import { spawn } from 'child_process'
import { supportedPackageManagers } from './supportedPackageManagers.js'

export class packageManagementScanner {
	constructor(packagesObject) {
		this.supportedPackageManagers = supportedPackageManagers
		this.installedPackagesObject = packagesObject
	}

	async getPlatformBaseCommand(packageManager) {
		return new Promise((resolve, reject) => {
			const platform = process.platform
			try {
				if (Object.keys(this.supportedPackageManagers[packageManager]['platforms']).includes(platform)) {
					const platformCommand = this.supportedPackageManagers[packageManager]['platforms'][platform]
					resolve(platformCommand)
				}
			} catch {
				reject(new Error(`Platform ${platform} is not supported`))
			}
		})
	}

	// Queries the corresponding command arguments from the supported package manager's object
	async getCommand(packageManager, command) {
		return new Promise((resolve, reject) => {
			try {
				if (Object.keys(this.supportedPackageManagers[packageManager]['commandArgs']).includes(command)) {
					const commandArray = this.supportedPackageManagers[packageManager]['commandArgs'][command]
					resolve(commandArray)
				}
			} catch {
				reject(new Error(`${command} is not supported.`))
			}
		})
	}

	// This function scans for a given package manager (packageManager)
	async scanForPackageManager(packageManager) {
		return new Promise(async (resolve, reject) => {
			const platformCommand = await this.getPlatformBaseCommand(packageManager)
			const scanCommand = await this.getCommand(packageManager, 'version')
			const scanProcess = spawn(platformCommand, scanCommand)
			scanProcess.on('exit', (code) => {
				try {
					if (code === 0) {
						resolve(packageManager)
					} else if (code !== 0) {
						resolve(null)
					}
				} catch {
					reject(new Error(`Package manager \'${packageManager}\' could not be resolved.`))
				}
			})
		})
	}

	async scanInstalledPackages(packageManager, packageScanScope) {
		return new Promise(async (resolve, reject) => {
			const platformCommand = await this.getPlatformBaseCommand(packageManager)
			const scanCommandGlobal = await this.getCommand(packageManager, 'globallyInstalledPackages')
			const scanCommandLocal = await this.getCommand(packageManager, 'locallyInstalledPackages')
			const scanCommand = packageScanScope === 'global' ? scanCommandGlobal : scanCommandLocal

			const scanProcess = spawn(platformCommand, scanCommand)

			const outputLines = []
			scanProcess.stdout.on('data', (data) => {
				const lines = data.toString().trim().split('\n')
				outputLines.push(...lines)
			})

			scanProcess.on('close', (code) => {
				try {
					if (code === 0) {
						outputLines.shift() // Removes the first line, the directory in which packages are stored
						const packageList = outputLines.map((line) => line.replace(/^.*── /, ''))
						resolve(packageList)
					} else if (code !== 0) {
						resolve(null)
					}
				} catch {
					reject(new Error(`Failed to scan for installed packages, failed with code ${code}`))
				}
			})

			scanProcess.on('error', (error) => {
				reject(error)
			})
		})
	}

	// Takes an array of strings, each being a supported package manager from the 'supportedPackageManagers' object passed into the class constructor
	// This function is best suited to be used with 'supportedPackageManagers.keys()' as the argument, as the keys() function will return an array of the values
	async createInstalledPackagesObj(packageManagers, packageScanScope) {
		return new Promise(async (resolve, reject) => {
			try {
				for (const packageManager of packageManagers) {
					const resolvedPackageManager = await this.scanForPackageManager(packageManager)
					console.log(resolvedPackageManager)
					if (resolvedPackageManager !== null) {
						const installedPackages = await this.scanInstalledPackages(packageManager, packageScanScope)
						this.installedPackagesObject[resolvedPackageManager] = installedPackages
					}
				}
				resolve(this.installedPackagesObject)
			} catch (error) {
				reject(error)
			}
		})
	}
}

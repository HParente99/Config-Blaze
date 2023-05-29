import { packageManagementScanner } from './packageManagementScanner.js'

export const supportedPackageManagers = {
    'npm': {
        platforms: {
            'darwin': 'npm',
            'linux': 'npm',
            'win32': 'npm.cmd'
        },
        commandArgs: {
            version: ['--version'],
            locallyInstalledPackages: ['list'],
            globallyInstalledPackages: ['list', '-g', '--depth=0']
        }
    },
    'yarn': {
        platforms: {
            'darwin': 'yarn',
            'linux': 'yarn',
            'win32': 'yarn'
        },
        commandArgs: {
            version: ['--version'],
            locallyInstalledPackages: ['list'],
            globallyInstalledPackages: ['global list']
        }
    }
}

let packages = {}

const scanner = new packageManagementScanner(packages)

const yarnPMScan = await scanner.scanForPackageManager('yarn')
const npmPMScan = await scanner.scanForPackageManager('npm')
const npmPackages = await scanner.scanInstalledPackages('npm', 'global')

const versionCommand = await scanner.getCommand('npm', 'version')

const platformCommand = await scanner.getPlatformBaseCommand('npm')

const supportedPackageManagerKeys = Object.keys(supportedPackageManagers)

const installedPackages = await scanner.createInstalledPackagesObj(supportedPackageManagerKeys, 'global')
console.log(packages)

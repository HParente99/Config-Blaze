#!/usr/bin/env node

import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const packageJSONPath = path.join(__dirname, '../../package.json')
const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf8'))

const configBlaze = {
	name: 'config-blaze',
	description: packageJSON.description,
	version: packageJSON.version
}

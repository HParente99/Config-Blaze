import gradient from 'gradient-string'
import { get } from 'node-emoji'

const fireEmote = get('fire')

function flameGradient(gradientColors, string) {
	return gradient(gradientColors)(string)
}

const flameGradientColors = [
	'red',
	'orange',
	'yellow',
	'orange',
	'red'
]
const borderString = flameGradient(flameGradientColors, '<<-------------->>')
const titleString = flameGradient(flameGradientColors, 'Config-Blaze')

const banner = fireEmote + ' ' + titleString + ' ' + fireEmote

console.log(borderString + '\n' + banner + '\n' + borderString)
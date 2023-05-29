import gradient from 'gradient-string'
import { get } from 'node-emoji'

const fireEmote = get('fire')
const titleGradient = gradient('yellow', 'orange', 'red',)('Config-Blaze')

const banner = fireEmote + ' ' + titleGradient + ' ' + fireEmote

console.log(banner)
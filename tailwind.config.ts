import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./app/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				bg: {
					DEFAULT: '#060605',
					2: '#0d0d0b',
				},
				gold: {
					DEFAULT: '#f5c957',
					l: '#faffb3',
					dim: 'rgba(245,201,87,0.06)',
					b: 'rgba(245,201,87,0.18)',
				},
				cream: {
					DEFAULT: '#ede8de',
					dim: 'rgba(237,232,222,0.55)',
				},
				muted: 'rgba(237,232,222,0.38)',
				border: 'rgba(255,255,255,0.07)',
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				serif: ['GFS Didot', 'serif'],
			},
			maxWidth: {
				container: '1400px',
			},
		},
	},
}

export default config

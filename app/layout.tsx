import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
	title: 'HTC — High Ticket Consulting',
	other: {
		'color-scheme': 'dark',
		'theme-color': '#0a0a09',
		'apple-mobile-web-app-capable': 'yes',
		'apple-mobile-web-app-status-bar-style': 'black-translucent',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" style={{ background: '#0a0a09', colorScheme: 'dark' }}>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				<link
					href="https://fonts.googleapis.com/css2?family=GFS+Didot&family=Inter:wght@200;300;400;500;600&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="font-sans">{children}</body>
		</html>
	)
}

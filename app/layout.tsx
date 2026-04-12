import type { Metadata, Viewport } from 'next'
import { DM_Serif_Display, Inter_Tight, Reenie_Beanie } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ["latin"],
  variable: '--font-dm-serif',
  display: 'swap',
});

const interTight = Inter_Tight({ 
  subsets: ["latin"],
  variable: '--font-inter-tight',
  display: 'swap',
});

const reenieBeanie = Reenie_Beanie({
  weight: '400',
  subsets: ["latin"],
  variable: '--font-reenie-beanie',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CRUMBS | Café de Especialidad & Cocina de Estación',
  description: 'Café de especialidad y cocina moderna en Ciudad Jardín, Buenos Aires. Desde el primer espresso hasta el último Negroni.',
  generator: 'v0.app',
  keywords: ['café', 'restaurante', 'Buenos Aires', 'Ciudad Jardín', 'brunch', 'cocina de autor', 'café de especialidad'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1F3B2D',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${dmSerif.variable} ${interTight.variable} ${reenieBeanie.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

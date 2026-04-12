import type { Metadata, Viewport } from 'next'
import { Inter_Tight, Reenie_Beanie, Work_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

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

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: '--font-work-sans',
  display: 'swap',
  weight: ['400', '700', '800', '900'],
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
    <html lang="es" className={`${interTight.variable} ${reenieBeanie.variable} ${workSans.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

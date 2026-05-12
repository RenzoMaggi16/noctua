import type { Metadata } from 'next'
import { Cormorant_Garamond, Outfit } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'NOCTUA — Alta Cocina de Autor | Buenos Aires',
  description:
    'NOCTUA es una experiencia gastronómica nocturna, íntima y exclusiva en el corazón de Recoleta, Buenos Aires. Alta cocina de autor con influencias europeas y latinoamericanas.',
  keywords: 'restaurante, alta cocina, Buenos Aires, Recoleta, gastronomía, reservas, fine dining',
  openGraph: {
    title: 'NOCTUA — Una experiencia que no se olvida.',
    description: 'Alta cocina de autor. Experiencia gastronómica nocturna, íntima y exclusiva.',
    locale: 'es_AR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`h-full ${cormorantGaramond.variable} ${outfit.variable}`}>
      <body className="min-h-full flex flex-col bg-noctua-negro antialiased font-body">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

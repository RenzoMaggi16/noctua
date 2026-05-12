'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const ENLACES = [
  { label: 'Inicio', href: '/#inicio' },
  { label: 'Historia', href: '/#historia' },
  { label: 'Gastronomía', href: '/#gastronomia' },
  { label: 'Ambiente', href: '/#ambiente' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const cerrarMenu = () => setMenuAbierto(false)

  const handleEnlaceClick = (href: string) => {
    cerrarMenu()
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '')
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || menuAbierto
            ? 'bg-noctua-negro/95 backdrop-blur-md border-b border-noctua-dorado/10'
            : 'bg-transparent'
        }`}
      >
        <nav
          className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between"
          aria-label="Navegación principal"
        >
          {/* Logo */}
          <Link href="/" className="font-display text-2xl font-semibold text-noctua-dorado tracking-[0.2em] hover:text-noctua-dorado-claro transition-colors">
            NOCTUA
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {ENLACES.map((enlace) => (
              <button
                key={enlace.href}
                onClick={() => handleEnlaceClick(enlace.href)}
                className="text-sm font-body text-noctua-cream/70 hover:text-noctua-dorado transition-colors tracking-widest uppercase"
                aria-label={`Ir a ${enlace.label}`}
              >
                {enlace.label}
              </button>
            ))}
            <Link
              href="/reservas"
              className="text-sm font-body text-noctua-negro bg-noctua-dorado hover:bg-noctua-dorado-claro transition-colors px-5 py-2 tracking-widest uppercase font-medium"
              aria-label="Hacer una reserva"
            >
              Reservar
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
          >
            <span
              className={`block w-6 h-px bg-noctua-dorado transition-all duration-300 ${
                menuAbierto ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`block w-6 h-px bg-noctua-dorado transition-all duration-300 ${
                menuAbierto ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-px bg-noctua-dorado transition-all duration-300 ${
                menuAbierto ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuAbierto && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-noctua-negro/98 backdrop-blur-lg flex flex-col items-center justify-center gap-8 md:hidden"
            aria-label="Menú móvil"
          >
            {ENLACES.map((enlace, i) => (
              <motion.button
                key={enlace.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handleEnlaceClick(enlace.href)}
                className="font-display text-4xl text-noctua-cream hover:text-noctua-dorado transition-colors tracking-widest"
                aria-label={`Ir a ${enlace.label}`}
              >
                {enlace.label}
              </motion.button>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ENLACES.length * 0.08 }}
            >
              <Link
                href="/reservas"
                onClick={cerrarMenu}
                className="font-display text-4xl text-noctua-dorado hover:text-noctua-dorado-claro transition-colors tracking-widest border border-noctua-dorado px-8 py-3"
                aria-label="Hacer una reserva"
              >
                Reservar
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { letterReveal, staggerContainer, fadeInUp, fadeIn } from '@/styles/animaciones'

const LETRAS_NOCTUA = 'NOCTUA'.split('')

export function HeroSection() {
  const router = useRouter()

  const handleScrollGastronomia = () => {
    const el = document.getElementById('gastronomia')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="inicio"
      className="relative h-screen flex flex-col items-center justify-end pb-24 overflow-hidden"
      aria-label="Sección principal"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80"
          alt="Elegante mesa de alta cocina en NOCTUA con iluminación íntima"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-noctua-negro via-noctua-negro/60 to-noctua-negro/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-noctua-negro/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6">
        {/* NOCTUA letras animadas */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex overflow-hidden"
          aria-label="NOCTUA"
        >
          {LETRAS_NOCTUA.map((letra, i) => (
            <motion.span
              key={i}
              variants={letterReveal}
              className="font-display hero-title-size text-noctua-dorado leading-none tracking-[0.15em]"
              style={{ display: 'inline-block', perspective: '800px' }}
            >
              {letra}
            </motion.span>
          ))}
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.9 }}
          className="font-display italic text-noctua-cream/80 text-xl md:text-2xl tracking-wide"
        >
          Una experiencia que no se olvida.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 mt-4"
        >
          <button
            onClick={() => router.push('/reservas')}
            className="bg-noctua-dorado hover:bg-noctua-dorado-claro text-noctua-negro font-body font-semibold px-8 py-3.5 text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105"
            aria-label="Ir a la página de reservas"
          >
            Reservar Mesa
          </button>
          <button
            onClick={handleScrollGastronomia}
            className="border border-noctua-dorado/60 hover:border-noctua-dorado text-noctua-dorado hover:bg-noctua-dorado/10 font-body font-medium px-8 py-3.5 text-sm tracking-widest uppercase transition-all duration-300"
            aria-label="Ver el menú gastronómico"
          >
            Ver Menú
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-noctua-cream/30 text-xs tracking-widest uppercase font-body">
          Descubrí
        </span>
        <div className="animate-bounce-slow">
          <svg
            className="w-5 h-5 text-noctua-dorado/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </motion.div>
    </section>
  )
}

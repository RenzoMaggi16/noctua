'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { staggerContainer, fadeInUp, fadeIn, defaultViewport } from '@/styles/animaciones'

export function CtaReservaSection() {
  const router = useRouter()

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Sección de llamada a reservar"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1920&q=80"
          alt="Interior íntimo de restaurante de alta gama con iluminación cálida"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-noctua-negro/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-noctua-negro/40 via-transparent to-noctua-negro/60" />
      </div>

      {/* Contenido */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="relative z-10 max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-8"
      >
        <motion.span
          variants={fadeIn}
          className="text-noctua-dorado text-xs tracking-[0.4em] uppercase font-body"
        >
          Reservas disponibles
        </motion.span>

        <motion.h2
          variants={fadeInUp}
          className="font-display text-5xl md:text-6xl lg:text-7xl text-noctua-cream leading-tight"
        >
          ¿Listo para vivir
          <br />
          <em className="text-noctua-dorado">la experiencia?</em>
        </motion.h2>

        <motion.div variants={fadeInUp} className="h-px bg-noctua-dorado/40 w-24" />

        <motion.p
          variants={fadeInUp}
          className="font-body text-noctua-cream/60 text-base lg:text-lg leading-relaxed max-w-xl"
        >
          Cada noche en NOCTUA es irrepetible. Reservá tu mesa y permití que
          el ritual gastronómico comience desde el momento en que cruzás nuestra puerta.
          Capacidad limitada para garantizar una atención sin igual.
        </motion.p>

        <motion.div variants={fadeInUp}>
          <button
            onClick={() => router.push('/reservas')}
            className="group relative border border-noctua-dorado text-noctua-dorado font-body font-medium px-12 py-4 text-sm tracking-[0.3em] uppercase overflow-hidden transition-all duration-500 hover:text-noctua-negro"
            aria-label="Ir a la página de reservas"
          >
            <span className="absolute inset-0 bg-noctua-dorado translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative">Reservar Mesa</span>
          </button>
        </motion.div>

        <motion.p
          variants={fadeIn}
          className="font-body text-noctua-cream/30 text-xs tracking-wide mt-4"
        >
          Miércoles a domingo · 20:00 a 01:00 hs · Solo con reserva previa
        </motion.p>
      </motion.div>
    </section>
  )
}

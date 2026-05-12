'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { staggerContainer, scaleIn, fadeInUp, defaultViewport } from '@/styles/animaciones'

const IMAGENES = [
  {
    id: 'ambiente-principal',
    src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
    alt: 'Salón principal de NOCTUA con iluminación íntima y mesas elegantemente dispuestas',
    grande: true,
  },
  {
    id: 'ambiente-bar',
    src: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80',
    alt: 'Bar de NOCTUA con selección premium de vinos y cócteles artesanales',
    grande: false,
  },
  {
    id: 'ambiente-velas',
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    alt: 'Detalle de mesa en NOCTUA con velas y decoración floral elegante',
    grande: false,
  },
]

export function AmbienteSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [-40, 40])

  return (
    <section
      id="ambiente"
      ref={ref}
      className="relative bg-noctua-oscuro py-24 lg:py-32 overflow-hidden"
      aria-label="El ambiente de NOCTUA"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="mb-12 flex flex-col gap-4"
        >
          <motion.span
            variants={fadeInUp}
            className="text-noctua-dorado text-xs tracking-[0.3em] uppercase font-body"
          >
            Atmósfera exclusiva
          </motion.span>
          <motion.h2 variants={fadeInUp} className="font-display text-5xl lg:text-6xl text-noctua-cream">
            El <em className="text-noctua-dorado">Ambiente</em>
          </motion.h2>
          <motion.p variants={fadeInUp} className="font-body text-noctua-cream/50 max-w-lg text-sm leading-relaxed">
            Un espacio diseñado para que el tiempo se detenga. Donde cada rincón invita
            a la contemplación y cada detalle susurra lujo sin ostentación.
          </motion.p>
        </motion.div>

        {/* Galería asimétrica */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 lg:h-[600px]"
        >
          {/* Imagen grande — 2 filas */}
          <motion.div
            variants={scaleIn}
            className="lg:col-span-2 lg:row-span-2 relative h-72 lg:h-full overflow-hidden"
          >
            <motion.div style={{ y }} className="absolute inset-0">
              <Image
                src={IMAGENES[0].src}
                alt={IMAGENES[0].alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-noctua-negro/40 to-transparent" />
            </motion.div>
          </motion.div>

          {/* Imagen pequeña 1 */}
          <motion.div
            variants={scaleIn}
            className="relative h-56 lg:h-auto overflow-hidden"
          >
            <Image
              src={IMAGENES[1].src}
              alt={IMAGENES[1].alt}
              fill
              className="object-cover object-center hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noctua-negro/40 to-transparent" />
          </motion.div>

          {/* Imagen pequeña 2 */}
          <motion.div
            variants={scaleIn}
            className="relative h-56 lg:h-auto overflow-hidden"
          >
            <Image
              src={IMAGENES[2].src}
              alt={IMAGENES[2].alt}
              fill
              className="object-cover object-center hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noctua-negro/40 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

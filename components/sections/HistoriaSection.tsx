'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { fadeInUp, staggerContainer, defaultViewport } from '@/styles/animaciones'

const PARRAFOS = [
  'Fundado en 2018 en el corazón de Recoleta, Buenos Aires, NOCTUA nació de la visión de dos amigos que soñaban con un espacio donde la noche cobrara vida propia. Un lugar donde la oscuridad no fuera ausencia de luz, sino el escenario perfecto para que los sabores brillen con intensidad.',
  'Nuestro chef ejecutivo, formado durante una década en las cocinas de Lyon, San Sebastián y Copenhague, regresó a Buenos Aires con una misión: fusionar la precisión técnica europea con la profundidad de la cocina latinoamericana. El resultado es una gastronomía que habla dos idiomas perfectamente, sin perder el acento de ninguno.',
  'En NOCTUA creemos que comer bien es un acto filosófico. Cada plato es una tesis, cada visita una conversación que no queremos que termine. La experiencia nocturna es nuestra naturaleza: comenzamos cuando la ciudad se aquieta y terminamos cuando el último comensal decide que ya es hora.',
]

export function HistoriaSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [-60, 60])

  return (
    <section
      id="historia"
      ref={ref}
      className="relative bg-noctua-oscuro overflow-hidden"
      aria-label="Nuestra historia"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-screen">
        {/* Image — 3/5 */}
        <div className="relative lg:col-span-3 h-72 lg:h-auto overflow-hidden">
          <motion.div style={{ y }} className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80"
              alt="Chef de NOCTUA preparando un plato con maestría artesanal"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-noctua-oscuro/60 hidden lg:block" />
          </motion.div>
        </div>

        {/* Text — 2/5 */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="lg:col-span-2 flex flex-col justify-center px-8 lg:px-12 xl:px-16 py-16 lg:py-24 gap-8"
        >
          <motion.div variants={fadeInUp} className="flex flex-col gap-2">
            <span className="text-noctua-dorado text-xs tracking-[0.3em] uppercase font-body">
              Nuestra Historia
            </span>
            <h2 className="font-display text-5xl lg:text-6xl text-noctua-cream leading-tight">
              El origen
              <br />
              <em className="text-noctua-dorado">de la noche</em>
            </h2>
          </motion.div>

          <div className="h-px bg-noctua-dorado/30 w-16" />

          {PARRAFOS.map((parrafo, i) => (
            <motion.p
              key={i}
              variants={fadeInUp}
              className="font-body text-noctua-cream/60 leading-relaxed text-sm lg:text-base"
            >
              {parrafo}
            </motion.p>
          ))}

          <motion.div variants={fadeInUp}>
            <span className="font-display italic text-noctua-dorado text-lg">
              — Fundado en Buenos Aires, 2018
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

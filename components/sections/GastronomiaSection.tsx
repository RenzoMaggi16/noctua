'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { staggerContainer, scaleIn, fadeInUp, defaultViewport } from '@/styles/animaciones'

interface Plato {
  id: string
  nombre: string
  categoria: 'Entrada' | 'Principal' | 'Postre'
  descripcion: string
  precio: number
  imagen: string
  alt: string
}

const PLATOS: Plato[] = [
  {
    id: 'magret-pato',
    nombre: 'Magret de Pato al Malbec',
    categoria: 'Principal',
    descripcion: 'Pecho de pato a baja temperatura con reducción de Malbec mendocino, puré de batata al anís estrellado y chips de polenta.',
    precio: 8900,
    imagen: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80',
    alt: 'Magret de pato al Malbec con puré de batata',
  },
  {
    id: 'vieira-azafran',
    nombre: 'Vieira Sellada con Espuma de Azafrán',
    categoria: 'Entrada',
    descripcion: 'Vieiras frescas de Ushuaia selladas en manteca noisette, espuma de azafrán iraní, aceite de trufa y caviar de río patagónico.',
    precio: 6400,
    imagen: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    alt: 'Vieira sellada con espuma de azafrán y caviar',
  },
  {
    id: 'lomo-wellington',
    nombre: 'Lomo Wellington Porteño',
    categoria: 'Principal',
    descripcion: 'Lomo de res envuelto en masa hojaldrada con duxelle de hongos silvestres, jamón crudo de Tandil y salsa de Merlot.',
    precio: 11200,
    imagen: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    alt: 'Lomo Wellington cortado mostrando su interior perfecto',
  },
  {
    id: 'carpaccio-remolacha',
    nombre: 'Carpaccio de Remolacha y Burrata',
    categoria: 'Entrada',
    descripcion: 'Remolacha asada en sal gruesa, burrata de búfala, vinagreta de naranja sanguínea, pistachos tostados y brotes de albahaca.',
    precio: 5100,
    imagen: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
    alt: 'Carpaccio de remolacha con burrata y pistachos',
  },
  {
    id: 'coulant-chocolate',
    nombre: 'Coulant de Chocolate Negro',
    categoria: 'Postre',
    descripcion: 'Volcán de chocolate 70% cacao con centro fundente, helado de vainilla de Tahití, tierra de cacao y polvo de frambuesa.',
    precio: 4200,
    imagen: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80',
    alt: 'Coulant de chocolate negro con centro fundente',
  },
  {
    id: 'creme-brulee',
    nombre: 'Crème Brûlée de Dulce de Leche',
    categoria: 'Postre',
    descripcion: 'Crema catalana caramelizada con dulce de leche artesanal, tuile de almendras, compota de maracuyá y flores comestibles.',
    precio: 3800,
    imagen: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
    alt: 'Crème brûlée de dulce de leche con caramelización perfecta',
  },
]

const COLORES_CATEGORIA: Record<Plato['categoria'], string> = {
  Entrada: 'bg-noctua-vino/80 text-noctua-cream',
  Principal: 'bg-noctua-dorado/20 text-noctua-dorado',
  Postre: 'bg-noctua-cream/10 text-noctua-cream/80',
}

export function GastronomiaSection() {
  const formatearPrecio = (precio: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(precio)

  return (
    <section
      id="gastronomia"
      className="relative bg-noctua-negro py-24 lg:py-32"
      aria-label="Menú gastronómico"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="text-center mb-16 flex flex-col items-center gap-4"
        >
          <motion.span
            variants={fadeInUp}
            className="text-noctua-dorado text-xs tracking-[0.3em] uppercase font-body"
          >
            Carta de temporada
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-5xl lg:text-6xl text-noctua-cream"
          >
            Nuestra <em className="text-noctua-dorado">Gastronomía</em>
          </motion.h2>
          <motion.div variants={fadeInUp} className="h-px bg-noctua-dorado/30 w-24 mt-2" />
          <motion.p
            variants={fadeInUp}
            className="font-body text-noctua-cream/50 max-w-xl text-sm leading-relaxed mt-2"
          >
            Cada plato es una historia narrada a través del sabor. Ingredientes locales,
            técnicas europeas, alma porteña.
          </motion.p>
        </motion.div>

        {/* Grid de platos */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {PLATOS.map((plato) => (
            <motion.article
              key={plato.id}
              variants={scaleIn}
              className="group relative flex flex-col border border-noctua-dorado/20 hover:border-noctua-dorado/50 bg-noctua-oscuro overflow-hidden transition-all duration-500"
              aria-label={plato.nombre}
            >
              {/* Imagen */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={plato.imagen}
                  alt={plato.alt}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noctua-oscuro/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Categoria badge */}
                <span
                  className={`absolute top-3 left-3 text-xs tracking-widest uppercase px-3 py-1 font-body ${COLORES_CATEGORIA[plato.categoria]}`}
                >
                  {plato.categoria}
                </span>
              </div>

              {/* Contenido */}
              <div className="flex flex-col gap-3 p-5 flex-1">
                <h3 className="font-display text-xl text-noctua-cream group-hover:text-noctua-dorado transition-colors">
                  {plato.nombre}
                </h3>
                <p className="font-body text-noctua-cream/50 text-sm leading-relaxed flex-1">
                  {plato.descripcion}
                </p>
                <div className="flex justify-between items-center pt-3 border-t border-noctua-dorado/10 mt-auto">
                  <span className="font-display text-noctua-dorado text-xl">
                    {formatearPrecio(plato.precio)}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

import { HeroSection } from '@/components/sections/HeroSection'
import { HistoriaSection } from '@/components/sections/HistoriaSection'
import { GastronomiaSection } from '@/components/sections/GastronomiaSection'
import { AmbienteSection } from '@/components/sections/AmbienteSection'
import { CtaReservaSection } from '@/components/sections/CtaReservaSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HistoriaSection />
      <GastronomiaSection />
      <AmbienteSection />
      <CtaReservaSection />
    </>
  )
}

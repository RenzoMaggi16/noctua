interface SpinnerProps {
  tamaño?: 'sm' | 'md' | 'lg'
}

export function Spinner({ tamaño = 'md' }: SpinnerProps) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }

  return (
    <span
      role="status"
      aria-label="Cargando..."
      className={`inline-block ${sizes[tamaño]} border-2 border-current border-t-transparent rounded-full animate-spin`}
    />
  )
}

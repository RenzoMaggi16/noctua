export function LeyendaMesas() {
  const ITEMS = [
    { color: 'rgba(201,169,110,0.18)', borde: '#C9A96E', label: 'Libre' },
    { color: 'rgba(107,30,42,0.35)',   borde: '#6B1E2A', label: 'Ocupada' },
    { color: 'rgba(146,64,14,0.35)',   borde: '#D97706', label: 'En proceso' },
    { color: 'rgba(55,65,81,0.25)',    borde: '#374151', label: 'Cerrada' },
  ]

  return (
    <div className="flex flex-wrap gap-3 items-center" aria-label="Leyenda de estados de mesas">
      {ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            className="w-3.5 h-3.5 rounded-full"
            style={{ background: item.color, border: `1.5px solid ${item.borde}` }}
            aria-hidden="true"
          />
          <span className="text-xs font-body text-noctua-cream/45 tracking-wide">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

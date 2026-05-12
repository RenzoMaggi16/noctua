interface CodigoQRProps {
  base64: string
  alt?: string
  tamaño?: number
}

export function CodigoQR({ base64, alt = 'Código QR de reserva', tamaño = 200 }: CodigoQRProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="border border-noctua-dorado/30 p-3 bg-noctua-cream/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${base64}`}
          alt={alt}
          width={tamaño}
          height={tamaño}
          className="block"
        />
      </div>
      <p className="font-body text-noctua-cream/30 text-xs text-center">
        Presentá este QR al llegar al restaurante
      </p>
    </div>
  )
}

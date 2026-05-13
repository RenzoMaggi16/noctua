// =============================================
// NOCTUA - Datos de mesas ficticios (demo)
// =============================================
import type { Mesa, PisoType } from '@/types'

/** Planta Baja */
const MESAS_PLANTA_BAJA: Mesa[] = [
  // -- ZONA TERRAZA (exterior, fila top) ----------
  { id: 'pb-t1', numero: 1, capacidad: 2, pos_x: 90,  pos_y: 60,  estado: 'libre',    piso: 'baja', zona: 'terraza', forma: 'redonda' },
  { id: 'pb-t2', numero: 2, capacidad: 2, pos_x: 175, pos_y: 60,  estado: 'ocupada',  piso: 'baja', zona: 'terraza', forma: 'redonda' },
  { id: 'pb-t3', numero: 3, capacidad: 4, pos_x: 270, pos_y: 60,  estado: 'libre',    piso: 'baja', zona: 'terraza', forma: 'redonda' },
  { id: 'pb-t4', numero: 4, capacidad: 2, pos_x: 370, pos_y: 60,  estado: 'libre',    piso: 'baja', zona: 'terraza', forma: 'redonda' },

  // -- ZONA PRINCIPAL (centro izquierda) ----------
  { id: 'pb-p1', numero: 5,  capacidad: 4, pos_x: 90,  pos_y: 200, estado: 'libre',    piso: 'baja', zona: 'salon', forma: 'cuadrada' },
  { id: 'pb-p2', numero: 6,  capacidad: 4, pos_x: 200, pos_y: 200, estado: 'ocupada',  piso: 'baja', zona: 'salon', forma: 'cuadrada' },
  { id: 'pb-p3', numero: 7,  capacidad: 6, pos_x: 310, pos_y: 200, estado: 'libre',    piso: 'baja', zona: 'salon', forma: 'cuadrada' },
  { id: 'pb-p4', numero: 8,  capacidad: 4, pos_x: 90,  pos_y: 310, estado: 'esperando_pedido', piso: 'baja', zona: 'salon', forma: 'cuadrada' },
  { id: 'pb-p5', numero: 9,  capacidad: 4, pos_x: 200, pos_y: 310, estado: 'libre',    piso: 'baja', zona: 'salon', forma: 'cuadrada' },
  { id: 'pb-p6', numero: 10, capacidad: 6, pos_x: 310, pos_y: 310, estado: 'libre',    piso: 'baja', zona: 'salon', forma: 'cuadrada' },

  // -- ZONA SOFAS (derecha) -----------------------
  { id: 'pb-s1', numero: 11, capacidad: 6, pos_x: 510, pos_y: 170, estado: 'libre',    piso: 'baja', zona: 'sofas', forma: 'sofa' },
  { id: 'pb-s2', numero: 12, capacidad: 8, pos_x: 510, pos_y: 310, estado: 'ocupada',  piso: 'baja', zona: 'sofas', forma: 'sofa' },

  // -- ZONA BAR (fondo izquierda) -----------------
  { id: 'pb-b1', numero: 13, capacidad: 2, pos_x: 90,  pos_y: 420, estado: 'libre',    piso: 'baja', zona: 'bar',   forma: 'redonda' },
  { id: 'pb-b2', numero: 14, capacidad: 2, pos_x: 175, pos_y: 420, estado: 'libre',    piso: 'baja', zona: 'bar',   forma: 'redonda' },
  { id: 'pb-b3', numero: 15, capacidad: 2, pos_x: 260, pos_y: 420, estado: 'ocupada',  piso: 'baja', zona: 'bar',   forma: 'redonda' },

  // -- ZONA PRIVADA COCINA (fondo) ----------------
  { id: 'pb-c1', numero: 16, capacidad: 4, pos_x: 420, pos_y: 420, estado: 'libre',    piso: 'baja', zona: 'cocina', forma: 'cuadrada' },
  { id: 'pb-c2', numero: 17, capacidad: 4, pos_x: 510, pos_y: 420, estado: 'cerrada',  piso: 'baja', zona: 'cocina', forma: 'cuadrada' },
]

/** Planta Alta */
const MESAS_PLANTA_ALTA: Mesa[] = [
  // -- ZONA VISTA (primera fila, balcon) ----------
  { id: 'pa-v1', numero: 18, capacidad: 2, pos_x: 90,  pos_y: 70,  estado: 'libre',    piso: 'alta', zona: 'balcon', forma: 'redonda' },
  { id: 'pa-v2', numero: 19, capacidad: 2, pos_x: 175, pos_y: 70,  estado: 'libre',    piso: 'alta', zona: 'balcon', forma: 'redonda' },
  { id: 'pa-v3', numero: 20, capacidad: 4, pos_x: 270, pos_y: 70,  estado: 'ocupada',  piso: 'alta', zona: 'balcon', forma: 'redonda' },
  { id: 'pa-v4', numero: 21, capacidad: 4, pos_x: 320, pos_y: 70,  estado: 'libre',    piso: 'alta', zona: 'balcon', forma: 'redonda' },

  // -- ZONA PRINCIPAL ALTA ------------------------
  { id: 'pa-p1', numero: 22, capacidad: 4, pos_x: 90,  pos_y: 200, estado: 'libre',    piso: 'alta', zona: 'salon', forma: 'cuadrada' },
  { id: 'pa-p2', numero: 23, capacidad: 4, pos_x: 200, pos_y: 200, estado: 'ocupada',  piso: 'alta', zona: 'salon', forma: 'cuadrada' },
  { id: 'pa-p3', numero: 24, capacidad: 6, pos_x: 310, pos_y: 200, estado: 'libre',    piso: 'alta', zona: 'salon', forma: 'cuadrada' },
  { id: 'pa-p4', numero: 25, capacidad: 6, pos_x: 90,  pos_y: 320, estado: 'libre',    piso: 'alta', zona: 'salon', forma: 'cuadrada' },
  { id: 'pa-p5', numero: 26, capacidad: 4, pos_x: 200, pos_y: 320, estado: 'esperando_pedido', piso: 'alta', zona: 'salon', forma: 'cuadrada' },

  // -- SALA PRIVADA (VIP) -------------------------
  { id: 'pa-vip1', numero: 27, capacidad: 8,  pos_x: 490, pos_y: 200, estado: 'libre',   piso: 'alta', zona: 'vip', forma: 'sofa' },
  { id: 'pa-vip2', numero: 28, capacidad: 10, pos_x: 490, pos_y: 340, estado: 'cerrada', piso: 'alta', zona: 'vip', forma: 'sofa' },

  // -- ZONA LOUNGE -------------------------------
  { id: 'pa-l1', numero: 29, capacidad: 4, pos_x: 150, pos_y: 430, estado: 'libre',    piso: 'alta', zona: 'lounge', forma: 'redonda' },
  { id: 'pa-l2', numero: 30, capacidad: 4, pos_x: 280, pos_y: 430, estado: 'libre',    piso: 'alta', zona: 'lounge', forma: 'redonda' },
]

export function getMesasMock(piso: PisoType): Mesa[] {
  return piso === 'baja' ? MESAS_PLANTA_BAJA : MESAS_PLANTA_ALTA
}

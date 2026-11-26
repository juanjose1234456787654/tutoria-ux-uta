/**
 * Modelos y constantes de dominio para el sistema Tutoría UX.
 * Capa: Domain (sin dependencias externas ni del DOM).
 */

export const MODALIDADES = Object.freeze({
  PRESENCIAL: 'Presencial',
  VIRTUAL: 'Virtual',
});

export const ESTADOS_RESERVA = Object.freeze({
  CONFIRMADA: 'Confirmada',
  MODIFICADA: 'Modificada',
  CANCELADA: 'Cancelada',
});

/**
 * Crea una entidad de reserva normalizada.
 * @param {object} params
 * @returns {object}
 */
export function crearEntidadReserva({
  id,
  codigo,
  docenteId,
  docenteNombre,
  asignaturaId,
  asignaturaNombre,
  modalidad,
  fecha,
  horario,
  estudianteNombre,
  estudianteCorreo,
  motivo,
  estado = ESTADOS_RESERVA.CONFIRMADA,
  creadoEn = new Date().toISOString(),
  actualizadoEn = null,
}) {
  return {
    id,
    codigo,
    docenteId,
    docenteNombre,
    asignaturaId,
    asignaturaNombre,
    modalidad,
    fecha,
    horario,
    estudianteNombre: estudianteNombre.trim(),
    estudianteCorreo: estudianteCorreo.trim().toLowerCase(),
    motivo: motivo.trim(),
    estado,
    creadoEn,
    actualizadoEn,
  };
}

/**
 * Genera un código legible único para la reserva (ej. TUT-2026-4821).
 * @param {number} [seed]
 * @returns {string}
 */
export function generarCodigoReserva(seed = Date.now()) {
  const sufijo = String(seed % 10000).padStart(4, '0');
  return `TUT-2026-${sufijo}`;
}

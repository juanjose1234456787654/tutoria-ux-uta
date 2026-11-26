/**
 * Reglas de validación de negocio para reservas de tutoría.
 * Capa: Domain.
 */

import { MODALIDADES } from './models.js';

const EMAIL_UTA_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida los datos de una solicitud de reserva o modificación.
 * Devuelve un objeto con { valido: boolean, errores: Record<string, string> }.
 * @param {object} datos
 * @param {object} [opciones]
 * @param {string} [opciones.fechaMinima] Fecha ISO YYYY-MM-DD mínima permitida
 * @returns {{ valido: boolean, errores: Record<string, string> }}
 */
export function validarDatosReserva(datos, opciones = {}) {
  const errores = {};
  const modalidadesValidas = Object.values(MODALIDADES);

  if (!datos.docenteId) {
    errores.docenteId = 'Selecciona un docente para la tutoría.';
  }

  if (!datos.asignaturaId) {
    errores.asignaturaId = 'Selecciona una asignatura.';
  }

  if (!datos.modalidad || !modalidadesValidas.includes(datos.modalidad)) {
    errores.modalidad = 'Elige una modalidad válida (Presencial o Virtual).';
  }

  if (!datos.fecha) {
    errores.fecha = 'Selecciona una fecha para la tutoría.';
  } else {
    const fechaMin = opciones.fechaMinima || obtenerFechaHoyISO();
    if (datos.fecha < fechaMin) {
      errores.fecha = 'La fecha no puede ser anterior al día de hoy.';
    }
    const diaSemana = obtenerDiaSemanaISO(datos.fecha);
    if (diaSemana === 0 || diaSemana === 6) {
      errores.fecha = 'Las tutorías solo se atienden de lunes a viernes.';
    }
  }

  if (!datos.horario) {
    errores.horario = 'Selecciona un horario disponible.';
  }

  const nombre = (datos.estudianteNombre || '').trim();
  if (nombre.length < 3) {
    errores.estudianteNombre = 'Ingresa tu nombre completo (mínimo 3 caracteres).';
  }

  const correo = (datos.estudianteCorreo || '').trim();
  if (!EMAIL_UTA_REGEX.test(correo)) {
    errores.estudianteCorreo = 'Ingresa un correo institucional o personal válido.';
  }

  const motivo = (datos.motivo || '').trim();
  if (motivo.length < 10) {
    errores.motivo = 'Describe brevemente el tema o duda (mínimo 10 caracteres).';
  }

  return {
    valido: Object.keys(errores).length === 0,
    errores,
  };
}

/**
 * Obtiene la fecha local actual en formato YYYY-MM-DD.
 * @returns {string}
 */
export function obtenerFechaHoyISO() {
  const ahora = new Date();
  const y = ahora.getFullYear();
  const m = String(ahora.getMonth() + 1).padStart(2, '0');
  const d = String(ahora.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Devuelve el día de la semana (0=Dom, 6=Sáb) para una fecha YYYY-MM-DD.
 * @param {string} fechaISO
 * @returns {number}
 */
export function obtenerDiaSemanaISO(fechaISO) {
  const [y, m, d] = fechaISO.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
}

/**
 * Componentes reutilizables de interfaz para Tutoría UX.
 * Capa: Presentation.
 */

import { ESTADOS_RESERVA } from '../domain/models.js';

/**
 * Escapa caracteres HTML para prevenir XSS al renderizar texto del usuario.
 * @param {string} texto
 * @returns {string}
 */
export function escaparHTML(texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Renderiza una tarjeta de docente con sus asignaturas y modalidades.
 */
export function renderTarjetaDocente(docente, asignaturasMap) {
  const nombresAsig = docente.asignaturasIds
    .map((id) => asignaturasMap.get(id)?.nombre || id)
    .map((nombre) => `<li class="tag-item">${escaparHTML(nombre)}</li>`)
    .join('');

  const modalidades = docente.modalidades
    .map((m) => `<li class="tag-item">${escaparHTML(m)}</li>`)
    .join('');

  return `
    <article class="docente-card">
      <div class="docente-header">
        <h3>${escaparHTML(docente.nombre)}</h3>
      </div>
      <p class="docente-meta">${escaparHTML(docente.especialidad)}</p>
      <p class="docente-meta"><strong>Ubicación:</strong> ${escaparHTML(docente.oficina)}</p>
      <p class="docente-meta"><strong>Asignaturas:</strong></p>
      <ul class="tag-list" aria-label="Asignaturas">${nombresAsig}</ul>
      <p class="docente-meta"><strong>Modalidades:</strong></p>
      <ul class="tag-list" aria-label="Modalidades">${modalidades}</ul>
      <div class="reserva-actions">
        <button
          type="button"
          class="btn btn-primary btn-seleccionar-docente"
          data-docente-id="${escaparHTML(docente.id)}"
        >
          Reservar con este docente
        </button>
      </div>
    </article>
  `;
}

/**
 * Renderiza una tarjeta de reserva con estado y botones de acción.
 */
export function renderTarjetaReserva(reserva) {
  const claseEstado =
    reserva.estado === ESTADOS_RESERVA.CONFIRMADA
      ? 'badge-confirmada'
      : reserva.estado === ESTADOS_RESERVA.MODIFICADA
        ? 'badge-modificada'
        : 'badge-cancelada';

  const estaCancelada = reserva.estado === ESTADOS_RESERVA.CANCELADA;

  return `
    <article class="reserva-card">
      <div class="reserva-header">
        <div>
          <h3>${escaparHTML(reserva.asignaturaNombre)}</h3>
          <p class="reserva-meta">Código: <strong>${escaparHTML(reserva.codigo)}</strong></p>
        </div>
        <span class="badge ${claseEstado}">${escaparHTML(reserva.estado)}</span>
      </div>
      <p class="reserva-meta"><strong>Docente:</strong> ${escaparHTML(reserva.docenteNombre)}</p>
      <p class="reserva-meta"><strong>Fecha y hora:</strong> ${escaparHTML(reserva.fecha)} · ${escaparHTML(reserva.horario)}</p>
      <p class="reserva-meta"><strong>Modalidad:</strong> ${escaparHTML(reserva.modalidad)}</p>
      <p class="reserva-meta"><strong>Estudiante:</strong> ${escaparHTML(reserva.estudianteNombre)} (${escaparHTML(reserva.estudianteCorreo)})</p>
      <p class="reserva-meta"><strong>Tema:</strong> ${escaparHTML(reserva.motivo)}</p>
      ${
        estaCancelada
          ? `<p class="reserva-meta"><strong>Motivo de cancelación:</strong> ${escaparHTML(reserva.motivoCancelacion || 'No especificado')}</p>`
          : `<div class="reserva-actions">
              <button type="button" class="btn btn-secondary btn-modificar-reserva" data-reserva-id="${escaparHTML(reserva.id)}">
                Modificar
              </button>
              <button type="button" class="btn btn-danger btn-cancelar-reserva" data-reserva-id="${escaparHTML(reserva.id)}">
                Cancelar
              </button>
            </div>`
      }
    </article>
  `;
}

/**
 * Renderiza pares clave-valor dentro de un <dl> de resumen.
 */
export function renderListaResumen(filas) {
  return filas
    .map(
      ([etiqueta, valor]) => `
      <div class="summary-row">
        <dt>${escaparHTML(etiqueta)}</dt>
        <dd>${escaparHTML(valor)}</dd>
      </div>
    `
    )
    .join('');
}

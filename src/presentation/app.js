/**
 * Controlador principal de presentación para Tutoría UX.
 * Conecta la interfaz DOM con TutoriaService conservando datos en navegación y errores.
 * Capa: Presentation.
 */

import { TutoriaService } from '../application/tutoriaService.js';
import { validarDatosReserva, validarFechaIndividual, obtenerFechaHoyISO } from '../domain/validators.js';
import { StorageRepository } from '../infrastructure/storageRepository.js';
import {
  escaparHTML,
  renderListaResumen,
  renderTarjetaDocente,
  renderTarjetaReserva,
} from './components.js';

const repository = new StorageRepository();
const service = new TutoriaService(repository);

const asignaturasMap = new Map(service.listarAsignaturas().map((a) => [a.id, a]));

const dom = {
  navBtns: document.querySelectorAll('.nav-btn'),
  vistas: {
    explorar: document.getElementById('vista-explorar'),
    reservar: document.getElementById('vista-reservar'),
    reservas: document.getElementById('vista-reservas'),
  },
  regionAlertas: document.getElementById('region-alertas'),
  badgeContador: document.getElementById('badge-contador-reservas'),

  // Explorar
  filtroTexto: document.getElementById('filtro-texto'),
  filtroAsignatura: document.getElementById('filtro-asignatura'),
  filtroModalidad: document.getElementById('filtro-modalidad'),
  btnLimpiarFiltros: document.getElementById('btn-limpiar-filtros'),
  listaDocentes: document.getElementById('lista-docentes'),

  // Reservar
  tituloReservar: document.getElementById('titulo-reservar'),
  subtituloReservar: document.getElementById('subtitulo-reservar'),
  formReserva: document.getElementById('form-reserva'),
  reservaIdEdicion: document.getElementById('reserva-id-edicion'),
  campoDocente: document.getElementById('campo-docente'),
  campoAsignatura: document.getElementById('campo-asignatura'),
  campoFecha: document.getElementById('campo-fecha'),
  campoNombre: document.getElementById('campo-nombre'),
  campoCorreo: document.getElementById('campo-correo'),
  campoMotivo: document.getElementById('campo-motivo'),
  contenedorHorarios: document.getElementById('contenedor-horarios'),
  pasoFormulario: document.getElementById('paso-formulario'),
  pasoRevision: document.getElementById('paso-revision'),
  pasoConfirmacion: document.getElementById('paso-confirmacion'),
  resumenRevision: document.getElementById('resumen-revision'),
  tituloConfirmacion: document.getElementById('titulo-confirmacion'),
  mensajeConfirmacion: document.getElementById('mensaje-confirmacion'),
  detalleConfirmacion: document.getElementById('detalle-confirmacion'),
  pasosInd: [
    document.getElementById('paso-ind-1'),
    document.getElementById('paso-ind-2'),
    document.getElementById('paso-ind-3'),
  ],

  // Botones reservar
  btnVolverDocentes: document.getElementById('btn-volver-docentes'),
  btnRevisarReserva: document.getElementById('btn-revisar-reserva'),
  btnRegresarEditar: document.getElementById('btn-regresar-editar'),
  btnIrMisReservas: document.getElementById('btn-ir-mis-reservas'),
  btnNuevaReserva: document.getElementById('btn-nueva-reserva'),

  // Mis reservas
  filtroReservasTexto: document.getElementById('filtro-reservas-texto'),
  filtroReservasEstado: document.getElementById('filtro-reservas-estado'),
  listaReservas: document.getElementById('lista-reservas'),

  // Modal cancelación
  modalCancelacion: document.getElementById('modal-cancelacion'),
  formCancelacion: document.getElementById('form-cancelacion'),
  motivoCancelacion: document.getElementById('motivo-cancelacion'),
  btnCerrarModalCancel: document.getElementById('btn-cerrar-modal-cancel'),
};

let horarioSeleccionado = '';
let reservaPendienteCancelarId = null;

function inicializar() {
  poblarSelectsIniciales();
  dom.campoFecha.min = obtenerFechaHoyISO();
  restaurarBorradorEnFormulario();
  registrarEventos();
  renderDocentes();
  renderReservas();
  actualizarContadorReservas();
}

function poblarSelectsIniciales() {
  const asignaturas = service.listarAsignaturas();
  for (const a of asignaturas) {
    dom.filtroAsignatura.insertAdjacentHTML(
      'beforeend',
      `<option value="${escaparHTML(a.id)}">${escaparHTML(a.nombre)} (${escaparHTML(a.codigo)})</option>`
    );
    dom.campoAsignatura.insertAdjacentHTML(
      'beforeend',
      `<option value="${escaparHTML(a.id)}">${escaparHTML(a.nombre)}</option>`
    );
  }

  const docentes = service.consultarDocentes();
  for (const d of docentes) {
    dom.campoDocente.insertAdjacentHTML(
      'beforeend',
      `<option value="${escaparHTML(d.id)}">${escaparHTML(d.nombre)}</option>`
    );
  }
}

function mostrarAlerta(tipo, mensaje) {
  const clase =
    tipo === 'success' ? 'alert-success' : tipo === 'error' ? 'alert-error' : 'alert-info';
  dom.regionAlertas.innerHTML = `
    <div class="alert-banner ${clase}">
      <span>${escaparHTML(mensaje)}</span>
      <button type="button" class="btn btn-secondary" aria-label="Cerrar alerta" onclick="this.parentElement.remove()">Cerrar</button>
    </div>
  `;
}

function limpiarAlerta() {
  dom.regionAlertas.innerHTML = '';
}

function cambiarVista(nombreVista) {
  Object.entries(dom.vistas).forEach(([clave, el]) => {
    const activa = clave === nombreVista;
    el.hidden = !activa;
  });

  dom.navBtns.forEach((btn) => {
    const activa = btn.dataset.view === nombreVista;
    btn.classList.toggle('is-active', activa);
    if (activa) {
      btn.setAttribute('aria-current', 'page');
    } else {
      btn.removeAttribute('aria-current');
    }
  });

  if (nombreVista === 'reservas') {
    renderReservas();
  }
}

function mostrarPasoReserva(numeroPaso) {
  dom.pasoFormulario.hidden = numeroPaso !== 1;
  dom.pasoRevision.hidden = numeroPaso !== 2;
  dom.pasoConfirmacion.hidden = numeroPaso !== 3;

  dom.pasosInd.forEach((el, idx) => {
    const paso = idx + 1;
    el.classList.toggle('is-active', paso === numeroPaso);
    el.classList.toggle('is-done', paso < numeroPaso);
  });
}

function obtenerDatosFormulario() {
  const modalidadEl = dom.formReserva.querySelector('input[name="modalidad"]:checked');
  const horarioEl = dom.formReserva.querySelector('input[name="horario"]:checked');
  return {
    docenteId: dom.campoDocente.value,
    asignaturaId: dom.campoAsignatura.value,
    modalidad: modalidadEl ? modalidadEl.value : '',
    fecha: dom.campoFecha.value,
    horario: horarioEl ? horarioEl.value : horarioSeleccionado,
    estudianteNombre: dom.campoNombre.value,
    estudianteCorreo: dom.campoCorreo.value,
    motivo: dom.campoMotivo.value,
  };
}

function guardarBorradorActual() {
  if (!dom.reservaIdEdicion.value) {
    service.guardarBorrador(obtenerDatosFormulario());
  }
}

function restaurarBorradorEnFormulario() {
  const borrador = service.obtenerBorrador();
  if (!borrador) return;

  if (borrador.docenteId) dom.campoDocente.value = borrador.docenteId;
  actualizarOpcionesPorDocente(false);

  if (borrador.asignaturaId) dom.campoAsignatura.value = borrador.asignaturaId;
  if (borrador.modalidad) {
    const radio = dom.formReserva.querySelector(`input[name="modalidad"][value="${CSS.escape(borrador.modalidad)}"]`);
    if (radio) radio.checked = true;
  }
  if (borrador.fecha) dom.campoFecha.value = borrador.fecha;
  horarioSeleccionado = borrador.horario || '';
  if (borrador.estudianteNombre) dom.campoNombre.value = borrador.estudianteNombre;
  if (borrador.estudianteCorreo) dom.campoCorreo.value = borrador.estudianteCorreo;
  if (borrador.motivo) dom.campoMotivo.value = borrador.motivo;

  renderHorariosDisponibles();
}

function actualizarOpcionesPorDocente(limpiarIncompatibles = true) {
  const docente = service.obtenerDocentePorId(dom.campoDocente.value);
  const radiosModalidad = dom.formReserva.querySelectorAll('input[name="modalidad"]');

  radiosModalidad.forEach((radio) => {
    const permitido = !docente || docente.modalidades.includes(radio.value);
    radio.disabled = !permitido;
    if (!permitido && radio.checked && limpiarIncompatibles) {
      radio.checked = false;
    }
  });

  if (docente && docente.asignaturasIds.length === 1 && !dom.campoAsignatura.value) {
    dom.campoAsignatura.value = docente.asignaturasIds[0];
  }
}

function validarFechaTempranaUI() {
  const errEl = document.getElementById('err-fecha');
  if (!dom.campoFecha.value) {
    if (errEl) errEl.textContent = '';
    dom.campoFecha.removeAttribute('aria-invalid');
    return true;
  }

  const res = validarFechaIndividual(dom.campoFecha.value);
  if (!res.valido) {
    if (errEl) errEl.textContent = res.error;
    dom.campoFecha.setAttribute('aria-invalid', 'true');
    horarioSeleccionado = '';
    return false;
  }

  if (errEl) errEl.textContent = '';
  dom.campoFecha.removeAttribute('aria-invalid');
  return true;
}

function renderHorariosDisponibles(avisoExtra = '') {
  const docenteId = dom.campoDocente.value;
  const fecha = dom.campoFecha.value;
  const excluirId = dom.reservaIdEdicion.value || null;

  if (!docenteId || !fecha) {
    dom.contenedorHorarios.innerHTML =
      '<p class="hint-text">Selecciona un docente y una fecha para ver los horarios disponibles.</p>';
    return;
  }

  const validacionFecha = validarFechaIndividual(fecha);
  if (!validacionFecha.valido) {
    dom.contenedorHorarios.innerHTML = `<p class="slot-notice slot-notice-error" role="alert">${escaparHTML(validacionFecha.error)} Elige un día entre lunes y viernes para cargar horarios.</p>`;
    return;
  }

  const slots = service.obtenerHorariosConEstado(docenteId, fecha, excluirId);
  if (slots.length === 0) {
    dom.contenedorHorarios.innerHTML = '<p class="hint-text">No hay horarios configurados para este docente.</p>';
    return;
  }

  const avisoHtml = avisoExtra
    ? `<p class="slot-notice" role="status">${escaparHTML(avisoExtra)}</p>`
    : '';

  dom.contenedorHorarios.innerHTML =
    avisoHtml +
    slots
      .map((slot) => {
        const checked = slot.disponible && horarioSeleccionado === slot.horario ? 'checked' : '';
        const disabled = slot.disponible ? '' : 'disabled';
        const claseDisabled = slot.disponible ? '' : 'is-disabled';
        const etiquetaEstado = slot.disponible ? '' : ' (Ocupado)';
        return `
          <label class="slot-option ${claseDisabled}">
            <input
              type="radio"
              name="horario"
              value="${escaparHTML(slot.horario)}"
              ${checked}
              ${disabled}
            />
            <span>${escaparHTML(slot.horario)}${etiquetaEstado}</span>
          </label>
        `;
      })
      .join('');
}

function limpiarErroresFormulario() {
  const campos = ['docenteId', 'asignaturaId', 'modalidad', 'fecha', 'horario', 'estudianteNombre', 'estudianteCorreo', 'motivo'];
  for (const campo of campos) {
    const errEl = document.getElementById(`err-${campo}`);
    if (errEl) errEl.textContent = '';
  }
  dom.formReserva.querySelectorAll('[aria-invalid="true"]').forEach((el) => el.removeAttribute('aria-invalid'));
}

function mostrarErroresFormulario(errores) {
  limpiarErroresFormulario();
  const mapaElementos = {
    docenteId: dom.campoDocente,
    asignaturaId: dom.campoAsignatura,
    fecha: dom.campoFecha,
    estudianteNombre: dom.campoNombre,
    estudianteCorreo: dom.campoCorreo,
    motivo: dom.campoMotivo,
  };

  let primerElementoConError = null;
  for (const [campo, mensaje] of Object.entries(errores)) {
    const errEl = document.getElementById(`err-${campo}`);
    if (errEl) errEl.textContent = mensaje;
    const inputEl = mapaElementos[campo];
    if (inputEl) {
      inputEl.setAttribute('aria-invalid', 'true');
      if (!primerElementoConError) primerElementoConError = inputEl;
    }
  }

  if (primerElementoConError) {
    primerElementoConError.focus();
  }
}

function renderDocentes() {
  const docentes = service.consultarDocentes({
    texto: dom.filtroTexto.value,
    asignaturaId: dom.filtroAsignatura.value,
    modalidad: dom.filtroModalidad.value,
  });

  if (docentes.length === 0) {
    dom.listaDocentes.innerHTML = `
      <div class="empty-state">
        <p>No encontramos docentes con esos filtros. Intenta limpiar los criterios de búsqueda.</p>
      </div>
    `;
    return;
  }

  dom.listaDocentes.innerHTML = docentes.map((d) => renderTarjetaDocente(d, asignaturasMap)).join('');
}

function renderReservas() {
  const reservas = service.consultarReservas({
    texto: dom.filtroReservasTexto.value,
    estado: dom.filtroReservasEstado.value,
  });

  if (reservas.length === 0) {
    dom.listaReservas.innerHTML = `
      <div class="empty-state">
        <p>Aún no tienes reservas registradas con ese filtro.</p>
      </div>
    `;
    return;
  }

  dom.listaReservas.innerHTML = reservas.map(renderTarjetaReserva).join('');
}

function actualizarContadorReservas() {
  const total = service.consultarReservas().length;
  dom.badgeContador.textContent = String(total);
}

function prepararNuevaReserva(docenteId = '') {
  dom.reservaIdEdicion.value = '';
  dom.tituloReservar.textContent = 'Reservar tutoría';
  dom.subtituloReservar.textContent =
    'Completa los datos. Tus selecciones se conservan si regresas a consultar docentes o corriges un error.';
  if (docenteId) {
    dom.campoDocente.value = docenteId;
    actualizarOpcionesPorDocente();
    guardarBorradorActual();
  }
  limpiarErroresFormulario();
  renderHorariosDisponibles();
  mostrarPasoReserva(1);
  cambiarVista('reservar');
}

function cargarReservaParaModificar(reservaId) {
  const reserva = service.obtenerReservaPorId(reservaId);
  if (!reserva) return;

  dom.reservaIdEdicion.value = reserva.id;
  dom.tituloReservar.textContent = `Modificar reserva ${reserva.codigo}`;
  dom.subtituloReservar.textContent = 'Actualiza fecha, horario, modalidad o motivo manteniendo tu código de reserva.';

  dom.campoDocente.value = reserva.docenteId;
  actualizarOpcionesPorDocente(false);
  dom.campoAsignatura.value = reserva.asignaturaId;

  const radioMod = dom.formReserva.querySelector(`input[name="modalidad"][value="${CSS.escape(reserva.modalidad)}"]`);
  if (radioMod) radioMod.checked = true;

  dom.campoFecha.value = reserva.fecha;
  horarioSeleccionado = reserva.horario;
  dom.campoNombre.value = reserva.estudianteNombre;
  dom.campoCorreo.value = reserva.estudianteCorreo;
  dom.campoMotivo.value = reserva.motivo;

  limpiarErroresFormulario();
  renderHorariosDisponibles();
  mostrarPasoReserva(1);
  cambiarVista('reservar');
  mostrarAlerta('info', `Editando reserva ${reserva.codigo}.`);
}

function registrarEventos() {
  dom.navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      limpiarAlerta();
      cambiarVista(btn.dataset.view);
    });
  });

  // Filtros docentes
  [dom.filtroTexto, dom.filtroAsignatura, dom.filtroModalidad].forEach((el) => {
    el.addEventListener('input', renderDocentes);
    el.addEventListener('change', renderDocentes);
  });

  dom.btnLimpiarFiltros.addEventListener('click', () => {
    dom.filtroTexto.value = '';
    dom.filtroAsignatura.value = '';
    dom.filtroModalidad.value = '';
    renderDocentes();
  });

  // Selección de docente desde tarjeta
  dom.listaDocentes.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-seleccionar-docente');
    if (!btn) return;
    limpiarAlerta();
    prepararNuevaReserva(btn.dataset.docenteId);
  });

  // Cambios en formulario con persistencia automática de borrador (v2: H-01 y H-02)
  dom.campoDocente.addEventListener('change', () => {
    const horarioPrevio = horarioSeleccionado;
    const nuevoDocente = service.obtenerDocentePorId(dom.campoDocente.value);
    actualizarOpcionesPorDocente();

    let avisoCambio = '';
    if (horarioPrevio && (!nuevoDocente || !nuevoDocente.horarios.includes(horarioPrevio))) {
      horarioSeleccionado = '';
      avisoCambio = `Al cambiar de docente se reinició tu horario anterior (${horarioPrevio}). Selecciona una franja disponible.`;
      mostrarAlerta('info', avisoCambio);
    }

    renderHorariosDisponibles(avisoCambio);
    guardarBorradorActual();
  });

  dom.campoFecha.addEventListener('change', () => {
    const fechaValida = validarFechaTempranaUI();
    renderHorariosDisponibles();
    if (!fechaValida) {
      mostrarAlerta('error', 'Las tutorías solo se atienden de lunes a viernes y a partir de hoy.');
    } else {
      limpiarAlerta();
    }
    guardarBorradorActual();
  });

  dom.contenedorHorarios.addEventListener('change', (e) => {
    if (e.target.name === 'horario') {
      horarioSeleccionado = e.target.value;
      guardarBorradorActual();
    }
  });

  [dom.campoAsignatura, dom.campoNombre, dom.campoCorreo, dom.campoMotivo].forEach((el) => {
    el.addEventListener('input', guardarBorradorActual);
    el.addEventListener('change', guardarBorradorActual);
  });

  dom.formReserva.querySelectorAll('input[name="modalidad"]').forEach((r) => {
    r.addEventListener('change', guardarBorradorActual);
  });

  // Volver a docentes conservando borrador
  dom.btnVolverDocentes.addEventListener('click', () => {
    guardarBorradorActual();
    cambiarVista('explorar');
    mostrarAlerta('info', 'Tus datos del formulario se conservaron mientras consultas docentes.');
  });

  // Revisar reserva (Paso 1 -> Paso 2)
  dom.btnRevisarReserva.addEventListener('click', () => {
    limpiarAlerta();
    const datos = obtenerDatosFormulario();
    const validacion = validarDatosReserva(datos);
    if (!validacion.valido) {
      mostrarErroresFormulario(validacion.errores);
      mostrarAlerta('error', 'Revisa los campos marcados. Tus datos ingresados se mantienen intactos.');
      return;
    }

    const docente = service.obtenerDocentePorId(datos.docenteId);
    if (docente && !docente.modalidades.includes(datos.modalidad)) {
      mostrarErroresFormulario({
        modalidad: `${docente.nombre} solo atiende en modalidad ${docente.modalidades.join(' o ')}.`,
      });
      mostrarAlerta('error', 'La modalidad elegida no coincide con la disponibilidad del docente.');
      return;
    }

    limpiarErroresFormulario();
    const asignatura = service.obtenerAsignaturaPorId(datos.asignaturaId);
    dom.resumenRevision.innerHTML = renderListaResumen([
      ['Docente', docente ? docente.nombre : datos.docenteId],
      ['Asignatura', asignatura ? asignatura.nombre : datos.asignaturaId],
      ['Modalidad', datos.modalidad],
      ['Fecha', datos.fecha],
      ['Horario', datos.horario],
      ['Estudiante', `${datos.estudianteNombre} (${datos.estudianteCorreo})`],
      ['Tema', datos.motivo],
    ]);
    mostrarPasoReserva(2);
  });

  // Regresar a editar desde revisión (Paso 2 -> Paso 1)
  dom.btnRegresarEditar.addEventListener('click', () => {
    mostrarPasoReserva(1);
  });

  // Confirmar envío (crear o modificar)
  dom.formReserva.addEventListener('submit', (e) => {
    e.preventDefault();
    const datos = obtenerDatosFormulario();
    const idEdicion = dom.reservaIdEdicion.value;

    const resultado = idEdicion
      ? service.modificarReserva(idEdicion, datos)
      : service.crearReserva(datos);

    if (!resultado.ok) {
      mostrarPasoReserva(1);
      mostrarErroresFormulario(resultado.errores || {});
      mostrarAlerta('error', resultado.mensaje);
      return;
    }

    const r = resultado.reserva;
    dom.tituloConfirmacion.textContent = idEdicion ? '¡Reserva actualizada!' : '¡Tutoría confirmada!';
    dom.mensajeConfirmacion.textContent = resultado.mensaje;
    dom.detalleConfirmacion.innerHTML = renderListaResumen([
      ['Código de reserva', r.codigo],
      ['Estado', r.estado],
      ['Docente', r.docenteNombre],
      ['Asignatura', r.asignaturaNombre],
      ['Fecha y hora', `${r.fecha} · ${r.horario}`],
      ['Modalidad', r.modalidad],
    ]);

    dom.reservaIdEdicion.value = '';
    horarioSeleccionado = '';
    dom.formReserva.reset();
    actualizarContadorReservas();
    mostrarPasoReserva(3);
    mostrarAlerta('success', resultado.mensaje);
  });

  dom.btnIrMisReservas.addEventListener('click', () => {
    limpiarAlerta();
    cambiarVista('reservas');
  });

  dom.btnNuevaReserva.addEventListener('click', () => {
    limpiarAlerta();
    prepararNuevaReserva();
  });

  // Filtros en Mis Reservas
  [dom.filtroReservasTexto, dom.filtroReservasEstado].forEach((el) => {
    el.addEventListener('input', renderReservas);
    el.addEventListener('change', renderReservas);
  });

  // Acciones Modificar / Cancelar en Mis Reservas
  dom.listaReservas.addEventListener('click', (e) => {
    const btnMod = e.target.closest('.btn-modificar-reserva');
    if (btnMod) {
      cargarReservaParaModificar(btnMod.dataset.reservaId);
      return;
    }

    const btnCancel = e.target.closest('.btn-cancelar-reserva');
    if (btnCancel) {
      reservaPendienteCancelarId = btnCancel.dataset.reservaId;
      dom.motivoCancelacion.value = '';
      if (typeof dom.modalCancelacion.showModal === 'function') {
        dom.modalCancelacion.showModal();
      } else {
        dom.modalCancelacion.setAttribute('open', 'true');
      }
    }
  });

  dom.btnCerrarModalCancel.addEventListener('click', () => {
    reservaPendienteCancelarId = null;
    if (typeof dom.modalCancelacion.close === 'function') {
      dom.modalCancelacion.close();
    } else {
      dom.modalCancelacion.removeAttribute('open');
    }
  });

  dom.formCancelacion.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!reservaPendienteCancelarId) return;

    const resultado = service.cancelarReserva(reservaPendienteCancelarId, dom.motivoCancelacion.value);
    reservaPendienteCancelarId = null;
    if (typeof dom.modalCancelacion.close === 'function') {
      dom.modalCancelacion.close();
    } else {
      dom.modalCancelacion.removeAttribute('open');
    }

    renderReservas();
    renderHorariosDisponibles();
    mostrarAlerta(resultado.ok ? 'success' : 'error', resultado.mensaje);
  });
}

inicializar();

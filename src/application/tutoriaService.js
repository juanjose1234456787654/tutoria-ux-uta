/**
 * Servicio de aplicación para la gestión de tutorías universitarias.
 * Capa: Application (orquesta casos de uso entre Domain e Infrastructure).
 */

import { ESTADOS_RESERVA, crearEntidadReserva, generarCodigoReserva } from '../domain/models.js';
import { validarDatosReserva } from '../domain/validators.js';
import { ASIGNATURAS, DOCENTES } from '../infrastructure/catalogData.js';

export class TutoriaService {
  /**
   * @param {import('../infrastructure/storageRepository.js').StorageRepository} repository
   */
  constructor(repository) {
    this.repository = repository;
  }

  listarAsignaturas() {
    return ASIGNATURAS;
  }

  /**
   * Consulta docentes filtrando por texto, asignatura o modalidad.
   * @param {object} [filtros]
   * @param {string} [filtros.texto]
   * @param {string} [filtros.asignaturaId]
   * @param {string} [filtros.modalidad]
   */
  consultarDocentes(filtros = {}) {
    const texto = (filtros.texto || '').trim().toLowerCase();
    const asignaturaId = filtros.asignaturaId || '';
    const modalidad = filtros.modalidad || '';

    return DOCENTES.filter((doc) => {
      const coincideAsignatura = !asignaturaId || doc.asignaturasIds.includes(asignaturaId);
      const coincideModalidad = !modalidad || doc.modalidades.includes(modalidad);
      const coincideTexto =
        !texto ||
        doc.nombre.toLowerCase().includes(texto) ||
        doc.especialidad.toLowerCase().includes(texto) ||
        doc.asignaturasIds.some((id) => {
          const asig = this.obtenerAsignaturaPorId(id);
          return asig && asig.nombre.toLowerCase().includes(texto);
        });
      return coincideAsignatura && coincideModalidad && coincideTexto;
    });
  }

  obtenerDocentePorId(docenteId) {
    return DOCENTES.find((d) => d.id === docenteId) || null;
  }

  obtenerAsignaturaPorId(asignaturaId) {
    return ASIGNATURAS.find((a) => a.id === asignaturaId) || null;
  }

  /**
   * Devuelve los horarios del docente indicando cuáles están ocupados en la fecha dada.
   * Permite excluir una reserva actual cuando se está modificando.
   */
  obtenerHorariosConEstado(docenteId, fecha, excluirReservaId = null) {
    const docente = this.obtenerDocentePorId(docenteId);
    if (!docente) return [];

    const reservasActivas = this.repository
      .listarReservas()
      .filter(
        (r) =>
          r.docenteId === docenteId &&
          r.fecha === fecha &&
          r.estado !== ESTADOS_RESERVA.CANCELADA &&
          r.id !== excluirReservaId
      );

    const horariosOcupados = new Set(reservasActivas.map((r) => r.horario));

    return docente.horarios.map((horario) => ({
      horario,
      disponible: !horariosOcupados.has(horario),
    }));
  }

  /**
   * Lista todas las reservas, opcionalmente filtradas por estado o término de búsqueda.
   */
  consultarReservas(filtros = {}) {
    const estado = filtros.estado || '';
    const texto = (filtros.texto || '').trim().toLowerCase();
    const todas = this.repository.listarReservas();

    return todas
      .filter((r) => {
        const coincideEstado = !estado || r.estado === estado;
        const coincideTexto =
          !texto ||
          r.codigo.toLowerCase().includes(texto) ||
          r.docenteNombre.toLowerCase().includes(texto) ||
          r.asignaturaNombre.toLowerCase().includes(texto) ||
          r.estudianteNombre.toLowerCase().includes(texto);
        return coincideEstado && coincideTexto;
      })
      .sort((a, b) => (b.creadoEn || '').localeCompare(a.creadoEn || ''));
  }

  obtenerReservaPorId(id) {
    return this.repository.listarReservas().find((r) => r.id === id) || null;
  }

  /**
   * Crea una nueva reserva validando reglas de negocio y disponibilidad.
   * Si falla, conserva el borrador para que el usuario no pierda sus datos.
   */
  crearReserva(datos, opciones = {}) {
    this.repository.guardarBorrador(datos);

    const validacion = validarDatosReserva(datos, opciones);
    if (!validacion.valido) {
      return {
        ok: false,
        errores: validacion.errores,
        mensaje: 'Revisa los campos marcados antes de confirmar tu reserva.',
      };
    }

    const docente = this.obtenerDocentePorId(datos.docenteId);
    const asignatura = this.obtenerAsignaturaPorId(datos.asignaturaId);

    if (!docente || !asignatura) {
      return {
        ok: false,
        errores: { general: 'Docente o asignatura no válidos.' },
        mensaje: 'El docente o la asignatura seleccionados no existen en el catálogo.',
      };
    }

    if (!docente.modalidades.includes(datos.modalidad)) {
      return {
        ok: false,
        errores: { modalidad: `${docente.nombre} solo atiende en modalidad ${docente.modalidades.join(' o ')}.` },
        mensaje: 'La modalidad seleccionada no está disponible para este docente.',
      };
    }

    const horarios = this.obtenerHorariosConEstado(docente.id, datos.fecha);
    const slot = horarios.find((h) => h.horario === datos.horario);
    if (!slot || !slot.disponible) {
      return {
        ok: false,
        errores: { horario: 'Este horario ya fue reservado. Elige otra franja disponible.' },
        mensaje: 'El horario seleccionado ya no está disponible.',
      };
    }

    const reservas = this.repository.listarReservas();
    const id = `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const codigo = generarCodigoReserva(Date.now() + reservas.length);

    const nuevaReserva = crearEntidadReserva({
      id,
      codigo,
      docenteId: docente.id,
      docenteNombre: docente.nombre,
      asignaturaId: asignatura.id,
      asignaturaNombre: asignatura.nombre,
      modalidad: datos.modalidad,
      fecha: datos.fecha,
      horario: datos.horario,
      estudianteNombre: datos.estudianteNombre,
      estudianteCorreo: datos.estudianteCorreo,
      motivo: datos.motivo,
      estado: ESTADOS_RESERVA.CONFIRMADA,
    });

    reservas.push(nuevaReserva);
    this.repository.guardarReservas(reservas);
    this.repository.limpiarBorrador();

    return {
      ok: true,
      reserva: nuevaReserva,
      mensaje: `Reserva ${nuevaReserva.codigo} confirmada correctamente.`,
    };
  }

  /**
   * Modifica una reserva existente manteniendo su código y registrando el estado Modificada.
   */
  modificarReserva(id, datosActualizados, opciones = {}) {
    const reservas = this.repository.listarReservas();
    const indice = reservas.findIndex((r) => r.id === id);

    if (indice === -1) {
      return {
        ok: false,
        errores: { general: 'No se encontró la reserva solicitada.' },
        mensaje: 'No fue posible localizar la reserva para modificarla.',
      };
    }

    const actual = reservas[indice];
    if (actual.estado === ESTADOS_RESERVA.CANCELADA) {
      return {
        ok: false,
        errores: { general: 'Una reserva cancelada no puede modificarse.' },
        mensaje: 'Esta reserva ya fue cancelada y no admite cambios.',
      };
    }

    const validacion = validarDatosReserva(datosActualizados, opciones);
    if (!validacion.valido) {
      return {
        ok: false,
        errores: validacion.errores,
        mensaje: 'Corrige los campos señalados para guardar los cambios.',
      };
    }

    const docente = this.obtenerDocentePorId(datosActualizados.docenteId);
    const asignatura = this.obtenerAsignaturaPorId(datosActualizados.asignaturaId);

    if (!docente || !asignatura) {
      return {
        ok: false,
        errores: { general: 'Docente o asignatura no válidos.' },
        mensaje: 'Selecciona un docente y asignatura válidos.',
      };
    }

    if (!docente.modalidades.includes(datosActualizados.modalidad)) {
      return {
        ok: false,
        errores: { modalidad: `${docente.nombre} solo atiende en modalidad ${docente.modalidades.join(' o ')}.` },
        mensaje: 'Modalidad incompatible con el docente seleccionado.',
      };
    }

    const horarios = this.obtenerHorariosConEstado(docente.id, datosActualizados.fecha, id);
    const slot = horarios.find((h) => h.horario === datosActualizados.horario);
    if (!slot || !slot.disponible) {
      return {
        ok: false,
        errores: { horario: 'Ese horario está ocupado. Selecciona otro disponible.' },
        mensaje: 'El nuevo horario seleccionado ya está ocupado.',
      };
    }

    const modificada = crearEntidadReserva({
      ...actual,
      docenteId: docente.id,
      docenteNombre: docente.nombre,
      asignaturaId: asignatura.id,
      asignaturaNombre: asignatura.nombre,
      modalidad: datosActualizados.modalidad,
      fecha: datosActualizados.fecha,
      horario: datosActualizados.horario,
      estudianteNombre: datosActualizados.estudianteNombre,
      estudianteCorreo: datosActualizados.estudianteCorreo,
      motivo: datosActualizados.motivo,
      estado: ESTADOS_RESERVA.MODIFICADA,
      actualizadoEn: new Date().toISOString(),
    });

    reservas[indice] = modificada;
    this.repository.guardarReservas(reservas);

    return {
      ok: true,
      reserva: modificada,
      mensaje: `Reserva ${modificada.codigo} actualizada con éxito.`,
    };
  }

  /**
   * Cancela una reserva existente cambiando su estado a Cancelada.
   */
  cancelarReserva(id, motivoCancelacion = '') {
    const reservas = this.repository.listarReservas();
    const indice = reservas.findIndex((r) => r.id === id);

    if (indice === -1) {
      return {
        ok: false,
        mensaje: 'No se encontró la reserva que intentas cancelar.',
      };
    }

    if (reservas[indice].estado === ESTADOS_RESERVA.CANCELADA) {
      return {
        ok: false,
        mensaje: 'Esta reserva ya se encontraba cancelada.',
      };
    }

    reservas[indice] = {
      ...reservas[indice],
      estado: ESTADOS_RESERVA.CANCELADA,
      motivoCancelacion: motivoCancelacion.trim() || 'Cancelada por el estudiante',
      actualizadoEn: new Date().toISOString(),
    };

    this.repository.guardarReservas(reservas);
    return {
      ok: true,
      reserva: reservas[indice],
      mensaje: `Reserva ${reservas[indice].codigo} cancelada. El horario quedó liberado.`,
    };
  }

  guardarBorrador(datos) {
    this.repository.guardarBorrador(datos);
  }

  obtenerBorrador() {
    return this.repository.obtenerBorrador();
  }

  limpiarBorrador() {
    this.repository.limpiarBorrador();
  }
}

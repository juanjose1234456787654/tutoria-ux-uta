import test from 'node:test';
import assert from 'node:assert/strict';

import { TutoriaService } from '../src/application/tutoriaService.js';
import { ESTADOS_RESERVA, MODALIDADES } from '../src/domain/models.js';
import { validarDatosReserva } from '../src/domain/validators.js';
import { StorageRepository, crearMemoriaStorage } from '../src/infrastructure/storageRepository.js';

function crearServicioPrueba() {
  const repo = new StorageRepository(crearMemoriaStorage());
  return new TutoriaService(repo);
}

const FECHA_HABIL = '2026-11-30'; // Lunes
const FECHA_MINIMA = '2026-11-26';

test('Consultar docentes filtra por asignatura, modalidad y texto', () => {
  const service = crearServicioPrueba();

  const todos = service.consultarDocentes();
  assert.equal(todos.length, 4);

  const porIhc = service.consultarDocentes({ asignaturaId: 'ihc' });
  assert.equal(porIhc.length, 2);

  const soloVirtual = service.consultarDocentes({ asignaturaId: 'bd', modalidad: MODALIDADES.VIRTUAL });
  assert.equal(soloVirtual.length, 1);
  assert.equal(soloVirtual[0].id, 'doc-3');

  const porTexto = service.consultarDocentes({ texto: 'Paredes' });
  assert.equal(porTexto.length, 1);
  assert.equal(porTexto[0].id, 'doc-2');
});

test('Validación rechaza fin de semana y campos inválidos', () => {
  const resultado = validarDatosReserva(
    {
      docenteId: 'doc-1',
      asignaturaId: 'ihc',
      modalidad: MODALIDADES.VIRTUAL,
      fecha: '2026-11-28', // Sábado
      horario: '09:00 - 09:30',
      estudianteNombre: 'Ana',
      estudianteCorreo: 'correo-mal',
      motivo: 'Corto',
    },
    { fechaMinima: FECHA_MINIMA }
  );

  assert.equal(resultado.valido, false);
  assert.ok(resultado.errores.fecha);
  assert.ok(resultado.errores.estudianteCorreo);
  assert.ok(resultado.errores.motivo);
});

test('Crear reserva válida la persiste como Confirmada, limpia borrador y bloquea horario duplicado', () => {
  const service = crearServicioPrueba();

  const datos = {
    docenteId: 'doc-1',
    asignaturaId: 'ihc',
    modalidad: MODALIDADES.VIRTUAL,
    fecha: FECHA_HABIL,
    horario: '09:00 - 09:30',
    estudianteNombre: 'Ana Lucía Torres',
    estudianteCorreo: 'atorres@uta.edu.ec',
    motivo: 'Revisión de prototipo de baja fidelidad',
  };

  const res1 = service.crearReserva(datos, { fechaMinima: FECHA_MINIMA });
  assert.equal(res1.ok, true);
  assert.equal(res1.reserva.estado, ESTADOS_RESERVA.CONFIRMADA);
  assert.match(res1.reserva.codigo, /^TUT-2026-\d{4}$/);
  assert.equal(service.obtenerBorrador(), null);

  // Intentar reservar el mismo docente, fecha y horario debe fallar
  const res2 = service.crearReserva(datos, { fechaMinima: FECHA_MINIMA });
  assert.equal(res2.ok, false);
  assert.ok(res2.errores.horario);
});

test('Error de validación conserva borrador del formulario para recuperación', () => {
  const service = crearServicioPrueba();

  const datosIncompletos = {
    docenteId: 'doc-1',
    asignaturaId: 'ihc',
    modalidad: MODALIDADES.PRESENCIAL,
    fecha: FECHA_HABIL,
    horario: '08:00 - 08:30',
    estudianteNombre: 'Luis Pérez',
    estudianteCorreo: 'correo_sin_arroba',
    motivo: 'Consulta sobre matriz de trazabilidad',
  };

  const res = service.crearReserva(datosIncompletos, { fechaMinima: FECHA_MINIMA });
  assert.equal(res.ok, false);

  const borrador = service.obtenerBorrador();
  assert.ok(borrador);
  assert.equal(borrador.estudianteNombre, 'Luis Pérez');
  assert.equal(borrador.horario, '08:00 - 08:30');
});

test('Modificar reserva cambia estado a Modificada y conserva el código original', () => {
  const service = crearServicioPrueba();

  const creada = service.crearReserva(
    {
      docenteId: 'doc-2',
      asignaturaId: 'arq',
      modalidad: MODALIDADES.PRESENCIAL,
      fecha: FECHA_HABIL,
      horario: '10:00 - 10:30',
      estudianteNombre: 'Carlos Mejía',
      estudianteCorreo: 'cmejia@uta.edu.ec',
      motivo: 'Dudas sobre arquitectura en capas',
    },
    { fechaMinima: FECHA_MINIMA }
  );

  assert.equal(creada.ok, true);
  const codigoOriginal = creada.reserva.codigo;

  const modificada = service.modificarReserva(
    creada.reserva.id,
    {
      docenteId: 'doc-2',
      asignaturaId: 'arq',
      modalidad: MODALIDADES.VIRTUAL,
      fecha: FECHA_HABIL,
      horario: '11:00 - 11:30',
      estudianteNombre: 'Carlos Mejía',
      estudianteCorreo: 'cmejia@uta.edu.ec',
      motivo: 'Dudas sobre arquitectura limpia y pruebas',
    },
    { fechaMinima: FECHA_MINIMA }
  );

  assert.equal(modificada.ok, true);
  assert.equal(modificada.reserva.codigo, codigoOriginal);
  assert.equal(modificada.reserva.estado, ESTADOS_RESERVA.MODIFICADA);
  assert.equal(modificada.reserva.horario, '11:00 - 11:30');
});

test('Cancelar reserva cambia estado a Cancelada y libera el horario', () => {
  const service = crearServicioPrueba();

  const creada = service.crearReserva(
    {
      docenteId: 'doc-3',
      asignaturaId: 'bd',
      modalidad: MODALIDADES.VIRTUAL,
      fecha: FECHA_HABIL,
      horario: '08:30 - 09:00',
      estudianteNombre: 'María Gómez',
      estudianteCorreo: 'mgomez@uta.edu.ec',
      motivo: 'Normalización de base de datos',
    },
    { fechaMinima: FECHA_MINIMA }
  );

  assert.equal(creada.ok, true);

  let slots = service.obtenerHorariosConEstado('doc-3', FECHA_HABIL);
  assert.equal(slots.find((s) => s.horario === '08:30 - 09:00').disponible, false);

  const cancelada = service.cancelarReserva(creada.reserva.id, 'Cruce con laboratorio');
  assert.equal(cancelada.ok, true);
  assert.equal(cancelada.reserva.estado, ESTADOS_RESERVA.CANCELADA);

  slots = service.obtenerHorariosConEstado('doc-3', FECHA_HABIL);
  assert.equal(slots.find((s) => s.horario === '08:30 - 09:00').disponible, true);
});

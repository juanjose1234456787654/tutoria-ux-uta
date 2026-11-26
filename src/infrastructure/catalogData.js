/**
 * Catálogo inicial de docentes, asignaturas y franjas horarias de la FISEI - UTA.
 * Capa: Infrastructure.
 */

import { MODALIDADES } from '../domain/models.js';

export const ASIGNATURAS = [
  { id: 'ihc', nombre: 'Interacción Humano-Computador', nivel: '5to Semestre', codigo: 'SW-501' },
  { id: 'ing-sw', nombre: 'Ingeniería de Software II', nivel: '5to Semestre', codigo: 'SW-502' },
  { id: 'bd', nombre: 'Bases de Datos Avanzadas', nivel: '4to Semestre', codigo: 'SW-403' },
  { id: 'web', nombre: 'Desarrollo Web y Móvil', nivel: '6to Semestre', codigo: 'SW-601' },
  { id: 'arq', nombre: 'Arquitectura de Software', nivel: '6to Semestre', codigo: 'SW-604' },
];

export const DOCENTES = [
  {
    id: 'doc-1',
    nombre: 'Ing. Valeria Mendoza, Mg.',
    especialidad: 'UX, Usabilidad y Diseño Centrado en el Usuario',
    oficina: 'Bloque B - Cubículo 204',
    modalidades: [MODALIDADES.PRESENCIAL, MODALIDADES.VIRTUAL],
    asignaturasIds: ['ihc', 'web'],
    horarios: ['08:00 - 08:30', '09:00 - 09:30', '14:00 - 14:30', '15:30 - 16:00'],
  },
  {
    id: 'doc-2',
    nombre: 'Ing. Carlos Paredes, PhD.',
    especialidad: 'Arquitectura de Software y Patrones de Diseño',
    oficina: 'Bloque A - Cubículo 108',
    modalidades: [MODALIDADES.PRESENCIAL, MODALIDADES.VIRTUAL],
    asignaturasIds: ['ing-sw', 'arq'],
    horarios: ['10:00 - 10:30', '11:00 - 11:30', '16:00 - 16:30'],
  },
  {
    id: 'doc-3',
    nombre: 'Ing. Sofía Villacís, Mg.',
    especialidad: 'Bases de Datos, SQL y Modelado de Información',
    oficina: 'Bloque B - Cubículo 112',
    modalidades: [MODALIDADES.VIRTUAL],
    asignaturasIds: ['bd', 'ing-sw'],
    horarios: ['08:30 - 09:00', '11:30 - 12:00', '17:00 - 17:30'],
  },
  {
    id: 'doc-4',
    nombre: 'Ing. Andrés Cevallos, Mg.',
    especialidad: 'Accesibilidad Web, Frontend y Pruebas Automatizadas',
    oficina: 'Bloque C - Laboratorio 302',
    modalidades: [MODALIDADES.PRESENCIAL],
    asignaturasIds: ['ihc', 'web', 'arq'],
    horarios: ['09:30 - 10:00', '14:30 - 15:00', '15:00 - 15:30'],
  },
];

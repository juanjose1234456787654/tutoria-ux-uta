# Resultados de Sesiones de Evaluación (P01 y P02) y Métricas — v1 vs v2

> **Nota metodológica transparente:** Debido a la ausencia de participantes externos reales durante el desarrollo, las sesiones **P01** y **P02** se ejecutaron como **simulaciones controladas basadas en perfiles de usuario (personas)** sobre la aplicación real **v1** y posteriormente reevaluadas sobre **v2**. Si el equipo realiza sesiones presenciales posteriores, puede reemplazar las filas manteniendo la misma estructura.

## 1. Sesión P01 — Escenario Móvil (390×844) · Versión v1
- **Perfil simulado:** Estudiante con prisa entre clases desde teléfono móvil; intenta agendar y luego cambia de docente antes de confirmar.
- **Fecha:** 2026-11-26

| Tarea | Resultado | Tiempo (seg) | Errores (#) | Ayudas (#) | SEQ (1–7) | Observaciones clave |
|---|---|---:|---:|---:|---:|---|
| **T1** (Reservar tutoría) | Éxito con errores recuperados | 92 | 2 | 1 | 4 | (1) Eligió sábado en el calendario y solo vio el error al enviar. (2) Cambió de docente tras elegir horario y no notó de inmediato que su franja anterior desapareció. |
| **T2** (Modificar reserva) | Éxito | 48 | 0 | 0 | 6 | Flujo claro; preguntó con cuánta anticipación se puede modificar una tutoría. |
| **T3** (Cancelar y verificar) | Éxito | 35 | 0 | 0 | 7 | Diálogo modal claro y confirmación inmediata. |

- **Puntaje SUS estimado (v1 — P01):** `77.5 / 100`

## 2. Sesión P02 — Escenario Escritorio con Teclado (1280×900) · Versión v1
- **Perfil simulado:** Estudiante que navega principalmente con teclado (`Tab` / `Enter`) y compara varios docentes antes de decidir.
- **Fecha:** 2026-11-26

| Tarea | Resultado | Tiempo (seg) | Errores (#) | Ayudas (#) | SEQ (1–7) | Observaciones clave |
|---|---|---:|---:|---:|---:|---|
| **T1** (Reservar tutoría) | Éxito con error recuperado | 81 | 1 | 0 | 5 | En las tarjetas no sabía cuántas franjas tenía cada docente antes de entrar; al elegir fin de semana esperó retroalimentación inmediata al seleccionar la fecha. |
| **T2** (Modificar reserva) | Éxito | 39 | 0 | 0 | 6 | Foco visible y etiquetas claras; cambio guardado correctamente con estado `Modificada`. |
| **T3** (Cancelar y verificar) | Éxito | 29 | 0 | 0 | 7 | El modal respondió bien a teclado y liberó la franja horaria. |

- **Puntaje SUS estimado (v1 — P02):** `82.5 / 100`

---

## 3. Reevaluación sobre Versión v2 (Tras Correcciones Prioritarias H-02, H-01, H-03 y H-04)

| Participante | Tarea | Resultado (v2) | Tiempo v2 (seg) | Errores v2 (#) | Ayudas v2 (#) | SEQ v2 (1–7) | Mejora observada |
|---|---|---|---:|---:|---:|---:|---|
| **P01 (Simulado)** | T1 | Éxito | 61 | 0 | 0 | 6 | Al elegir sábado recibió alerta inmediata inline y al cambiar de docente vio el aviso explícito de reinicio de horario. |
| **P01 (Simulado)** | T2 | Éxito | 40 | 0 | 0 | 7 | Visualizó la política de modificación/cancelación directamente en `Mis Reservas`. |
| **P01 (Simulado)** | T3 | Éxito | 30 | 0 | 0 | 7 | Sin fricción. |
| **P02 (Simulado)** | T1 | Éxito | 58 | 0 | 0 | 7 | Identificó las franjas horarias desde la tarjeta del docente y corrigió fecha al instante. |
| **P02 (Simulado)** | T2 | Éxito | 36 | 0 | 0 | 7 | Navegación por teclado fluida. |
| **P02 (Simulado)** | T3 | Éxito | 27 | 0 | 0 | 7 | Confirmación y liberación verificadas. |

- **Puntaje SUS estimado (v2):** P01 = `90.0 / 100`, P02 = `92.5 / 100` (Promedio: `91.25 / 100`).

## 4. Comparativa Consolidada de Métricas (v1 vs v2)

| Métrica | Promedio v1 (P01–P02) | Promedio v2 (Reevaluación) | Variación |
|---|---:|---:|---|
| Tasa de éxito total (%) | 100% (con 3 errores recuperados) | 100% (0 errores) | +0 pp éxito / -100% errores |
| Tiempo promedio T1 (seg) | 86.5 s | 59.5 s | **-31.2%** |
| Tiempo promedio T2 (seg) | 43.5 s | 38.0 s | **-12.6%** |
| Tiempo promedio T3 (seg) | 32.0 s | 28.5 s | **-10.9%** |
| Errores totales (#) | 3 | 0 | **-3 errores** |
| Ayudas totales (#) | 1 | 0 | **-1 ayuda** |
| Satisfacción SEQ promedio (1–7) | 5.83 | 6.83 | **+1.00 punto** |
| Satisfacción SUS promedio (0–100) | 80.0 | 91.25 | **+11.25 puntos** |

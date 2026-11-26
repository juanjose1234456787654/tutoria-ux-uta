# Registro de Pilotaje — Participante P00 (Escenario Simulado Controlado)

> **Modalidad de ejecución:** Simulación controlada mediante *walkthrough* guiado sobre la aplicación web **Tutoría UX v1** (no se contó con estudiantes externos presenciales; los registros corresponden a ensayos simulados reproducibles).

## 1. Datos de la Sesión Piloto
- **Participante:** P00 (Perfil simulado: estudiante de 5to semestre de Ingeniería de Software)
- **Fecha:** 2026-11-26
- **Dispositivo / Navegador:** Escritorio 1280×900 · Navegador moderno (Chrome)
- **Versión evaluada:** v1 (`commit 029b9fa`)

## 2. Resultados Registrados en P00 (v1)

| Tarea | Resultado | Tiempo (seg) | Errores (#) | Ayudas (#) | SEQ (1–7) | Notas de observación |
|---|---|---:|---:|---:|---:|---|
| **T1** (Consultar docente y reservar tutoría) | Éxito con error recuperado | 78 | 1 | 0 | 5 | Seleccionó un sábado en `<input type="date">` y recién al pulsar "Revisar reserva" recibió el mensaje de error. Los demás datos se conservaron correctamente. |
| **T2** (Consultar y modificar reserva) | Éxito | 42 | 0 | 0 | 6 | Encontró rápidamente `3. Mis Reservas` gracias al contador `(1)` y modificó el horario sin dificultad. |
| **T3** (Cancelar y verificar liberación) | Éxito | 31 | 0 | 0 | 7 | El diálogo modal de confirmación generó confianza y permitió verificar que el horario volvió a estar libre. |

## 3. Ajustes Realizados al Protocolo tras P00
1. **Claridad en el guion de T1:** Se precisó en el enunciado de T1 indicar "para el próximo lunes hábil" y añadir una prueba explícita de cambio de docente para evaluar si el usuario nota el reinicio del horario.
2. **Verificación de foco por teclado:** Se incorporó en el guion de P01/P02 la comprobación de navegación con `Tab` y `Escape` en el diálogo de cancelación.
3. **Criterio de medición:** Se fijó cronómetro individual por tarea y escala SEQ (1–7) al finalizar cada una, más SUS global al cierre.

# Recorrido Cognitivo (Cognitive Walkthrough) — Tutoría UX (v1)

Para cada acción crítica de las tareas **T1, T2 y T3**, se responden las 4 preguntas del recorrido cognitivo:
1. ¿Intentará el usuario lograr el efecto correcto?
2. ¿Notará el usuario que la acción correcta está disponible?
3. ¿Asociará la acción correcta con el efecto deseado?
4. Si realiza la acción, ¿verá que está progresando hacia la meta?

## Tarea 1: Consultar docente y reservar tutoría
| Paso | P1 | P2 | P3 | P4 | Observación |
|---|---|---|---|---|---|
| 1. Filtrar por asignatura/modalidad en `1. Docentes` | Sí | Sí | Sí | Sí | Los selects y tarjetas se actualizan al instante. |
| 2. Pulsar `Reservar con este docente` | Sí | Sí | Sí | Sí | Cambia a `2. Reservar` con el docente preseleccionado. |
| 3. Elegir modalidad, fecha y horario | Sí | Sí | Sí | Sí | Si el usuario elige fin de semana, el error aparece al revisar; podría indicarse junto al campo fecha antes de enviar. |
| 4. Pulsar `Revisar reserva` y luego `Confirmar reserva` | Sí | Sí | Sí | Sí | El stepper marca `1 -> 2 -> 3` y muestra el código `TUT-2026-XXXX`. |

## Tarea 2: Consultar y modificar reserva
| Paso | P1 | P2 | P3 | P4 | Observación |
|---|---|---|---|---|---|
| 1. Ir a `3. Mis Reservas` | Sí | Sí | Sí | Sí | El badge muestra el contador de reservas registradas. |
| 2. Pulsar `Modificar` en la tarjeta | Sí | Sí | Sí | Sí | Carga los datos en el formulario con el título `Modificar reserva TUT-2026-XXXX`. |
| 3. Cambiar horario/modalidad y confirmar | Sí | Sí | Sí | Sí | La tarjeta pasa a estado `Modificada` conservando el código. |

## Tarea 3: Cancelar reserva y verificar liberación
| Paso | P1 | P2 | P3 | P4 | Observación |
|---|---|---|---|---|---|
| 1. Pulsar `Cancelar` | Sí | Sí | Sí | Sí | Se abre el diálogo modal `<dialog>` evitando cancelaciones accidentales. |
| 2. Confirmar cancelación | Sí | Sí | Sí | Sí | Cambia a `Cancelada` y el horario vuelve a aparecer disponible al crear otra reserva. |

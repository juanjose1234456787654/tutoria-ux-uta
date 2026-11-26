# Plan de Evaluación de Usabilidad — Tutoría UX

## 1. Objetivo de la Evaluación
Validar la eficacia, eficiencia, satisfacción y accesibilidad de la aplicación web **Tutoría UX** (versión v1) con participantes reales representativos de estudiantes universitarios, identificar problemas prioritarios de usabilidad, corregirlos y reevaluar en la versión v2.

## 2. Perfil de Participantes
- **Piloto (`P00`):** 1 participante de prueba interna/externa para calibrar guion, tiempos y claridad de tareas.
- **Participantes reales (`P01`, `P02`):** 2 estudiantes universitarios **distintos de los desarrolladores** del equipo.

## 3. Tareas y Criterios de Éxito Observables

| ID | Tarea (Escenario para el participante) | Criterios de éxito observables |
|---|---|---|
| **T1** | *Consulta y reserva:* "Necesitas una tutoría **Virtual** de **Interacción Humano-Computador** con **Ing. Valeria Mendoza** para el próximo lunes hábil a las **09:00**. Registra la reserva con tus datos." | 1) Filtra/encuentra al docente.<br>2) Selecciona modalidad Virtual, fecha hábil y horario 09:00.<br>3) Completa revisión y obtiene código `TUT-2026-XXXX` con estado `Confirmada` sin perder datos ante errores. |
| **T2** | *Consulta y modificación:* "Surgió un cruce de horario. Entra a **Mis Reservas**, localiza tu reserva y cámbiala a otro horario disponible el mismo día o modalidad." | 1) Ubica su reserva en `Mis Reservas`.<br>2) Pulsa `Modificar`, conserva su código original.<br>3) Guarda cambios y visualiza el estado `Modificada`. |
| **T3** | *Cancelación y verificación de liberación:* "Ya no podrás asistir. Cancela la reserva indicando un motivo breve y verifica que el horario vuelve a aparecer disponible." | 1) Abre el diálogo de cancelación y confirma.<br>2) La tarjeta cambia a estado `Cancelada`.<br>3) El horario queda libre en la pantalla de reserva. |

## 4. Métricas a Registrar
- **Eficacia:** Éxito total, éxito con ayuda o fallo por tarea.
- **Eficiencia:** Tiempo en segundos por tarea (`seg`).
- **Errores:** Número y tipo de errores cometidos durante la tarea.
- **Ayudas:** Número de intervenciones del facilitador.
- **Satisfacción:** Cuestionario **SEQ** (Single Ease Question, 1 = Muy difícil a 7 = Muy fácil) al finalizar cada tarea, y/o **SUS** (System Usability Scale, 0–100) al finalizar la sesión.

# Hallazgos, Backlog de Correcciones y Validación v2

## 1. Catálogo de Hallazgos (Inspección + Sesiones Simuladas P00–P02)

| ID | Hallazgo | Fuente | Evidencia | Severidad (0–4) | Recomendación |
|---|---|---|---|---:|---|
| **H-01** | Al cambiar de docente en el Paso 1 después de haber seleccionado un horario, la franja anterior desaparece silenciosamente si el nuevo docente no atiende a esa hora, generando confusión. | Heurística H1 + P01 (simulado) | [v1_cambio_docente_sin_aviso.svg](../evidencias/antes/v1_cambio_docente_sin_aviso.svg) | **3** (Mayor) | Mostrar un aviso accesible inmediato informando que el horario anterior se reinició al cambiar de docente y resaltar las franjas disponibles del nuevo docente. |
| **H-02** | El campo fecha permite seleccionar sábado o domingo en el calendario del navegador y solo informa el error al pulsar "Revisar reserva", retrasando la corrección. | Heurística H2 + P00, P01, P02 (simulados) | [v1_validacion_tardia_fecha.svg](../evidencias/antes/v1_validacion_tardia_fecha.svg) | **3** (Mayor) | Validar la fecha inmediatamente en el evento `change` (fines de semana y fechas pasadas), mostrar mensaje inline al instante y bloquear el listado de horarios hasta seleccionar un día hábil. |
| **H-03** | Las tarjetas de docentes no anticipan cuántas franjas horarias de atención ofrece cada docente antes de abrir el formulario. | Heurística H6 + P02 (simulado) | `src/presentation/components.js` (v1) | **2** (Menor) | Incluir un indicador visual con el número de franjas horarias disponibles del docente dentro de su tarjeta. |
| **H-04** | En la vista `Mis Reservas` no se informa al estudiante sobre las condiciones recomendadas para modificar o cancelar una tutoría. | Heurística H10 + P01 (simulado) | `index.html` `#vista-reservas` (v1) | **1** (Cosmético/Ayuda) | Agregar una nota informativa clara en `Mis Reservas` indicando que se puede modificar o cancelar antes del inicio y que el horario queda liberado automáticamente. |

## 2. Backlog de Correcciones Implementadas en Versión v2

| Prioridad | Hallazgo | Corrección Implementada en v2 | Archivos Modificados | Estado |
|---|---|---|---|---|
| **P1 (Prioritario)** | **H-02** | Validación temprana de fecha en `validarFechaIndividual()` (dominio) e invocación inmediata en `change` de `#campo-fecha`; deshabilita selección de horarios para fines de semana y fechas pasadas con alerta inline inmediata. | `src/domain/validators.js`, `src/presentation/app.js`, `tests/tutoriaService.test.js` | **Completado** |
| **P2 (Prioritario)** | **H-01** | Detección explícita al cambiar de docente cuando existía un horario elegido: limpia `horarioSeleccionado`, muestra un aviso visual `.slot-notice` y anuncia el cambio por `aria-live`. | `src/presentation/app.js`, `src/presentation/styles.css` | **Completado** |
| **P3 (Mejora adicional)** | **H-03** | Tarjetas de docentes muestran badge de cantidad de franjas horarias diarias de atención. | `src/presentation/components.js`, `src/presentation/styles.css` | **Completado** |
| **P4 (Mejora adicional)** | **H-04** | Nota informativa de política de cambios y cancelaciones en `Mis Reservas`. | `index.html`, `src/presentation/styles.css` | **Completado** |

## 3. Validación de la Versión v2
- **Pruebas automatizadas:** Ampliadas a **8 pruebas funcionales** (`npm test`), verificando la nueva función `validarFechaIndividual` (rechazo temprano de sábado/domingo y fechas pasadas) junto con los flujos completos de reserva, borrador, modificación y cancelación.
- **Reevaluación de usabilidad (simulada):** Reducción de errores en T1 de `3` a `0`, disminución de tiempo promedio en T1 de `86.5 s` a `59.5 s` (`-31.2%`) e incremento de SEQ promedio de `5.83` a `6.83` (SUS de `80.0` a `91.25`).
- **Evidencias comparativas:** Documentadas en [evidencias/antes/](../evidencias/antes/README.md) y [evidencias/despues/](../evidencias/despues/README.md).

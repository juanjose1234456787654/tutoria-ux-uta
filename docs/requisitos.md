# Requisitos del Sistema — Tutoría UX (FISEI - UTA)

## 1. Requisitos Funcionales (R1–R6)

| ID | Requisito | Descripción | Criterio de Aceptación |
|---|---|---|---|
| **R1** | **Consulta de docentes y asignaturas** | El estudiante puede explorar el catálogo de docentes y asignaturas, filtrando por texto, asignatura o modalidad. | La lista se actualiza dinámicamente, muestra especialidades, oficina y modalidades de cada docente, y ofrece un estado vacío claro si no hay coincidencias. |
| **R2** | **Selección de modalidad, fecha y horario** | El estudiante elige modalidad (Presencial o Virtual), fecha hábil (lunes a viernes) y un horario disponible del docente. | Se deshabilitan modalidades no soportadas por el docente y se marcan los horarios ya ocupados como `(Ocupado)` para evitar choques. |
| **R3** | **Registro y confirmación de reserva** | El estudiante ingresa sus datos (nombre, correo, motivo), revisa el resumen y confirma la reserva obteniendo un código único. | Se validan los campos, se muestra una pantalla de revisión previa, se genera código `TUT-2026-XXXX` y estado `Confirmada`. |
| **R4** | **Conservación de datos y recuperación ante errores** | Si ocurre un error de validación o el usuario regresa a consultar docentes/editar, los datos ingresados no se pierden. | El borrador se persiste automáticamente; los errores señalan el campo exacto con `aria-invalid` y mensajes claros sin limpiar el formulario. |
| **R5** | **Consulta de reservas** | El estudiante puede visualizar todas sus reservas registradas, filtrarlas por estado (`Confirmada`, `Modificada`, `Cancelada`) o buscar por código/docente/asignatura. | Las reservas se ordenan de la más reciente a la más antigua mostrando código, estado visual y detalles completos. |
| **R6** | **Modificación y cancelación de reservas** | El estudiante puede editar una reserva activa (cambiando modalidad, fecha, horario o motivo) o cancelarla mediante un diálogo de confirmación. | Al modificar, el estado cambia a `Modificada` conservando el código; al cancelar, cambia a `Cancelada` y libera el horario ocupado. |

## 2. Requisitos No Funcionales
- **RNF1 (Mobile First):** Diseño adaptable desde 320px hasta escritorio sin desbordamiento horizontal.
- **RNF2 (Accesibilidad WCAG 2.1 AA):** HTML semántico, enlace de salto, navegación por teclado (`Tab`, `Enter`, `Escape`), foco visible (`:focus-visible`) y contraste mínimo 4.5:1.
- **RNF3 (Arquitectura):** Separación estricta entre `domain`, `application`, `infrastructure` y `presentation`.

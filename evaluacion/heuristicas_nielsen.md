# Evaluación Heurística de Nielsen — Tutoría UX (v1)

**Escala de severidad (0–4):**
- `0`: No es un problema de usabilidad.
- `1`: Problema cosmético (corregir solo si hay tiempo extra).
- `2`: Problema menor (baja prioridad).
- `3`: Problema mayor (alta prioridad de corrección).
- `4`: Catástrofe de usabilidad (imperativo corregir antes de liberar).

| # | Heurística de Nielsen | Evaluación en Tutoría UX v1 | Hallazgo / Observación | Severidad (0–4) |
|---|---|---|---|---:|
| **H1** | Visibilidad del estado del sistema | Cumple en gran medida: stepper de 3 pasos, contador en navegación, badges de estado y alertas `aria-live`. | Al cambiar de docente en el Paso 1, si la fecha ya estaba elegida pero el horario anterior no existe en el nuevo docente, conviene mostrar un aviso explícito de que el horario se reinició. | **2** |
| **H2** | Relación entre el sistema y el mundo real | Lenguaje académico cercano ("Tutoría", "Asignatura", "Presencial/Virtual", "Lunes a viernes"). | El selector de fecha nativo `<input type="date">` no bloquea visualmente sábados/domingos en el calendario desplegable antes de validar. | **2** |
| **H3** | Control y libertad del usuario | Botón "Volver a docentes (conservar datos)" y "Regresar y editar" en Paso 2; diálogo de cancelación reversible. | Cumple adecuadamente. | **0** |
| **H4** | Consistencia y estándares | Botones, badges y tarjetas consistentes en todas las vistas; foco visible estándar. | Cumple adecuadamente. | **0** |
| **H5** | Prevención de errores | Deshabilita modalidades incompatibles con el docente y marca horarios como `(Ocupado)`. | En móvil, el botón de "Cancelar" está cerca de "Modificar"; aunque pide confirmación modal, conviene mantener buena separación visual. | **1** |
| **H6** | Reconocer antes que recordar | En Paso 2 (Revisión) se muestran todos los datos antes de confirmar; en Mis Reservas se ve código y tema. | En la tarjeta de docente podría mostrarse una vista previa de cuántos horarios libres tiene hoy/próximamente. | **1** |
| **H7** | Flexibilidad y eficiencia de uso | Filtros combinables en tiempo real y autocompletado parcial de asignatura única. | Cumple adecuadamente. | **0** |
| **H8** | Diseño estético y minimalista | Interfaz limpia, sin ruido visual, jerarquía clara. | Cumple adecuadamente. | **0** |
| **H9** | Ayuda a reconocer, diagnosticar y recuperarse de errores | Mensajes específicos por campo en rojo con `role="alert"` y conservación de borrador. | Cumple adecuadamente. | **0** |
| **H10** | Ayuda y documentación | Textos guía en cada sección y placeholders claros. | Sería útil incluir un breve texto de ayuda sobre el tiempo máximo para cancelar o modificar. | **1** |

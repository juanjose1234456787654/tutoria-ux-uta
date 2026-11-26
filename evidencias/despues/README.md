# Evidencias Después de Correcciones (Versión v2)

Evidencias comparativas tras aplicar las correcciones prioritarias **H-02** y **H-01** (más las mejoras complementarias **H-03** y **H-04**) y reevaluar la versión **v2**:

1. **[v2_validacion_temprana_fecha.svg](v2_validacion_temprana_fecha.svg)** — Evidencia de la corrección **H-02**: validación inmediata en el evento `change` de `#campo-fecha` bloqueando horarios para fines de semana y fechas pasadas con mensaje inline.
2. **[v2_aviso_cambio_docente.svg](v2_aviso_cambio_docente.svg)** — Evidencia de la corrección **H-01**: aviso visible y accesible (`role="status"` + alerta `aria-live`) cuando el cambio de docente reinicia la franja horaria previa.
3. **Pruebas automatizadas v2:** **8/8 pruebas funcionales aprobadas** (`npm test`), incluyendo pruebas específicas para `validarFechaIndividual` y rechazo de modalidad incompatible.

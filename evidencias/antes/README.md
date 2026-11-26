# Evidencias Antes de Correcciones (Versión v1)

Evidencias visuales y trazabilidad de los problemas detectados en la versión **v1** (`commit 029b9fa`) durante la inspección heurística y las sesiones simuladas `P00`, `P01` y `P02`:

1. **[v1_validacion_tardia_fecha.svg](v1_validacion_tardia_fecha.svg)** — Documenta el hallazgo **H-02** (Severidad 3): en v1, seleccionar un fin de semana en `#campo-fecha` seguía renderizando horarios y solo validaba al pulsar "Revisar reserva".
2. **[v1_cambio_docente_sin_aviso.svg](v1_cambio_docente_sin_aviso.svg)** — Documenta el hallazgo **H-01** (Severidad 3): al cambiar de docente después de elegir una franja horaria, el horario previo se perdía sin aviso explícito en pantalla.
3. **Pruebas automatizadas v1:** 6/6 pruebas aprobadas (`commit e7249ca`).

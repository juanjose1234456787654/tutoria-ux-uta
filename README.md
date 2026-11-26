# Tutoría UX — Sistema de Gestión de Tutorías Universitarias (FISEI - UTA)

Aplicación web para la gestión de tutorías académicas de la Facultad de Ingeniería en Sistemas, Electrónica e Industrial (Universidad Técnica de Ambato), desarrollada para la **Prueba Práctica Integradora de Interacción Humano-Computador (5to Semestre)**.

## 1. Funcionalidades Principales (v2)
- **Consulta de docentes y asignaturas (`R1`):** Búsqueda por texto, filtros combinables por asignatura y modalidad (`Presencial` / `Virtual`), e indicador de franjas horarias diarias disponibles por docente (`H-03`).
- **Selección de modalidad, fecha y horario (`R2`):** Deshabilitación automática de modalidades no atendidas por el docente, **validación temprana de fecha en `change`** para fines de semana y fechas pasadas (`H-02`), aviso explícito al reiniciar horario tras cambiar de docente (`H-01`) y marcado de horarios ocupados.
- **Reserva con revisión y código único (`R3`):** Flujo en 3 pasos (Datos y horario → Revisión → Confirmación) generando código `TUT-2026-XXXX` y estado `Confirmada`.
- **Conservación de datos y recuperación (`R4`):** Persistencia automática de borrador al regresar a consultar docentes o ante errores de validación inline.
- **Consulta, modificación y cancelación (`R5`, `R6`):** Filtrado por estado/código, nota de política de cambios (`H-04`), edición conservando el código (`Modificada`) y cancelación con diálogo modal accesible que libera el horario (`Cancelada`).
- **Accesibilidad y Mobile First:** HTML semántico, navegación completa por teclado, enlace de salto, foco visible (`:focus-visible`) y regiones `aria-live`.

## 2. Requisitos e Instalación
- **Node.js** `>= 20` (probado en `v24.21.0`) para ejecutar pruebas funcionales.
- **Python 3** (o cualquier servidor estático como `npx serve` / Live Server) para servir los módulos ES6 en el navegador.

```bash
git clone https://github.com/juanjose1234456787654/tutoria-ux-uta.git
cd tutoria-ux-uta
```

## 3. Ejecución
### Aplicación Web
```bash
npm start
# Abre http://localhost:8080 en tu navegador
```
### Prototipo Interactivo
Abre `http://localhost:8080/ux/prototipo/index.html` para navegar por los estados normales, de error, recuperación y confirmación.

### Pruebas Funcionales Automatizadas (8/8 aprobadas)
```bash
npm test
```

## 4. Arquitectura
El código fuente en `src/` sigue una arquitectura en capas con módulos ES6 puros:
- `src/domain/`: Entidades y reglas de validación (`models.js`, `validators.js`).
- `src/application/`: Casos de uso y orquestación (`tutoriaService.js`).
- `src/infrastructure/`: Catálogo inicial y persistencia (`catalogData.js`, `storageRepository.js`).
- `src/presentation/`: Interfaz HTML/CSS/JS accesible (`index.html`, `styles.css`, `components.js`, `app.js`).

Más detalles en [docs/arquitectura.md](docs/arquitectura.md).

## 5. Documentación, UX, Evaluación y Evidencias
- **Documentación técnica:** [Requisitos](docs/requisitos.md) · [Arquitectura](docs/arquitectura.md) · [Sitemap](docs/sitemap.md) · [User Flow](docs/flujo_usuario.md) · [Trazabilidad](docs/trazabilidad.md)
- **UX y Prototipo:** [Análisis UX y Curva Emocional](ux/analisis_ux.md) · [Wireframes](ux/wireframes.md) · [Prototipo Interactivo](ux/prototipo/index.html)
- **Evaluación de Usabilidad (Simulación controlada P00–P02 + Inspección):** [Plan](evaluacion/plan_evaluacion.md) · [Consentimiento](evaluacion/consentimiento.md) · [Piloto P00](evaluacion/piloto_P00.md) · [Heurísticas](evaluacion/heuristicas_nielsen.md) · [Recorrido Cognitivo](evaluacion/recorrido_cognitivo.md) · [Accesibilidad WCAG](evaluacion/accesibilidad_wcag.md) · [Resultados y Métricas](evaluacion/resultados_participantes.md) · [Hallazgos y Backlog](evaluacion/hallazgos_y_backlog.md)
- **Evidencias Antes / Después:** [Antes (v1)](evidencias/antes/README.md) · [Después (v2)](evidencias/despues/README.md)

## 6. Limitaciones Conocidas
- La persistencia se realiza en `localStorage` del navegador (sin backend remoto ni autenticación institucional OAuth/SAML).
- El catálogo de docentes y franjas horarias es estático para fines académicos de la prueba integradora.
- Las sesiones de evaluación `P00`, `P01` y `P02` documentadas corresponden a **escenarios simulados controlados** ante la ausencia de participantes externos presenciales durante la ejecución de la práctica.

## 7. Contribuciones
| Integrante | Rol / Responsabilidad | Evidencia en Git |
|---|---|---|
| **Juan José Carvajal Jaya** | Arquitectura en capas, análisis UX, prototipo interactivo, implementación v1/v2, pruebas funcionales y documentación de evaluación | Historial verificable en rama `main` (`git log --oneline`) |

# Matriz de Trazabilidad (Requisitos ↔ Pantallas ↔ Componentes)

| Requisito | Pantalla / Vista | Componentes y Módulos Involucrados | Prueba Funcional Asociada |
|---|---|---|---|
| **R1: Consulta de docentes y asignaturas** | `1. Docentes` (`#vista-explorar`) | `catalogData.js`, `TutoriaService.consultarDocentes`, `renderTarjetaDocente` | `Consultar docentes filtra por asignatura, modalidad y texto` |
| **R2: Selección de modalidad, fecha y horario** | `2. Reservar` (`#vista-reservar` Paso 1) | `TutoriaService.obtenerHorariosConEstado`, `#grupo-modalidad`, `#contenedor-horarios` | `Crear reserva válida... bloquea horario duplicado` |
| **R3: Registro y confirmación** | `2. Reservar` (Pasos 1, 2 y 3) | `crearEntidadReserva`, `generarCodigoReserva`, `TutoriaService.crearReserva`, `renderListaResumen` | `Crear reserva válida la persiste como Confirmada` |
| **R4: Conservación de datos y recuperación** | `2. Reservar` ↔ `1. Docentes` | `StorageRepository.guardarBorrador`, `validarDatosReserva`, `mostrarErroresFormulario` | `Error de validación conserva borrador del formulario para recuperación` |
| **R5: Consulta de reservas** | `3. Mis Reservas` (`#vista-reservas`) | `TutoriaService.consultarReservas`, `renderTarjetaReserva` | Verificación en `consultarReservas` + interfaz |
| **R6: Modificación y cancelación** | `3. Mis Reservas` + `#modal-cancelacion` | `TutoriaService.modificarReserva`, `TutoriaService.cancelarReserva` | `Modificar reserva cambia estado a Modificada...`, `Cancelar reserva... libera el horario` |

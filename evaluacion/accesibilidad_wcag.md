# Revisión de Accesibilidad WCAG 2.1 (Nivel AA) — Tutoría UX

| Criterio WCAG 2.1 | Nivel | Estado en v1 | Evidencia / Implementación |
|---|---|---|---|
| **1.3.1 Información y relaciones** | A | Cumple | Uso de HTML semántico (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<fieldset>`, `<legend>`, `<dl>`). |
| **1.4.3 Contraste mínimo** | AA | Cumple | Texto principal `#1a202c` sobre `#ffffff` / `#f7fafc` (>12:1); primario `#8b1e24` con texto blanco `#ffffff` (>7:1). |
| **2.1.1 Teclado** | A | Cumple | Todos los controles son `<button>`, `<input>`, `<select>`, `<textarea>` nativos navegables con `Tab` / `Shift+Tab` / `Enter` / `Espacio`. |
| **2.4.1 Evitar bloques** | A | Cumple | Enlace `Saltar al contenido principal` (`.skip-link`) visible al recibir foco. |
| **2.4.7 Foco visible** | AA | Cumple | Regla global `:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 2px; }`. |
| **3.3.1 Identificación de errores** | A | Cumple | Cada campo tiene `<p class="field-error" role="alert">` y `aria-invalid="true"`, moviendo el foco al primer campo erróneo. |
| **3.3.2 Etiquetas o instrucciones** | A | Cumple | Todos los campos poseen `<label for="...">` explícito e indicador de requerido. |
| **4.1.3 Mensajes de estado** | AA | Cumple | Región `#region-alertas` con `role="status"` y `aria-live="polite"`. |
| **2.5.5 / 2.5.8 Tamaño de objetivo** | AA | Cumple | Controles interactivos con `min-height: 44px` para uso cómodo en pantalla táctil móvil. |

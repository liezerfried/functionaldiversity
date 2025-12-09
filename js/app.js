/* 
 * FUNCIONALIDAD DE NAVEGACIÓN ENTRE SECCIONES
 * 
 * Este código controla el sistema de pestañas/tabs de la aplicación web.
 * Permite cambiar entre las tres secciones (Calculator, Task List, Gallery) sin recargar la página.
 * 
 * Funcionamiento:
 * 1. Espera a que el DOM esté completamente cargado
 * 2. Selecciona todos los enlaces de navegación y secciones de contenido
 * 3. Agrega un evento click a cada enlace de navegación
 * 4. Cuando se hace click en un enlace:
 *    - Previene el comportamiento por defecto del enlace
 *    - Quita la clase 'active' de todos los enlaces (los "apaga" visualmente)
 *    - Agrega la clase 'active' al enlace clickeado (lo resalta)
 *    - Oculta todas las secciones quitándoles la clase 'active'
 *    - Lee el atributo 'data-section' del enlace clickeado
 *    - Muestra solo la sección correspondiente agregándole la clase 'active'
 * 
 * Resultado: Sistema de navegación SPA (Single Page Application) sin recargar la página
 */

// Funcionalidad de navegación
document.addEventListener('DOMContentLoaded', function() {
    // Obtener todos los enlaces de navegación
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    // Agregar evento click a los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remover clase active de todos los enlaces
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            
            // Agregar clase active al enlace clickeado
            this.classList.add('active');

            // Ocultar todas las secciones
            sections.forEach(section => section.classList.remove('active'));

            // Mostrar la sección seleccionada
            const targetSection = this.getAttribute('data-section');
            document.getElementById(targetSection).classList.add('active');
        });
    });

    console.log('¡Aplicación inicializada correctamente!');
});

// Funcionalidad de la calculadora - Por implementar
function initCalculator() {
    // La lógica de la calculadora se agregará aquí
}

// Funcionalidad de la lista de tareas - Por implementar
function initTaskList() {
    // La lógica de la lista de tareas se agregará aquí
}

// Funcionalidad de la galería - Por implementar
function initGallery() {
    // La lógica de la galería se agregará aquí
}

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
    
    // Inicializar las funciones de cada sección
    initCalculator();
    initTaskList();
    initGallery();
});

/**
 * Navega a una sección específica de la aplicación
 * @param {string} sectionId - ID de la sección a mostrar (calculator, tasklist, gallery)
 */
function goToSection(sectionId) {
    // Obtener todos los enlaces de navegación y secciones
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    
    // Remover clase active de todos los enlaces
    navLinks.forEach(navLink => navLink.classList.remove('active'));
    
    // Agregar clase active al enlace correspondiente
    const targetLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
    
    // Ocultar todas las secciones
    sections.forEach(section => section.classList.remove('active'));
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// ============================================
// CALCULADORA
// ============================================

/* Variables globales para la calculadora:
 * - displayValue: El valor que se muestra en pantalla
 * - firstOperand: El primer número de la operación
 * - operator: El operador matemático seleccionado (+, -, *, /)
 * - waitingForSecondOperand: Indica si estamos esperando el segundo número
 * - expression: La expresión completa para mostrar en pantalla
 */
let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let expression = '';

/**
 * Inicializa la calculadora actualizando el display
 */
function initCalculator() {
    updateDisplay();
}

/**
 * Actualiza el display de la calculadora con el valor actual
 */
function updateDisplay() {
    const display = document.getElementById('display');
    // Si hay una expresión, mostrarla; si no, mostrar el valor actual
    display.textContent = expression || displayValue;
}

/**
 * Limpia completamente la calculadora, resetea todos los valores
 */
function clearDisplay() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    expression = '';
    updateDisplay();
}

/**
 * Borra el último dígito ingresado
 */
function deleteDigit() {
    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue = '0';
    }
    // Actualizar la expresión si existe (elimina el último carácter de la expresión también)
    // Esto mantiene sincronizada la expresión visual con el valor actual
    if (expression && !waitingForSecondOperand) {
        expression = expression.slice(0, -1);
    }
    updateDisplay();
}

/**
 * Agrega un número o punto decimal al display
 * @param {string} number - El número o punto a agregar
 */
function appendNumber(number) {
    // Si estamos esperando el segundo operando, reemplazamos el display
    if (waitingForSecondOperand) {
        displayValue = number;
        // Construir la expresión mostrando: primer número + operador + nuevo número
        expression = firstOperand + ' ' + operator + ' ' + number;
        waitingForSecondOperand = false;
    } else {
        // Si el display es '0', lo reemplazamos; si no, agregamos al final
        displayValue = displayValue === '0' ? number : displayValue + number;
        
        // Actualizar la expresión si ya existe un operador activo
        // Esto permite ver la operación completa mientras escribes
        if (expression && operator) {
            expression = firstOperand + ' ' + operator + ' ' + displayValue;
        }
    }
    updateDisplay();
}

/**
 * Maneja la selección de un operador matemático
 * @param {string} nextOperator - El operador seleccionado (+, -, *, /)
 */
function appendOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    // Si no hay primer operando, guardamos el valor actual
    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        // Si ya hay un operador, calculamos el resultado de la operación anterior
        // Esto permite hacer cálculos en cadena: 5 + 3 + 2 = 10
        const result = performCalculation(firstOperand, inputValue, operator);
        displayValue = String(result);
        firstOperand = result;
    }

    // Preparar para recibir el segundo operando
    waitingForSecondOperand = true;
    operator = nextOperator;
    
    // Mostrar el operador en la expresión para que el usuario vea qué operación hará
    // Ejemplo: "5 + " indica que está listo para recibir el segundo número
    expression = firstOperand + ' ' + nextOperator + ' ';
    updateDisplay();
}

/**
 * Calcula el resultado final de la operación
 */
function calculate() {
    const inputValue = parseFloat(displayValue);

    // Solo calculamos si hay un operador y un primer operando
    if (operator && firstOperand !== null) {
        const result = performCalculation(firstOperand, inputValue, operator);
        displayValue = String(result);
        expression = ''; // Limpiar la expresión después del resultado para empezar una nueva operación
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        updateDisplay();
    }
}

/**
 * Realiza el cálculo matemático según el operador
 * @param {number} first - Primer operando
 * @param {number} second - Segundo operando
 * @param {string} operator - Operador matemático
 * @returns {number|string} - Resultado de la operación o 'Error'
 */
function performCalculation(first, second, operator) {
    switch (operator) {
        case '+':
            return first + second;
        case '-':
            return first - second;
        case '*':
            return first * second;
        case '/':
            // Evitamos división por cero
            return second !== 0 ? first / second : 'Error';
        default:
            return second;
    }
}

// ============================================
// LISTA DE TAREAS
// ============================================

/* Array que almacena todas las tareas
 * Cada tarea es un objeto con: id, text, completed, date
 */
let tasks = [];

/**
 * Inicializa la lista de tareas cargando las guardadas y configurando eventos
 */
function initTaskList() {
    // Cargar tareas guardadas del localStorage (persistencia de datos)
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
    
    // Permitir agregar tareas presionando la tecla Enter en el input de texto
    const taskInput = document.getElementById('taskInput');
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
}

/**
 * Agrega una nueva tarea a la lista
 * Valida que el input no esté vacío antes de agregar
 */
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    const taskText = taskInput.value.trim();
    
    // Validar que el texto no esté vacío
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Crear objeto de tarea con un ID único basado en timestamp
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        date: taskDate.value || null // Fecha opcional
    };
    
    // Agregar la tarea al array y actualizar la vista
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = ''; // Limpiar el input de texto
    taskDate.value = ''; // Limpiar el input de fecha
}

/**
 * Elimina una tarea de la lista
 * @param {number} id - ID único de la tarea a eliminar
 */
function deleteTask(id) {
    // Confirmar antes de eliminar
    if (confirm('Are you sure you want to delete this task?')) {
        // Filtrar todas las tareas excepto la que coincide con el ID
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }
}

/**
 * Marca una tarea como completada y la elimina con animación
 * @param {number} id - ID único de la tarea
 */
function toggleTask(id) {
    // Buscar la tarea
    const task = tasks.find(task => task.id === id);
    if (!task) return;
    
    // Si ya está completada, no hacer nada (evita múltiples clicks)
    if (task.completed) return;
    
    // Marcar como completada en el array de datos
    task.completed = true;
    saveTasks();
    
    // Encontrar el elemento DOM de la tarea usando el atributo data-task-id
    // Este atributo se asigna durante el renderizado para identificar cada tarea
    const taskElement = document.querySelector(`[data-task-id="${id}"]`);
    
    if (taskElement) {
        // Paso 1: Agregar clase de completado para tachar el texto inmediatamente
        taskElement.classList.add('completed-task');
        
        // Paso 2: Después de 500ms (medio segundo), iniciar la animación de desvanecimiento
        setTimeout(() => {
            taskElement.classList.add('fade-out-task');
            
            // Paso 3: Después de que termine la animación (1.5s), eliminar la tarea del array
            // Total de tiempo: 0.5s (espera) + 1.5s (animación) = 2 segundos
            setTimeout(() => {
                tasks = tasks.filter(task => task.id !== id);
                saveTasks();
                renderTasks(); // Re-renderizar la lista sin la tarea eliminada
            }, 1500);
        }, 500);
    }
}

/**
 * Permite editar el texto de una tarea existente
 * @param {number} id - ID único de la tarea a editar
 */
function editTask(id) {
    const task = tasks.find(task => task.id === id);
    if (!task) return;
    
    // Solicitar nuevo texto con el texto actual como valor por defecto
    // El usuario verá una ventana emergente con el texto actual
    const newText = prompt('Edit task:', task.text);
    
    // Si el usuario cancela (null) o deja vacío, no hacer cambios
    if (newText === null || newText.trim() === '') {
        return;
    }
    
    // Actualizar el texto de la tarea y guardar los cambios
    task.text = newText.trim();
    saveTasks();
    renderTasks(); // Re-renderizar para mostrar el texto actualizado
}

/**
 * Permite editar la fecha de una tarea existente
 * @param {number} id - ID único de la tarea
 */
function editTaskDate(id) {
    const task = tasks.find(task => task.id === id);
    if (!task) return;
    
    // Solicitar nueva fecha mostrando la fecha actual si existe
    // Formato esperado: YYYY-MM-DD (estándar HTML5 date input)
    const newDate = prompt('Edit due date (YYYY-MM-DD):', task.date || '');
    
    // Si el usuario cancela, no hacer cambios
    if (newDate === null) {
        return;
    }
    
    // Actualizar la fecha (puede ser vacío para eliminar la fecha)
    // null significa que la tarea no tiene fecha límite
    task.date = newDate.trim() || null;
    saveTasks();
    renderTasks(); // Re-renderizar para mostrar la fecha actualizada
}

/**
 * Guarda las tareas en localStorage para persistencia
 * Los datos se mantienen incluso al cerrar el navegador
 */
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Formatea una fecha en formato legible
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {string} - Fecha formateada (ej: "Dec 9, 2025")
 */
function formatDate(dateString) {
    if (!dateString) return '';
    // Agregar T00:00:00 para evitar problemas con zonas horarias
    // Sin esto, JavaScript podría interpretar la fecha un día antes
    const date = new Date(dateString + 'T00:00:00');
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Renderiza todas las tareas en el DOM
 * Crea elementos HTML dinámicamente para cada tarea
 */
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Limpiar la lista antes de renderizar
    
    // Crear un elemento <li> para cada tarea
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center task-item';
        // Agregar ID como atributo data para identificar el elemento durante la animación
        // Este atributo permite encontrar el elemento DOM específico cuando se completa la tarea
        li.setAttribute('data-task-id', task.id);
        
        // Agregar clase especial si la tarea está completada
        if (task.completed) {
            li.classList.add('completed-task');
        }
        
        // Contenedor principal de la tarea (incluye texto y fecha)
        const taskMainContent = document.createElement('div');
        taskMainContent.className = 'task-main-content';
        taskMainContent.style.flex = '1';
        
        // Contenido de la tarea (texto) - clickeable para marcar como completada
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        taskContent.style.cursor = 'pointer';
        taskContent.textContent = task.text;
        // Al hacer click en el texto, se marca como completada y se inicia la animación
        taskContent.onclick = () => toggleTask(task.id);
        
        // Fecha de la tarea (si existe)
        // Las tareas pueden tener fecha opcional
        if (task.date) {
            const taskDateDisplay = document.createElement('small');
            taskDateDisplay.className = 'task-date text-muted';
            // Mostrar emoji de calendario y fecha formateada
            taskDateDisplay.innerHTML = `<i>📅 ${formatDate(task.date)}</i>`;
            taskMainContent.appendChild(taskContent);
            taskMainContent.appendChild(taskDateDisplay);
        } else {
            // Si no hay fecha, solo agregar el texto
            taskMainContent.appendChild(taskContent);
        }
        
        // Contenedor de botones de acción
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'btn-group';
        
        // Botón de editar texto de la tarea
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-warning btn-sm';
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => editTask(task.id);
        
        // Botón de editar fecha (icono de calendario)
        const editDateBtn = document.createElement('button');
        editDateBtn.className = 'btn btn-info btn-sm';
        editDateBtn.textContent = '📅';
        editDateBtn.title = 'Edit date'; // Tooltip al pasar el mouse
        editDateBtn.onclick = () => editTaskDate(task.id);
        
        // Botón de eliminar tarea
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteTask(task.id);
        
        // Agregar todos los botones al grupo
        buttonGroup.appendChild(editBtn);
        buttonGroup.appendChild(editDateBtn);
        buttonGroup.appendChild(deleteBtn);
        
        // Ensamblar todos los elementos en el <li>
        li.appendChild(taskMainContent);
        li.appendChild(buttonGroup);
        // Agregar el <li> completo a la lista
        taskList.appendChild(li);
    });
}

// ============================================
// GALERÍA DE IMÁGENES
// ============================================

/**
 * Inicializa la galería de imágenes
 * Carga un array de imágenes de paisajes desde Unsplash
 */
function initGallery() {
    // Array de imágenes de ejemplo usando Unsplash API
    // Usamos dos tamaños: thumbnail para la galería y full para el modal
    const images = [
        {
            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
            fullUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=900&fit=crop',
            title: 'Mountain Landscape'
        },
        {
            url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
            fullUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=900&fit=crop',
            title: 'Nature Scene'
        },
        {
            url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop',
            fullUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=900&fit=crop',
            title: 'Foggy Forest'
        },
        {
            url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
            fullUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=900&fit=crop',
            title: 'Sunset Road'
        },
        {
            url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=300&fit=crop',
            fullUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&h=900&fit=crop',
            title: 'Lake View'
        },
        {
            url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=300&fit=crop',
            fullUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&h=900&fit=crop',
            title: 'Ocean Waves'
        },
        {
            url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
            fullUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=900&fit=crop',
            title: 'Green Forest'
        },
        {
            url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=300&fit=crop',
            fullUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&h=900&fit=crop',
            title: 'Mountain Peak'
        },
        {
            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
            fullUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=900&fit=crop',
            title: 'Alpine Valley'
        }
    ];
    
    renderGallery(images);
}

/**
 * Renderiza la galería de imágenes en el DOM
 * @param {Array} images - Array de objetos con url y title de cada imagen
 */
function renderGallery(images) {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = ''; // Limpiar la galería antes de renderizar
    
    // Crear una tarjeta (card) para cada imagen
    images.forEach((image, index) => {
        // Crear columna con Bootstrap grid system
        const col = document.createElement('div');
        col.className = 'col-md-4 col-sm-6 mb-4';
        
        // Crear tarjeta
        const card = document.createElement('div');
        card.className = 'card gallery-card';
        
        // Crear elemento de imagen
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.title;
        img.className = 'card-img-top';
        img.loading = 'lazy'; // Carga diferida para mejor rendimiento
        img.style.cursor = 'pointer'; // Cambiar cursor a pointer para indicar que es clickeable
        
        // Agregar evento click para abrir modal con imagen de alta resolución
        img.onclick = () => openModal(image.fullUrl, image.title);
        
        // Crear cuerpo de la tarjeta
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        
        // Crear título de la tarjeta
        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = image.title;
        
        // Ensamblar todos los elementos
        cardBody.appendChild(title);
        card.appendChild(img);
        card.appendChild(cardBody);
        col.appendChild(card);
        galleryGrid.appendChild(col);
    });
}

/**
 * Abre el modal con la imagen ampliada
 * @param {string} imageUrl - URL de la imagen a mostrar
 * @param {string} imageTitle - Título de la imagen
 */
function openModal(imageUrl, imageTitle) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const caption = document.getElementById('modalCaption');
    
    modal.style.display = 'block';
    modalImg.src = imageUrl;
    caption.textContent = imageTitle;
}

/**
 * Cierra el modal de imagen ampliada
 */
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}

// Variables globales - Inicializar con valores por defecto
let carreraActual = 'Medicina Veterinaria';
let colorActual = configuracion.colores[0];
let fuenteActual = configuracion.fuentes[0];
let completedCourses = new Set();
let courseGrades = {};

// Función para mostrar mensajes toast
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Función para aplicar personalización
function aplicarPersonalizacion() {
    console.log('🎨 Aplicando personalización...');
    console.log('Color actual:', colorActual);
    console.log('Fuente actual:', fuenteActual);
    console.log('Carrera actual:', carreraActual);
    
    const root = document.documentElement;
    
    // Aplicar colores inmediatamente
    root.style.setProperty('--color-primary', colorActual.primario);
    root.style.setProperty('--color-primary-dark', colorActual.secundario);
    
    // Forzar recálculo de estilos
    root.offsetHeight;
    
    console.log('✅ Colores aplicados:', colorActual.primario, colorActual.secundario);
    
    // Aplicar fuente
    document.body.style.fontFamily = fuenteActual.valor;
    console.log('✅ Fuente aplicada:', fuenteActual.valor);
    
    // Actualizar título con información del usuario
    actualizarTituloUsuario();
    
    // Actualizar footer
    const footer = document.getElementById('footerText');
    if (footer) footer.textContent = `© 2024 Malla Curricular - ${carreraActual}. Todos los derechos reservados.`;
    

    
    // Agregar clase para mostrar elementos con los colores correctos
    document.body.classList.add('datos-cargados');
    console.log('✅ Clase datos-cargados agregada al body');
    
    console.log('✅ Personalización aplicada correctamente');
}

// Función para actualizar el título con información del usuario
function actualizarTituloUsuario() {
    const titulo = document.getElementById('tituloCarrera');
    const nombreUsuario = document.getElementById('nombreUsuario');
    
    if (titulo && usuarios[USER_ID]) {
        const usuario = usuarios[USER_ID];
        titulo.textContent = `Malla - ${usuario.nombre} - ${usuario.carrera}`;
        
        // Actualizar el nombre en el botón de perfil
        if (nombreUsuario) {
            nombreUsuario.textContent = usuario.nombre;
        }
        
        // Actualizar también la carrera actual
        carreraActual = usuario.carrera;
    }
}

// --- NUEVO: Guardar y cargar perfil en Firebase ---
let USER_ID = localStorage.getItem('currentUser') || 'admin'; // Recuperar usuario de localStorage

// Variable para controlar cuándo pueden activarse los tooltips de prerrequisitos
let tooltipsPrereqHabilitados = false;



// Base de datos de usuarios (en un proyecto real esto estaría en Firebase Auth)
const usuarios = {
    'admin': { password: 'admin', nombre: 'Administrador', carrera: 'Medicina Veterinaria', esAdmin: true }
};

// Función para crear nueva cuenta
function crearNuevaCuenta(nuevoUsuario, nuevaPassword, nombre, carrera, esAdmin = false) {
    if (usuarios[nuevoUsuario]) {
        return { success: false, message: 'El usuario ya existe' };
    }
    
    if (nuevoUsuario.length < 3) {
        return { success: false, message: 'El usuario debe tener al menos 3 caracteres' };
    }
    
    if (nuevaPassword.length < 4) {
        return { success: false, message: 'La contraseña debe tener al menos 4 caracteres' };
    }
    
    // Agregar nuevo usuario
    usuarios[nuevoUsuario] = {
        password: nuevaPassword,
        nombre: nombre || nuevoUsuario,
        carrera: carrera || 'Medicina Veterinaria',
        esAdmin: esAdmin
    };
    
    // Guardar en Firebase (en un proyecto real esto se haría con Firebase Auth)
    db.ref('usuarios/' + nuevoUsuario).set({
        password: nuevaPassword,
        nombre: nombre || nuevoUsuario,
        carrera: carrera || 'Medicina Veterinaria',
        esAdmin: esAdmin
    });
    
    console.log('✅ Cuenta creada:', nuevoUsuario, esAdmin ? '(Administrador)' : '(Usuario normal)');
    
    return { success: true, message: `Cuenta ${esAdmin ? 'de administrador' : ''} creada exitosamente` };
}

// Función para mostrar cuentas creadas
function mostrarCuentasCreadas() {
    const cuentasLista = document.getElementById('cuentasLista');
    if (!cuentasLista) return;
    
    let html = '';
    Object.keys(usuarios).forEach(usuarioId => {
        // Filtrar las cuentas que no queremos mostrar
        if (usuarioId === 'estudiante1' || usuarioId === 'estudiante2' || usuarioId === 'profesor') {
            return; // Saltar estas cuentas
        }
        
        const usuario = usuarios[usuarioId];
        const esAdmin = usuario.esAdmin || usuarioId === 'admin'; // 'admin' siempre es admin
        
        html += `
            <div class="cuenta-item">
                <div class="cuenta-info">
                    <div class="cuenta-nombre">
                        ${usuario.nombre}
                        ${esAdmin ? '<span class="admin-badge">ADMIN</span>' : ''}
                    </div>
                    <div class="cuenta-detalles">
                        Usuario: <span class="cuenta-usuario">${usuarioId}</span> | 
                        Carrera: <span class="cuenta-carrera">${usuario.carrera}</span>
                    </div>
                </div>
                <div class="cuenta-acciones">
                    ${usuarioId !== 'admin' ? `<button class="btn-borrar" onclick="borrarCuenta('${usuarioId}')" title="Borrar cuenta">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18"/>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                    </button>` : ''}
                </div>
            </div>
        `;
    });
    
    cuentasLista.innerHTML = html;
}

// Función para cargar usuarios desde Firebase
function cargarUsuariosDesdeFirebase() {
    db.ref('usuarios').once('value').then(snap => {
        const data = snap.val();
        if (data) {
            // Agregar usuarios de Firebase a la lista local, excluyendo las cuentas no deseadas
            Object.keys(data).forEach(userId => {
                // No cargar las cuentas que queremos eliminar
                if (userId === 'estudiante1' || userId === 'estudiante2' || userId === 'profesor') {
                    return; // Saltar estas cuentas
                }
                
                if (!usuarios[userId]) {
                    usuarios[userId] = data[userId];
                }
            });
        }
        
        // Después de cargar usuarios, verificar si hay un usuario guardado para login automático
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser && savedUser !== 'admin' && usuarios[savedUser]) {
            console.log('🔄 Usuario encontrado en localStorage después de cargar Firebase:', savedUser);
            USER_ID = savedUser;
            
            // Verificar si el login no se ha mostrado aún
            const loginContainer = document.getElementById('loginContainer');
            if (loginContainer && loginContainer.classList.contains('show')) {
                console.log('✅ Iniciando sesión automática...');
                iniciarSesionCompartida();
            }
        }
    });
}

function guardarPerfilEnFirebase() {
    console.log('=== INICIANDO GUARDADO EN FIREBASE ===');
    console.log('Usuario actual:', USER_ID);
    console.log('Carrera actual:', carreraActual);
    console.log('Color actual:', colorActual);
    console.log('Fuente actual:', fuenteActual);

    console.log('Cursos completados:', Array.from(completedCourses));
    console.log('Notas de cursos:', courseGrades);
    
    const datosAGuardar = {
        carreraActual,
        colorActual,
        fuenteActual,

        completedCourses: Array.from(completedCourses),
        courseGrades
    };
    
    console.log('Datos a guardar en Firebase:', datosAGuardar);
    
    db.ref('perfiles/' + USER_ID).set(datosAGuardar).then(() => {
        console.log('✅ Perfil guardado exitosamente en Firebase');
        console.log('Ruta en Firebase: perfiles/' + USER_ID);
    }).catch((error) => {
        console.error('❌ Error al guardar perfil en Firebase:', error);
        console.error('Detalles del error:', error.message);
    });
}
function cargarPerfilDeFirebase(callback) {
    console.log('=== INICIANDO CARGA DESDE FIREBASE ===');
    console.log('Usuario actual:', USER_ID);
    console.log('Ruta en Firebase: perfiles/' + USER_ID);
    
    db.ref('perfiles/' + USER_ID).once('value').then(snap => {
        const data = snap.val();
        console.log('Datos recibidos de Firebase:', data);
        
        if (data) {
            console.log('✅ Datos encontrados en Firebase');
            console.log('Carrera anterior:', carreraActual, '-> Nueva:', data.carreraActual);
            console.log('Color anterior:', colorActual?.nombre, '-> Nuevo:', data.colorActual?.nombre);
            console.log('Fuente anterior:', fuenteActual?.nombre, '-> Nueva:', data.fuenteActual?.nombre);

            console.log('Cursos completados anteriores:', completedCourses.size, '-> Nuevos:', data.completedCourses?.length || 0);
            console.log('Notas anteriores:', Object.keys(courseGrades).length, '-> Nuevas:', Object.keys(data.courseGrades || {}).length);
            
            const carreraAnterior = carreraActual;
            carreraActual = data.carreraActual || carreraActual;
            colorActual = data.colorActual || colorActual;
            fuenteActual = data.fuenteActual || fuenteActual;

            completedCourses = new Set(data.completedCourses || []);
            courseGrades = data.courseGrades || {};
            
            console.log('✅ Datos cargados exitosamente');
            
            // Si cambió la carrera, limpiar horario
            if (carreraAnterior !== carreraActual) {
                console.log('🔄 Cambio de carrera detectado, limpiando horario...');
                horarioVisualData = [];
                semestreVisualSeleccionado = 1;
                modoEdicionHorario = false;
                // Guardar horario limpio
                saveHorarioVisualData(horarioVisualData);
            }
        } else {
            console.log('⚠️ No se encontraron datos en Firebase para este usuario');
        }
        
        // Cargar horario después de cargar el perfil
        cargarHorarioDeFirebase(() => {
            if (callback) {
                console.log('Ejecutando callback después de cargar datos y horario...');
                callback();
            }
        });
    }).catch((error) => {
        console.error('❌ Error al cargar perfil desde Firebase:', error);
        console.error('Detalles del error:', error.message);
        
        // Intentar cargar horario incluso si falla el perfil
        cargarHorarioDeFirebase(() => {
            if (callback) callback();
        });
    });
}
// Sobrescribir funciones locales para usar Firebase
function guardarConfiguracion() {
    console.log('🔧 guardarConfiguracion() llamada');
    guardarPerfilEnFirebase(); 
}

function saveProgress() { 
    console.log('💾 saveProgress() llamada');
    guardarPerfilEnFirebase(); 
}
function guardarOpciones() {
    console.log('🎨 guardarOpciones() llamada');
    console.log('Iniciando guardado de opciones...');
    
    // Guardar color
    const colorSeleccionado = document.querySelector('.color-opcion.seleccionado');
    if (!colorSeleccionado) {
        console.error('No se encontró color seleccionado');
        return;
    }
    const nuevoColor = JSON.parse(colorSeleccionado.dataset.color);
    console.log('Nuevo color seleccionado:', nuevoColor);
    
    // Guardar fuente
    const fuenteSelect = document.getElementById('fuenteSelect');
    const nuevaFuente = JSON.parse(fuenteSelect.value);
    console.log('Nueva fuente seleccionada:', nuevaFuente);
    
    let cambios = false;
    
    if (nuevoColor.nombre !== colorActual.nombre) {
        console.log('Cambio de color detectado:', colorActual.nombre, '->', nuevoColor.nombre);
        colorActual = nuevoColor;
        cambios = true;
    }
    
    if (nuevaFuente.nombre !== fuenteActual.nombre) {
        console.log('Cambio de fuente detectado:', fuenteActual.nombre, '->', nuevaFuente.nombre);
        fuenteActual = nuevaFuente;
        cambios = true;
    }
    
    if (cambios) {
        console.log('Guardando cambios en Firebase...');
        guardarPerfilEnFirebase();
        aplicarPersonalizacion();
        
        createMalla();
        updateProgress();
        renderSelectorSemestreVisual();
        renderHorarioVisualSection();
        
        setTimeout(() => {
            document.querySelectorAll('.course').forEach(element => {
                const id = element.dataset.courseId;
                const mallaData = convertirMallaASemestres(obtenerDatosCarrera().malla);
                const semester = mallaData.find(sem => sem.courses.some(course => course.id === id));
                const course = semester.courses.find(course => course.id === id);
                updateCourseState(element, course);
                updateCourseTooltips(element, course);
            });
        }, 100);
        
        console.log('Opciones guardadas exitosamente');
    } else {
        console.log('No se detectaron cambios para guardar');
    }
}

// Función para obtener datos de la carrera actual
function obtenerDatosCarrera() {
    return carreras[carreraActual];
}

// Función para convertir malla a formato semestres
function convertirMallaASemestres(malla) {
    const semestres = [];
    const semestresOrden = Object.keys(malla);
    
    semestresOrden.forEach((semestreKey, index) => {
        const numero = index + 1;
        const cursos = malla[semestreKey].map(curso => ({
            id: curso.id,
            name: curso.nombre,
            prerequisites: curso.prerrequisitos || []
        }));
        
        semestres.push({
            number: numero,
            courses: cursos
        });
    });
    
    return semestres;
}

// Función para verificar si un curso puede ser marcado como completado
function canCompleteCourse(course) {
    if (course.prerequisites.length === 0) return true;
    return course.prerequisites.every(prereq => completedCourses.has(prereq));
}

// Función para actualizar tooltips de un curso
function updateCourseTooltips(courseElement, courseData) {
    // Remover tooltips existentes
    if (courseElement._tooltip) {
        courseElement._tooltip.remove();
        courseElement._tooltip = null;
    }
    if (courseElement._notaTooltip) {
        courseElement._notaTooltip.remove();
        courseElement._notaTooltip = null;
    }
    
    // Limpiar event listeners existentes
    courseElement.removeEventListener('mouseenter', courseElement._prereqMouseEnter);
    courseElement.removeEventListener('mouseleave', courseElement._prereqMouseLeave);
    courseElement.removeEventListener('mouseenter', courseElement._notaMouseEnter);
    courseElement.removeEventListener('mouseleave', courseElement._notaMouseLeave);
    
    // Agregar tooltips solo si es necesario y están habilitados
    if (courseData.prerequisites && courseData.prerequisites.length > 0 && !canCompleteCourse(courseData)) {
        courseElement._prereqMouseEnter = function(e) {
            // Solo mostrar tooltip si están habilitados
            if (!tooltipsPrereqHabilitados) {
                console.log('⚠️ Tooltips de prerrequisitos aún no habilitados');
                return;
            }
            
            let tooltip = document.createElement('div');
            tooltip.className = 'tooltip-prereq';
            const names = courseData.prerequisites.map(prereqId => {
                const mallaData = convertirMallaASemestres(obtenerDatosCarrera().malla);
                for (const sem of mallaData) {
                    const c = sem.courses.find(c => c.id === prereqId);
                    if (c) return c.name;
                }
                return prereqId;
            });
            tooltip.textContent = 'Prerrequisitos: ' + names.join(', ');
            document.body.appendChild(tooltip);
            const rect = courseElement.getBoundingClientRect();
            tooltip.style.left = (rect.left + rect.width/2) + 'px';
            tooltip.style.top = (rect.top - 8) + 'px';
            setTimeout(() => { tooltip.classList.add('show'); }, 10);
            courseElement._tooltip = tooltip;
        };
        
        courseElement._prereqMouseLeave = function() {
            if (courseElement._tooltip) {
                courseElement._tooltip.remove();
                courseElement._tooltip = null;
            }
        };
        
        courseElement.addEventListener('mouseenter', courseElement._prereqMouseEnter);
        courseElement.addEventListener('mouseleave', courseElement._prereqMouseLeave);
    }
    
    // Tooltip de nota para materias aprobadas
    if (completedCourses.has(courseData.id) && courseGrades[courseData.id] !== undefined) {
        console.log('🔧 Creando tooltip de nota para:', courseData.name, 'con nota:', courseGrades[courseData.id]);
        
        courseElement._notaMouseEnter = function(e) {
            let tooltip = document.createElement('div');
            tooltip.className = 'tooltip-nota';
            tooltip.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 1.1em; margin-bottom: 2px;">📊 Nota</div>
                    <div style="font-size: 1.3em; font-weight: 700;">${courseGrades[courseData.id]}</div>
                </div>
            `;
            document.body.appendChild(tooltip);
            
            // Función para posicionar el tooltip
            function posicionarTooltip(mouseX, mouseY) {
                const tooltipRect = tooltip.getBoundingClientRect();
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;
                
                let left = mouseX + 15; // Offset del mouse
                let top = mouseY - tooltipRect.height - 15; // Arriba del mouse
                
                // Verificar límites de la pantalla
                if (left + tooltipRect.width > windowWidth) {
                    left = mouseX - tooltipRect.width - 15; // Mover a la izquierda
                }
                
                if (top < 0) {
                    top = mouseY + 15; // Mover abajo del mouse
                }
                
                tooltip.style.left = left + 'px';
                tooltip.style.top = top + 'px';
            }
            
            // Posicionar inicialmente
            posicionarTooltip(e.clientX, e.clientY);
            
            setTimeout(() => { tooltip.classList.add('show'); }, 10);
            courseElement._notaTooltip = tooltip;
            courseElement._posicionarTooltip = posicionarTooltip;
        };
        
        courseElement._notaMouseMove = function(e) {
            if (courseElement._notaTooltip && courseElement._posicionarTooltip) {
                // Actualizar posición del tooltip siguiendo el mouse
                courseElement._posicionarTooltip(e.clientX, e.clientY);
            }
        };
        
        courseElement._notaMouseLeave = function() {
            if (courseElement._notaTooltip) {
                courseElement._notaTooltip.remove();
                courseElement._notaTooltip = null;
                courseElement._posicionarTooltip = null;
            }
        };
        
        courseElement.addEventListener('mouseenter', courseElement._notaMouseEnter);
        courseElement.addEventListener('mousemove', courseElement._notaMouseMove);
        courseElement.addEventListener('mouseleave', courseElement._notaMouseLeave);
        
        console.log('✅ Tooltip de nota configurado para:', courseData.name);
    } else {
        console.log('⚠️ No se crea tooltip de nota para:', courseData.name, 
                   'Completada:', completedCourses.has(courseData.id), 
                   'Tiene nota:', courseGrades[courseData.id] !== undefined);
    }
}

// Función para actualizar el estado visual de un curso
function updateCourseState(courseElement, courseData) {
    const wasDisabled = courseElement.classList.contains('disabled');
    const isCompleted = completedCourses.has(courseData.id);
    const canComplete = canCompleteCourse(courseData);
    courseElement.classList.toggle('completed', isCompleted);
    courseElement.classList.toggle('disabled', !canComplete && !isCompleted);
    const statusElement = courseElement.querySelector('.course-status');
    statusElement.textContent = isCompleted ? '✓' : '';
    
    const nameElement = courseElement.querySelector('.course-name');
    nameElement.textContent = courseData.name;
    
    // Animación de desbloqueo/bloqueo
    if (!isCompleted) {
        if (wasDisabled && canComplete) {
            courseElement.classList.add('unlocked');
            setTimeout(() => courseElement.classList.remove('unlocked'), 400);
        } else if (!wasDisabled && !canComplete) {
            courseElement.classList.add('locked');
            setTimeout(() => courseElement.classList.remove('locked'), 400);
        }
    }
}

// Función para actualizar el progreso total
function updateProgress() {
    console.log('📊 Actualizando progreso...');
    console.log('Total de cursos completados:', completedCourses.size);
    
    const mallaData = convertirMallaASemestres(obtenerDatosCarrera().malla);
    const totalCourses = mallaData.reduce((total, semester) => total + semester.courses.length, 0);
    const progressPercentage = totalCourses > 0 ? (completedCourses.size / totalCourses) * 100 : 0;
    
    console.log('Total de cursos en la malla:', totalCourses);
    console.log('Porcentaje de progreso:', progressPercentage.toFixed(1) + '%');
    
    // Actualizar barra de progreso
    const progressBar = document.getElementById('totalProgress');
    if (progressBar) {
        progressBar.style.width = progressPercentage + '%';
        console.log('✅ Barra de progreso actualizada');
    } else {
        console.log('⚠️ No se encontró la barra de progreso');
    }
    
    // Actualizar porcentaje de texto
    const progressText = document.getElementById('progressPercentage');
    if (progressText) {
        progressText.textContent = Math.round(progressPercentage) + '%';
        console.log('✅ Texto de progreso actualizado');
    } else {
        console.log('⚠️ No se encontró el texto de progreso');
    }
    
    console.log('✅ Progreso actualizado correctamente');
}

// Descargar concentrado de notas
function downloadNotasPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(18);
    doc.text('Concentrado de Notas', 105, y, { align: 'center' });
    y += 10;
    doc.setFontSize(12);
    let rows = [];
    let total = 0;
    let count = 0;
    const mallaData = convertirMallaASemestres(obtenerDatosCarrera().malla);
    mallaData.forEach(sem => {
        sem.courses.forEach(course => {
            if (completedCourses.has(course.id)) {
                let nota = courseGrades[course.id] !== undefined ? courseGrades[course.id] : '';
                rows.push([course.id, course.name, nota]);
                if (nota !== '') {
                    total += parseFloat(nota);
                    count++;
                }
            }
        });
    });
    // Encabezados
    y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('ID', 20, y);
    doc.text('Materia', 50, y);
    doc.text('Nota promedio', 160, y);
    doc.setFont(undefined, 'normal');
    y += 7;
    // Filas
    rows.forEach(row => {
        doc.text(String(row[0]), 20, y);
        doc.text(String(row[1]), 50, y, { maxWidth: 100 });
        doc.text(String(row[2]), 160, y);
        y += 7;
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });
    // Promedio general
    y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('Promedio general:', 50, y);
    doc.setFont(undefined, 'normal');
    let promedio = count > 0 ? (total / count).toFixed(2) : '-';
    doc.text(String(promedio), 120, y);
    doc.save('concentrado_notas.pdf');
}

// Modal para ingresar nota promedio
function showNotaModal(courseElement, courseData) {
    // Crear modal si no existe
    let modal = document.getElementById('notaModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'notaModal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.4)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '9999';
        modal.innerHTML = `
            <div style="background: #fff; padding: 24px 32px; border-radius: 8px; box-shadow: 0 2px 12px #0002; min-width: 300px; text-align: center;">
                <h3>Ingresa la nota promedio</h3>
                <input id="notaInput" type="number" min="10" max="70" step="1" inputmode="numeric" style="margin: 12px 0; width: 80px; font-size: 18px; padding: 4px 8px; border-radius: 4px; border: 1px solid #ccc; appearance: textfield; -moz-appearance: textfield;" />
                <div style="margin-top: 16px; display: flex; justify-content: center;">
                    <button id="guardarNotaBtn" style="background: var(--color-primary-dark, #d81b60); color: #fff; border: none; border-radius: 6px; padding: 8px 20px; font-size: 15px; cursor: pointer; transition: background 0.2s;">Guardar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        // Ocultar flechas en todos los navegadores
        const style = document.createElement('style');
        style.textContent = `
            #notaInput::-webkit-outer-spin-button, #notaInput::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            #notaInput[type=number] {
                -moz-appearance: textfield;
            }
            #guardarNotaBtn:hover {
                background: var(--color-primary, #ad1457) !important;
            }
        `;
        document.head.appendChild(style);
    }
    // Mostrar modal
    modal.style.display = 'flex';
    const input = modal.querySelector('#notaInput');
    input.value = courseGrades[courseData.id] || '';
    input.focus();
    // Guardar
    modal.querySelector('#guardarNotaBtn').onclick = function() {
        let val = parseInt(input.value);
        if (isNaN(val) || val < 10 || val > 70) {
            showToast('Ingresa una nota válida (10 a 70)');
            input.value = '';
            return;
        }
        courseGrades[courseData.id] = val;
        saveProgress();
        modal.style.display = 'none';
        
        // Actualizar específicamente el curso que acaba de recibir nota
        const cursoActualizado = document.querySelector(`.course[data-course-id='${courseData.id}']`);
        if (cursoActualizado) {
            updateCourseState(cursoActualizado, courseData);
            updateCourseTooltips(cursoActualizado, courseData);
            console.log('✅ Tooltips actualizados para curso específico:', courseData.name);
        }
        
        // Actualizar todos los demás cursos para cambios de prerrequisitos
        document.querySelectorAll('.course').forEach(element => {
            const id = element.dataset.courseId;
            if (id !== courseData.id) { // No re-procesar el curso que ya actualizamos
            const mallaData = convertirMallaASemestres(obtenerDatosCarrera().malla);
            const semester = mallaData.find(sem => sem.courses.some(course => course.id === id));
            const course = semester.courses.find(course => course.id === id);
                if (course) {
            updateCourseState(element, course);
                    updateCourseTooltips(element, course);
                }
            }
        });
        
        console.log('✅ Nota guardada y todos los tooltips actualizados');
    };
    // Eliminar botón cancelar y evitar cerrar el modal sin nota válida
    modal.onclick = function(e) { e.stopPropagation(); };
    window.onkeydown = function(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
        }
    };
}

function animateCourseElement(courseElement) {
    courseElement.classList.add('animated');
    setTimeout(() => {
        courseElement.classList.remove('animated');
    }, 320);
}

function animateUncheckCourseElement(courseElement) {
    courseElement.classList.add('unchecking');
    setTimeout(() => {
        courseElement.classList.remove('unchecking');
    }, 320);
}

function animatePrereqShake(courseElement) {
    courseElement.classList.add('prereq-shake');
    setTimeout(() => {
        courseElement.classList.remove('prereq-shake');
    }, 400);
}

// Modificar handleCourseClick para mostrar el modal
function handleCourseClick(courseElement, courseData) {
    if (completedCourses.has(courseData.id)) {
        // Desmarcar en cascada todas las que dependan de esta
        function desmarcarDependientes(id) {
            const mallaData = convertirMallaASemestres(obtenerDatosCarrera().malla);
            mallaData.forEach(sem => {
                sem.courses.forEach(course => {
                    if (completedCourses.has(course.id) && course.prerequisites.includes(id)) {
                        const depElement = document.querySelector(`.course[data-course-id='${course.id}']`);
                        if (depElement) animateUncheckCourseElement(depElement);
                        completedCourses.delete(course.id);
                        delete courseGrades[course.id];
                        // Buscar dependientes recursivamente
                        desmarcarDependientes(course.id);
                    }
                });
            });
        }
        completedCourses.delete(courseData.id);
        delete courseGrades[courseData.id];
        desmarcarDependientes(courseData.id);
        updateCourseState(courseElement, courseData);
        showToast(`${courseData.name} marcada como pendiente`);
        animateUncheckCourseElement(courseElement);
    } else if (canCompleteCourse(courseData)) {
        completedCourses.add(courseData.id);
        updateCourseState(courseElement, courseData);
        showToast(`${courseData.name} marcada como completada`);
        
        // Agregar animación de celebración
        courseElement.classList.add('course-completing');
        setTimeout(() => {
            courseElement.classList.remove('course-completing');
        }, 600);
        
        showNotaModal(courseElement, courseData);
        animateCourseElement(courseElement);
        
        // Actualizar tooltips inmediatamente después de marcar como completada
        setTimeout(() => {
            updateCourseTooltips(courseElement, courseData);
        }, 100);
    } else {
        const missingPrereqs = courseData.prerequisites
            .filter(prereq => !completedCourses.has(prereq))
            .map(prereq => {
                const mallaData = convertirMallaASemestres(obtenerDatosCarrera().malla);
                const semesterData = mallaData.find(sem => 
                    sem.courses.some(course => course.id === prereq)
                );
                const course = semesterData.courses.find(course => course.id === prereq);
                return course.name;
            });
        showToast(`Debes aprobar primero: ${missingPrereqs.join(', ')}`);
        animatePrereqShake(courseElement);
    }
    saveProgress();
    updateProgress();
    document.querySelectorAll('.course').forEach(element => {
        const id = element.dataset.courseId;
        const mallaData = convertirMallaASemestres(obtenerDatosCarrera().malla);
        const semester = mallaData.find(sem => 
            sem.courses.some(course => course.id === id)
        );
        const course = semester.courses.find(course => course.id === id);
        updateCourseState(element, course);
        
        // Actualizar tooltips dinámicamente
        updateCourseTooltips(element, course);
    });
}

// Función para crear el elemento HTML de un curso
function createCourseElement(courseData) {
    const courseElement = document.createElement('div');
    courseElement.className = 'course';
    courseElement.dataset.courseId = courseData.id;
    
    const nameElement = document.createElement('div');
    nameElement.className = 'course-name';
    nameElement.textContent = courseData.name;
    
    const statusElement = document.createElement('div');
    statusElement.className = 'course-status';
    
    courseElement.appendChild(nameElement);
    courseElement.appendChild(statusElement);
    
    courseElement.addEventListener('click', () => handleCourseClick(courseElement, courseData));
    
    updateCourseState(courseElement, courseData);
    updateCourseTooltips(courseElement, courseData);
    return courseElement;
}

// Función para crear la malla curricular
function createMalla() {
    console.log('🏗️ Creando malla curricular...');
    console.log('Cursos completados:', Array.from(completedCourses));
    console.log('Notas de cursos:', courseGrades);
    
    const container = document.getElementById('mallaContainer');
    container.innerHTML = '';
    
    const mallaData = convertirMallaASemestres(obtenerDatosCarrera().malla);
    console.log('Datos de malla cargados:', mallaData.length, 'semestres');
        
    // Crear contenedores para cada semestre
    mallaData.forEach((semesterData, index) => {
                const semesterElement = document.createElement('div');
                semesterElement.className = 'semester';
                
                const titleElement = document.createElement('h2');
                titleElement.className = 'semester-title';
                titleElement.textContent = `${semesterData.number}° Semestre`;
                
                const coursesGrid = document.createElement('div');
                coursesGrid.className = 'courses-grid';
                
                semesterData.courses.forEach(courseData => {
                    const courseElement = createCourseElement(courseData);
                    coursesGrid.appendChild(courseElement);
                });
                
                semesterElement.appendChild(titleElement);
                semesterElement.appendChild(coursesGrid);
        container.appendChild(semesterElement);
    });
    
    console.log('✅ Malla curricular creada correctamente');
}

// Funciones para el modal de opciones
function inicializarModalOpciones() {
    console.log('🔧 Inicializando modal de opciones...');
    
    const modal = document.getElementById('opcionesModal');
    const btn = document.getElementById('opcionesBtn');
    const closeBtn = document.getElementById('closeOpcionesBtn');
    const guardarBtn = document.getElementById('guardarOpcionesBtn');
    
    // Verificar que los elementos existen antes de agregar event listeners
    if (!modal || !btn || !closeBtn || !guardarBtn) {
        console.log('⚠️ Algunos elementos del modal de opciones no existen, saltando inicialización');
        return;
    }
    
    // Mostrar modal
    btn.addEventListener('click', () => {
        modal.classList.add('show');
        cargarOpcionesActuales();
    });
    
    // Cerrar modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });
    
    // Cerrar al hacer clic fuera del contenido
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
    
    // Guardar opciones
    guardarBtn.addEventListener('click', () => {
        guardarOpciones();
        modal.classList.remove('show');
    });
    
    console.log('✅ Modal de opciones inicializado correctamente');
}

// Mejorar selección de color en personalización
function cargarOpcionesActuales() {
    // Cargar colores
    const coloresGrid = document.getElementById('coloresGrid');
    if (coloresGrid) {
        // Limpiar colores existentes
    coloresGrid.innerHTML = '';
        
        // Agregar colores dinámicamente
    configuracion.colores.forEach(color => {
        const colorElement = document.createElement('div');
        colorElement.className = 'color-opcion';
            colorElement.style.background = `linear-gradient(135deg, ${color.primario}, ${color.secundario})`;
            colorElement.title = color.nombre;
        colorElement.dataset.color = JSON.stringify(color);
            
            // Marcar como seleccionado si coincide con el color actual
        if (color.nombre === colorActual.nombre) {
            colorElement.classList.add('seleccionado');
        }
            
            // Event listener para seleccionar color
        colorElement.addEventListener('click', () => {
            document.querySelectorAll('.color-opcion').forEach(el => el.classList.remove('seleccionado'));
            colorElement.classList.add('seleccionado');
                colorActual = color;
                aplicarPersonalizacion();
                // Guardar automáticamente cuando se cambia el color
                console.log('Color cambiado, guardando automáticamente...');
                guardarPerfilEnFirebase();
        });
            
        coloresGrid.appendChild(colorElement);
    });
    }
    
    // Cargar fuentes
    const fuenteSelect = document.getElementById('fuenteSelect');
    if (fuenteSelect) {
    fuenteSelect.innerHTML = '';
    configuracion.fuentes.forEach(fuente => {
        const option = document.createElement('option');
        option.value = JSON.stringify(fuente);
        option.textContent = fuente.nombre;
        option.style.fontFamily = fuente.valor;
        if (fuente.nombre === fuenteActual.nombre) {
            option.selected = true;
        }
        fuenteSelect.appendChild(option);
    });
        
        // Event listener para cambio de fuente
        fuenteSelect.addEventListener('change', () => {
    const nuevaFuente = JSON.parse(fuenteSelect.value);
        fuenteActual = nuevaFuente;
        aplicarPersonalizacion();
            // Guardar automáticamente cuando se cambia la fuente
            console.log('Fuente cambiada, guardando automáticamente...');
            guardarPerfilEnFirebase();
        });
    }
    

}

// --- HORARIO ---
const HORARIO_VISUAL_KEY = 'horarioVisualRamos';

// Variable global para almacenar el horario del usuario actual
let horarioVisualData = [];

function getHorarioVisualData() {
    console.log('📊 getHorarioVisualData() llamado, horario actual:', horarioVisualData);
    // Asegurar que siempre devuelva un array válido
    if (!horarioVisualData || !Array.isArray(horarioVisualData)) {
        console.log('⚠️ horarioVisualData no es válido, inicializando como array vacío');
        horarioVisualData = [];
    }
    return horarioVisualData;
}

function saveHorarioVisualData(data) {
    console.log('💾 Guardando horario:', data);
    console.log('👤 Usuario actual:', USER_ID);
    horarioVisualData = data;
    // Guardar horario y preferencias en Firebase por usuario
    const horarioCompleto = {
        horario: data,
        semestreSeleccionado: semestreVisualSeleccionado,
        modoEdicion: modoEdicionHorario
    };
    console.log('📤 Enviando a Firebase:', horarioCompleto);
    db.ref('horarios/' + USER_ID).set(horarioCompleto).then(() => {
        console.log('✅ Horario y preferencias guardados en Firebase para usuario:', USER_ID);
    }).catch((error) => {
        console.error('❌ Error al guardar horario en Firebase:', error);
    });
}

function cargarHorarioDeFirebase(callback) {
    console.log('🔄 Cargando horario desde Firebase para usuario:', USER_ID);
    db.ref('horarios/' + USER_ID).once('value').then(snap => {
        const data = snap.val();
        console.log('📥 Datos recibidos de Firebase:', data);
        if (data) {
            // Si es el formato nuevo (con preferencias)
            if (data.horario) {
                horarioVisualData = data.horario;
                semestreVisualSeleccionado = data.semestreSeleccionado || 1;
                modoEdicionHorario = data.modoEdicion || false;
                console.log('✅ Horario y preferencias cargados desde Firebase:', data);
                console.log('📊 Horario cargado:', horarioVisualData);
            } else {
                // Formato antiguo (solo horario)
                horarioVisualData = data;
                console.log('✅ Horario cargado desde Firebase (formato antiguo):', data);
                console.log('📊 Horario cargado:', horarioVisualData);
            }
            
            // Validar y limpiar materias que no existen en la carrera actual
            limpiarHorarioMateriasInvalidas();
        } else {
            horarioVisualData = [];
            console.log('⚠️ No se encontró horario en Firebase, usando valores por defecto');
        }
        if (callback) callback();
    }).catch((error) => {
        console.error('❌ Error al cargar horario desde Firebase:', error);
        horarioVisualData = [];
        if (callback) callback();
    });
}

// Función para limpiar materias que no existen en la carrera actual
function limpiarHorarioMateriasInvalidas() {
    console.log('🧹 Validando materias del horario contra la carrera actual...');
    
    // Obtener todas las materias válidas de la carrera actual
    const mallaData = convertirMallaASemestres(obtenerDatosCarrera().malla);
    const materiasValidas = new Set();
    
    mallaData.forEach(semestre => {
        semestre.courses.forEach(curso => {
            materiasValidas.add(curso.id);
        });
    });
    
    console.log('📚 Materias válidas en la carrera actual:', Array.from(materiasValidas));
    
    // Limpiar horario de materias inválidas
    let materiasEliminadas = 0;
    if (horarioVisualData && Array.isArray(horarioVisualData)) {
        horarioVisualData.forEach(semestreData => {
            if (semestreData && semestreData.bloques && Array.isArray(semestreData.bloques)) {
                const bloquesOriginales = [...semestreData.bloques];
                semestreData.bloques = semestreData.bloques.filter(bloque => {
                    if (!materiasValidas.has(bloque.materia)) {
                        console.log('🗑️ Eliminando materia inválida del horario:', bloque.materia);
                        materiasEliminadas++;
                        return false;
                    }
                    return true;
                });
            }
        });
    }
    
    if (materiasEliminadas > 0) {
        console.log(`✅ Se eliminaron ${materiasEliminadas} materias inválidas del horario`);
        // Guardar el horario limpio
        saveHorarioVisualData(horarioVisualData);
    } else {
        console.log('✅ Todas las materias del horario son válidas para la carrera actual');
    }
}
const DIAS_VISUAL = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const BLOQUES_VISUAL = [
    {inicio: '08:30', fin: '09:10', ventana: false},
    {inicio: '09:10', fin: '09:50', ventana: false},
    {inicio: '09:50', fin: '10:00', ventana: true},
    {inicio: '10:00', fin: '10:40', ventana: false},
    {inicio: '10:40', fin: '11:20', ventana: false},
    {inicio: '11:20', fin: '11:30', ventana: true},
    {inicio: '11:30', fin: '12:10', ventana: false},
    {inicio: '12:10', fin: '12:50', ventana: false},
    {inicio: '12:50', fin: '13:10', ventana: true},
    {inicio: '13:10', fin: '13:50', ventana: false},
    {inicio: '13:50', fin: '14:30', ventana: false},
    {inicio: '14:30', fin: '14:40', ventana: true},
    {inicio: '14:40', fin: '15:20', ventana: false},
    {inicio: '15:20', fin: '16:00', ventana: false},
    {inicio: '16:00', fin: '16:10', ventana: true},
    {inicio: '16:10', fin: '16:50', ventana: false},
    {inicio: '16:50', fin: '17:30', ventana: false},
    {inicio: '17:30', fin: '18:10', ventana: false},
    {inicio: '18:10', fin: '18:30', ventana: true},
    {inicio: '18:30', fin: '19:10', ventana: false},
];

let semestreVisualSeleccionado = 1;
let modoEdicionHorario = false;

function renderSelectorSemestreVisual() {
    const container = document.getElementById('selectorSemestreVisualContainer');
    container.innerHTML = '';
    const label = document.createElement('label');
    label.textContent = 'Ver horario de: ';
    const select = document.createElement('select');
    const mallaData = convertirMallaASemestres(obtenerDatosCarrera().malla);
    for (let i = 1; i <= mallaData.length; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `${i}° Semestre`;
        if (i === semestreVisualSeleccionado) opt.selected = true;
        select.appendChild(opt);
    }
    select.onchange = function() {
        semestreVisualSeleccionado = parseInt(this.value);
        // Guardar preferencias automáticamente
        const horarioCompleto = {
            horario: horarioVisualData,
            semestreSeleccionado: semestreVisualSeleccionado,
            modoEdicion: modoEdicionHorario
        };
        db.ref('horarios/' + USER_ID).set(horarioCompleto).then(() => {
            console.log('✅ Preferencias de semestre guardadas en Firebase');
        }).catch((error) => {
            console.error('❌ Error al guardar preferencias:', error);
        });
        renderHorarioVisualSection();
    };
    container.appendChild(label);
    container.appendChild(select);
}

function renderHorarioVisualSection() {
    renderSelectorSemestreVisual();
    const section = document.getElementById('horarioVisualSection');
    section.innerHTML = '';
    
    // Verificar que la carrera tenga datos
    const datosCarrera = obtenerDatosCarrera();
    if (!datosCarrera || !datosCarrera.malla) {
        section.innerHTML = '<h2 class="horario-titulo-rosa">Horario visual semanal</h2><p style="text-align:center;">No hay datos disponibles para esta carrera.</p>';
        return;
    }
    
    const mallaData = convertirMallaASemestres(datosCarrera.malla);
    const semestre = mallaData[semestreVisualSeleccionado-1];
    if (!semestre) {
        section.innerHTML = '<h2 class="horario-titulo-rosa">Horario visual semanal</h2><p style="text-align:center;">¡Ya aprobaste todos los ramos!</p>';
        return;
    }
    
    // Botón editar
    const editarBtn = document.getElementById('editarHorarioBtn');
    if (editarBtn) {
        editarBtn.innerHTML = modoEdicionHorario ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><polyline points="20 6 9 17 4 12"/></svg>Listo' : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:7px;"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>Editar';
        editarBtn.onclick = () => {
            modoEdicionHorario = !modoEdicionHorario;
            // Guardar preferencias automáticamente
            const horarioCompleto = {
                horario: horarioVisualData,
                semestreSeleccionado: semestreVisualSeleccionado,
                modoEdicion: modoEdicionHorario
            };
            db.ref('horarios/' + USER_ID).set(horarioCompleto).then(() => {
                console.log('✅ Preferencias de modo edición guardadas en Firebase');
            }).catch((error) => {
                console.error('❌ Error al guardar preferencias:', error);
            });
            renderHorarioVisualSection();
        };
    }
    
    function prereqsAprobados(course) {
        return course.prerequisites.length === 0 || course.prerequisites.every(pr => completedCourses.has(pr));
    }
    
    // Materias del semestre seleccionado
    const materiasSemestre = semestre.courses.filter(c => !completedCourses.has(c.id) && prereqsAprobados(c));
    
    // Materias de semestres anteriores no aprobadas y con prerrequisitos aprobados
    // Solo incluir materias del mismo tipo (impar/par) que el semestre actual
    let materiasPrevias = [];
    const semestreActualEsImpar = semestreVisualSeleccionado % 2 === 1;
    
    for (let s = 0; s < semestreVisualSeleccionado-1; s++) {
        const semestreEsImpar = (s + 1) % 2 === 1;
        // Solo incluir materias de semestres del mismo tipo (impar/par)
        if (semestreEsImpar === semestreActualEsImpar) {
            mallaData[s].courses.forEach(c => {
                if (!completedCourses.has(c.id) && prereqsAprobados(c)) {
                    if (!materiasPrevias.some(m => m.id === c.id)) materiasPrevias.push(c);
                }
            });
        }
    }
    
    // Combinar materias del semestre actual + materias previas disponibles
    const materiasDisponibles = [...materiasPrevias, ...materiasSemestre];
    
    console.log('📚 Materias disponibles para el horario:');
    console.log('- Semestre actual:', semestreVisualSeleccionado, semestreVisualSeleccionado % 2 === 1 ? '(impar)' : '(par)');
    console.log('- Total materias en el semestre:', semestre.courses.length);
    console.log('- Materias completadas en el semestre:', semestre.courses.filter(c => completedCourses.has(c.id)).length);
    console.log('- Materias con prerrequisitos no cumplidos:', semestre.courses.filter(c => !prereqsAprobados(c)).length);
    console.log('- Materias del semestre disponibles:', materiasSemestre.length);
    console.log('- Materias previas disponibles (mismo tipo impar/par):', materiasPrevias.length);
    console.log('- Total materias disponibles:', materiasDisponibles.length);
    console.log('- Carrera actual:', carreraActual);
    console.log('- Cursos completados total:', completedCourses.size);
    
    // Debug específico para Medicina Veterinaria semestre 1
    if (carreraActual === 'Medicina Veterinaria' && semestreVisualSeleccionado === 1) {
        console.log('🔍 DEBUG Medicina Veterinaria Semestre 1:');
        console.log('- Todas las materias del semestre:', semestre.courses.map(c => ({id: c.id, name: c.name, completed: completedCourses.has(c.id), prereqsOk: prereqsAprobados(c)})));
        console.log('- Materias completadas:', Array.from(completedCourses));
    }
    
    // Verificar si no hay materias disponibles
    if (materiasDisponibles.length === 0) {
        // Si no hay materias no aprobadas, mostrar todas las materias del semestre para permitir arrastrar de vuelta
        const todasLasMaterias = semestre.courses;
        console.log('⚠️ No hay materias no aprobadas, mostrando todas las materias del semestre para permitir arrastrar de vuelta');
        
        // Lista de materias
        const lista = document.createElement('div');
        lista.className = 'horario-materias-lista';
        lista.innerHTML = '<h3>Materias (Todas aprobadas - puedes arrastrar de vuelta)</h3>';
        todasLasMaterias.forEach(m => {
            const matDiv = document.createElement('div');
            matDiv.className = 'materia-draggable';
            matDiv.textContent = m.name;
            matDiv.draggable = modoEdicionHorario;
            matDiv.dataset.materiaId = m.id;
            if (modoEdicionHorario) {
                matDiv.addEventListener('dragstart', e => {
                    e.dataTransfer.setData('text/plain', m.id);
                    e.dataTransfer.setData('from-list', 'true');
                });
            }
            lista.appendChild(matDiv);
        });
        
        // Agregar zona de eliminación
        const deleteZone = document.createElement('div');
        deleteZone.id = 'deleteZone';
        deleteZone.className = 'delete-zone';
        deleteZone.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;
        lista.appendChild(deleteZone);
        
        // Contenedor principal
        const container = document.createElement('div');
        container.className = 'horario-visual-container' + (modoEdicionHorario ? '' : ' no-edit');
        container.appendChild(lista);
        
        // Cuadrícula vacía
        const grid = document.createElement('div');
        grid.className = 'horario-visual-grid';
        const table = document.createElement('table');
        table.className = 'horario-visual-table';
        
        // Encabezado
        let thead = '<thead><tr><th class="hora-super">Hora</th>';
        for (const dia of DIAS_VISUAL) thead += `<th>${dia}</th>`;
        thead += '</tr></thead>';
        table.innerHTML = thead;
        
        // Cuerpo vacío
        let tbody = '<tbody>';
        BLOQUES_VISUAL.forEach((bloque, i) => {
            tbody += '<tr>';
            if (!bloque.ventana) {
                tbody += `<td class="hora-label">${bloque.inicio}<br>-<br>${bloque.fin}</td>`;
            } else {
                tbody += `<td class="hora-label ventana">${bloque.inicio}-${bloque.fin}</td>`;
            }
            for (let d = 0; d < DIAS_VISUAL.length; d++) {
                if (bloque.ventana) {
                    tbody += '<td class="bloque-horario ventana"></td>';
                } else {
                    tbody += `<td class="bloque-horario" data-dia="${DIAS_VISUAL[d]}" data-inicio="${bloque.inicio}" data-fin="${bloque.fin}"></td>`;
                }
            }
            tbody += '</tr>';
        });
        tbody += '</tbody>';
        table.innerHTML += tbody;
        grid.appendChild(table);
        container.appendChild(grid);
        section.appendChild(container);
        
        // Configurar drag & drop
        if (modoEdicionHorario) {
            configurarDragAndDrop(section, todasLasMaterias);
        }
        
        return;
    }
    
    // Función auxiliar para configurar drag & drop
    function configurarDragAndDrop(section, materiasDisponibles) {
        const deleteZone = document.getElementById('deleteZone');
        
        // Arrastrar desde lista
        section.querySelectorAll('.materia-draggable').forEach(el => {
            el.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', el.dataset.materiaId);
                e.dataTransfer.setData('from-list', 'true');
                el.classList.add('dragging');
                deleteZone.classList.add('show');
            });
            
            el.addEventListener('dragend', e => {
                el.classList.remove('dragging');
                deleteZone.classList.remove('show', 'hover');
                document.querySelectorAll('.dragging-over-delete').forEach(el => {
                    el.classList.remove('dragging-over-delete');
                });
            });
        });
        
        // Drop en bloques
        section.querySelectorAll('.bloque-horario:not(.ventana)').forEach(bloque => {
            bloque.addEventListener('dragover', e => {
                e.preventDefault();
                bloque.classList.add('drop-hover');
            });
            bloque.addEventListener('dragleave', e => {
                bloque.classList.remove('drop-hover');
            });
            bloque.addEventListener('drop', e => {
                e.preventDefault();
                bloque.classList.remove('drop-hover');
                const materiaId = e.dataTransfer.getData('text/plain');
                const fromList = e.dataTransfer.getData('from-list') === 'true';
                
                // Solo permitir materias disponibles (del semestre actual o previas no aprobadas del mismo tipo impar/par)
                if (!materiasDisponibles.some(m => m.id === materiaId)) {
                    console.log('❌ Materia no permitida:', materiaId);
                    const tipoSemestre = semestreVisualSeleccionado % 2 === 1 ? 'impar' : 'par';
                    // Mostrar mensaje al usuario
                    showToast(`Esta materia no está disponible para cursar en semestres ${tipoSemestre}es`);
                    return;
                }
                
                const materiaEnEsteBloque = horarioData.bloques.find(h => 
                    h.dia === bloque.dataset.dia && 
                    h.inicio === bloque.dataset.inicio && 
                    h.fin === bloque.dataset.fin
                );
                
                if (materiaEnEsteBloque) {
                    materiaEnEsteBloque.materia = materiaId;
                } else {
                    horarioData.bloques.push({ 
                        materia: materiaId, 
                        dia: bloque.dataset.dia, 
                        inicio: bloque.dataset.inicio, 
                        fin: bloque.dataset.fin 
                    });
                }
                
                saveHorarioVisualData(horarioDataAll);
                renderHorarioVisualSection();
            });
        });
        
        // Zona de eliminación
        deleteZone.addEventListener('dragover', e => {
            e.preventDefault();
            deleteZone.classList.add('hover');
            document.querySelectorAll('.dragging').forEach(el => {
                el.classList.add('dragging-over-delete');
            });
        });
        
        deleteZone.addEventListener('dragleave', e => {
            deleteZone.classList.remove('hover');
            document.querySelectorAll('.dragging-over-delete').forEach(el => {
                el.classList.remove('dragging-over-delete');
            });
        });
        
        deleteZone.addEventListener('drop', e => {
            e.preventDefault();
            deleteZone.classList.remove('hover');
            const materiaId = e.dataTransfer.getData('text/plain');
            const fromList = e.dataTransfer.getData('from-list') === 'true';
            
            if (!fromList) {
                const materiaAsignada = document.querySelector(`.materia-asignada[data-materia-id="${materiaId}"]`);
                if (materiaAsignada) {
                    const parent = materiaAsignada.closest('.bloque-horario');
                    if (parent) {
                        const dia = parent.dataset.dia, inicio = parent.dataset.inicio, fin = parent.dataset.fin;
                        const idx = horarioData.bloques.findIndex(h => h.materia === materiaId && h.dia === dia && h.inicio === inicio && h.fin === fin);
                        if (idx !== -1) {
                            horarioData.bloques.splice(idx, 1);
                            saveHorarioVisualData(horarioDataAll);
                            renderHorarioVisualSection();
                        }
                    }
                }
            }
            
            setTimeout(() => {
                deleteZone.classList.remove('show', 'success');
            }, 500);
        });
    }
    
    // Verificar si hay alguna materia asignada en el horario
    const horarioDataAll = getHorarioVisualData();
    console.log('🔄 Horario actual:', horarioDataAll);
    let horarioData = horarioDataAll.find(h => h.semestre === semestreVisualSeleccionado);
    if (!horarioData) {
        horarioData = { semestre: semestreVisualSeleccionado, bloques: [] };
        horarioDataAll.push(horarioData);
        console.log('📝 Creando nuevo semestre en horario:', semestreVisualSeleccionado);
        // Solo guardar si no es la primera vez que se carga
        if (horarioDataAll.length > 1) {
            saveHorarioVisualData(horarioDataAll);
        }
    }
    
    // Contenedor principal
    const container = document.createElement('div');
    container.className = 'horario-visual-container' + (modoEdicionHorario ? '' : ' no-edit');
    
    // Lista de materias
    const lista = document.createElement('div');
    lista.className = 'horario-materias-lista';
    lista.innerHTML = '<h3>Materias</h3>';
    
    // Agregar materias previas primero (si las hay)
    if (materiasPrevias.length > 0) {
        const previasHeader = document.createElement('div');
        previasHeader.className = 'materias-previas-header';
        previasHeader.innerHTML = '<h4>Materias de semestres anteriores</h4>';
        lista.appendChild(previasHeader);
        
        materiasPrevias.forEach(m => {
            const matDiv = document.createElement('div');
            matDiv.className = 'materia-draggable materia-previa';
            matDiv.textContent = m.name;
            matDiv.draggable = modoEdicionHorario;
            matDiv.dataset.materiaId = m.id;
            if (modoEdicionHorario) {
                matDiv.addEventListener('dragstart', e => {
                    e.dataTransfer.setData('text/plain', m.id);
                });
            }
            lista.appendChild(matDiv);
        });
    }
    
    // Agregar materias del semestre actual
    if (materiasSemestre.length > 0) {
        const actualHeader = document.createElement('div');
        actualHeader.className = 'materias-actual-header';
        actualHeader.innerHTML = `<h4>Materias del semestre ${semestreVisualSeleccionado}</h4>`;
        lista.appendChild(actualHeader);
        
        materiasSemestre.forEach(m => {
            const matDiv = document.createElement('div');
            matDiv.className = 'materia-draggable materia-actual';
            matDiv.textContent = m.name;
            matDiv.draggable = modoEdicionHorario;
            matDiv.dataset.materiaId = m.id;
            if (modoEdicionHorario) {
                matDiv.addEventListener('dragstart', e => {
                    e.dataTransfer.setData('text/plain', m.id);
                });
            }
            lista.appendChild(matDiv);
        });
    }
    
    // Agregar zona de eliminación dentro de la lista de materias
    const deleteZone = document.createElement('div');
    deleteZone.id = 'deleteZone';
    deleteZone.className = 'delete-zone';
    deleteZone.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    `;
    lista.appendChild(deleteZone);
    
    container.appendChild(lista);
    
    // Cuadrícula
    const grid = document.createElement('div');
    grid.className = 'horario-visual-grid';
    const table = document.createElement('table');
    table.className = 'horario-visual-table';
    
    // Encabezado
    let thead = '<thead><tr><th class="hora-super">Hora</th>';
    for (const dia of DIAS_VISUAL) thead += `<th>${dia}</th>`;
    thead += '</tr></thead>';
    table.innerHTML = thead;
    
    // Cuerpo
    let tbody = '<tbody>';
    BLOQUES_VISUAL.forEach((bloque, i) => {
        tbody += '<tr>';
        // Etiqueta de hora
        if (!bloque.ventana) {
            tbody += `<td class="hora-label">${bloque.inicio}<br>-<br>${bloque.fin}</td>`;
        } else {
            tbody += `<td class="hora-label ventana">${bloque.inicio}-${bloque.fin}</td>`;
        }
        for (let d = 0; d < DIAS_VISUAL.length; d++) {
            if (bloque.ventana) {
                tbody += '<td class="bloque-horario ventana"></td>';
            } else {
                const asignado = horarioData && horarioData.bloques ? horarioData.bloques.find(h => h.dia === DIAS_VISUAL[d] && h.inicio === bloque.inicio && h.fin === bloque.fin) : null;
                tbody += `<td class="bloque-horario" data-dia="${DIAS_VISUAL[d]}" data-inicio="${bloque.inicio}" data-fin="${bloque.fin}">`;
                if (asignado && materiasDisponibles.some(m => m.id === asignado.materia)) {
                    const mat = materiasDisponibles.find(m => m.id === asignado.materia);
                    tbody += `<span class="materia-asignada" draggable="${modoEdicionHorario}" data-materia-id="${mat.id}" title="${mat.name}">${mat.name}</span>`;
                }
                tbody += '</td>';
            }
        }
        tbody += '</tr>';
    });
    tbody += '</tbody>';
    table.innerHTML += tbody;
    grid.appendChild(table);
    container.appendChild(grid);
    section.appendChild(container);
    
    // Drag & drop lógica SOLO si modoEdicionHorario
    if (modoEdicionHorario) {
        const deleteZone = document.getElementById('deleteZone');
        
        // Arrastrar desde lista
        section.querySelectorAll('.materia-draggable').forEach(el => {
            el.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', el.dataset.materiaId);
                e.dataTransfer.setData('from-list', 'true'); // Marcar que viene de la lista
                el.classList.add('dragging');
                
                // Mostrar zona de eliminación solo cuando se arrastra
                deleteZone.classList.add('show');
            });
            
            el.addEventListener('dragend', e => {
                el.classList.remove('dragging');
                deleteZone.classList.remove('show', 'hover');
                
                // Remover clases de feedback
                document.querySelectorAll('.dragging-over-delete').forEach(el => {
                    el.classList.remove('dragging-over-delete');
                });
            });
        });
        
        // Hacer que la lista de materias también sea una zona de drop para eliminar
        const listaMaterias = section.querySelector('.horario-materias-lista');
        listaMaterias.addEventListener('dragover', e => {
            e.preventDefault();
            listaMaterias.classList.add('drop-hover');
        });
        
        listaMaterias.addEventListener('dragleave', e => {
            listaMaterias.classList.remove('drop-hover');
        });
        
        listaMaterias.addEventListener('drop', e => {
            e.preventDefault();
            listaMaterias.classList.remove('drop-hover');
            
            // Obtener la materia que se está arrastrando
            const materiaId = e.dataTransfer.getData('text/plain');
            const fromList = e.dataTransfer.getData('from-list') === 'true';
            
            // Solo eliminar si viene del horario (no de la lista)
            if (!fromList) {
                console.log('🗑️ Eliminando materia específica del horario al arrastrar a la lista:', materiaId);
                
                // Obtener el bloque de origen desde el elemento arrastrado
                const draggedElement = document.querySelector('.dragging');
                if (draggedElement) {
                    const parentBlock = draggedElement.closest('.bloque-horario');
                    if (parentBlock) {
                        const dia = parentBlock.dataset.dia;
                        const inicio = parentBlock.dataset.inicio;
                        const fin = parentBlock.dataset.fin;
                        
                        // Encontrar y eliminar solo la instancia específica de esta materia en este bloque específico
                        const idx = horarioData.bloques.findIndex(h => 
                            h.materia === materiaId && 
                            h.dia === dia && 
                            h.inicio === inicio && 
                            h.fin === fin
                        );
                        
                        if (idx !== -1) {
                            horarioData.bloques.splice(idx, 1);
                            console.log('✅ Materia específica eliminada del bloque:', dia, inicio, fin);
                        }
                    }
                }
                
                saveHorarioVisualData(horarioDataAll);
                renderHorarioVisualSection();
            }
        });
        
        // Arrastrar materia ya asignada (solo materias del semestre actual)
        section.querySelectorAll('.materia-asignada').forEach(el => {
            el.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', el.dataset.materiaId);
                e.dataTransfer.setData('from-list', 'false'); // Marcar que viene del horario
                el._draggedFrom = el.closest('.bloque-horario');
                el.classList.add('dragging');
                
                // Mostrar zona de eliminación solo cuando se arrastra
                deleteZone.classList.add('show');
            });
            
            el.addEventListener('dragend', e => {
                el.classList.remove('dragging');
                deleteZone.classList.remove('show', 'hover');
                
                // Remover clases de feedback
                document.querySelectorAll('.dragging-over-delete').forEach(el => {
                    el.classList.remove('dragging-over-delete');
                });
            });
        });
        
        // Drop en bloques
        section.querySelectorAll('.bloque-horario:not(.ventana)').forEach(bloque => {
            bloque.addEventListener('dragover', e => {
                e.preventDefault();
                bloque.classList.add('drop-hover');
            });
            bloque.addEventListener('dragleave', e => {
                bloque.classList.remove('drop-hover');
            });
            bloque.addEventListener('drop', e => {
                e.preventDefault();
                bloque.classList.remove('drop-hover');
                const materiaId = e.dataTransfer.getData('text/plain');
                const fromList = e.dataTransfer.getData('from-list') === 'true';
                console.log('🎯 Drop detectado para materia:', materiaId, 'desde lista:', fromList);
                
                // Solo permitir materias disponibles (del semestre actual o previas no aprobadas del mismo tipo impar/par)
                if (!materiasDisponibles.some(m => m.id === materiaId)) {
                    console.log('❌ Materia no permitida:', materiaId);
                    const tipoSemestre = semestreVisualSeleccionado % 2 === 1 ? 'impar' : 'par';
                    // Mostrar mensaje al usuario
                    showToast(`Esta materia no está disponible para cursar en semestres ${tipoSemestre}es`);
                    return;
                }
                
                // Verificar si ya hay una materia en este bloque específico
                const materiaEnEsteBloque = horarioData.bloques.find(h => 
                    h.dia === bloque.dataset.dia && 
                    h.inicio === bloque.dataset.inicio && 
                    h.fin === bloque.dataset.fin
                );
                console.log('🔍 Materia en este bloque:', materiaEnEsteBloque);
                
                if (materiaEnEsteBloque) {
                    // Si ya hay una materia en este bloque, siempre reemplazar
                    console.log('🔄 Reemplazando materia en este bloque');
                    materiaEnEsteBloque.materia = materiaId;
                    console.log('✅ Materia reemplazada en:', bloque.dataset.dia, bloque.dataset.inicio);
                } else {
                    // Si no hay materia en este bloque, agregar la nueva
                    horarioData.bloques.push({ 
                        materia: materiaId, 
                        dia: bloque.dataset.dia, 
                        inicio: bloque.dataset.inicio, 
                        fin: bloque.dataset.fin 
                    });
                    console.log('➕ Materia agregada a:', bloque.dataset.dia, bloque.dataset.inicio);
                }
                
                console.log('💾 Guardando horario después de drop...');
                saveHorarioVisualData(horarioDataAll);
                renderHorarioVisualSection();
            });
        });
        
        // La zona de eliminación elimina materias del horario
        deleteZone.addEventListener('dragover', e => {
            e.preventDefault();
            deleteZone.classList.add('hover');
            
            // Agregar feedback visual a elementos arrastrados
            document.querySelectorAll('.dragging').forEach(el => {
                el.classList.add('dragging-over-delete');
            });
        });
        
        deleteZone.addEventListener('dragleave', e => {
            deleteZone.classList.remove('hover');
            
            // Remover feedback visual
            document.querySelectorAll('.dragging-over-delete').forEach(el => {
                el.classList.remove('dragging-over-delete');
            });
        });
        
        deleteZone.addEventListener('drop', e => {
            e.preventDefault();
            deleteZone.classList.remove('hover');
            deleteZone.classList.add('success');
            
            // Remover feedback visual
            document.querySelectorAll('.dragging-over-delete').forEach(el => {
                el.classList.remove('dragging-over-delete');
            });
            
            // Obtener la materia que se está arrastrando
            const materiaId = e.dataTransfer.getData('text/plain');
            
            // Solo eliminar si es una materia que ya está en el horario
            const materiaAsignada = document.querySelector(`.materia-asignada[data-materia-id="${materiaId}"]`);
            if (materiaAsignada) {
                materiaAsignada.classList.add('deleting');
                
                setTimeout(() => {
                    const parent = materiaAsignada.closest('.bloque-horario');
                    if (parent) {
                        const dia = parent.dataset.dia, inicio = parent.dataset.inicio, fin = parent.dataset.fin;
                        const idx = horarioData.bloques.findIndex(h => h.materia === materiaId && h.dia === dia && h.inicio === inicio && h.fin === fin);
                        if (idx !== -1) {
                            horarioData.bloques.splice(idx, 1);
                            saveHorarioVisualData(horarioDataAll);
                            renderHorarioVisualSection();
                        }
                    }
                }, 500);
            }
            
            // Ocultar zona de eliminación después de la animación
            setTimeout(() => {
                deleteZone.classList.remove('show', 'success');
            }, 500);
        });
    } else {
        // Ocultar zona de eliminación cuando no está en modo edición
        const deleteZone = document.getElementById('deleteZone');
        if (deleteZone) {
            deleteZone.classList.remove('show', 'hover', 'success');
        }
    }
}

// Función para cerrar el modal de horario
function cerrarHorario() {
    console.log('Función cerrarHorario() ejecutada');
    const horarioModal = document.getElementById('horarioVisualModal');
    if (horarioModal) {
        horarioModal.classList.remove('active');
        console.log('Modal de horario cerrado');
    } else {
        console.log('No se encontró el modal de horario');
    }
}

// Función para limpiar todos los tooltips
function limpiarTooltips() {
    // Desactivar tooltips de prerrequisitos
    tooltipsPrereqHabilitados = false;
    console.log('🚫 Tooltips de prerrequisitos desactivados');
    
    // Limpiar tooltips de prerrequisitos
    document.querySelectorAll('.tooltip-prereq').forEach(tooltip => {
        tooltip.remove();
    });
    
    // Limpiar tooltips de notas
    document.querySelectorAll('.tooltip-nota').forEach(tooltip => {
        tooltip.remove();
    });
    
    // Limpiar referencias de tooltips en elementos
    document.querySelectorAll('.course').forEach(element => {
        if (element._tooltip) {
            element._tooltip.remove();
            element._tooltip = null;
        }
        if (element._notaTooltip) {
            element._notaTooltip.remove();
            element._notaTooltip = null;
            element._posicionarTooltip = null;
        }
    });
    
    console.log('🧹 Tooltips limpiados');
}

// Función para habilitar tooltips de prerrequisitos después del login
function habilitarTooltipsPrereq() {
    setTimeout(() => {
        tooltipsPrereqHabilitados = true;
        console.log('✅ Tooltips de prerrequisitos habilitados después de 2 segundos');
    }, 2000);
}

// Función para mostrar el login
function mostrarLogin() {
    console.log('🔑 Mostrando login...');
    
    // Limpiar tooltips antes de mostrar login
    limpiarTooltips();
    
    // Remover clase para ocultar elementos hasta la próxima carga
    document.body.classList.remove('datos-cargados');
    console.log('✅ Clase datos-cargados removida - elementos ocultos');
    
    const loginContainer = document.getElementById('loginContainer');
    const container = document.querySelector('.container');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginContainer) {
        loginContainer.classList.add('show');
    }
    
    if (container) {
        container.style.display = 'none';
    }
    
    if (logoutBtn) {
        logoutBtn.style.display = 'none';
    }
}

// Al mostrar la app tras login, cargar perfil
function ocultarLogin() {
    console.log('👋 Ocultando login, mostrando aplicación...');
    
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser && savedUser !== USER_ID) {
        USER_ID = savedUser;
        console.log('🔄 Usuario recuperado de localStorage:', USER_ID);
    }
    
    // Limpiar tooltips antes de mostrar aplicación
    limpiarTooltips();
    
    const loginContainer = document.getElementById('loginContainer');
    const container = document.querySelector('.container');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginContainer) {
        loginContainer.classList.remove('show');
    } else {
        console.log('⚠️ No se encontró loginContainer');
    }
    
    if (container) {
        container.style.display = '';
    } else {
        console.log('⚠️ No se encontró container');
    }
    
    if (logoutBtn) {
        logoutBtn.style.display = 'block';
    } else {
        console.log('⚠️ No se encontró logoutBtn');
    }
    
    inicializarAplicacion();
}

// --- INICIO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCKrOH4dxZ-gHkUqnotDLOvmNzWr8lyw2c",
  authDomain: "malla-curricular-4315c.firebaseapp.com",
  databaseURL: "https://malla-curricular-4315c-default-rtdb.firebaseio.com",
  projectId: "malla-curricular-4315c",
  storageBucket: "malla-curricular-4315c.firebasestorage.app",
  messagingSenderId: "822634947088",
  appId: "1:822634947088:web:f02331fc1252922b6e6095",
  measurementId: "G-V2KX57R4MJ"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
// --- FIN INICIO FIREBASE ---

// --- INICIO DE SESIÓN COMPARTIDA ---
function iniciarSesionCompartida() {
    console.log('🔐 Iniciando sesión compartida para usuario:', USER_ID);
    db.ref('sesionIniciada').set(true);
    inicializarAplicacion();
}

function cerrarSesion() {
    console.log('🚪 Cerrando sesión...');
    
    // Limpiar localStorage
    localStorage.removeItem('currentUser');
    USER_ID = 'admin'; // Volver al usuario por defecto
    
    // Limpiar horario y preferencias del usuario anterior
    horarioVisualData = [];
    semestreVisualSeleccionado = 1;
    modoEdicionHorario = false;
    
    // Desactivar tooltips de prerrequisitos
    tooltipsPrereqHabilitados = false;
    console.log('🚫 Tooltips de prerrequisitos desactivados al cerrar sesión');
    
    // Remover clase para ocultar elementos hasta la próxima carga
    document.body.classList.remove('datos-cargados');
    console.log('✅ Clase datos-cargados removida - elementos ocultos');
    db.ref('sesionIniciada').set(false);
    
    // Mostrar login
    mostrarLogin();
    
    console.log('✅ Sesión cerrada correctamente');
}

// Función para borrar una cuenta
function borrarCuenta(usuarioId) {
    if (confirm(`¿Estás seguro de que quieres borrar la cuenta de usuario "${usuarioId}"? Esta acción no se puede deshacer.`)) {
        db.ref('usuarios/' + usuarioId).remove()
            .then(() => {
                console.log('✅ Cuenta de usuario', usuarioId, 'borrada exitosamente.');
                showToast(`Cuenta de usuario "${usuarioId}" borrada.`);
                cargarUsuariosDesdeFirebase(); // Recargar la lista de cuentas
                mostrarCuentasCreadas(); // Actualizar la visualización
            })
            .catch(error => {
                console.error('❌ Error al borrar cuenta de usuario:', error);
                showToast('Error al borrar la cuenta.');
            });
    }
}

// Función de inicialización que carga datos de Firebase
function inicializarAplicacion() {
    console.log('🚀 Inicializando aplicación...');
    console.log('Usuario actual:', USER_ID);
    
    // Cargar perfil de Firebase
    cargarPerfilDeFirebase(() => {
        console.log('✅ Datos cargados de Firebase, aplicando personalización...');
        
        // Aplicar personalización primero
    aplicarPersonalizacion();
    
        // Pequeño delay para asegurar que los estilos se apliquen
        setTimeout(() => {
    createMalla();
    updateProgress();
    
            // Actualizar estados de cursos después de crear la malla
            setTimeout(() => {
                console.log('🔄 Actualizando estados de cursos...');
                document.querySelectorAll('.course').forEach(element => {
                    const id = element.dataset.courseId;
                    const mallaData = convertirMallaASemestres(obtenerDatosCarrera().malla);
                    const semester = mallaData.find(sem => sem.courses.some(course => course.id === id));
                    const course = semester ? semester.courses.find(course => course.id === id) : null;
                    if (course) {
                        updateCourseState(element, course);
                        updateCourseTooltips(element, course);
                    }
                });
                console.log('✅ Estados de cursos actualizados');
            }, 50);
            
            // Inicializar componentes
            try {
    inicializarModalOpciones();
            } catch (error) {
                console.log('⚠️ Error al inicializar modal de opciones:', error.message);
            }
            
            try {
                renderSelectorSemestreVisual();
                renderHorarioVisualSection();
            } catch (error) {
                console.log('⚠️ Error al renderizar horario:', error.message);
            }
            
            console.log('✅ Aplicación inicializada correctamente');
            
            // Habilitar tooltips de prerrequisitos después de 2 segundos
            habilitarTooltipsPrereq();
        }, 100);
    });
}

// Función para inicializar eventos básicos que no dependen de Firebase
function inicializarEventosBasicos() {
    console.log('🔧 Inicializando eventos básicos...');
    
    // Configurar eventos de botones que no dependen de datos de Firebase
    const btn = document.getElementById('downloadNotasBtn');
    if (btn) {
        btn.addEventListener('click', downloadNotasPDF);
    }
    
    // Panel de personalización
    const personalizacionPanel = document.getElementById('personalizacionPanel');
    const dropdownPersonalizacionBtn = document.getElementById('dropdownPersonalizacionBtn');
    const guardarOpcionesBtn = document.getElementById('guardarOpcionesBtn');
    
    if (dropdownPersonalizacionBtn && personalizacionPanel) {
        dropdownPersonalizacionBtn.onclick = (e) => {
            e.stopPropagation();
            if (personalizacionPanel.style.display === 'none' || personalizacionPanel.style.display === '') {
                personalizacionPanel.style.display = 'flex';
                cargarOpcionesActuales();
            } else {
                personalizacionPanel.style.display = 'none';
            }
            // Cerrar el menú de opciones
            const opcionesDropdown = document.getElementById('opcionesDropdown');
            if (opcionesDropdown) opcionesDropdown.style.display = 'none';
        };
        
        // Ocultar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (personalizacionPanel.style.display !== 'none') {
                personalizacionPanel.style.display = 'none';
            }
        });
        personalizacionPanel.onclick = (e) => e.stopPropagation();
    }
    
    if (guardarOpcionesBtn && personalizacionPanel) {
        console.log('Configurando botón de guardar opciones...');
        guardarOpcionesBtn.onclick = (e) => {
            e.preventDefault();
            console.log('Botón guardar opciones clickeado');
            guardarOpciones();
            personalizacionPanel.style.display = 'none';
        };
        console.log('Botón de guardar opciones configurado correctamente');
    } else {
        console.log('No se encontró el botón de guardar opciones o el panel de personalización');
    }
    
    // Configurar otros elementos del DOM que no dependen de Firebase...
    
    // Configurar botón de descarga de horario
    const descargarHorarioJpgBtn = document.getElementById('descargarHorarioJpgBtn');
    if (descargarHorarioJpgBtn) {
        descargarHorarioJpgBtn.onclick = async () => {
            const grid = document.querySelector('.horario-visual-grid');
            if (!grid) return;
            
            // Código de descarga del horario...
            console.log('Descargando horario...');
        };
    }
    
    // Modal de horario visual
    const horarioBtn = document.getElementById('toggleHorarioBtn');
    const horarioModal = document.getElementById('horarioVisualModal');
    
    if (horarioBtn && horarioModal) {
        horarioBtn.addEventListener('click', () => {
            horarioModal.classList.add('active');
            renderHorarioVisualSection();
        });
        
        // Cerrar al hacer clic fuera del modal
        horarioModal.addEventListener('click', (e) => {
            if (e.target === horarioModal) {
                cerrarHorario();
            }
        });
    }
    
    console.log('✅ Eventos básicos inicializados');
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM cargado, iniciando configuración...');
    
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser && savedUser !== 'admin') {
        console.log('🔄 Usuario encontrado en localStorage:', savedUser);
        USER_ID = savedUser;
        // El login automático se hará después de cargar usuarios de Firebase
    }
    
    // Mostrar login solo si no hay usuario guardado
    if (!savedUser || savedUser === 'admin') {
        const loginContainer = document.getElementById('loginContainer');
        if (loginContainer) {
            loginContainer.classList.add('show');
        }
    }
    
    // Cargar usuarios desde Firebase
    cargarUsuariosDesdeFirebase();
    
    // Inicializar solo eventos básicos
    inicializarEventosBasicos();
    
    // Configurar cuentas de demostración clickeables
    document.addEventListener('click', (e) => {
        if (e.target.closest('.demo-account')) {
            const demoAccount = e.target.closest('.demo-account');
            const accountText = demoAccount.querySelector('strong').textContent;
            const loginUser = document.getElementById('loginUser');
            const loginPass = document.getElementById('loginPass');
            
            if (accountText === 'admin') {
                loginUser.value = 'admin';
                loginPass.value = 'admin';
            } else if (accountText === 'estudiante1') {
                loginUser.value = 'estudiante1';
                loginPass.value = '123456';
            }
            
            // Agregar animación de feedback
            demoAccount.style.transform = 'scale(0.95)';
            setTimeout(() => {
                demoAccount.style.transform = '';
            }, 150);
            
            // Focus en el botón de login después de un momento
            setTimeout(() => {
                document.querySelector('.login-button').focus();
            }, 200);
        }
    });
    
    // --- INICIO DE SESIÓN COMPARTIDA ---
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.onclick = cerrarSesion;
    if (loginForm) {
        loginForm.onsubmit = function(e) {
            e.preventDefault();
            const user = document.getElementById('loginUser').value.trim();
            const pass = document.getElementById('loginPass').value;
            
            // Verificar si el usuario existe y la contraseña es correcta
            if (usuarios[user] && usuarios[user].password === pass) {
                // Verificar si se está intentando usar admin/admin cuando hay otros administradores
                if (user === 'admin' && pass === 'admin') {
                    // Contar cuántos administradores hay (excluyendo admin)
                    const otrosAdmins = Object.keys(usuarios).filter(uid => 
                        uid !== 'admin' && usuarios[uid] && usuarios[uid].esAdmin
                    );
                    
                    if (otrosAdmins.length > 0) {
                        console.log('❌ Intento de login con admin/admin bloqueado - hay otros administradores');
                        const loginError = document.getElementById('loginError');
                        loginError.textContent = 'La cuenta admin por defecto está deshabilitada. Use una cuenta de administrador válida.';
                        loginError.style.display = 'block';
                        
                        // Agregar animación de shake al formulario
                        const loginCard = document.querySelector('.login-card');
                        loginCard.style.animation = 'none';
                        setTimeout(() => {
                            loginCard.style.animation = 'errorShake 0.5s ease-in-out';
                        }, 10);
                        
                        // Limpiar animación después
                        setTimeout(() => {
                            loginCard.style.animation = '';
                        }, 500);
                        return;
                    }
                }
                console.log('🔐 Login exitoso para usuario:', user);
                console.log('👤 Datos del usuario:', usuarios[user]);
                
                USER_ID = user; // Cambiar USER_ID al usuario logueado
                localStorage.setItem('currentUser', user); // Guardar en localStorage
                console.log('✅ USER_ID establecido a:', USER_ID);
                
                // Limpiar horario y preferencias del usuario anterior
                horarioVisualData = [];
                semestreVisualSeleccionado = 1;
                modoEdicionHorario = false;
                console.log('🧹 Horario limpiado para nuevo usuario');
                
                iniciarSesionCompartida();
                loginError.style.display = 'none';
                showToast(`¡Bienvenido, ${usuarios[user].nombre}!`);
                
                // Mostrar/ocultar botón de administración
                const dropdownAdminBtn = document.getElementById('dropdownAdminBtn');
                if (dropdownAdminBtn) {
                    if (USER_ID === 'admin' || (usuarios[USER_ID] && usuarios[USER_ID].esAdmin)) {
                        dropdownAdminBtn.style.display = 'flex';
                    } else {
                        dropdownAdminBtn.style.display = 'none';
                    }
                }
            } else {
                console.log('❌ Login fallido para usuario:', user);
                const loginError = document.getElementById('loginError');
                loginError.textContent = 'Usuario o contraseña incorrectos';
                loginError.style.display = 'block';
                
                // Agregar animación de shake al formulario
                const loginCard = document.querySelector('.login-card');
                loginCard.style.animation = 'none';
                setTimeout(() => {
                    loginCard.style.animation = 'errorShake 0.5s ease-in-out';
                }, 10);
                
                // Limpiar animación después
                setTimeout(() => {
                    loginCard.style.animation = '';
                }, 500);
            }
        };
    }
    
    // Escuchar cambios en la sesión compartida
    db.ref('sesionIniciada').on('value', function(snapshot) {
        console.log('📡 Cambio en sesión Firebase:', snapshot.val());
        if (snapshot.val() === true) {
            console.log('✅ Sesión activa detectada, ocultando login...');
            ocultarLogin();
            // NO duplicar la inicialización aquí - ya se hace en ocultarLogin()
        } else {
            console.log('❌ Sesión inactiva, mostrando login...');
            mostrarLogin();
        }
    });
    // NO aplicar personalización aquí - se hace después de cargar datos de Firebase
    
    // NO crear malla ni actualizar progreso aquí - se hace después de cargar datos de Firebase
    
    // NO inicializar modal de opciones aquí - se hace después de cargar datos de Firebase
    
    console.log('✅ Configuración inicial completada, esperando login...');
}); 

// --- Funciones para animaciones del desplegable ---
function cerrarDropdownConAnimacion() {
    const opcionesDropdown = document.getElementById('opcionesDropdown');
    if (opcionesDropdown && opcionesDropdown.style.display !== 'none') {
        opcionesDropdown.classList.add('closing');
        setTimeout(() => {
            opcionesDropdown.style.display = 'none';
            opcionesDropdown.classList.remove('closing');
        }, 200);
    }
}

function abrirDropdown() {
    const opcionesDropdown = document.getElementById('opcionesDropdown');
    if (opcionesDropdown) {
        opcionesDropdown.style.display = 'flex';
        opcionesDropdown.classList.remove('closing');
    }
}

// --- Menú desplegable de opciones ---
document.addEventListener('DOMContentLoaded', () => {
    // Menú desplegable de opciones
    const opcionesBtn = document.getElementById('opcionesBtn');
    const opcionesDropdown = document.getElementById('opcionesDropdown');
    const dropdownNotasBtn = document.getElementById('dropdownNotasBtn');
    const dropdownHorarioBtn = document.getElementById('dropdownHorarioBtn');
    const dropdownPersonalizacionBtn = document.getElementById('dropdownPersonalizacionBtn');
    const dropdownCerrarSesionBtn = document.getElementById('dropdownCerrarSesionBtn');
    if (opcionesBtn && opcionesDropdown) {
        opcionesBtn.onclick = (e) => {
            e.stopPropagation();
            if (opcionesDropdown.style.display === 'none') {
                abrirDropdown();
            } else {
                cerrarDropdownConAnimacion();
            }
        };
        document.addEventListener('click', (e) => {
            if (opcionesDropdown.style.display !== 'none') {
                cerrarDropdownConAnimacion();
            }
        });
        opcionesDropdown.onclick = (e) => e.stopPropagation();
    }
    if (dropdownNotasBtn) dropdownNotasBtn.onclick = () => {
        if (typeof downloadNotasPDF === 'function') downloadNotasPDF();
        cerrarDropdownConAnimacion();
    };
    if (dropdownHorarioBtn) dropdownHorarioBtn.onclick = () => {
        const horarioModal = document.getElementById('horarioVisualModal');
        if (horarioModal) horarioModal.classList.add('active');
        renderHorarioVisualSection();
        cerrarDropdownConAnimacion();
    };
    if (dropdownPersonalizacionBtn) dropdownPersonalizacionBtn.onclick = () => {
        const personalizacionPanel = document.getElementById('personalizacionPanel');
        if (personalizacionPanel) {
            personalizacionPanel.style.display = 'flex';
            cargarOpcionesActuales();
        }
        cerrarDropdownConAnimacion();
    };
    if (dropdownCerrarSesionBtn) dropdownCerrarSesionBtn.onclick = () => {
        cerrarSesion();
        cerrarDropdownConAnimacion();
    };
    
    // Panel de administración (solo para admin)
    const dropdownAdminBtn = document.getElementById('dropdownAdminBtn');
    const adminPanel = document.getElementById('adminPanel');
    const crearCuentaBtn = document.getElementById('crearCuentaBtn');
    const cerrarAdminBtn = document.getElementById('cerrarAdminBtn');
    const adminError = document.getElementById('adminError');
    
    // Mostrar botón de administración para admin y cuentas con esAdmin
    if (dropdownAdminBtn) {
        if (USER_ID === 'admin' || (usuarios[USER_ID] && usuarios[USER_ID].esAdmin)) {
            dropdownAdminBtn.style.display = 'flex';
        } else {
            dropdownAdminBtn.style.display = 'none';
        }
    }
    
    if (dropdownAdminBtn) dropdownAdminBtn.onclick = () => {
        if (adminPanel) {
            adminPanel.style.display = 'flex';
        }
        cerrarDropdownConAnimacion();
    };
    
    if (crearCuentaBtn && adminPanel) {
        crearCuentaBtn.onclick = (e) => {
            e.preventDefault();
            const nombre = document.getElementById('adminNombre').value.trim();
            const carrera = document.getElementById('adminCarrera').value;
            const usuario = document.getElementById('adminUsuario').value.trim();
            const password = document.getElementById('adminPassword').value;
            const esAdmin = document.getElementById('adminIsAdmin').checked;
            
            if (!nombre || !carrera || !usuario || !password) {
                adminError.textContent = 'Todos los campos son obligatorios';
                adminError.style.display = 'block';
                return;
            }
            
            const resultado = crearNuevaCuenta(usuario, password, nombre, carrera, esAdmin);
            
            if (resultado.success) {
                adminError.style.display = 'none';
                showToast(resultado.message);
                // Limpiar formulario
                document.getElementById('adminNombre').value = '';
                document.getElementById('adminCarrera').value = '';
                document.getElementById('adminUsuario').value = '';
                document.getElementById('adminPassword').value = '';
                document.getElementById('adminIsAdmin').checked = false;
            } else {
                adminError.textContent = resultado.message;
                adminError.style.display = 'block';
            }
        };
    }
    
    // Botón ver cuentas
    const verCuentasBtn = document.getElementById('verCuentasBtn');
    const cuentasModal = document.getElementById('cuentasModal');
    const closeCuentasModalBtn = document.getElementById('closeCuentasModalBtn');
    
    if (verCuentasBtn && cuentasModal) {
        verCuentasBtn.onclick = () => {
            mostrarCuentasCreadas();
            cuentasModal.style.display = 'flex';
            cerrarDropdownConAnimacion(); // Cerrar el dropdown al abrir el modal de cuentas
        };
    }
    
    if (closeCuentasModalBtn && cuentasModal) {
        closeCuentasModalBtn.onclick = () => {
            cuentasModal.style.display = 'none';
        };
    }
    
    // Cerrar modal de cuentas al hacer clic fuera
    if (cuentasModal) {
        cuentasModal.onclick = (e) => {
            if (e.target === cuentasModal) {
                cuentasModal.style.display = 'none';
            }
        };
    }
    
    if (cerrarAdminBtn && adminPanel) {
        cerrarAdminBtn.onclick = () => {
            adminPanel.style.display = 'none';
        };
    }
    
    // Cerrar panel de administración al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (adminPanel && adminPanel.style.display !== 'none') {
            if (!adminPanel.contains(e.target)) {
                adminPanel.style.display = 'none';
            }
        }
    });
    
    // Panel de personalización
    const personalizacionPanel = document.getElementById('personalizacionPanel');
    const guardarOpcionesBtn = document.getElementById('guardarOpcionesBtn');
    
    // Cerrar panel al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (personalizacionPanel && personalizacionPanel.style.display !== 'none') {
            if (!personalizacionPanel.contains(e.target)) {
                personalizacionPanel.style.display = 'none';
            }
        }
    });
    
    // Guardar cambios de personalización
    if (guardarOpcionesBtn && personalizacionPanel) {
        guardarOpcionesBtn.onclick = (e) => {
            e.preventDefault();
            guardarOpciones();
            personalizacionPanel.style.display = 'none';
        };
    }
    
    // Botón de horario clásico
    const horarioBtn = document.getElementById('toggleHorarioBtn');
    const horarioModal = document.getElementById('horarioVisualModal');
    const closeHorarioBtn = document.getElementById('closeHorarioModalBtn');
    if (horarioBtn && horarioModal && closeHorarioBtn) {
        horarioBtn.addEventListener('click', () => {
            horarioModal.classList.add('active');
    renderHorarioVisualSection();
        });
        closeHorarioBtn.addEventListener('click', () => {
            horarioModal.classList.remove('active');
        });
        horarioModal.addEventListener('click', (e) => {
            if (e.target === horarioModal) {
                horarioModal.classList.remove('active');
            }
        });
    }
    
    // Botón de horario desde menú desplegable
    if (dropdownHorarioBtn) dropdownHorarioBtn.onclick = () => {
        const horarioModal = document.getElementById('horarioVisualModal');
        if (horarioModal) {
            horarioModal.classList.add('active');
            renderHorarioVisualSection();
        }
        cerrarDropdownConAnimacion();
    };
}); 
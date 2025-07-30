// Variables globales - Inicializar con valores por defecto
let carreraActual = 'Medicina Veterinaria';
let colorActual = configuracion.colores[0];
let fuenteActual = configuracion.fuentes[0];
let completedCourses = new Set();
let courseGrades = {};

// Detectar si es un dispositivo táctil
const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Variable global para el estado táctil
const touchState = {
    isTouchDevice: isTouchDevice(),
    isDragging: false,
    draggedElement: null,
    touchStartTime: 0,
    touchStartX: 0,
    touchStartY: 0
};

// Función para mostrar mensajes toast
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Función para manejar eventos táctiles de manera consistente
function handleTouchEvent(event, callback) {
    if (touchState.isTouchDevice) {
        event.preventDefault();
        callback(event);
    }
}

// Función para mejorar la precisión del drop en dispositivos táctiles
function getTouchPosition(event) {
    const touch = event.touches ? event.touches[0] : event.changedTouches[0];
    return {
        x: touch.clientX,
        y: touch.clientY
    };
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
    
    // Actualizar footer
    const footer = document.getElementById('footerText');
    if (footer) footer.textContent = `© 2025 Malla Curricular - ${carreraActual}. Todos los derechos reservados.`;
    

    
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
        
        // Usar la carrera del perfil si está disponible, sino usar la del usuario
        const carreraAMostrar = carreraActual || usuario.carrera;
        
        titulo.textContent = `Malla - ${usuario.nombre} - ${carreraAMostrar}`;
        
        // Actualizar el nombre en el botón de perfil
        if (nombreUsuario) {
            nombreUsuario.textContent = usuario.nombre;
        }
        
        // Solo actualizar carreraActual si no se ha cargado desde el perfil
        if (!carreraActual) {
        carreraActual = usuario.carrera;
    }
}

    // Actualizar visibilidad del botón de administración
    actualizarVisibilidadAdmin();
}

// Función centralizada para manejar la visibilidad del botón de administración
function actualizarVisibilidadAdmin() {
    const dropdownAdminBtn = document.getElementById('dropdownAdminBtn');
    if (dropdownAdminBtn) {
        // BLOQUEAR COMPLETAMENTE EL ACCESO A ADMINISTRACIÓN PARA LA CUENTA ADMIN
        if (USER_ID === 'admin') {
            dropdownAdminBtn.style.display = 'none';
        } else if (usuarios[USER_ID] && usuarios[USER_ID].esAdmin) {
            dropdownAdminBtn.style.display = 'flex';
        } else {
            dropdownAdminBtn.style.display = 'none';
        }
    }
}


let USER_ID = localStorage.getItem('currentUser') || null; // Recuperar usuario de localStorage

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
    return db.ref('usuarios').once('value').then(snap => {
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
            
            // BLOQUEAR COMPLETAMENTE EL AUTO-LOGIN DE LA CUENTA ADMIN
            if (savedUser === 'admin') {
                console.log('⚠️ Intento de auto-login con cuenta admin bloqueado.');
                localStorage.removeItem('currentUser');
                return;
            }
            
            // Verificar si el usuario es administrador
            const esAdmin = usuarios[savedUser].esAdmin;
            
            // Si es administrador, verificar si hay otros administradores
            if (esAdmin) {
                const otrosAdmins = Object.keys(usuarios).filter(uid => 
                    uid !== savedUser && uid !== 'admin' && usuarios[uid] && usuarios[uid].esAdmin
                );
                
                if (otrosAdmins.length > 0) {
                    console.log('⚠️ Usuario administrador encontrado pero hay otros administradores. No se hará auto-login.');
                    // Limpiar el usuario guardado para forzar login manual
                    localStorage.removeItem('currentUser');
                    return;
                }
            }
            
            // Si no es administrador o no hay otros administradores, proceder con auto-login
            USER_ID = savedUser;
            
            // Verificar si el login no se ha mostrado aún
            const loginContainer = document.getElementById('loginContainer');
            if (loginContainer && loginContainer.classList.contains('show')) {
                console.log('✅ Iniciando sesión automática...');
                iniciarSesionCompartida();
            }
        }
        
        return usuarios; // Devolver los usuarios cargados
    });
}

function guardarPerfilEnFirebase() {
    if (!USER_ID || USER_ID === 'admin') {
        return;
    }
    
    const datosAGuardar = {
        carreraActual,
        colorActual,
        fuenteActual,
        completedCourses: Array.from(completedCourses),
        courseGrades,
        horario: horarioVisualData,
        semestreSeleccionado: semestreVisualSeleccionado,
        modoEdicion: modoEdicionHorario
    };
    
    db.ref('perfiles/' + USER_ID).set(datosAGuardar).catch((error) => {
        console.error('Error al guardar perfil en Firebase:', error);
    });
}
function cargarPerfilDeFirebase(callback) {
    if (!USER_ID) {
        if (callback) callback();
        return;
    }
    
    db.ref('perfiles/' + USER_ID).once('value').then(snap => {
        const data = snap.val();
        
        if (data) {
            const carreraAnterior = carreraActual;
            carreraActual = data.carreraActual || carreraActual;
            colorActual = data.colorActual || colorActual;
            fuenteActual = data.fuenteActual || fuenteActual;

            completedCourses = new Set(data.completedCourses || []);
            courseGrades = data.courseGrades || {};
            
            // Cargar horario desde el mismo perfil
            if (data.horario) {
                horarioVisualData = data.horario;
                semestreVisualSeleccionado = data.semestreSeleccionado || 1;
                modoEdicionHorario = data.modoEdicion || false;
            } else {
                horarioVisualData = [];
                semestreVisualSeleccionado = 1;
                modoEdicionHorario = false;
            }
        }
        
        if (callback) callback();
    }).catch((error) => {
        console.error('Error al cargar perfil desde Firebase:', error);
        
        // Usar valores por defecto si falla la carga
        horarioVisualData = [];
        semestreVisualSeleccionado = 1;
        modoEdicionHorario = false;
        
        if (callback) callback();
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
        // NO llamar renderHorarioVisualSection() aquí para evitar que se abra automáticamente
        
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


const HORARIO_VISUAL_KEY = 'horarioVisualRamos';

// Variable global para almacenar el horario del usuario actual
let horarioVisualData = [];

function getHorarioVisualData() {
    // Asegurar que siempre devuelva un array válido
    if (!horarioVisualData || !Array.isArray(horarioVisualData)) {
        horarioVisualData = [];
    }
    return horarioVisualData;
}

function saveHorarioVisualData(data) {
    if (!USER_ID || USER_ID === 'admin') {
        return;
    }
    
    if (!data || !Array.isArray(data)) {
        return;
    }
    
    horarioVisualData = data;
    guardarPerfilEnFirebase();
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
        guardarPerfilEnFirebase();
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
            guardarPerfilEnFirebase();
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
    
    // Verificar si no hay materias disponibles
    if (materiasDisponibles.length === 0) {
        // Si no hay materias no aprobadas, mostrar todas las materias del semestre para permitir arrastrar de vuelta
        const todasLasMaterias = semestre.courses;
        
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
            configurarDragAndDrop(section, todasLasMaterias, horarioData, horarioDataAll, modoEdicionHorario);
        }
        
        return;
    }
    
    // Verificar si hay alguna materia asignada en el horario
    const horarioDataAll = getHorarioVisualData();
    console.log('🔄 Horario actual:', horarioDataAll);
    let horarioData = horarioDataAll.find(h => h.semestre === semestreVisualSeleccionado);
    if (!horarioData) {
        horarioData = { semestre: semestreVisualSeleccionado, bloques: [] };
        horarioDataAll.push(horarioData);
        console.log('📝 Creando nuevo semestre en horario:', semestreVisualSeleccionado);
        // Guardar siempre para asegurar persistencia
        saveHorarioVisualData(horarioDataAll);
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
    
    // Configurar drag & drop
    if (modoEdicionHorario) {
        configurarDragAndDrop(section, materiasDisponibles, horarioData, horarioDataAll, modoEdicionHorario);
    }
    function configurarDragAndDrop(section, materiasDisponibles, horarioData, horarioDataAll, modoEdicionHorario) {
        console.log('🚀 Configurando drag and drop - modoEdicionHorario:', modoEdicionHorario);
        
        const deleteZone = document.getElementById('deleteZone');
        let draggedElement = null;
        let isDragging = false;
        let touchStartX = 0;
        let touchStartY = 0;
        let ghostElement = null;
        let currentMateriaId = null;
        let currentFromList = false;
        
        // Función para manejar el drop
        function handleDrop(target, materiaId, fromList) {
            console.log('🎯 handleDrop llamado con:', { target, materiaId, fromList });
            
            // Obtener materias disponibles del contexto actual
            const datosCarrera = obtenerDatosCarrera();
            if (!datosCarrera || !datosCarrera.malla) {
                showToast('Error: No hay datos de carrera disponibles');
                return;
            }
            
            const mallaData = convertirMallaASemestres(datosCarrera.malla);
            const semestre = mallaData[semestreVisualSeleccionado-1];
            if (!semestre) {
                showToast('Error: Semestre no válido');
                return;
            }
            
            // Recrear la lógica de materias disponibles
            function prereqsAprobados(course) {
                return course.prerequisites.length === 0 || course.prerequisites.every(pr => completedCourses.has(pr));
            }
            
            const materiasSemestre = semestre.courses.filter(c => !completedCourses.has(c.id) && prereqsAprobados(c));
            
            let materiasPrevias = [];
            const semestreActualEsImpar = semestreVisualSeleccionado % 2 === 1;
            
            for (let s = 0; s < semestreVisualSeleccionado-1; s++) {
                const semestreEsImpar = (s + 1) % 2 === 1;
                if (semestreEsImpar === semestreActualEsImpar) {
                    mallaData[s].courses.forEach(c => {
                        if (!completedCourses.has(c.id) && prereqsAprobados(c)) {
                            if (!materiasPrevias.some(m => m.id === c.id)) materiasPrevias.push(c);
                        }
                    });
                }
            }
            
            const materiasDisponibles = [...materiasPrevias, ...materiasSemestre];
            
            if (!materiasDisponibles.some(m => m.id === materiaId)) {
                console.log('❌ Materia no permitida:', materiaId);
                const tipoSemestre = semestreVisualSeleccionado % 2 === 1 ? 'impar' : 'par';
                showToast(`Esta materia no está disponible para cursar en semestres ${tipoSemestre}es`);
                return;
            }
            
            // Obtener datos del horario
            const horarioDataAll = getHorarioVisualData();
            let horarioData = horarioDataAll.find(h => h.semestre === semestreVisualSeleccionado);
            if (!horarioData) {
                horarioData = { semestre: semestreVisualSeleccionado, bloques: [] };
                horarioDataAll.push(horarioData);
            }
            
            // Asegurar que bloques existe
            if (!horarioData.bloques) {
                horarioData.bloques = [];
            }
            
            const materiaEnEsteBloque = horarioData.bloques.find(h => 
                h.dia === target.dataset.dia && 
                h.inicio === target.dataset.inicio && 
                h.fin === target.dataset.fin
            );
            
            if (materiaEnEsteBloque) {
                console.log('🔄 Reemplazando materia en bloque existente');
                materiaEnEsteBloque.materia = materiaId;
            } else {
                console.log('➕ Agregando nueva materia al bloque');
                horarioData.bloques.push({ 
                    materia: materiaId, 
                    dia: target.dataset.dia, 
                    inicio: target.dataset.inicio, 
                    fin: target.dataset.fin 
                });
            }
            
            console.log('💾 Guardando horario...');
            saveHorarioVisualData(horarioDataAll);
            console.log('✅ Horario guardado');
            
            console.log('🔄 Re-renderizando sección...');
            renderHorarioVisualSection();
            console.log('✅ Sección re-renderizada');
            
            showToast('Materia asignada correctamente');
        }
        
        // Función para manejar la eliminación
        function handleDelete(materiaId, fromList) {
            console.log('🗑️ handleDelete llamado con:', { materiaId, fromList });
            
            if (!fromList) {
                const materiaAsignada = document.querySelector(`.materia-asignada[data-materia-id="${materiaId}"]`);
                if (materiaAsignada) {
                    const parent = materiaAsignada.closest('.bloque-horario');
                    if (parent) {
                        const dia = parent.dataset.dia, inicio = parent.dataset.inicio, fin = parent.dataset.fin;
                        
                        // Obtener datos del horario
                        const horarioDataAll = getHorarioVisualData();
                        let horarioData = horarioDataAll.find(h => h.semestre === semestreVisualSeleccionado);
                        if (!horarioData) {
                            horarioData = { semestre: semestreVisualSeleccionado, bloques: [] };
                            horarioDataAll.push(horarioData);
                        }
                        
                        // Asegurar que bloques existe
                        if (!horarioData.bloques) {
                            horarioData.bloques = [];
                        }
                        
                        const idx = horarioData.bloques.findIndex(h => h.materia === materiaId && h.dia === dia && h.inicio === inicio && h.fin === fin);
                        if (idx !== -1) {
                            console.log('🗑️ Eliminando materia del índice:', idx);
                            horarioData.bloques.splice(idx, 1);
                            
                            console.log('💾 Guardando horario...');
                            saveHorarioVisualData(horarioDataAll);
                            console.log('✅ Horario guardado');
                            
                            console.log('🔄 Re-renderizando sección...');
                            renderHorarioVisualSection();
                            console.log('✅ Sección re-renderizada');
                            
                            showToast('Materia eliminada del horario');
                        }
                    }
                }
            } else {
                showToast('Las materias de la lista no se pueden eliminar');
            }
        }
        
        // Función para crear elemento fantasma
        function createGhostElement(originalElement) {
            const ghost = originalElement.cloneNode(true);
            ghost.classList.add('dragging-ghost');
            ghost.style.position = 'fixed';
            ghost.style.zIndex = '10000';
            ghost.style.pointerEvents = 'none';
            ghost.style.opacity = '0.8';
            ghost.style.transform = 'scale(1.1)';
            ghost.style.transition = 'none';
            document.body.appendChild(ghost);
            return ghost;
        }
        
        // Función para limpiar drag
        function clearDrag() {
            if (ghostElement) {
                ghostElement.remove();
                ghostElement = null;
            }
            if (draggedElement) {
                draggedElement.classList.remove('dragging');
                draggedElement = null;
            }
            isDragging = false;
            currentMateriaId = null;
            currentFromList = false;
            
            // Limpiar clases de hover
            section.querySelectorAll('.bloque-horario').forEach(block => {
                block.classList.remove('drop-hover', 'drag-hover');
            });
            deleteZone.classList.remove('show', 'hover');
            document.querySelectorAll('.dragging-over-delete').forEach(el => {
                el.classList.remove('dragging-over-delete');
            });
        }
        
        // Configurar eventos para materias draggables (mouse y touch)
        section.querySelectorAll('.materia-draggable').forEach(el => {
            // Eventos de mouse (drag & drop tradicional)
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
        
            // Sistema de drag and drop táctil para móviles
            el.addEventListener('touchstart', function(e) {
                if (!modoEdicionHorario) return;
                
            e.preventDefault();
                
                const touch = e.touches[0];
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                
                currentMateriaId = this.dataset.materiaId;
                currentFromList = true;
                
                console.log('👆 Iniciando drag táctil para materia:', currentMateriaId);
                
                // Crear elemento fantasma
                ghostElement = createGhostElement(this);
                ghostElement.style.left = touchStartX - 25 + 'px';
                ghostElement.style.top = touchStartY - 25 + 'px';
                
                // Marcar como arrastrando
                this.classList.add('dragging');
                isDragging = true;
                draggedElement = this;
                
                // Mostrar zona de eliminación
                deleteZone.classList.add('show');
                
            }, { passive: false });
        });
        
        // Configurar eventos para materias asignadas (mouse y touch)
        section.querySelectorAll('.materia-asignada').forEach(el => {
            // Eventos de mouse (drag & drop tradicional)
            el.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', el.dataset.materiaId);
                e.dataTransfer.setData('from-list', 'false');
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
            
            // Sistema de drag and drop táctil para móviles
            el.addEventListener('touchstart', function(e) {
                if (!modoEdicionHorario) return;
                
                e.preventDefault();
                
                const touch = e.touches[0];
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                
                currentMateriaId = this.dataset.materiaId;
                currentFromList = false;
                
                console.log('👆 Iniciando drag táctil para materia asignada:', currentMateriaId);
                
                // Crear elemento fantasma
                ghostElement = createGhostElement(this);
                ghostElement.style.left = touchStartX - 25 + 'px';
                ghostElement.style.top = touchStartY - 25 + 'px';
                
                // Marcar como arrastrando
                this.classList.add('dragging');
                isDragging = true;
                draggedElement = this;
                
                // Mostrar zona de eliminación
                deleteZone.classList.add('show');
                
            }, { passive: false });
        });
        
        // Eventos táctiles globales para el drag
        document.addEventListener('touchmove', function(e) {
            if (!isDragging || !ghostElement) return;
            
                e.preventDefault();
            
            const touch = e.touches[0];
            const currentX = touch.clientX;
            const currentY = touch.clientY;
            
            // Mover elemento fantasma
            ghostElement.style.left = currentX - 25 + 'px';
            ghostElement.style.top = currentY - 25 + 'px';
            
            // Encontrar elemento bajo el dedo
            const elementUnderTouch = document.elementFromPoint(currentX, currentY);
            
            // Limpiar hover anterior
            section.querySelectorAll('.bloque-horario').forEach(block => {
                block.classList.remove('drop-hover', 'drag-hover');
            });
            deleteZone.classList.remove('hover');
            document.querySelectorAll('.dragging-over-delete').forEach(el => {
                el.classList.remove('dragging-over-delete');
            });
            
            // Verificar si está sobre un bloque del horario
            if (elementUnderTouch && elementUnderTouch.classList.contains('bloque-horario') && !elementUnderTouch.classList.contains('ventana')) {
                elementUnderTouch.classList.add('drop-hover');
                if (draggedElement) {
                    draggedElement.classList.add('dragging-over-delete');
                }
            }
            
            // Verificar si está sobre la zona de eliminación
            if (elementUnderTouch && elementUnderTouch.id === 'deleteZone') {
                deleteZone.classList.add('hover');
                if (draggedElement) {
                    draggedElement.classList.add('dragging-over-delete');
                }
            }
            
        }, { passive: false });
        
        document.addEventListener('touchend', function(e) {
            if (!isDragging || !ghostElement) return;
                
                e.preventDefault();
                
            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            
            // Encontrar elemento donde se soltó
            const dropTarget = document.elementFromPoint(endX, endY);
            
            if (dropTarget) {
                // Si se soltó en un bloque del horario
                if (dropTarget.classList.contains('bloque-horario') && !dropTarget.classList.contains('ventana')) {
                    console.log('🎯 Drop en bloque:', dropTarget.dataset.dia, dropTarget.dataset.inicio);
                    handleDrop(dropTarget, currentMateriaId, currentFromList);
                }
                // Si se soltó en la zona de eliminación
                else if (dropTarget.id === 'deleteZone') {
                    console.log('🗑️ Drop en zona de eliminación');
                    handleDelete(currentMateriaId, currentFromList);
                }
                // Si se soltó en la lista de materias
                else if (dropTarget.closest('.horario-materias-lista')) {
                    console.log('🗑️ Drop en lista de materias');
                    // Solo eliminar si viene del horario (no de la lista)
                    if (!currentFromList) {
                        handleDelete(currentMateriaId, currentFromList);
                    }
                }
            }
            
            // Limpiar drag
            clearDrag();
            
        }, { passive: false });
        
        // Configurar eventos para bloques de horario (mouse y touch)
        section.querySelectorAll('.bloque-horario:not(.ventana)').forEach(bloque => {
            console.log('🔧 Configurando eventos para bloque:', bloque.dataset.dia, bloque.dataset.inicio);
            
            // Eventos de mouse
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
                handleDrop(bloque, materiaId, fromList);
            });
        });
        
        // Hacer que la lista de materias también sea una zona de drop para eliminar
        const listaMaterias = section.querySelector('.horario-materias-lista');
        if (listaMaterias) {
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
                    console.log('🗑️ Eliminando materia del horario al arrastrar a la lista:', materiaId);
                    handleDelete(materiaId, fromList);
                }
            });
        }
        
        // Configurar zona de eliminación
        if (deleteZone) {
            // Eventos de mouse para zona de eliminación
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
            deleteZone.classList.add('success');
            
            // Remover feedback visual
            document.querySelectorAll('.dragging-over-delete').forEach(el => {
                el.classList.remove('dragging-over-delete');
            });
            
            // Obtener la materia que se está arrastrando
            const materiaId = e.dataTransfer.getData('text/plain');
                const fromList = e.dataTransfer.getData('from-list') === 'true';
                
                // Usar la función handleDelete que ya tiene la lógica correcta
                handleDelete(materiaId, fromList);
            
            // Ocultar zona de eliminación después de la animación
            setTimeout(() => {
                deleteZone.classList.remove('show', 'success');
            }, 500);
        });
        }
    }
}

// Función para cerrar el modal de horario
function cerrarHorario() {
    console.log('Función cerrarHorario() ejecutada');
    const horarioModal = document.getElementById('horarioVisualModal');
    if (horarioModal) {
        horarioModal.classList.remove('active');
        console.log('Modal de horario cerrado exitosamente');
        
        // Forzar el cierre en móvil si es necesario
        setTimeout(() => {
            if (horarioModal.classList.contains('active')) {
                horarioModal.classList.remove('active');
                console.log('Cierre forzado del modal en móvil');
            }
        }, 100);
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
    
    // VERIFICACIÓN DE SEGURIDAD: Si es admin, cerrar sesión instantáneamente
    if (USER_ID === 'admin') {
        console.log('⚠️ Detección de sesión admin al ocultar login - cerrando instantáneamente...');
        showToast('Acceso denegado: Cuenta de administrador deshabilitada');
        setTimeout(() => {
            cerrarSesion();
        }, 1000);
        return;
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

// Función de prueba para verificar conexión a Firebase




// --- INICIO DE SESIÓN COMPARTIDA ---
function iniciarSesionCompartida() {
    // No cambiar sesionIniciada para evitar afectar a otros usuarios
    // db.ref('sesionIniciada').set(true);
    // inicializarAplicacion(); // Ya no es necesario, se llama desde ocultarLogin()
}

function cerrarSesion() {
    // Guardar el perfil del usuario actual antes de cerrar sesión
    const usuarioActual = USER_ID;
    if (usuarioActual && usuarioActual !== 'admin') {
        guardarPerfilEnFirebase();
    }
    
    // Limpiar localStorage
    localStorage.removeItem('currentUser');
    USER_ID = 'admin'; // Volver al usuario por defecto
    
    // Limpiar horario y preferencias para el usuario por defecto
    horarioVisualData = [];
    semestreVisualSeleccionado = 1;
    modoEdicionHorario = false;
    
    // Guardar el estado limpio en Firebase para el usuario por defecto
    const perfilAdmin = {
        carreraActual: 'Ingeniería Civil',
        colorActual: { nombre: 'Azul', primary: '#2196F3', secondary: '#1976D2' },
        fuenteActual: { nombre: 'Roboto', family: 'Roboto, sans-serif' },
        completedCourses: [],
        courseGrades: {},
        horario: [],
        semestreSeleccionado: 1,
        modoEdicion: false
    };
    db.ref('perfiles/' + USER_ID).set(perfilAdmin).catch((error) => {
        console.error('Error al guardar estado limpio en Firebase:', error);
    });
    
    // Desactivar tooltips de prerrequisitos
    tooltipsPrereqHabilitados = false;
    
    // Remover clase para ocultar elementos hasta la próxima carga
    document.body.classList.remove('datos-cargados');
    // No cambiar sesionIniciada para evitar afectar a otros usuarios
    // db.ref('sesionIniciada').set(false);
    
    // Mostrar login
    mostrarLogin();
}

// Función para borrar una cuenta
function borrarCuenta(usuarioId) {
    if (confirm(`¿Estás seguro de que quieres borrar la cuenta de usuario "${usuarioId}"? Esta acción no se puede deshacer.`)) {
        db.ref('usuarios/' + usuarioId).remove()
            .then(() => {
                showToast(`Cuenta de usuario "${usuarioId}" borrada.`);
                cargarUsuariosDesdeFirebase(); // Recargar la lista de cuentas
                mostrarCuentasCreadas(); // Actualizar la visualización
            })
            .catch(error => {
                console.error('Error al borrar cuenta de usuario:', error);
                showToast('Error al borrar la cuenta.');
            });
    }
}

// Función de inicialización que carga datos de Firebase
function inicializarAplicacion() {
    // VERIFICACIÓN DE SEGURIDAD: Si es admin, cerrar sesión instantáneamente
    if (USER_ID === 'admin') {
        console.log('⚠️ Detección de sesión admin durante inicialización - cerrando instantáneamente...');
        showToast('Acceso denegado: Cuenta de administrador deshabilitada');
        setTimeout(() => {
            cerrarSesion();
        }, 1000);
        return;
    }
    
    // Asegurar que el modal del horario esté cerrado al inicializar
    const horarioModal = document.getElementById('horarioVisualModal');
    if (horarioModal) {
        horarioModal.classList.remove('active');
    }
    
    // Cargar perfil de Firebase
    cargarPerfilDeFirebase(() => {
        // Primero actualizar el título y footer con la información correcta del usuario
        actualizarTituloUsuario();
        
        // Asegurar que la visibilidad del botón de administración esté correcta
        actualizarVisibilidadAdmin();
        
        // Luego aplicar personalización
        aplicarPersonalizacion();
        
        // Pequeño delay para asegurar que los estilos se apliquen
        setTimeout(() => {
            createMalla();
            updateProgress();
            
            // Actualizar estados de cursos después de crear la malla
            setTimeout(() => {
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
            }, 50);
            
            // Inicializar componentes
            try {
                inicializarModalOpciones();
            } catch (error) {
                console.log('Error al inicializar modal de opciones:', error.message);
            }
            
            try {
                renderSelectorSemestreVisual();
                // NO llamar renderHorarioVisualSection() aquí para evitar que se abra automáticamente
            } catch (error) {
                console.log('Error al renderizar selector de semestre:', error.message);
            }
            
            // Habilitar tooltips de prerrequisitos después de 2 segundos
            habilitarTooltipsPrereq();
            
            // Asegurar que la visibilidad del botón de administración esté correcta después de toda la inicialización
            actualizarVisibilidadAdmin();
            
            // Mostrar el contenido principal solo cuando todo esté listo
            const mainContainer = document.getElementById('mainContainer');
            if (mainContainer) {
                mainContainer.style.visibility = 'visible';
                // Añadir clase para la transición suave
                setTimeout(() => {
                    mainContainer.classList.add('loaded');
                }, 10);
            }
        }, 100);
    });
    
    // Asegurar que el modal del horario esté cerrado después de toda la inicialización
    setTimeout(() => {
        const horarioModal = document.getElementById('horarioVisualModal');
        if (horarioModal) {
            horarioModal.classList.remove('active');
        }
    }, 200);
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
            if (!grid) {
                showToast('No se encontró el horario para descargar');
                return;
            }
            
            try {
                console.log('Iniciando descarga del horario...');
                
                // Mostrar indicador de carga
                descargarHorarioJpgBtn.textContent = 'Descargando...';
                descargarHorarioJpgBtn.disabled = true;
                
                // Verificar que hay clases en el horario
                const bloquesConClases = Array.from(grid.querySelectorAll('.bloque-horario')).filter(bloque => 
                    bloque.querySelector('.materia-asignada')
                );
                
                console.log('Bloques con clases encontrados:', bloquesConClases.length);
                
                if (bloquesConClases.length === 0) {
                    showToast('No hay clases en el horario para descargar');
                    return;
                }
                
                console.log('Capturando horario con html2canvas...');
                
                // Verificar si hay clases el sábado
                const bloquesSabado = Array.from(grid.querySelectorAll('.bloque-horario')).filter(bloque => 
                    bloque.dataset.dia === 'Sábado' && bloque.querySelector('.materia-asignada')
                );
                
                const tieneClasesSabado = bloquesSabado.length > 0;
                console.log('¿Tiene clases el sábado?', tieneClasesSabado);
                
                // Encontrar la última fila con clases
                const filas = Array.from(grid.querySelectorAll('tbody tr'));
                let ultimaFilaConClases = 0;
                
                for (let i = 0; i < filas.length; i++) {
                    const fila = filas[i];
                    const bloquesEnFila = fila.querySelectorAll('.bloque-horario');
                    const tieneClases = Array.from(bloquesEnFila).some(bloque => 
                        bloque.querySelector('.materia-asignada')
                    );
                    if (tieneClases) {
                        ultimaFilaConClases = i;
                    }
                }
                
                console.log('Última fila con clases:', ultimaFilaConClases);
                
                // Si no hay clases el sábado, ocultar la columna
                let columnasSabado = [];
                if (!tieneClasesSabado) {
                    console.log('Ocultando columna del sábado...');
                    
                    // Ocultar todos los elementos de la columna del sábado
                    columnasSabado = Array.from(grid.querySelectorAll('[data-dia="Sábado"]'));
                    columnasSabado.forEach(columna => {
                        columna.style.display = 'none';
                    });
                    
                    // Ocultar el header del sábado (última columna del thead)
                    const thead = grid.querySelector('thead tr');
                    if (thead) {
                        const headers = thead.querySelectorAll('th');
                        if (headers.length > 0) {
                            headers[headers.length - 1].style.display = 'none'; // Última columna (Sábado)
                        }
                    }
                    
                    // Ocultar toda la columna del sábado en el tbody
                    const tbody = grid.querySelector('tbody');
                    if (tbody) {
                        const filas = tbody.querySelectorAll('tr');
                        filas.forEach(fila => {
                            const celdas = fila.querySelectorAll('td');
                            if (celdas.length > 0) {
                                // La última celda de cada fila es la del sábado (después de la celda de hora)
                                celdas[celdas.length - 1].style.display = 'none';
                            }
                        });
                    }
                }
                
                // Ocultar filas vacías después de la última clase
                console.log('Ocultando filas vacías después de la última clase...');
                for (let i = ultimaFilaConClases + 1; i < filas.length; i++) {
                    filas[i].style.display = 'none';
                }
                
                // Esperar un momento para que se actualice el layout
                await new Promise(resolve => setTimeout(resolve, 100));
                
                // Usar html2canvas directamente en el horario original
                const canvas = await html2canvas(grid, {
                    backgroundColor: '#ffffff',
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    logging: true
                });
                
                // Restaurar la columna del sábado si se ocultó
                if (!tieneClasesSabado) {
                    console.log('Restaurando columna del sábado...');
                    
                    // Restaurar todos los elementos de la columna del sábado
                    columnasSabado.forEach(columna => {
                        columna.style.display = '';
                    });
                    
                    // Restaurar el header del sábado (última columna del thead)
                    const thead = grid.querySelector('thead tr');
                    if (thead) {
                        const headers = thead.querySelectorAll('th');
                        if (headers.length > 0) {
                            headers[headers.length - 1].style.display = ''; // Última columna (Sábado)
                        }
                    }
                    
                    // Restaurar toda la columna del sábado en el tbody
                    const tbody = grid.querySelector('tbody');
                    if (tbody) {
                        const filas = tbody.querySelectorAll('tr');
                        filas.forEach(fila => {
                            const celdas = fila.querySelectorAll('td');
                            if (celdas.length > 0) {
                                // La última celda de cada fila es la del sábado (después de la celda de hora)
                                celdas[celdas.length - 1].style.display = '';
                            }
                        });
                    }
                }
                
                // Restaurar filas vacías que se ocultaron
                console.log('Restaurando filas vacías...');
                const todasLasFilas = Array.from(grid.querySelectorAll('tbody tr'));
                todasLasFilas.forEach(fila => {
                    fila.style.display = '';
                });
                
                console.log('Canvas creado, generando imagen...');
                
                // Convertir a imagen y descargar
                const link = document.createElement('a');
                link.download = `horario_semestre_${semestreVisualSeleccionado}_${USER_ID}.jpg`;
                link.href = canvas.toDataURL('image/jpeg', 0.9);
                
                console.log('Descargando archivo...');
                link.click();
                
                showToast('Horario descargado exitosamente');
                console.log('Descarga completada');
                
            } catch (error) {
                console.error('Error al descargar horario:', error);
                showToast('Error al descargar el horario: ' + error.message);
            } finally {
                // Restaurar botón
                descargarHorarioJpgBtn.textContent = 'Descargar Horario';
                descargarHorarioJpgBtn.disabled = false;
            }
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
    // Asegurar que el modal del horario inicie cerrado
    const horarioModal = document.getElementById('horarioVisualModal');
    if (horarioModal) {
        horarioModal.classList.remove('active');
    }
    
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
    actualizarVisibilidadAdmin();
    
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
    const closeHorarioBtn = document.getElementById('closeHorarioModalBtn');
    if (horarioBtn && horarioModal && closeHorarioBtn) {
        horarioBtn.addEventListener('click', () => {
            horarioModal.classList.add('active');
    renderHorarioVisualSection();
        });
        
        // Eventos múltiples para el botón de cerrar en móvil
        closeHorarioBtn.addEventListener('click', cerrarHorario);
        closeHorarioBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            cerrarHorario();
        });
        
        // Evento adicional para móvil que funcione en todas las orientaciones
        closeHorarioBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
        });
        
        // Evento específico para móvil portrait
        closeHorarioBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const horarioModal = document.getElementById('horarioVisualModal');
            if (horarioModal) {
            horarioModal.classList.remove('active');
                console.log('Modal cerrado por evento de clic en móvil');
            }
        });
        
        // Evento de clic fuera del modal para cerrar
        horarioModal.addEventListener('click', (e) => {
            if (e.target === horarioModal) {
                horarioModal.classList.remove('active');
            }
        });
        
        // Evento de toque fuera del modal para cerrar en móvil
        horarioModal.addEventListener('touchend', (e) => {
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
    
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('currentUser');
    console.log('🔄 Usuario guardado en localStorage:', savedUser);
    
    // Cargar usuarios desde Firebase primero
    cargarUsuariosDesdeFirebase().then(() => {
        // Verificar si hay sesión válida
        if (savedUser && savedUser !== 'admin' && usuarios[savedUser]) {
            // Hay sesión válida, establecer USER_ID y cargar aplicación
            console.log('✅ Sesión válida encontrada, cargando aplicación...');
            USER_ID = savedUser;
            ocultarLogin();
            inicializarAplicacion();
        } else if (savedUser === 'admin' && usuarios['admin']) {
            // Verificar si se puede usar admin (solo si no hay otros administradores)
            const otrosAdmins = Object.keys(usuarios).filter(uid => 
                uid !== 'admin' && usuarios[uid] && usuarios[uid].esAdmin
            );
            
            if (otrosAdmins.length === 0) {
                // No hay otros administradores, permitir usar admin
                console.log('✅ Usando cuenta admin por defecto...');
                USER_ID = 'admin';
                ocultarLogin();
                inicializarAplicacion();
            } else {
                // Hay otros administradores, no permitir admin por defecto
                console.log('❌ Admin por defecto deshabilitado, hay otros administradores');
                localStorage.removeItem('currentUser');
                USER_ID = null;
                mostrarLogin();
            }
        } else {
            // No hay sesión válida, mostrar login
            console.log('❌ No hay sesión válida, mostrando login...');
            if (savedUser) {
                localStorage.removeItem('currentUser');
            }
            USER_ID = null;
            mostrarLogin();
        }
    }).catch((error) => {
        // Error al cargar usuarios, mostrar login
        console.error('❌ Error al cargar usuarios:', error);
        if (savedUser) {
            localStorage.removeItem('currentUser');
        }
        USER_ID = null;
        mostrarLogin();
    });
    
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
                // BLOQUEAR COMPLETAMENTE EL ACCESO A LA CUENTA ADMIN
                if (user === 'admin') {
                    const loginError = document.getElementById('loginError');
                    loginError.textContent = 'La cuenta de administrador está deshabilitada. Use una cuenta de usuario válida.';
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
                
                // Guardar el perfil del usuario anterior antes de cambiar (incluye horario)
                const usuarioAnterior = USER_ID;
                if (usuarioAnterior && usuarioAnterior !== user) {
                    guardarPerfilEnFirebase();
                }
                
                USER_ID = user; // Cambiar USER_ID al usuario logueado
                localStorage.setItem('currentUser', user); // Guardar en localStorage
                
                // Cargar el perfil completo del nuevo usuario (incluye horario)
                cargarPerfilDeFirebase(() => {
                    // VERIFICACIÓN ADICIONAL: Si es admin, cerrar sesión instantáneamente
                    if (USER_ID === 'admin') {
                        console.log('⚠️ Detección de sesión admin - cerrando instantáneamente...');
                        showToast('Acceso denegado: Cuenta de administrador deshabilitada');
                        setTimeout(() => {
                            cerrarSesion();
                        }, 1000); // Cerrar después de 1 segundo para mostrar el mensaje
                        return;
                    }
                    
                    // Ocultar login y mostrar la aplicación
                    ocultarLogin();
                });
                loginError.style.display = 'none';
                showToast(`¡Bienvenido, ${usuarios[user].nombre}!`);
                
                // Mostrar/ocultar botón de administración
                actualizarVisibilidadAdmin();
            } else {
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
    
    // Escuchar cambios en la sesión compartida (solo para el primer login)
    // Comentado para evitar que el cierre de sesión de un usuario afecte a otros
    /*
    db.ref('sesionIniciada').on('value', function(snapshot) {
        if (snapshot.val() === true) {
            ocultarLogin();
        } else {
            mostrarLogin();
        }
    });
    */
}); 


function cerrarDropdownConAnimacion() {
    const opcionesDropdown = document.getElementById('opcionesDropdown');
    const opcionesBtn = document.getElementById('opcionesBtn');
    
    if (opcionesDropdown && opcionesDropdown.style.display !== 'none') {
        opcionesDropdown.classList.add('closing');
        setTimeout(() => {
            opcionesDropdown.style.display = 'none';
            opcionesDropdown.classList.remove('closing');
        }, 200);
    }
    
    // Contraer el botón en desktop
    if (opcionesBtn && window.innerWidth >= 1025) {
        opcionesBtn.classList.remove('expanded');
    }
}

function abrirDropdown() {
    const opcionesDropdown = document.getElementById('opcionesDropdown');
    const opcionesBtn = document.getElementById('opcionesBtn');
    
    if (opcionesDropdown) {
        opcionesDropdown.style.display = 'flex';
        opcionesDropdown.classList.remove('closing');
    }
    
    // Expandir el botón en desktop
    if (opcionesBtn && window.innerWidth >= 1025) {
        opcionesBtn.classList.add('expanded');
    }
}

// Forzar que el modal del horario esté cerrado al cargar la página
(function() {
    const horarioModal = document.getElementById('horarioVisualModal');
    if (horarioModal) {
        horarioModal.classList.remove('active');
    }
})();

// Evento que se ejecuta inmediatamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Forzar cierre del modal del horario
    const horarioModal = document.getElementById('horarioVisualModal');
    if (horarioModal) {
        horarioModal.classList.remove('active');
    }
}, false);

// Evento que se ejecuta cuando la página se carga completamente
window.addEventListener('load', function() {
    // Forzar cierre del modal del horario
    const horarioModal = document.getElementById('horarioVisualModal');
    if (horarioModal) {
        horarioModal.classList.remove('active');
    }
}, false);

// Listener para resize de ventana - contraer botón si se hace más pequeño
window.addEventListener('resize', function() {
    const opcionesBtn = document.getElementById('opcionesBtn');
    const opcionesDropdown = document.getElementById('opcionesDropdown');
    
    if (opcionesBtn && window.innerWidth < 1025) {
        opcionesBtn.classList.remove('expanded');
    }
    
    // Si el dropdown está abierto y la ventana se hace pequeña, cerrarlo
    if (opcionesDropdown && opcionesDropdown.style.display !== 'none' && window.innerWidth < 1025) {
        cerrarDropdownConAnimacion();
    }
});

// VERIFICACIÓN PERIÓDICA DE SEGURIDAD: Detectar y cerrar sesión admin
setInterval(function() {
    if (USER_ID === 'admin') {
        console.log('⚠️ Detección periódica de sesión admin - cerrando instantáneamente...');
        showToast('Acceso denegado: Cuenta de administrador deshabilitada');
        cerrarSesion();
    }
}, 5000); // Verificar cada 5 segundos



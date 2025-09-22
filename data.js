const carreras = {
    "Medicina Veterinaria": {
        "universidad": "Universidad Bernardo O'Higgins",
        "duracion": "10 semestres",
        "malla": {
            "1er semestre": [
                { "id": "BIO101", "nombre": "Biología Celular", "prerrequisitos": [] },
                { "id": "MOR101", "nombre": "Morfología Micro y Macroscópica I", "prerrequisitos": [] },
                { "id": "MAT101", "nombre": "Matemáticas", "prerrequisitos": [] },
                { "id": "INT101", "nombre": "Introducción a la Medicina Veterinaria", "prerrequisitos": [] },
                { "id": "ING101", "nombre": "Inglés I", "prerrequisitos": [] },
                { "id": "HAB101", "nombre": "Habilidades Académicas I", "prerrequisitos": [] }
            ],
            "2do semestre": [
                { "id": "QUI201", "nombre": "Química y Bioquímica para la Vida", "prerrequisitos": ["BIO101"] },
                { "id": "MOR201", "nombre": "Morfología Micro y Macroscópica II", "prerrequisitos": ["MOR101"] },
                { "id": "GEN201", "nombre": "Genética Animal", "prerrequisitos": ["MAT101"] },
                { "id": "ZOO201", "nombre": "Zoología", "prerrequisitos": [] },
                { "id": "ING201", "nombre": "Inglés II", "prerrequisitos": ["ING101"] },
                { "id": "HAB201", "nombre": "Habilidades Académicas II", "prerrequisitos": ["HAB101"] }
            ],
            "3er semestre": [
                { "id": "FIS301", "nombre": "Fisiología y Fisiopatología I", "prerrequisitos": ["QUI201"] },
                { "id": "AGE301", "nombre": "Agentes Biológicos de Enfermedad", "prerrequisitos": [] },
                { "id": "BIO301", "nombre": "Bioestadística", "prerrequisitos": ["MAT101"] },
                { "id": "ADM301", "nombre": "Administración de Empresas", "prerrequisitos": [] },
                { "id": "ECO301", "nombre": "Ecología", "prerrequisitos": ["ZOO201"] },
                { "id": "ING301", "nombre": "Inglés III", "prerrequisitos": ["ING201"] },
                { "id": "ETI301", "nombre": "Ética y Ciudadanía", "prerrequisitos": [] }
            ],
            "4to semestre": [
                { "id": "FIS401", "nombre": "Fisiología y Fisiopatología II", "prerrequisitos": ["FIS301"] },
                { "id": "INM401", "nombre": "Inmunología General", "prerrequisitos": ["AGE301"] },
                { "id": "FOR401", "nombre": "Formulación y Evaluación de Proyectos", "prerrequisitos": ["ADM301"] },
                { "id": "INV401", "nombre": "Módulo de Investigación en Medicina Veterinaria I", "prerrequisitos": [] },
                { "id": "ING401", "nombre": "Inglés IV", "prerrequisitos": ["ING301"] },
                { "id": "RSU401", "nombre": "Responsabilidad Social Universitaria", "prerrequisitos": [] },
                { "id": "PRA401", "nombre": "Práctica Integrada I en Medicina Veterinaria", "prerrequisitos": ["MOR201"] }
            ],
            "5to semestre": [
                { "id": "PAT501", "nombre": "Patología Veterinaria", "prerrequisitos": ["FIS401"] },
                { "id": "ENF501", "nombre": "Enfermedades Infecciosas y Parasitarias", "prerrequisitos": ["INM401"] },
                { "id": "EPI501", "nombre": "Epidemiología", "prerrequisitos": ["BIO301"] },
                { "id": "NUT501", "nombre": "Nutrición y Alimentación Animal", "prerrequisitos": ["FIS401"] },
                { "id": "BIO501", "nombre": "Bioética y Bienestar Animal", "prerrequisitos": ["ECO301"] },
                { "id": "PRA501", "nombre": "Práctica Integrada II en Medicina", "prerrequisitos": ["PRA401"] }
            ],
            "6to semestre": [
                { "id": "FAR601", "nombre": "Farmacología Veterinaria", "prerrequisitos": ["FIS401"] },
                { "id": "SEM601", "nombre": "Semiología", "prerrequisitos": ["FIS401"] },
                { "id": "SAL601", "nombre": "Salud Pública Veterinaria", "prerrequisitos": ["ENF501", "EPI501"] },
                { "id": "BAS601", "nombre": "Bases de Producción Animal Sustentable", "prerrequisitos": ["NUT501"] },
                { "id": "BIO601", "nombre": "Biología y Conservación de Especies", "prerrequisitos": ["BIO501"] },
                { "id": "PRA601", "nombre": "Práctica Integrada III en Medicina", "prerrequisitos": ["PRA501"] }
            ],
            "7mo semestre": [
                { "id": "REP701", "nombre": "Reproducción y Obstetricia Animal", "prerrequisitos": ["FIS401","SEM601"] },
                { "id": "IMA701", "nombre": "Imagenología Diagnóstica", "prerrequisitos": ["SEM601"] },
                { "id": "INO701", "nombre": "Inocuidad y Calidad Alimentaria", "prerrequisitos": ["SAL601"] },
                { "id": "PRO701", "nombre": "Producción de Rumiantes", "prerrequisitos": ["BAS601"] },
                { "id": "MAN701", "nombre": "Manejo y Conservación de Fauna Silvestre", "prerrequisitos": ["BIO601"] },
                { "id": "PRA701", "nombre": "Práctica Integrada IV en Medicina", "prerrequisitos": ["PRA601"] }
            ],
            "8vo semestre": [
                { "id": "HEM801", "nombre": "Hematología y Bioquímica Clínica", "prerrequisitos": ["SEM601"] },
                { "id": "MED801", "nombre": "Medicina Interna de Animales Mayores", "prerrequisitos": ["SEM601","IMA701"] },
                { "id": "INS801", "nombre": "Inspección Veterinaria de Alimentos", "prerrequisitos": ["INO701"] },
                { "id": "PRO801", "nombre": "Producción y Patología Aviar", "prerrequisitos": ["PAT501","BAS601"] },
                { "id": "LEG801", "nombre": "Legislación y Evaluación de Impacto Ambiental", "prerrequisitos": ["MAN701"] },
                { "id": "INV801", "nombre": "Módulo de Investigación en Medicina Veterinaria II", "prerrequisitos": ["INV401"] },
                { "id": "PRA801", "nombre": "Práctica Integrada V en Medicina", "prerrequisitos": ["PRA701"] }
            ],
            "9no semestre": [
                { "id": "CIR901", "nombre": "Cirugía Veterinaria", "prerrequisitos": ["FAR601","MED801"] },
                { "id": "MED901", "nombre": "Medicina Interna de Animales Menores", "prerrequisitos": ["MED801"] },
                { "id": "INT901", "nombre": "Internado de Salud Pública", "prerrequisitos": ["INS801"] },
                { "id": "ACU901", "nombre": "Acuicultura y Patología de Peces", "prerrequisitos": ["PAT501"] },
                { "id": "INT902", "nombre": "Internado y Conservación de Biodiversidad", "prerrequisitos": ["LEG801"] },
                { "id": "TIT901", "nombre": "Trabajo de Titulación I", "prerrequisitos": [] },
                { "id": "ELE901", "nombre": "Electivo de Formación General I", "prerrequisitos": [] }
            ],
            "10mo semestre": [
                { "id": "INT1001", "nombre": "Internado Quirúrgico", "prerrequisitos": ["CIR901"] },
                { "id": "INT1002", "nombre": "Internado Medicina Interna", "prerrequisitos": ["MED901"] },
                { "id": "ELE1001", "nombre": "Electivo de Profundización", "prerrequisitos": [] },
                { "id": "INT1003", "nombre": "Internado Producción Animal", "prerrequisitos": ["ACU901"] },
                { "id": "TIT1001", "nombre": "Trabajo de Titulación II", "prerrequisitos": [] },
                { "id": "ELE1002", "nombre": "Electivo de Formación General II", "prerrequisitos": [] }
            ]
        }
    },
    "Ingeniería en Realidad Virtual y Diseño de Juegos Digitales": {
        "universidad": "Universidad Bernardo O'Higgins",
        "duracion": "8 semestres + actividad de titulación",
        "malla": {
            "1er semestre": [
                { "id": "HAB101", "nombre": "Habilidades Académicas I", "prerrequisitos": [] },
                { "id": "ING101", "nombre": "Inglés I", "prerrequisitos": [] },
                { "id": "GEO101", "nombre": "Geometría Analítica", "prerrequisitos": [] },
                { "id": "ALM101", "nombre": "Algoritmos Multimedia", "prerrequisitos": [] },
                { "id": "TEM101", "nombre": "Tecnologías Multimedial", "prerrequisitos": [] },
                { "id": "ALG101", "nombre": "Álgebra I", "prerrequisitos": [] },
            ],
            "2do semestre": [
                { "id": "HAB201", "nombre": "Habilidades Académicas II", "prerrequisitos": ["HAB101"] },
                { "id": "ING201", "nombre": "Inglés II", "prerrequisitos": ["ING101"] },
                { "id": "MAT201", "nombre": "Matemáticas Para Videojuegos", "prerrequisitos": ["GEO101"] },
                { "id": "CAL201", "nombre": "Cálculo I", "prerrequisitos": ["ALG101"] },
                { "id": "POO201", "nombre": "Programación Espacial", "prerrequisitos": ["ALM101"] },
                { "id": "PRO201", "nombre": "Producción Multimedia", "prerrequisitos": ["TEM101"] },
            ],
            "3er semestre": [
                { "id": "ETI301", "nombre": "Ética y Ciudadanía", "prerrequisitos": [] },
                { "id": "ING301", "nombre": "Inglés III", "prerrequisitos": ["ING201"] },
                { "id": "MEC301", "nombre": "Mecánica para Simulación", "prerrequisitos": [] },
                { "id": "POO301", "nombre": "POO Multimedia", "prerrequisitos": ["POO201"] },
                { "id": "EST301", "nombre": "Estructura de Datos de Animación", "prerrequisitos": ["POO201"] },
                { "id": "FUN301", "nombre": "Fundamentos de Videojuegos y Guionismo", "prerrequisitos": [] },

            ],
            "4to semestre": [

                { "id": "RES401", "nombre": "Responsabilidad Social Universitaria", "prerrequisitos": ["ETI301"] },
                { "id": "ING401", "nombre": "Inglés IV", "prerrequisitos": ["ING301"] },
                { "id": "ECO401", "nombre": "Economía", "prerrequisitos": [] },
                { "id": "GRA401", "nombre": "Gráficas Computacionales", "prerrequisitos": ["POO301"] },
                { "id": "FOT401", "nombre": "Fotografía Digital", "prerrequisitos": [] },
                { "id": "MOD401", "nombre": "Modelos de Administración de Datos", "prerrequisitos": [] },
            ],
            "5to semestre": [
                { "id": "CON501", "nombre": "Contabilidad y Costos", "prerrequisitos": [] },
                { "id": "GRA501", "nombre": "Gráficas Computacionales en Web", "prerrequisitos": [] },
                { "id": "MOD501", "nombre": "Modelado Orgánico", "prerrequisitos": ["TEM101"] },
                { "id": "SIS501", "nombre": "Sistemas Operativos y Redes", "prerrequisitos": [] },
                { "id": "LOG501", "nombre": "Lógica Digital y Hapticos", "prerrequisitos": ["POO201"] },
                { "id": "ESC501", "nombre": "Escenario de Videojuegos", "prerrequisitos": ["FUN301"] },
                { "id": "ELE501", "nombre": "Electivo de Formación General I", "prerrequisitos": [] },
            ],
            "6to semestre": [
                { "id": "INN601", "nombre": "Innovación, Emprendimiento y Sustentabilidad", "prerrequisitos": [] },
                { "id": "INT601", "nombre": "Interfaces y Experiencias Usuarios en Web", "prerrequisitos": [] },
                { "id": "PRP601", "nombre": "Producción 2D", "prerrequisitos": [] },
                { "id": "ANI601", "nombre": "Animación", "prerrequisitos": [] },
                { "id": "EFE601", "nombre": "Efectos Especiales", "prerrequisitos": [] },
                { "id": "OPT601", "nombre": "Optimización de Videojuegos", "prerrequisitos": ["ESC501"] },
                { "id": "ELE601", "nombre": "Electivo de Formación General II", "prerrequisitos": [] },
            ],
            "7mo semestre": [
                { "id": "PRE701", "nombre": "Preparación y Evaluacion de Proyectos", "prerrequisitos": ["CON501"] },
                { "id": "DES701", "nombre": "Desarrollo Web", "prerrequisitos": ["INT601"] },
                { "id": "ANI701", "nombre": "Animación Avanzada", "prerrequisitos": ["ANI601"] },
                { "id": "VID701", "nombre": "Videojuegos Mobil", "prerrequisitos": [] },
                { "id": "DIS701", "nombre": "Diseño de Videojuegos en Línea", "prerrequisitos": ["OPT601"] }
            ],
            "8vo semestre": [
                { "id": "GES801", "nombre": "Gestión de Proyectos", "prerrequisitos": ["PRE701"] },
                { "id": "ADM801", "nombre": "Administracion y Gestion del Talento Humano", "prerrequisitos": [] },
                { "id": "PRO801", "nombre": "Procesamiento de Imágenes", "prerrequisitos": [] },
                { "id": "MAR801", "nombre": "Marketing Digital", "prerrequisitos": [] },
                { "id": "REA801", "nombre": "Realidad Virtual", "prerrequisitos": ["OPT601"] },
            ],
            "actividad de titulación": [
                { "id": "ACT901", "nombre": "Actividad de Titulación", "prerrequisitos": ["PRE701"] },
                { "id": "PRA901", "nombre": "Práctica Profesional", "prerrequisitos": [] },
                { "id": "ELE901", "nombre": "Electivo de Profundización", "prerrequisitos": [] },
            ]
        }
    }
};

// Configuración de personalización
const configuracion = {
    colores: [
        { nombre: "Rosa", primario: "#fce4ec", secundario: "#f8bbd0", oscuro: "#d81b60" },
        { nombre: "Azul", primario: "#e3f2fd", secundario: "#bbdefb", oscuro: "#1976d2" },
        { nombre: "Verde", primario: "#e8f5e8", secundario: "#c8e6c9", oscuro: "#388e3c" },
        { nombre: "Púrpura", primario: "#f3e5f5", secundario: "#e1bee7", oscuro: "#7b1fa2" },
        { nombre: "Naranja", primario: "#fff3e0", secundario: "#ffcc80", oscuro: "#f57c00" },
        { nombre: "Rojo", primario: "#ffebee", secundario: "#ffcdd2", oscuro: "#d32f2f" },
        { nombre: "Amarillo", primario: "#fffde7", secundario: "#fff9c4", oscuro: "#fbc02d" },
        { nombre: "Cyan", primario: "#e0f7fa", secundario: "#b2ebf2", oscuro: "#0097a7" },
        { nombre: "Lima", primario: "#f9fbe7", secundario: "#f0f4c3", oscuro: "#afb42b" },
        { nombre: "Índigo", primario: "#e8eaf6", secundario: "#c5cae9", oscuro: "#3f51b5" },
        { nombre: "Teal", primario: "#e0f2f1", secundario: "#b2dfdb", oscuro: "#00796b" },
        { nombre: "Marrón", primario: "#efebe9", secundario: "#d7ccc8", oscuro: "#5d4037" },
        { nombre: "Gris", primario: "#fafafa", secundario: "#f5f5f5", oscuro: "#424242" },
        { nombre: "Rosa Oscuro", primario: "#fce4ec", secundario: "#f8bbd0", oscuro: "#ad1457" }
    ],
    fuentes: [
        { nombre: "Poppins", valor: "'Poppins', sans-serif" },
        { nombre: "Roboto", valor: "'Roboto', sans-serif" },
        { nombre: "Open Sans", valor: "'Open Sans', sans-serif" },
        { nombre: "Lato", valor: "'Lato', sans-serif" },
        { nombre: "Montserrat", valor: "'Montserrat', sans-serif" },
        { nombre: "Source Sans Pro", valor: "'Source Sans Pro', sans-serif" },
        { nombre: "Raleway", valor: "'Raleway', sans-serif" },
        { nombre: "PT Sans", valor: "'PT Sans', sans-serif" },
        { nombre: "Ubuntu", valor: "'Ubuntu', sans-serif" },
        { nombre: "Nunito", valor: "'Nunito', sans-serif" },
        { nombre: "Inter", valor: "'Inter', sans-serif" },
        { nombre: "Work Sans", valor: "'Work Sans', sans-serif" },
        { nombre: "Quicksand", valor: "'Quicksand', sans-serif" },
        { nombre: "Comfortaa", valor: "'Comfortaa', cursive" },
        { nombre: "Barlow", valor: "'Barlow', sans-serif" },
        { nombre: "Josefin Sans", valor: "'Josefin Sans', sans-serif" },
        { nombre: "Maven Pro", valor: "'Maven Pro', sans-serif" },
        { nombre: "Titillium Web", valor: "'Titillium Web', sans-serif" },
        { nombre: "Cabin", valor: "'Cabin', sans-serif" },
        { nombre: "Karla", valor: "'Karla', sans-serif" }
    ]
}; 

// CONFIGURACIÓN DE LA MALLA: Aquí puedes editar, agregar o quitar ramos.
// El campo 'prerrequisitos' usa los IDs de los ramos que deben estar aprobados.
const mallaCurricular = [
    {
        semestre: 1,
        ramos: [
            { id: "ic", nombre: "Introducción a la Cosmetología", prerrequisitos: [] },
            { id: "bc", nombre: "Biología Cutánea", prerrequisitos: [] },
            { id: "tc", nombre: "Teoría de la Cosmetología", prerrequisitos: [] },
            { id: "ca1", nombre: "Cosmetología Aplicada 1", prerrequisitos: [] },
            { id: "ms1", nombre: "Maquillaje Social y Asesoría de Imagen", prerrequisitos: [] }
        ]
    },
    {
        semestre: 2,
        ramos: [
            { id: "ct1", nombre: "Corporal Teórico 1", prerrequisitos: ["bc"] }, // Ejemplo: requiere Biología
            { id: "ec1", nombre: "Estética Corporal Aplicada 1", prerrequisitos: ["ca1"] },
            { id: "ca2", nombre: "Cosmetología Aplicada 2", prerrequisitos: ["ca1"] },
            { id: "ms2", nombre: "Maquillaje Social", prerrequisitos: ["ms1"] },
            { id: "tef", nombre: "Teoría de la Electroestética Facial", prerrequisitos: ["tc"] }
        ]
    },
    {
        semestre: 3,
        ramos: [
            { id: "ct2", nombre: "Corporal Teórico 2", prerrequisitos: ["ct1"] },
            { id: "mc", nombre: "Módulos Complementarios", prerrequisitos: [] },
            { id: "ec2", nombre: "Estética Corporal Aplicada 2", prerrequisitos: ["ec1"] },
            { id: "ca3", nombre: "Cosmetología Aplicada 3", prerrequisitos: ["ca2"] }
        ]
    },
    {
        semestre: 4,
        ramos: [
            { id: "tcos", nombre: "Tecnología Cosmética", prerrequisitos: [] },
            { id: "afc", nombre: "Alteraciones Funcionales Cutáneas", prerrequisitos: ["bc"] },
            { id: "ca4", nombre: "Cosmetología Aplicada 4", prerrequisitos: ["ca3"] },
            { id: "ec3", nombre: "Estética Corporal Aplicada 3", prerrequisitos: ["ec2"] },
            { id: "mf", nombre: "Maquillaje de Fantasía", prerrequisitos: ["ms2"] }
        ]
    }
];

// Estado de aprobación (se carga de LocalStorage si existe)
let aprobados = JSON.parse(localStorage.getItem('aprobadosCosmetologia')) || [];

const container = document.getElementById('malla-container');

function renderMalla() {
    container.innerHTML = '';

    mallaCurricular.forEach(sem => {
        const col = document.createElement('div');
        col.className = 'semestre-col';
        col.innerHTML = `<h3>Semestre ${sem.semestre}</h3>`;

        sem.ramos.forEach(ramo => {
            const div = document.createElement('div');
            div.className = 'ramo';
            div.innerText = ramo.nombre;
            div.id = ramo.id;

            // Verificar si está aprobado
            if (aprobados.includes(ramo.id)) {
                div.classList.add('aprobado');
            }

            // Verificar si está bloqueado (falta algún requisito)
            const faltantes = ramo.prerrequisitos.filter(p => !aprobados.includes(p));
            if (faltantes.length > 0 && !aprobados.includes(ramo.id)) {
                div.classList.add('bloqueado');
            }

            // Evento Click
            div.onclick = () => togglerRamo(ramo, faltantes);

            col.appendChild(div);
        });

        container.appendChild(col);
    });
}

function togglerRamo(ramo, faltantes) {
    if (aprobados.includes(ramo.id)) {
        // Si ya está aprobado, quitar de la lista (desmarcar)
        aprobados = aprobados.filter(id => id !== ramo.id);
    } else {
        // Si no está aprobado, verificar bloqueos
        if (faltantes.length > 0) {
            const nombresFaltantes = [];
            // Buscar los nombres de los requisitos que faltan
            mallaCurricular.forEach(s => s.ramos.forEach(r => {
                if (faltantes.includes(r.id)) nombresFaltantes.push(r.nombre);
            }));
            
            alert(`Ramo Bloqueado. Debes aprobar primero: \n- ${nombresFaltantes.join('\n- ')}`);
            return;
        }
        aprobados.push(ramo.id);
    }

    // Guardar y refrescar
    localStorage.setItem('aprobadosCosmetologia', JSON.stringify(aprobados));
    renderMalla();
}

// Botón de Reinicio
document.getElementById('reset-btn').onclick = () => {
    if(confirm("¿Estás seguro de que quieres borrar todo tu progreso?")) {
        aprobados = [];
        localStorage.removeItem('aprobadosCosmetologia');
        renderMalla();
    }
};

// Carga inicial
renderMalla();

document.addEventListener('DOMContentLoaded', () => {
    obtenerAlumnosPorClase();
    obtenerTopAlumnos();
    cargarClasesEnTabla(); // carga el select
    document.getElementById('selectClaseTabla').addEventListener('change', (e) => {
        const claseId = e.target.value;
        if (claseId) {
            cargarAlumnosPorClase(claseId);
        } else {
            document.getElementById('tablaAlumnosClase').innerHTML = '';
        }
    });
});

// Leaderboard de alumnos con más puntos
async function obtenerTopAlumnos() {
    const response = await fetch('http://localhost:5000/api/alumnos');
    let alumnos = await response.json();

    alumnos.sort((a, b) => b.puntos - a.puntos);
    alumnos = alumnos.slice(0, 5);

    const contenedor = document.getElementById('leaderboard');
    contenedor.innerHTML = '';
    alumnos.forEach((alumno, index) => {
        const entry = document.createElement('div');
        entry.className = 'entry';
        entry.innerHTML = `
            <div class="rank">#${index + 1}</div>
            <div class="name">${alumno.nombre}</div>
            <div class="points">${alumno.puntos} pts</div>
        `;
        contenedor.appendChild(entry);
    });
}

// Cargar clases en el select de tabla
async function cargarClasesEnTabla() {
    try {
        const response = await fetch('http://localhost:5000/api/clases');
        const clases = await response.json();
        const select = document.getElementById('selectClaseTabla');

        clases.forEach(clase => {
            const option = document.createElement('option');
            option.value = clase.id ?? clase.id_clase;
            option.textContent = clase.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar clases:', error);
    }
}

// Cargar alumnos por clase y mostrarlos en la tabla
async function cargarAlumnosPorClase(claseId) {
    try {
        const response = await fetch(`http://localhost:5000/api/alumnos/clase/${claseId}`);
        const alumnos = await response.json();
        const tbody = document.getElementById('tablaAlumnosClase');
        tbody.innerHTML = '';

        if (alumnos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" class="text-center">No hay alumnos en esta clase.</td></tr>`;
            return;
        }

        alumnos.forEach((alumno, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${index + 1}</td>
                <td>${alumno.nombre}</td>
                <td>${alumno.puntos}</td>
            `;
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al cargar alumnos por clase:', error);
    }
}

// Gráfico de barras: Alumnos por Clase
async function obtenerAlumnosPorClase() {
    const response = await fetch('http://localhost:5000/api/alumnos');
    const alumnos = await response.json();

    const conteo = {};
    alumnos.forEach(alumno => {
        const clase = alumno.id_clase;
        conteo[clase] = (conteo[clase] || 0) + 1;
    });

    const etiquetas = Object.keys(conteo);
    const valores = Object.values(conteo);

    const canvas = document.createElement('canvas1');
    canvas.id = 'graficoClases';
    document.querySelector('.container').appendChild(canvas);

    new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Cantidad de Alumnos',
                data: valores,
                backgroundColor: '#0d6efd',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Alumnos por Clase' }
            }
        }
    });
}

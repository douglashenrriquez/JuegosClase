document.addEventListener('DOMContentLoaded', async () => {
    // 🔒 Validar si hay información del alumno guardada
    const alumnoRaw = localStorage.getItem('usuario');

    if (!alumnoRaw) {
        alert("No se encontró información del alumno. Por favor inicia sesión.");
        window.location.href = "login.html";
        return;
    }

    let alumno;
    try {
        alumno = JSON.parse(alumnoRaw);
    } catch (error) {
        console.error("Error parseando localStorage:", error);
        alert("Error leyendo los datos del alumno.");
        localStorage.clear();
        window.location.href = "login.html";
        return;
    }

    // 👋 Mostrar mensaje personalizado
    const bienvenida = document.getElementById("bienvenida");
    bienvenida.textContent = `Bienvenido, ${alumno.nombre || 'Alumno'}`;

    await cargarClases();

    document.getElementById('selectClase').addEventListener('change', async (event) => {
        const claseId = event.target.value;
        console.log("Seleccionada clase:", claseId);

        if (claseId) {
            await mostrarLeaderboardPorClase(claseId);
        } else {
            document.getElementById('leaderboard').innerHTML = '';
        }
    });
});

async function cargarClases() {
    try {
        const response = await fetch('http://localhost:5000/api/clases');
        if (!response.ok) throw new Error('Error al cargar clases');

        const clases = await response.json();
        const select = document.getElementById('selectClase');

        clases.forEach(clase => {
            const option = document.createElement('option');
            option.value = clase.id ?? clase.id_clase;
            option.textContent = clase.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error cargando clases:', error);
    }
}

async function mostrarLeaderboardPorClase(claseId) {
    try {
        const response = await fetch(`http://localhost:5000/api/alumnos/clase/${claseId}`);
        if (!response.ok) throw new Error('Error al cargar alumnos');

        const alumnos = await response.json();

        // Ordenar por puntos descendente y tomar top 5
        alumnos.sort((a, b) => b.puntos - a.puntos);
        const topAlumnos = alumnos.slice(0, 5);

        const contenedor = document.getElementById('leaderboard');
        contenedor.innerHTML = ''; // Limpiar antes de mostrar

        if (topAlumnos.length === 0) {
            contenedor.innerHTML = '<p class="text-center">No hay alumnos para esta clase.</p>';
            return;
        }

        topAlumnos.forEach((alumno, index) => {
            const entry = document.createElement('div');
            entry.className = 'entry d-flex justify-content-between align-items-center mb-2 p-2 border rounded';
            entry.innerHTML = `
                <div class="rank fw-bold">#${index + 1}</div>
                <div class="name flex-grow-1 ms-3">${alumno.nombre}</div>
                <div class="points fw-semibold">${alumno.puntos} pts</div>
            `;
            contenedor.appendChild(entry);
        });
    } catch (error) {
        console.error('Error mostrando leaderboard:', error);
        document.getElementById('leaderboard').innerHTML = '<p class="text-danger text-center">Error al cargar alumnos.</p>';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const usuarioRaw = localStorage.getItem('usuario');

    if (!usuarioRaw) {
        alert("Sesión no encontrada. Por favor inicia sesión.");
        window.location.href = "login.html";
        return;
    }

    let usuario;
    try {
        usuario = JSON.parse(usuarioRaw);
    } catch (error) {
        console.error("Error al leer datos del usuario:", error);
        localStorage.clear();
        window.location.href = "login.html";
        return;
    }

    const creadorID = usuario.id; 

    if (!creadorID) {
        alert("No se encontró el ID del creador.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/juegos/por-creador/${creadorID}`);
        if (!response.ok) throw new Error("Error al obtener los juegos");

        const juegos = await response.json();
        mostrarJuegos(juegos);
    } catch (error) {
        console.error("Error al cargar juegos:", error);
        document.querySelector('.container').innerHTML = '<p class="text-danger">No se pudieron cargar los juegos.</p>';
    }
});

function mostrarJuegos(juegos) {
    const container = document.querySelector('.container');
    container.innerHTML = '<h2 class="mb-4">Tus Juegos</h2>';

    if (juegos.length === 0) {
        container.innerHTML += '<p>No tienes juegos asignados.</p>';
        return;
    }

    const row = document.createElement('div');
    row.className = 'row';

    juegos.forEach(juego => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';

        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">${juego.nombre}</h5>
                    <p class="card-text"><strong>Reglas:</strong> ${juego.reglas}</p>
                    <a href="ganadores.html" class="btn btn-primary mt-2">Jugadores</a>
                </div>
            </div>
        `;

        row.appendChild(col);
    });

    container.appendChild(row);
}

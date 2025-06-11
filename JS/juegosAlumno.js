let usuario = null;

document.addEventListener('DOMContentLoaded', async () => {
    const usuarioRaw = localStorage.getItem('usuario');

    if (!usuarioRaw) {
        alert("Sesión no encontrada. Por favor inicia sesión.");
        window.location.href = "login.html";
        return;
    }

    try {
        usuario = JSON.parse(usuarioRaw);
    } catch (error) {
        console.error("Error al leer datos del usuario:", error);
        localStorage.clear();
        window.location.href = "login.html";
        return;
    }

    const idClase = usuario.id_clase;
    console.log('usuario:', usuario);
    console.log('idClase:', idClase);

    if (!idClase) {
        alert("No se encontró la clase del alumno.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/juegos/por-clase/${idClase}`);
        if (!response.ok) throw new Error("Error al obtener los juegos");

        const juegos = await response.json();
        mostrarJuegos(juegos);
    } catch (error) {
        console.error("Error al cargar juegos:", error);
        document.querySelector('.container').innerHTML = '<p class="text-danger">No se pudieron cargar los juegos.</p>';
    }

    try {
        const estadoResp = await fetch(`http://localhost:5000/api/estado_juego/${usuario.id}`);
        const estadoData = await estadoResp.json();

        if (!estadoData.success) {
            localStorage.removeItem('juegoSeleccionado');
        }
    } catch (error) {
        console.error("Error al verificar estado del juego:", error);
    }
});

async function mostrarJuegos(juegos) {
    const container = document.querySelector('.container');
    container.innerHTML = '<h2 class="mb-4">Juegos disponibles</h2>';

    if (juegos.length === 0) {
        container.innerHTML += '<p>No hay juegos asignados a tu clase.</p>';
        return;
    }

    const cards = [];

    const juegoGuardadoRaw = localStorage.getItem('juegoSeleccionado');
    let juegoGuardado = null;

    if (juegoGuardadoRaw) {
        try {
            juegoGuardado = JSON.parse(juegoGuardadoRaw);
        } catch {
            localStorage.removeItem('juegoSeleccionado');
        }
    }

    for (const juego of juegos) {
        const puedeJugarResp = await fetch(`http://localhost:5000/api/juegos/puede_jugar/${usuario.id}/${juego.id}`);
        const puedeJugarData = await puedeJugarResp.json();

        const puedeJugar = puedeJugarData.puede_jugar;
        const vidasUsadas = puedeJugarData.vidas_usadas;
        const vidasTotales = puedeJugarData.vidas_totales;
        const vidasRestantes = vidasTotales - vidasUsadas;

        const corazones = '❤️ '.repeat(vidasRestantes) + '🖤 '.repeat(vidasUsadas);

        const card = document.createElement('div');
        card.className = 'card mb-3';
        card.style.transition = '0.3s';

        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${juego.nombre}</h5>
                <p class="card-text"><strong>Reglas:</strong> ${juego.reglas}</p>
                <p class="card-text"><strong>Vidas:</strong> ${corazones}</p>
                <p class="card-text"><strong>Puntos a ganar:</strong> 🏆 ${juego.puntos}</p>
                <button class="btn btn-success btnJugar">Jugar</button>
            </div>
        `;

        container.appendChild(card);
        cards.push(card);

        const boton = card.querySelector('.btnJugar');

        if (!puedeJugar) {
            boton.disabled = true;
            boton.textContent = 'Sin vidas';
            card.classList.add('bg-light', 'text-muted');
            continue;
        }

        if (juegoGuardado) {
            if (juegoGuardado.id_juego !== juego.id) {
                card.classList.add('bg-secondary', 'text-white', 'opacity-75');
                boton.disabled = true;
            } else {
                boton.disabled = true;
                boton.textContent = 'Jugando...';
            }
        }

        boton.addEventListener('click', async () => {
            try {
                const response = await fetch('http://localhost:5000/api/estado_juego', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_alumno: usuario.id,
                        id_juego: juego.id
                    })
                });

                if (!response.ok) throw new Error("No se pudo registrar el estado del juego");

                localStorage.setItem('juegoSeleccionado', JSON.stringify({
                    id_juego: juego.id,
                    nombre: juego.nombre
                }));

                cards.forEach(c => {
                    const btn = c.querySelector('.btnJugar');
                    if (c !== card) {
                        c.classList.add('bg-secondary', 'text-white', 'opacity-75');
                        btn.disabled = true;
                    }
                });

                card.classList.remove('bg-secondary', 'text-white', 'opacity-75');
                boton.disabled = true;
                boton.textContent = 'Jugando...';

                alert("El estado del juego se ha registrado correctamente.");
            } catch (error) {
                console.error("Error al iniciar el juego:", error);
                alert("No se pudo iniciar el juego.");
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".container");

    // Crear formulario para ingresar ID
    container.innerHTML = `
        <div class="mb-4">
            <label for="inputIdAlumno" class="form-label">ID del Alumno</label>
            <input type="text" id="inputIdAlumno" class="form-control" placeholder="Ejemplo: 2024002001">
            <button class="btn btn-primary mt-2" id="btnBuscar">Buscar Historial</button>
        </div>
        <div id="resultadoHistorial" class="row"></div>
    `;

    const input = document.getElementById("inputIdAlumno");
    const btnBuscar = document.getElementById("btnBuscar");
    const resultado = document.getElementById("resultadoHistorial");

    btnBuscar.addEventListener("click", () => {
        const idAlumno = input.value.trim();

        if (!idAlumno) {
            resultado.innerHTML = `<p class="text-warning">Por favor ingresa un ID de alumno.</p>`;
            return;
        }

        fetch(`http://localhost:5000/api/historial_juegos/${idAlumno}`)
            .then(res => res.json())
            .then(data => {
                if (!data.success || !Array.isArray(data.historial)) {
                    resultado.innerHTML = '<p class="text-danger">No se pudo obtener el historial.</p>';
                    return;
                }

                const historial = data.historial;

                if (historial.length === 0) {
                    resultado.innerHTML = '<p class="text-muted">Este alumno no tiene juegos registrados.</p>';
                    return;
                }

                resultado.innerHTML = historial.map(juego => {
                    const fecha = new Date(juego.fecha_inicio).toLocaleString("es-ES");
                    return `
                        <div class="col-md-4 mb-3">
                            <div class="card h-100 shadow-sm">
                                <div class="card-body">
                                    <h5 class="card-title">${juego.juego}</h5>
                                    <p class="card-text">
                                        <strong>Reglas:</strong> ${juego.reglas}<br>
                                        <strong>Puntos:</strong> ${juego.puntos}<br>
                                        <strong>Vida:</strong> ${juego.vida}<br>
                                        <strong>Estado:</strong> <span class="badge bg-${juego.estado === 'finalizado' ? 'success' : 'warning'}">${juego.estado}</span><br>
                                        <strong>Inicio:</strong> ${fecha}
                                    </p>
                                </div>
                            </div>
                        </div>
                    `;
                }).join("");
            })
            .catch(err => {
                console.error("Error al cargar historial:", err);
                resultado.innerHTML = '<p class="text-danger">Error al cargar el historial.</p>';
            });
    });
});

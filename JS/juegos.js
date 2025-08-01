document.addEventListener("DOMContentLoaded", function () {
    const tabla = $('#tablaJuegos').DataTable();
    const btn = document.querySelector("#formJuego button[type='submit']");

    // Modales
    function mostrarModal(mensaje, titulo = "Mensaje") {
        document.getElementById("mensajeModalLabel").textContent = titulo;
        document.getElementById("modalMensajeTexto").textContent = mensaje;
        new bootstrap.Modal(document.getElementById("mensajeModal")).show();
    }

    function mostrarConfirmacion(mensaje, onConfirmar) {
        document.getElementById("modalConfirmacionTexto").textContent = mensaje;
        const modal = new bootstrap.Modal(document.getElementById("confirmacionModal"));
        modal.show();
        const btnConfirmar = document.getElementById("btnConfirmarAccion");
        btnConfirmar.onclick = () => {
            modal.hide();
            onConfirmar();
        };
    }

    function cargarJuegos() {
        fetch("http://localhost:5000/api/juegos")
            .then(res => res.json())
            .then(juegos => {
                tabla.clear();
                juegos.forEach(juego => {
                    tabla.row.add([
                        juego.id,
                        juego.nombre,
                        juego.reglas,
                        juego.vida,
                        juego.puntos,
                        juego.nombre_clase || "Sin clase",
                        juego.nombre_creador || "Sin asignar",
                        `
                        <button class="btn btn-warning btn-sm me-2" onclick="editarJuego(${juego.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarJuego(${juego.id})">Eliminar</button>
                        `
                    ]);
                });
                tabla.draw();
            });
    }

    function cargarClases() {
        fetch("http://localhost:5000/api/clases")
            .then(res => res.json())
            .then(clases => {
                const select = document.getElementById("id_clase");
                select.innerHTML = '<option value="">Selecciona una clase</option>';
                clases.forEach(clase => {
                    const option = document.createElement("option");
                    option.value = clase.id_clase;
                    option.textContent = clase.nombre;
                    select.appendChild(option);
                });
            });
    }

    function cargarAlumnos() {
        fetch("http://localhost:5000/api/alumnos")
            .then(res => res.json())
            .then(alumnos => {
                const select = document.getElementById("id_alumno");
                select.innerHTML = '<option value="">Selecciona un alumno</option>';
                alumnos.forEach(alumno => {
                    const option = document.createElement("option");
                    option.value = alumno.id;
                    option.textContent = `${alumno.id} - ${alumno.nombre}`;
                    select.appendChild(option);
                });
            });
    }

    document.getElementById("formJuego").addEventListener("submit", function (e) {
        e.preventDefault();

        const juego = {
            nombre: document.getElementById("nombre").value,
            reglas: document.getElementById("reglas").value,
            vida: parseInt(document.getElementById("vida").value),
            puntos: parseInt(document.getElementById("puntos").value),
            id_clase: parseInt(document.getElementById("id_clase").value),
            creadorjuego: document.getElementById("id_alumno").value
        };

        const isEditing = btn.dataset.editing === "true";
        const juegoId = btn.dataset.id;

        const url = isEditing
            ? `http://localhost:5000/api/juegos/${juegoId}`
            : "http://localhost:5000/api/juegos";

        const method = isEditing ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(juego)
        })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    mostrarModal(isEditing ? "Juego actualizado correctamente" : "Juego registrado con éxito", "Éxito");
                    resetFormulario();
                    cargarJuegos();
                } else {
                    mostrarModal("Error al guardar el juego", "Error");
                }
            })
            .catch(err => {
                console.error(err);
                mostrarModal("Error al conectar con el servidor", "Error");
            });
    });

    window.editarJuego = function (id) {
        fetch("http://localhost:5000/api/juegos")
            .then(res => res.json())
            .then(juegos => {
                const juego = juegos.find(j => j.id === id);
                if (juego) {
                    document.getElementById("nombre").value = juego.nombre;
                    document.getElementById("reglas").value = juego.reglas;
                    document.getElementById("vida").value = juego.vida;
                    document.getElementById("puntos").value = juego.puntos;
                    document.getElementById("id_clase").value = juego.id_clase;
                    document.getElementById("id_alumno").value = juego.id_alumno;

                    btn.textContent = "Actualizar Juego";
                    btn.classList.remove("btn-success");
                    btn.classList.add("btn-primary");
                    btn.dataset.editing = "true";
                    btn.dataset.id = id;
                }
            });
    }

    window.eliminarJuego = function (id) {
        mostrarConfirmacion("¿Estás seguro de eliminar este juego?", () => {
            fetch(`http://localhost:5000/api/juegos/${id}`, {
                method: "DELETE"
            })
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        mostrarModal("Juego eliminado correctamente", "Éxito");
                        cargarJuegos();
                    } else {
                        mostrarModal("No se pudo eliminar el juego", "Error");
                    }
                })
                .catch(err => {
                    console.error(err);
                    mostrarModal("Error al conectar con el servidor", "Error");
                });
        });
    }

    function resetFormulario() {
        document.getElementById("formJuego").reset();
        document.getElementById("id_clase").value = "";
        btn.textContent = "Registrar Juego";
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-success");
        btn.removeAttribute("data-editing");
        btn.removeAttribute("data-id");
    }

    cargarClases();
    cargarJuegos();
    cargarAlumnos();
});

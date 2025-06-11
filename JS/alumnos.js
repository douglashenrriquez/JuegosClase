let tabla; // Variable global para la DataTable

// Ejecutar cuando se carga el DOM
document.addEventListener("DOMContentLoaded", function () {
    // Inicializar DataTable
    tabla = $('#tablaAlumnos').DataTable();

    // Cargar clases en el select
    const selectClase = document.getElementById("id_clase");
    fetch("http://localhost:5000/api/clases")
        .then(res => res.json())
        .then(clases => {
            clases.forEach(clase => {
                const option = document.createElement("option");
                option.value = clase.id_clase;
                option.textContent = clase.nombre;
                selectClase.appendChild(option);
            });
        });

    // Cargar alumnos al iniciar
    cargarAlumnos();

    // Manejar envío del formulario
    document.getElementById("formAlumno").addEventListener("submit", function (e) {
        e.preventDefault();

        const alumno = {
            id: document.getElementById("id").value,
            nombre: document.getElementById("nombre").value,
            password: document.getElementById("password").value,
            id_clase: document.getElementById("id_clase").value,
            puntos: document.getElementById("puntos").value
        };

        const btn = document.querySelector("#formAlumno button[type='submit']");
        const isEditing = btn.dataset.editing === "true";

        if (isEditing) {
            // Actualizar alumno
            fetch(`http://localhost:5000/api/alumnos/${alumno.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(alumno)
            })
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                         mostrarModal(isEditing ? "Alumno actualizado" : "Alumno registrado correctamente", "Éxito");
                        resetFormulario();
                        cargarAlumnos();
                    } else {
                         mostrarModal("Error al " + (isEditing ? "actualizar" : "registrar") + " alumno", "Error");
                    }
                });
        } else {
            // Registrar nuevo alumno
            fetch("http://localhost:5000/api/alumnos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(alumno)
            })
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        mostrarModal("Alumno registrado correctamente", "Éxito");
                        resetFormulario();
                        cargarAlumnos();
                    } else {
                        mostrarModal("ERROR", "Éxito");
                    }
                });
        }
    });
});

// ✅ Cargar alumnos en la tabla
function cargarAlumnos() {
    fetch("http://localhost:5000/api/alumnos")
        .then(res => res.json())
        .then(data => {
            tabla.clear();
            data.forEach(alumno => {
                tabla.row.add([
                    alumno.id,
                    alumno.nombre,
                    alumno.password,
                    alumno.nombre_clase || "Sin clase",
                    alumno.puntos,
                    `
                    <button class="btn btn-warning btn-sm me-2" onclick="editarAlumno('${alumno.id}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarAlumno('${alumno.id}')">Eliminar</button>
                    `
                ]);
            });
            tabla.draw();
        });
}

// ✅ Eliminar un alumno
function eliminarAlumno(id) {
    mostrarConfirmacion("¿Estás seguro de eliminar este alumno?", () => {
    fetch(`http://localhost:5000/api/alumnos/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            mostrarModal("Alumno eliminado", "Éxito");
            cargarAlumnos();
        } else {
            mostrarModal("No se pudo eliminar el alumno", "Error");
        }
    });
});

}

// ✅ Editar un alumno
function editarAlumno(id) {
    fetch("http://localhost:5000/api/alumnos")
        .then(res => res.json())
        .then(data => {
            const alumno = data.find(a => a.id === id);
            if (alumno) {
                document.getElementById("id").value = alumno.id;
                document.getElementById("id").readOnly = true;
                document.getElementById("nombre").value = alumno.nombre;
                document.getElementById("password").value = alumno.password;
                document.getElementById("id_clase").value = alumno.id_clase || "";
                document.getElementById("puntos").value = alumno.puntos;

                const btn = document.querySelector("#formAlumno button[type='submit']");
                btn.textContent = "Actualizar Alumno";
                btn.classList.remove("btn-success");
                btn.classList.add("btn-primary");
                btn.dataset.editing = "true";
            }
        });
}

// ✅ Resetear el formulario a estado inicial
function resetFormulario() {
    document.getElementById("formAlumno").reset();
    document.getElementById("id").readOnly = false;

    const btn = document.querySelector("#formAlumno button[type='submit']");
    btn.textContent = "Registrar Alumno";
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-success");
    btn.dataset.editing = "false";
}
// Mostrar mensaje en modal
function mostrarModal(mensaje, titulo = "Mensaje") {
    document.getElementById("mensajeModalLabel").textContent = titulo;
    document.getElementById("modalMensajeTexto").textContent = mensaje;
    new bootstrap.Modal(document.getElementById("mensajeModal")).show();
}

// Mostrar confirmación y ejecutar callback si acepta
function mostrarConfirmacion(mensaje, onConfirmar) {
    document.getElementById("modalConfirmacionTexto").textContent = mensaje;
    const modal = new bootstrap.Modal(document.getElementById("confirmacionModal"));
    modal.show();

    const btn = document.getElementById("btnConfirmarAccion");
    btn.onclick = () => {
        modal.hide();
        onConfirmar();
    };
}

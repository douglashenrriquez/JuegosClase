document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formClase');
    const nombreInput = document.getElementById('nombre');
    const idInput = document.getElementById('id_clase');
    const cancelarBtn = document.getElementById('cancelarEdicion');
    let tabla;

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

    // Cargar clases al inicio
    cargarClases();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = nombreInput.value.trim();
        const id = idInput.value;

        if (!nombre) return mostrarModal('El nombre de la clase es obligatorio', 'Error');

        const url = id
            ? `http://localhost:5000/api/clases/${id}`
            : 'http://localhost:5000/api/clases';

        const metodo = id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre })
            });

            const data = await response.json();

            if (data.success) {
                mostrarModal(id ? 'Clase actualizada correctamente' : 'Clase creada con éxito', 'Éxito');
                form.reset();
                idInput.value = '';
                cargarClases();
            } else {
                mostrarModal('Error al guardar la clase', 'Error');
            }
        } catch (error) {
            console.error(error);
            mostrarModal('Error de conexión con el servidor', 'Error');
        }
    });

    cancelarBtn.addEventListener('click', () => {
        form.reset();
        idInput.value = '';
    });

    async function cargarClases() {
        try {
            const res = await fetch('http://localhost:5000/api/clases');
            const clases = await res.json();

            if (tabla) tabla.destroy();

            const tbody = document.querySelector('#tablaClases tbody');
            tbody.innerHTML = '';

            clases.forEach(clase => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${clase.id_clase}</td>
                    <td>${clase.nombre}</td>
                    <td>
                        <button class="btn btn-sm btn-warning editar" data-id="${clase.id_clase}" data-nombre="${clase.nombre}">Editar</button>
                        <button class="btn btn-sm btn-danger eliminar" data-id="${clase.id_clase}">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(row);
            });

            tabla = new DataTable('#tablaClases');

            // Eventos de botones
            document.querySelectorAll('.editar').forEach(btn => {
                btn.addEventListener('click', () => {
                    idInput.value = btn.dataset.id;
                    nombreInput.value = btn.dataset.nombre;
                });
            });

            document.querySelectorAll('.eliminar').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;

                    mostrarConfirmacion('¿Estás seguro de eliminar esta clase?', async () => {
                        try {
                            const res = await fetch(`http://localhost:5000/api/clases/${id}`, { method: 'DELETE' });
                            const data = await res.json();
                            if (data.success) {
                                mostrarModal('Clase eliminada correctamente', 'Éxito');
                                cargarClases();
                            } else {
                                mostrarModal('No se pudo eliminar la clase', 'Error');
                            }
                        } catch (error) {
                            console.error(error);
                            mostrarModal('Error al conectar con el servidor', 'Error');
                        }
                    });
                });
            });
        } catch (error) {
            console.error(error);
            mostrarModal('Error al cargar clases desde el servidor', 'Error');
        }
    }
});

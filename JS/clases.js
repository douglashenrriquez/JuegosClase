document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formClase');
    const nombreInput = document.getElementById('nombre');
    const idInput = document.getElementById('id_clase');
    const cancelarBtn = document.getElementById('cancelarEdicion');
    let tabla;

    // Cargar clases al inicio
    cargarClases();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = nombreInput.value.trim();
        const id = idInput.value;

        if (!nombre) return alert('Nombre requerido');

        const url = id
            ? `http://localhost:5000/api/clases/${id}`
            : 'http://localhost:5000/api/clases';

        const metodo = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
        });

        const data = await response.json();

        if (data.success) {
            alert(id ? 'Clase actualizada' : 'Clase creada');
            form.reset();
            cargarClases();
        } else {
            alert('Error al guardar');
        }
    });

    cancelarBtn.addEventListener('click', () => {
        form.reset();
        idInput.value = '';
    });

    async function cargarClases() {
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
                if (confirm('¿Eliminar esta clase?')) {
                    const res = await fetch(`http://localhost:5000/api/clases/${id}`, { method: 'DELETE' });
                    const data = await res.json();
                    if (data.success) {
                        alert('Clase eliminada');
                        cargarClases();
                    } else {
                        alert('Error al eliminar');
                    }
                }
            });
        });
    }
});

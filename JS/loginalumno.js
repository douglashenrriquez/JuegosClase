document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const modal = new bootstrap.Modal(document.getElementById('mensajeModal'));
    const modalTexto = document.getElementById('modalMensajeTexto');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const id = document.getElementById('numero').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/api/login_alumno', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, password })
            });

            const data = await response.json();

            if (data.success) {
                // Guardar datos del usuario y rol en localStorage
                localStorage.setItem('usuario', JSON.stringify(data.datos));
                localStorage.setItem('rol', data.rol);

                // Redirigir a la página principal de alumnos
                window.location.href = 'principalAlumnos.html';
            } else {
                // Mostrar error en el modal
                modalTexto.textContent = data.message || 'Credenciales incorrectas.';
                modal.show();
            }

        } catch (error) {
            console.error('Error en la solicitud:', error);
            modalTexto.textContent = 'Error al conectar con el servidor.';
            modal.show();
        }
    });
});
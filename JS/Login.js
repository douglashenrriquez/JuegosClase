document.addEventListener('DOMContentLoaded', function () {
    localStorage.clear();
    sessionStorage.clear();

    const loginForm = document.querySelector('.login-card form');

    // Función para mostrar el modal
    function mostrarModal(mensaje, titulo = 'Mensaje') {
        document.getElementById('mensajeModalLabel').textContent = titulo;
        document.getElementById('modalMensajeTexto').textContent = mensaje;

        const modal = new bootstrap.Modal(document.getElementById('mensajeModal'));
        modal.show();
    }

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const numero = document.getElementById('numero').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ numero, password })
            });

            const data = await response.json();

            if (data.success) {
                mostrarModal('¡Login exitoso!', 'Bienvenido');

                localStorage.setItem('usuario', JSON.stringify(data));
                localStorage.setItem('rol', data.rol);

                // Redirigir después de cerrar el modal
                setTimeout(() => {
                    if (data.rol === 'administrador') {
                        window.location.href = 'principalMaestro.html';
                    } else if (data.rol === 'alumno') {
                        window.location.href = 'principalAlumnos.html';
                    } else {
                        mostrarModal('Rol desconocido', 'Error');
                    }
                }, 1500); // 1.5 segundos después
            } else {
                mostrarModal(data.message || 'Credenciales incorrectas', 'Error');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarModal('Error al conectar con el servidor', 'Error');
        }
    });
});

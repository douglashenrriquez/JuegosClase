document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const modal = new bootstrap.Modal(document.getElementById('mensajeModal'));
    const modalTexto = document.getElementById('modalMensajeTexto');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const numero = document.getElementById('numero').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/api/login_administrador', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ numero, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Guardar datos en localStorage
                localStorage.setItem('usuario', JSON.stringify(data.datos));
                localStorage.setItem('rol', data.rol);

                // Redirigir a la página principal del administrador
                window.location.href = 'principalMaestro.html';
            } else {
                modalTexto.textContent = data.message || 'Número o contraseña incorrectos.';
                modal.show();
            }

        } catch (error) {
            console.error('Error en la solicitud:', error);
            modalTexto.textContent = 'Error al conectar con el servidor.';
            modal.show();
        }
    });
});

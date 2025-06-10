document.addEventListener('DOMContentLoaded', function () {
    localStorage.clear();
    sessionStorage.clear();

    const loginForm = document.querySelector('.login-card form');

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
                alert('¡Login exitoso!');

                // Guardar todo el objeto como "usuario"
                localStorage.setItem('usuario', JSON.stringify(data));
                localStorage.setItem('rol', data.rol); // Por si lo usas luego

                // Redirigir según rol
                if (data.rol === 'administrador') {
                    window.location.href = 'principalMaestro.html';
                } else if (data.rol === 'alumno') {
                    window.location.href = 'principalAlumnos.html';
                } else {
                    alert('Rol desconocido');
                }

            } else {
                alert('Error: ' + (data.message || 'Credenciales incorrectas'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        }
    });
});

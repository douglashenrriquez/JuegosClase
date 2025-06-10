document.addEventListener('DOMContentLoaded', () => {
    const btnCerrar = document.getElementById('btnCerrarSesion');

    if (btnCerrar) {
        btnCerrar.addEventListener('click', (e) => {
            e.preventDefault();

            // Limpia localStorage y sessionStorage
            localStorage.clear();
            sessionStorage.clear();

            // Redirige al login
            window.location.href = 'login.html';
        });
    }
});

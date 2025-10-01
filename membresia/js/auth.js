document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    const navRegistro = document.querySelector('a[href="registro.html"]');
    const navLogin = document.querySelector('a[href="login.html"]');
    const navPerfil = document.querySelector('a[href="perfil.html"]');
    const navLogout = document.querySelector('a[href="logout.html"]');

    // Some pages might not have all nav elements, so we check for their parents (li)
    const navRegistroLi = navRegistro ? navRegistro.parentElement : null;
    const navLoginLi = navLogin ? navLogin.parentElement : null;
    const navPerfilLi = navPerfil ? navPerfil.parentElement : null;
    const navLogoutLi = navLogout ? navLogout.parentElement : null;

    const welcomeMessage = document.getElementById('welcome-message');

    if (currentUser) {
        // User is logged in
        if (navRegistroLi) navRegistroLi.style.display = 'none';
        if (navLoginLi) navLoginLi.style.display = 'none';

        // Show profile and logout if they exist
        if (navPerfilLi) navPerfilLi.style.display = 'list-item';
        if (navLogoutLi) navLogoutLi.style.display = 'list-item';

        if (welcomeMessage) {
            if (welcomeMessage.textContent.includes('¡Hola')) {
                welcomeMessage.textContent = `¡Hola, ${currentUser.nombre}!`;
            } else {
                welcomeMessage.textContent = `Bienvenido, ${currentUser.nombre}!`;
            }
        }

        // Add logout functionality
        if (navLogout) {
            navLogout.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
        }

    } else {
        // User is not logged in
        if (navRegistroLi) navRegistroLi.style.display = 'list-item';
        if (navLoginLi) navLoginLi.style.display = 'list-item';

        // Hide profile and logout if they exist
        if (navPerfilLi) navPerfilLi.style.display = 'none';
        if (navLogoutLi) navLogoutLi.style.display = 'none';
    }
});
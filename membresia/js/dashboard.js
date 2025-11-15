document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        // Si no hay un usuario conectado, no hacemos nada.
        // auth.js se encargará de redirigir a login.html
        return;
    }

    const completeProfileModal = document.getElementById('complete-profile-modal');
    const reserveButtons = document.querySelectorAll('.reserve-btn');

    reserveButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const isProfileComplete = currentUser.isProfileComplete || false;

            if (!isProfileComplete) {
                // Prevenir la navegación a reservas.html
                e.preventDefault();
                // Mostrar el modal
                completeProfileModal.style.display = 'block';
            }
            // Si el perfil está completo, el enlace funcionará normalmente.
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const verificationForm = document.getElementById('verification-form');
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const verifyEmailBtn = document.getElementById('verify-email-btn');
    const verifyPhoneBtn = document.getElementById('verify-phone-btn');

    // Rellenar datos del usuario
    nombreInput.value = currentUser.nombre;
    emailInput.value = currentUser.email;

    // Simular verificación de correo
    verifyEmailBtn.addEventListener('click', () => {
        alert('Se ha enviado un correo de verificación.');
        verifyEmailBtn.textContent = 'Correo Verificado';
        verifyEmailBtn.disabled = true;
    });

    // Simular verificación de teléfono
    verifyPhoneBtn.addEventListener('click', () => {
        alert('Se ha enviado un código de verificación a tu teléfono.');
        verifyPhoneBtn.textContent = 'Teléfono Verificado';
        verifyPhoneBtn.disabled = true;
    });

    verificationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validar que las verificaciones se hayan realizado
        if (!verifyEmailBtn.disabled || !verifyPhoneBtn.disabled) {
            alert('Por favor, verifica tu correo y teléfono para continuar.');
            return;
        }

        const telefono = document.getElementById('telefono').value;
        const direccion = document.getElementById('direccion').value;
        const tipoDocumento = document.getElementById('tipo-documento').value;
        const numeroDocumento = document.getElementById('numero-documento').value;
        const fotoDocumento = document.getElementById('foto-documento').files[0];

        // Guardar datos en una nueva "tabla" en localStorage
        let userVerifications = JSON.parse(localStorage.getItem('userVerifications')) || {};
        userVerifications[currentUser.email] = {
            telefono,
            direccion,
            tipoDocumento,
            numeroDocumento,
            // Simular guardado de la foto
            fotoDocumento: fotoDocumento ? fotoDocumento.name : null,
        };
        localStorage.setItem('userVerifications', JSON.stringify(userVerifications));

        // Marcar el perfil como completo
        currentUser.isProfileComplete = true;
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

        alert('¡Registro completado! Ahora puedes volver a la página de reservas.');
        window.location.href = 'reservas.html';
    });
});

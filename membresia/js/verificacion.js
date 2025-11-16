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
    const emailCodeContainer = document.getElementById('email-code-container');
    const verifyCodeBtn = document.getElementById('verify-code-btn');
    const emailCodeInput = document.getElementById('email-code');
    const submitBtn = document.getElementById('submit-btn');

    let isEmailVerified = false;

    // Rellenar datos del usuario
    nombreInput.value = currentUser.nombre;
    emailInput.value = currentUser.email;

    // Simular envío de código de verificación de correo
    verifyEmailBtn.addEventListener('click', () => {
        alert('Se ha enviado un código de verificación a tu correo. El código es: 123456');
        emailCodeContainer.style.display = 'block';
        verifyEmailBtn.disabled = true;
    });

    // Verificar el código de correo
    verifyCodeBtn.addEventListener('click', () => {
        if (emailCodeInput.value === '123456') {
            alert('Correo verificado correctamente.');
            isEmailVerified = true;
            verifyCodeBtn.textContent = 'Correo Verificado';
            verifyCodeBtn.disabled = true;
            emailCodeInput.disabled = true;
            checkVerifications();
        } else {
            alert('El código de verificación es incorrecto.');
        }
    });

    // Habilitar el botón de envío si el correo está verificado
    const checkVerifications = () => {
        if (isEmailVerified) {
            submitBtn.disabled = false;
        }
    };

    verificationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!isEmailVerified) {
            alert('Por favor, verifica tu correo para continuar.');
            return;
        }

        const direccion = document.getElementById('direccion').value;
        const tipoDocumento = document.getElementById('tipo-documento').value;
        const numeroDocumento = document.getElementById('numero-documento').value;
        const fotoDocumentoInput = document.getElementById('foto-documento');
        const fotoDocumento = fotoDocumentoInput.files[0];

        if (!fotoDocumento) {
            alert('Por favor, sube una foto de tu documento.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const fotoDocumentoDataUrl = event.target.result;

            // Guardar datos en una nueva "tabla" en localStorage
            let userVerifications = JSON.parse(localStorage.getItem('userVerifications')) || {};
            userVerifications[currentUser.email] = {
                direccion,
                tipoDocumento,
                numeroDocumento,
                fotoDocumento: fotoDocumentoDataUrl,
            };
            localStorage.setItem('userVerifications', JSON.stringify(userVerifications));

            // Marcar el perfil como completo
            currentUser.isProfileComplete = true;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

            alert('¡Registro completado! Ahora puedes volver a la página de reservas.');
            window.location.href = 'reservas.html';
        };

        reader.readAsDataURL(fotoDocumento);
    });
});

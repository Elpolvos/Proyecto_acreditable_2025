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
    const verifyPhoneBtn = document.getElementById('verify-phone-btn');
    const submitBtn = document.getElementById('submit-btn');

    let isEmailVerified = false;
    let isPhoneVerified = false;

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

    // Simular verificación de teléfono
    verifyPhoneBtn.addEventListener('click', () => {
        alert('Se ha enviado un código de verificación a tu teléfono.');
        isPhoneVerified = true;
        verifyPhoneBtn.textContent = 'Teléfono Verificado';
        verifyPhoneBtn.disabled = true;
        checkVerifications();
    });

    // Habilitar el botón de envío si ambas verificaciones son correctas
    const checkVerifications = () => {
        if (isEmailVerified && isPhoneVerified) {
            submitBtn.disabled = false;
        }
    };

    verificationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!isEmailVerified || !isPhoneVerified) {
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

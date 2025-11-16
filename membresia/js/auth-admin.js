document.addEventListener('DOMContentLoaded', () => {
    const registerAdminForm = document.getElementById('register-admin-form');
    const loginAdminForm = document.getElementById('login-admin-form');
    const messageElement = document.getElementById('message');

    // --- Lógica de Registro de Administradores ---
    if (registerAdminForm) {
        registerAdminForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombreCompleto = document.getElementById('nombre-completo').value;
            const cedula = document.getElementById('cedula').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                messageElement.textContent = 'Las claves no coinciden.';
                messageElement.style.color = 'red';
                return;
            }

            const adminUsers = JSON.parse(localStorage.getItem('adminUsers')) || [];
            const adminExists = adminUsers.find(user => user.cedula === cedula);

            if (adminExists) {
                messageElement.textContent = 'El número de cédula ya está registrado.';
                messageElement.style.color = 'red';
                return;
            }

            adminUsers.push({ nombreCompleto, cedula, password });
            localStorage.setItem('adminUsers', JSON.stringify(adminUsers));

            messageElement.textContent = 'Administrador registrado exitosamente. Ya puede iniciar sesión.';
            messageElement.style.color = 'green';

            setTimeout(() => {
                window.location.href = 'login-admin.html';
            }, 2000);
        });
    }

    // --- Lógica de Inicio de Sesión de Administradores ---
    if (loginAdminForm) {
        loginAdminForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const cedula = document.getElementById('cedula').value;
            const password = document.getElementById('password').value;

            const adminUsers = JSON.parse(localStorage.getItem('adminUsers')) || [];
            const admin = adminUsers.find(user => user.cedula === cedula);

            if (admin && admin.password === password) {
                messageElement.textContent = 'Inicio de sesión exitoso.';
                messageElement.style.color = 'green';

                const adminSession = {
                    nombre: admin.nombreCompleto,
                    cedula: admin.cedula,
                    role: 'admin'
                };
                sessionStorage.setItem('currentUser', JSON.stringify(adminSession));

                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1500);
            } else {
                messageElement.textContent = 'Número de cédula o clave incorrectos.';
                messageElement.style.color = 'red';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const registerEmployeeForm = document.getElementById('register-employee-form');
    const loginEmployeeForm = document.getElementById('login-employee-form');
    const messageElement = document.getElementById('message');

    // --- Lógica de Registro de Empleados ---
    if (registerEmployeeForm) {
        registerEmployeeForm.addEventListener('submit', (e) => {
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

            const employeeUsers = JSON.parse(localStorage.getItem('employeeUsers')) || [];
            const employeeExists = employeeUsers.find(user => user.cedula === cedula);

            if (employeeExists) {
                messageElement.textContent = 'El número de cédula ya está registrado.';
                messageElement.style.color = 'red';
                return;
            }

            employeeUsers.push({ nombreCompleto, cedula, password });
            localStorage.setItem('employeeUsers', JSON.stringify(employeeUsers));

            messageElement.textContent = 'Empleado registrado exitosamente. Ya puede iniciar sesión.';
            messageElement.style.color = 'green';

            setTimeout(() => {
                window.location.href = 'login-employee.html';
            }, 2000);
        });
    }

    // --- Lógica de Inicio de Sesión de Empleados ---
    if (loginEmployeeForm) {
        loginEmployeeForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const cedula = document.getElementById('cedula').value;
            const password = document.getElementById('password').value;

            const employeeUsers = JSON.parse(localStorage.getItem('employeeUsers')) || [];
            const employee = employeeUsers.find(user => user.cedula === cedula);

            if (employee && employee.password === password) {
                messageElement.textContent = 'Inicio de sesión exitoso.';
                messageElement.style.color = 'green';

                const employeeSession = {
                    nombre: employee.nombreCompleto,
                    cedula: employee.cedula,
                    role: 'empleado'
                };
                sessionStorage.setItem('currentUser', JSON.stringify(employeeSession));

                setTimeout(() => {
                    window.location.href = 'employee.html';
                }, 1500);
            } else {
                messageElement.textContent = 'Nombre de usuario o clave incorrectos.';
                messageElement.style.color = 'red';
            }
        });
    }
});

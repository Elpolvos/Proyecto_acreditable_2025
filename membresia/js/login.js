document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const messageElement = document.getElementById('message');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email);

        if (user) {
            if (user.password === password) {
                messageElement.textContent = 'Inicio de sesión exitoso.';
                messageElement.style.color = 'green';

                user.role = 'usuario';
                sessionStorage.setItem('currentUser', JSON.stringify(user));

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            } else {
                messageElement.textContent = 'Contraseña incorrecta.';
                messageElement.style.color = 'red';
            }
        } else {
            messageElement.textContent = 'Necesita registrarse para poder iniciar sesión.';
            messageElement.style.color = 'red';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    // Proteger la página: solo los administradores pueden acceder
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    const accountsTableBody = document.querySelector('#accounts-table tbody');
    const users = JSON.parse(localStorage.getItem('users')) || [];

    function renderUsers() {
        accountsTableBody.innerHTML = ''; // Limpiar la tabla antes de renderizar
        users.forEach((user, index) => {
            // No mostrar la cuenta de administrador en la lista
            if (user.email === 'admin@example.com' || user.role === 'admin') {
                return;
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.nombre}</td>
                <td>${user.email}</td>
                <td><button class="btn-danger" data-index="${index}">Eliminar</button></td>
            `;
            accountsTableBody.appendChild(row);
        });
    }

    // Manejar la eliminación de usuarios
    accountsTableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-danger')) {
            const userIndex = e.target.getAttribute('data-index');
            if (confirm('¿Estás seguro de que quieres eliminar esta cuenta?')) {
                users.splice(userIndex, 1);
                localStorage.setItem('users', JSON.stringify(users));
                renderUsers();
            }
        }
    });

    renderUsers();
});

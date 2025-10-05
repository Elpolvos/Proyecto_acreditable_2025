document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const userNameInput = document.getElementById('user-name');
    const userEmailInput = document.getElementById('user-email');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    const historyReservationsBody = document.getElementById('history-reservations-body');

    // Load user data into the form
    userNameInput.value = currentUser.nombre;
    userEmailInput.value = currentUser.email;

    // --- Edit/Save Profile Logic ---
    editProfileBtn.addEventListener('click', () => {
        userNameInput.disabled = false;
        userEmailInput.disabled = false;
        editProfileBtn.style.display = 'none';
        saveProfileBtn.style.display = 'inline-block';
    });

    saveProfileBtn.addEventListener('click', () => {
        const newName = userNameInput.value;
        const newEmail = userEmailInput.value;

        // Update sessionStorage
        currentUser.nombre = newName;
        currentUser.email = newEmail;
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Update localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.email === currentUser.email || user.nombre === currentUser.nombre);
        if (userIndex !== -1) {
            users[userIndex].nombre = newName;
            users[userIndex].email = newEmail;
            localStorage.setItem('users', JSON.stringify(users));
        }

        userNameInput.disabled = true;
        userEmailInput.disabled = true;
        editProfileBtn.style.display = 'inline-block';
        saveProfileBtn.style.display = 'none';

        alert('Perfil actualizado con éxito.');
    });

    // --- Delete Account Logic ---
    deleteAccountBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
            // Remove user from localStorage
            let users = JSON.parse(localStorage.getItem('users')) || [];
            users = users.filter(user => user.email !== currentUser.email);
            localStorage.setItem('users', JSON.stringify(users));

            // Remove user's reservations
            let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
            reservations = reservations.filter(res => res.userEmail !== currentUser.email);
            localStorage.setItem('reservations', JSON.stringify(reservations));

            // Logout
            sessionStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }
    });

    // --- Render Reservation History ---
    const renderReservationHistory = () => {
        if (!historyReservationsBody) return;
        historyReservationsBody.innerHTML = '';
        let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        const userReservations = reservations.filter(res => res.userEmail === currentUser.email);

        userReservations.forEach(res => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${res.vehiculo}</td>
                <td>${res.fechaInicio}</td>
                <td>${res.fechaFin}</td>
                <td>${res.estado}</td>
            `;
            historyReservationsBody.appendChild(row);
        });
    };

    renderReservationHistory();
});
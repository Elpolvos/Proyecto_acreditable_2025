document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const userNameSpan = document.getElementById('user-name');
    const userEmailSpan = document.getElementById('user-email');
    const userPhoneSpan = document.getElementById('user-phone');
    const userAddressSpan = document.getElementById('user-address');
    const userDocumentSpan = document.getElementById('user-document');
    const userPhotoImg = document.getElementById('user-photo');
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    const historyReservationsBody = document.getElementById('history-reservations-body');

    // Cargar datos básicos del usuario
    userNameSpan.textContent = currentUser.nombre;
    userEmailSpan.textContent = currentUser.email;

    // Cargar datos de verificación
    const userVerifications = JSON.parse(localStorage.getItem('userVerifications')) || {};
    const verificationData = userVerifications[currentUser.email];

    if (verificationData) {
        userPhoneSpan.textContent = verificationData.telefono;
        userAddressSpan.textContent = verificationData.direccion;
        userDocumentSpan.textContent = `${verificationData.tipoDocumento.toUpperCase()}: ${verificationData.numeroDocumento}`;
        userPhotoImg.src = verificationData.fotoDocumento;
    } else {
        // Opcional: mostrar un mensaje si el perfil no está completo
        userPhoneSpan.textContent = 'No verificado';
        userAddressSpan.textContent = 'No verificado';
        userDocumentSpan.textContent = 'No verificado';
    }

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

            // Remove user's verification data
            delete userVerifications[currentUser.email];
            localStorage.setItem('userVerifications', JSON.stringify(userVerifications));

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
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
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');

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

    // --- Admin Edit Logic ---
    if (currentUser.role === 'admin') {
        editProfileBtn.style.display = 'block';
    }

    editProfileBtn.addEventListener('click', () => {
        // Habilitar edición
        userNameSpan.innerHTML = `<input type="text" id="user-name-edit" value="${userNameSpan.textContent}">`;
        userPhoneSpan.innerHTML = `<input type="text" id="user-phone-edit" value="${userPhoneSpan.textContent}">`;
        userAddressSpan.innerHTML = `<input type="text" id="user-address-edit" value="${userAddressSpan.textContent}">`;

        // Mostrar/ocultar botones
        editProfileBtn.style.display = 'none';
        saveProfileBtn.style.display = 'block';
    });

    saveProfileBtn.addEventListener('click', () => {
        const newName = document.getElementById('user-name-edit').value;
        const newPhone = document.getElementById('user-phone-edit').value;
        const newAddress = document.getElementById('user-address-edit').value;

        // Actualizar UI
        userNameSpan.textContent = newName;
        userPhoneSpan.textContent = newPhone;
        userAddressSpan.textContent = newAddress;

        // Actualizar currentUser en sessionStorage
        currentUser.nombre = newName;
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Actualizar en localStorage (users)
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex].nombre = newName;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Actualizar en localStorage (userVerifications)
        const userVerifications = JSON.parse(localStorage.getItem('userVerifications')) || {};
        if (userVerifications[currentUser.email]) {
            userVerifications[currentUser.email].telefono = newPhone;
            userVerifications[currentUser.email].direccion = newAddress;
            localStorage.setItem('userVerifications', JSON.stringify(userVerifications));
        }


        // Mostrar/ocultar botones
        editProfileBtn.style.display = 'block';
        saveProfileBtn.style.display = 'none';
    });

    renderReservationHistory();
});
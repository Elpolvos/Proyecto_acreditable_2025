document.addEventListener('DOMContentLoaded', () => {
    // --- Autenticación ---
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const allowedRoles = ['admin', 'empleado'];
    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
        window.location.href = 'login.html';
        return;
    }

    // --- Elementos del DOM ---
    const reservationForm = document.getElementById('reservation-form');
    const reservationIdInput = document.getElementById('reservation-id');
    const userSelect = document.getElementById('user-select');
    const vehicleSelect = document.getElementById('vehicle-select');
    const fechaInicioInput = document.getElementById('fecha-inicio');
    const fechaFinInput = document.getElementById('fecha-fin');
    const reservationsTableBody = document.getElementById('reservations-table-body');

    // --- Carga de datos desde localStorage ---
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];

    // --- Funciones de renderizado ---

    function populateUserOptions() {
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.email;
            option.textContent = `${user.nombre} (${user.email})`;
            userSelect.appendChild(option);
        });
    }

    function populateVehicleOptions() {
        vehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle.name;
            option.textContent = vehicle.name;
            vehicleSelect.appendChild(option);
        });
    }

    function renderReservations() {
        reservationsTableBody.innerHTML = '';
        reservations.forEach(res => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${res.userEmail}</td>
                <td>${res.vehiculo}</td>
                <td>${res.fechaInicio}</td>
                <td>${res.fechaFin}</td>
                <td>${res.estado}</td>
                <td>
                    <button class="btn btn-edit" data-id="${res.id}">Editar</button>
                    <button class="btn btn-danger" data-id="${res.id}">Eliminar</button>
                </td>
            `;
            reservationsTableBody.appendChild(row);
        });
    }

    // --- Lógica de eventos ---

    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = reservationIdInput.value;
        const userEmail = userSelect.value;
        const vehiculo = vehicleSelect.value;
        const fechaInicio = fechaInicioInput.value;
        const fechaFin = fechaFinInput.value;

        if (id) {
            // Editar reserva
            const resIndex = reservations.findIndex(r => r.id == id);
            if (resIndex !== -1) {
                reservations[resIndex] = { ...reservations[resIndex], userEmail, vehiculo, fechaInicio, fechaFin };
            }
        } else {
            // Crear nueva reserva
            const newReservation = {
                id: `res-${Date.now()}`,
                userEmail,
                vehiculo,
                fechaInicio,
                fechaFin,
                estado: 'Activa',
            };
            reservations.push(newReservation);
        }

        localStorage.setItem('reservations', JSON.stringify(reservations));
        renderReservations();
        reservationForm.reset();
        reservationIdInput.value = '';
    });

    reservationsTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.getAttribute('data-id');

        if (target.classList.contains('btn-edit')) {
            const reservation = reservations.find(r => r.id == id);
            reservationIdInput.value = reservation.id;
            userSelect.value = reservation.userEmail;
            vehicleSelect.value = reservation.vehiculo;
            fechaInicioInput.value = reservation.fechaInicio;
            fechaFinInput.value = reservation.fechaFin;
            window.scrollTo(0, 0);
        }

        if (target.classList.contains('btn-danger')) {
            if (confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
                reservations = reservations.filter(r => r.id != id);
                localStorage.setItem('reservations', JSON.stringify(reservations));
                renderReservations();
            }
        }
    });

    // --- Inicialización ---
    populateUserOptions();
    populateVehicleOptions();
    renderReservations();
});

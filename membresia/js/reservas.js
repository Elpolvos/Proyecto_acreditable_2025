document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        // If no user is logged in, redirect to the login page
        window.location.href = 'login.html';
        return;
    }

    const vehicleSelect = document.getElementById('vehiculo');

    // Cargar vehículos desde localStorage o usar datos de ejemplo
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [
        { id: 1, name: 'Sedán Deportivo' },
        { id: 2, name: 'SUV Familiar' },
        { id: 3, name: 'Pickup 4x4' }
    ];

    function populateVehicleOptions() {
        vehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle.name;
            option.textContent = vehicle.name;
            vehicleSelect.appendChild(option);
        });
    }

    const reservationForm = document.getElementById('reservation-form');
    const activeReservationsBody = document.getElementById('active-reservations-body');
    const historyReservationsBody = document.getElementById('history-reservations-body');

    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];

    const renderReservations = () => {
        activeReservationsBody.innerHTML = '';
        historyReservationsBody.innerHTML = '';

        const userReservations = reservations.filter(res => res.userEmail === currentUser.email);

        userReservations.forEach(res => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${res.vehiculo}</td>
                <td>${res.fechaInicio}</td>
                <td>${res.fechaFin}</td>
                <td>${res.estado}</td>
            `;

            if (res.estado === 'Activa') {
                row.innerHTML += `
                    <td>
                        <button class="btn btn-modificar" data-id="${res.id}">Modificar</button>
                        <button class="btn btn-cancelar" data-id="${res.id}">Cancelar</button>
                    </td>
                `;
                activeReservationsBody.appendChild(row);
            } else {
                historyReservationsBody.appendChild(row);
            }
        });

        addEventListenersToButtons();
    };

    const addEventListenersToButtons = () => {
        document.querySelectorAll('.btn-modificar').forEach(button => {
            button.addEventListener('click', (e) => {
                const reservationId = e.target.dataset.id;
                const reservation = reservations.find(res => res.id === reservationId);
                if (reservation) {
                    document.getElementById('reservation-id').value = reservation.id;
                    document.getElementById('vehiculo').value = reservation.vehiculo;
                    document.getElementById('fecha-inicio').value = reservation.fechaInicio;
                    document.getElementById('fecha-fin').value = reservation.fechaFin;
                }
            });
        });

        document.querySelectorAll('.btn-cancelar').forEach(button => {
            button.addEventListener('click', (e) => {
                const reservationId = e.target.dataset.id;
                const reservationIndex = reservations.findIndex(res => res.id === reservationId);
                if (reservationIndex !== -1) {
                    reservations[reservationIndex].estado = 'Cancelada';
                    localStorage.setItem('reservations', JSON.stringify(reservations));
                    renderReservations();
                }
            });
        });
    };

    const submitButton = reservationForm.querySelector('button[type="submit"]');

    submitButton.addEventListener('click', (e) => {
        e.preventDefault();

        const reservationId = document.getElementById('reservation-id').value;
        const vehiculo = document.getElementById('vehiculo').value;
        const fechaInicio = document.getElementById('fecha-inicio').value;
        const fechaFin = document.getElementById('fecha-fin').value;

        // Simple validation to ensure fields are filled before processing
        if (!vehiculo || !fechaInicio || !fechaFin) {
            alert('Por favor, completa todos los campos de la reserva.');
            return;
        }

        if (reservationId) {
            // Update existing reservation
            const reservationIndex = reservations.findIndex(res => res.id === reservationId);
            if (reservationIndex !== -1) {
                reservations[reservationIndex] = {
                    ...reservations[reservationIndex],
                    vehiculo,
                    fechaInicio,
                    fechaFin,
                };
            }
        } else {
            // Create new reservation
            const newReservation = {
                id: `res-${Date.now()}`,
                userEmail: currentUser.email,
                vehiculo,
                fechaInicio,
                fechaFin,
                estado: 'Activa',
            };
            reservations.push(newReservation);

            // Store for invoice page and open in new window
            sessionStorage.setItem('currentReservation', JSON.stringify(newReservation));
            window.open('factura.html', '_blank');
        }

        localStorage.setItem('reservations', JSON.stringify(reservations));
        renderReservations();
        reservationForm.reset();
        document.getElementById('reservation-id').value = '';
    });

    renderReservations();
    populateVehicleOptions();
});
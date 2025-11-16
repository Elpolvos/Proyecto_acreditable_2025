document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const vehicleListContainer = document.getElementById('vehicle-list-container');
    const completeProfileModal = document.getElementById('complete-profile-modal');

    // Cargar vehículos desde localStorage o usar datos de ejemplo
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [
        { id: 1, name: 'Sedán Deportivo', price: '$50/día', image: 'css/imagenes/sedan-deportivo.jpg' },
        { id: 2, name: 'SUV Familiar', price: '$70/día', image: 'css/imagenes/suv-familiar.jpg' },
        { id: 3, name: 'Pickup 4x4', price: '$90/día', image: 'css/imagenes/pickup-4x4.jpg' }
    ];

    function renderVehicles() {
        vehicleListContainer.innerHTML = '';
        vehicles.forEach(vehicle => {
            const vehicleElement = document.createElement('div');
            vehicleElement.className = 'vehiculo';
            vehicleElement.innerHTML = `
                <img src="${vehicle.image}" class="card-img-top" alt="${vehicle.name}">
                <h3>${vehicle.name}</h3>
                <p>Precio: ${vehicle.price}</p>
                <a href="reservas.html" class="btn reserve-btn">Reservar Ahora</a>
            `;
            vehicleListContainer.appendChild(vehicleElement);
        });

        // Volver a agregar los detectores de eventos a los nuevos botones
        addEventListenersToReserveButtons();
    }

    function addEventListenersToReserveButtons() {
        const reserveButtons = document.querySelectorAll('.reserve-btn');
        reserveButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (currentUser.role === 'admin') {
                    return; // Permitir que los administradores continúen a la página de reservas
                }

                const isProfileComplete = currentUser.isProfileComplete || false;
                if (!isProfileComplete) {
                    e.preventDefault();
                    completeProfileModal.style.display = 'block';
                }
            });
        });
    }

    renderVehicles();
});

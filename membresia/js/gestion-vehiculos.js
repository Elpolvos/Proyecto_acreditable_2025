document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    // Proteger la página: solo los administradores pueden acceder
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    const vehicleForm = document.getElementById('vehicle-form');
    const vehicleIdInput = document.getElementById('vehicle-id');
    const vehicleNameInput = document.getElementById('vehicle-name');
    const vehiclePriceInput = document.getElementById('vehicle-price');
    const vehicleImageInput = document.getElementById('vehicle-image');
    const vehiclesTableBody = document.querySelector('#vehicles-table tbody');

    // Cargar vehículos desde localStorage o usar datos de ejemplo
    let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [
        { id: 1, name: 'Sedán Deportivo', price: 50, image: 'css/imagenes/sedan-deportivo.jpg' },
        { id: 2, name: 'SUV Familiar', price: 70, image: 'css/imagenes/suv-familiar.jpg' },
        { id: 3, name: 'Pickup 4x4', price: 90, image: 'css/imagenes/pickup-4x4.jpg' }
    ];

    function saveVehicles() {
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
    }

    function renderVehicles() {
        vehiclesTableBody.innerHTML = '';
        vehicles.forEach(vehicle => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vehicle.name}</td>
                <td>$${vehicle.price}/día</td>
                <td><img src="${vehicle.image}" alt="${vehicle.name}" width="100"></td>
                <td>
                    <button class="btn btn-edit" data-id="${vehicle.id}">Editar</button>
                    <button class="btn btn-danger" data-id="${vehicle.id}">Eliminar</button>
                </td>
            `;
            vehiclesTableBody.appendChild(row);
        });
    }

    // Manejar el envío del formulario (agregar/editar)
    vehicleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = vehicleIdInput.value;
        const name = vehicleNameInput.value;
        const price = parseFloat(vehiclePriceInput.value);
        const image = vehicleImageInput.value;

        if (isNaN(price)) {
            alert('Por favor, introduce un precio válido.');
            return;
        }

        if (id) {
            // Editar
            const vehicle = vehicles.find(v => v.id == id);
            vehicle.name = name;
            vehicle.price = price;
            vehicle.image = image;
        } else {
            // Agregar
            const newId = vehicles.length > 0 ? Math.max(...vehicles.map(v => v.id)) + 1 : 1;
            vehicles.push({ id: newId, name, price, image });
        }

        saveVehicles();
        renderVehicles();
        vehicleForm.reset();
        vehicleIdInput.value = '';
    });

    // Manejar la edición y eliminación
    vehiclesTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.getAttribute('data-id');

        if (target.classList.contains('btn-edit')) {
            const vehicle = vehicles.find(v => v.id == id);
            vehicleIdInput.value = vehicle.id;
            vehicleNameInput.value = vehicle.name;
            vehiclePriceInput.value = vehicle.price;
            vehicleImageInput.value = vehicle.image;
            window.scrollTo(0, 0); // Desplazarse al formulario
        }

        if (target.classList.contains('btn-danger')) {
            if (confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
                vehicles = vehicles.filter(v => v.id != id);
                saveVehicles();
                renderVehicles();
            }
        }
    });

    renderVehicles();
});

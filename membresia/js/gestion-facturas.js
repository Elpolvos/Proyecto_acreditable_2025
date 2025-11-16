document.addEventListener('DOMContentLoaded', () => {
    // --- Autenticación ---
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'empleado') {
        window.location.href = 'login.html';
        return;
    }

    // --- Elementos del DOM ---
    const invoicesTableBody = document.getElementById('invoices-table-body');
    const editFormSection = document.getElementById('edit-form-section');
    const editForm = document.getElementById('edit-invoice-form');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');

    // --- Carga de datos ---
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];

    // --- Lógica de la aplicación ---

    function getVehiclePrice(vehicleName) {
        const vehicle = vehicles.find(v => v.name === vehicleName);
        if (!vehicle || !vehicle.price) return 0;

        if (typeof vehicle.price === 'number') {
            return vehicle.price;
        }
        if (typeof vehicle.price === 'string') {
            const match = vehicle.price.match(/(\d+)/);
            return match ? parseFloat(match[0]) : 0;
        }
        return 0;
    }

    function calculateTotalCost(reservation) {
        const pricePerDay = getVehiclePrice(reservation.vehiculo);
        const startDate = new Date(reservation.fechaInicio);
        const endDate = new Date(reservation.fechaFin);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays * pricePerDay;
    }

    function renderInvoices() {
        invoicesTableBody.innerHTML = '';
        reservations.forEach(res => {
            const totalCost = calculateTotalCost(res);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${res.userEmail}</td>
                <td>${res.vehiculo}</td>
                <td>${res.fechaInicio} a ${res.fechaFin}</td>
                <td>$${totalCost.toFixed(2)}</td>
                <td>
                    <button class="btn btn-edit" data-id="${res.id}">Editar</button>
                    <button class="btn btn-danger" data-id="${res.id}">Eliminar</button>
                </td>
            `;
            invoicesTableBody.appendChild(row);
        });
    }

    // --- Event Listeners ---

    invoicesTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.getAttribute('data-id');

        if (target.classList.contains('btn-edit')) {
            const reservation = reservations.find(r => r.id == id);

            // Llenar y mostrar el formulario
            document.getElementById('edit-reservation-id').value = reservation.id;
            document.getElementById('edit-user-email').textContent = reservation.userEmail;
            document.getElementById('edit-vehicle-name').textContent = reservation.vehiculo;
            document.getElementById('edit-fecha-inicio').value = reservation.fechaInicio;
            document.getElementById('edit-fecha-fin').value = reservation.fechaFin;

            editFormSection.style.display = 'block';
            window.scrollTo(0, 0);
        }

        if (target.classList.contains('btn-danger')) {
            if (confirm('¿Estás seguro de que quieres eliminar esta factura/reserva?')) {
                reservations = reservations.filter(r => r.id != id);
                localStorage.setItem('reservations', JSON.stringify(reservations));
                renderInvoices();
            }
        }
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-reservation-id').value;
        const fechaInicio = document.getElementById('edit-fecha-inicio').value;
        const fechaFin = document.getElementById('edit-fecha-fin').value;

        const resIndex = reservations.findIndex(r => r.id == id);
        if (resIndex !== -1) {
            reservations[resIndex].fechaInicio = fechaInicio;
            reservations[resIndex].fechaFin = fechaFin;
        }

        localStorage.setItem('reservations', JSON.stringify(reservations));
        renderInvoices();
        editFormSection.style.display = 'none';
    });

    cancelEditBtn.addEventListener('click', () => {
        editFormSection.style.display = 'none';
    });

    // --- Inicialización ---
    renderInvoices();
});

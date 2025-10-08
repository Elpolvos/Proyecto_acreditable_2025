document.addEventListener('DOMContentLoaded', () => {
    const { jsPDF } = window.jspdf;
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const currentReservation = JSON.parse(sessionStorage.getItem('currentReservation'));

    if (!currentUser || !currentReservation) {
        // Redirect if data is missing
        window.location.href = 'reservas.html';
        return;
    }

    // --- Price mapping ---
    const vehiclePrices = {
        'Sedán Deportivo': 50,
        'SUV Familiar': 70,
        'Pickup 4x4': 90
    };

    // --- Populate Invoice Data ---
    document.getElementById('cliente-nombre').textContent = currentUser.nombre;
    document.getElementById('cliente-direccion').textContent = currentUser.direccion || 'N/A';
    document.getElementById('fecha-emision').textContent = new Date().toLocaleDateString();

    const vehiculoNombre = currentReservation.vehiculo;
    const fechaInicio = new Date(currentReservation.fechaInicio);
    const fechaFin = new Date(currentReservation.fechaFin);

    // Calculate duration
    const diffTime = Math.abs(fechaFin - fechaInicio);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include start day

    const precioDia = vehiclePrices[vehiculoNombre] || 0;
    const precioTotal = diffDays * precioDia;

    document.getElementById('vehiculo-nombre').textContent = vehiculoNombre;
    document.getElementById('fecha-inicio').textContent = fechaInicio.toLocaleDateString();
    document.getElementById('fecha-fin').textContent = fechaFin.toLocaleDateString();
    document.getElementById('dias-alquiler').textContent = diffDays;
    document.getElementById('precio-dia').textContent = `$${precioDia.toFixed(2)}`;
    document.getElementById('precio-total').textContent = `$${precioTotal.toFixed(2)}`;

    // --- PDF Generation ---
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    downloadPdfBtn.addEventListener('click', () => {
        const doc = new jsPDF();
        const facturaContainer = document.getElementById('factura-container');

        doc.html(facturaContainer, {
            callback: function (doc) {
                doc.save(`factura-${currentUser.nombre.replace(/\s/g, '_')}-${currentReservation.id}.pdf`);
            },
            x: 10,
            y: 10,
            width: 190,
            windowWidth: facturaContainer.offsetWidth
        });
    });
});
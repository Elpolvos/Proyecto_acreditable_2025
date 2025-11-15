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
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // --- Header ---
        doc.setFontSize(20);
        doc.text("Factura de Alquiler", 105, 25, { align: "center" });

        // --- Company and Client Info ---
        doc.setFontSize(12);
        doc.text("Autoservicios Roa H", 20, 40);
        doc.text("La avenida 19 de abril frente al farma todo por el viaducto nuevo", 20, 46);

        doc.text(`Cliente: ${currentUser.nombre}`, 120, 40);
        doc.text(`Dirección: ${currentUser.direccion || 'N/A'}`, 120, 46);

        // --- Invoice Details ---
        doc.setFontSize(14);
        doc.text("Detalles de la Reserva", 20, 65);
        doc.setFontSize(12);
        doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 20, 72);

        // --- Table ---
        doc.autoTable({
            startY: 80,
            head: [['Vehículo', 'Fecha de Inicio', 'Fecha de Fin', 'Días', 'Precio por Día', 'Total']],
            body: [
                [
                    vehiculoNombre,
                    fechaInicio.toLocaleDateString(),
                    fechaFin.toLocaleDateString(),
                    diffDays,
                    `$${precioDia.toFixed(2)}`,
                    `$${precioTotal.toFixed(2)}`
                ]
            ],
            theme: 'striped',
            headStyles: { fillColor: [22, 160, 133] }
        });

        // --- Footer ---
        const finalY = doc.lastAutoTable.finalY + 20;
        doc.setFontSize(12);
        doc.text("Gracias por su preferencia.", 105, finalY, { align: "center" });

        // --- Save PDF ---
        const safeName = currentUser.nombre.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        doc.save(`factura-${safeName}.pdf`);
    });
});
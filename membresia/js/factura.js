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

        const pageMargin = 20;
        const contentWidth = doc.internal.pageSize.getWidth() - (pageMargin * 2);
        const centerPos = doc.internal.pageSize.getWidth() / 2;
        const lineHeight = 7; // Vertical spacing between lines
        let currentY = 25; // Initial Y position, leaving space for header

        // --- Header ---
        doc.setFontSize(20);
        doc.text("Factura de Alquiler", centerPos, currentY, { align: "center" });
        currentY += 15; // Larger gap after main header

        // --- Company and Client Info ---
        doc.setFontSize(12);
        doc.text("Autoservicios Roa H", pageMargin, currentY);
        doc.text(`Cliente: ${currentUser.nombre}`, 120, currentY);
        currentY += lineHeight;

        // Use splitTextToSize for potentially long strings to handle wrapping
        const companyAddressLines = doc.splitTextToSize("La avenida 19 de abril frente al farma todo por el viaducto nuevo", 80); // Max width 80
        const clientAddressLines = doc.splitTextToSize(`Dirección: ${currentUser.direccion || 'N/A'}`, 80);

        doc.text(companyAddressLines, pageMargin, currentY);
        doc.text(clientAddressLines, 120, currentY);

        // Adjust currentY based on the longest of the two address blocks
        const maxLines = Math.max(companyAddressLines.length, clientAddressLines.length);
        currentY += (maxLines * lineHeight) + 8; // Extra gap after addresses

        // --- Invoice Details ---
        doc.setFontSize(14);
        doc.text("Detalles de la Reserva", pageMargin, currentY);
        currentY += lineHeight + 2;

        doc.setFontSize(12);
        doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, pageMargin, currentY);
        currentY += 8; // Margin before table

        // --- Table ---
        doc.autoTable({
            startY: currentY,
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
            headStyles: { fillColor: [22, 160, 133] },
            margin: { left: pageMargin, right: pageMargin }
        });

        // --- Footer ---
        let finalY = doc.lastAutoTable.finalY; // Get Y pos after table
        currentY = finalY + 20;
        doc.setFontSize(12);
        doc.text("Gracias por su preferencia.", centerPos, currentY, { align: "center" });

        // --- Save PDF ---
        const safeName = currentUser.nombre.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        doc.save(`factura-${safeName}.pdf`);
    });
});
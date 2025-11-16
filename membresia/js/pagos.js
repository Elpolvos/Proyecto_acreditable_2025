document.addEventListener('DOMContentLoaded', () => {
    // Asegurarse de que hay una reserva activa para procesar el pago
    const currentReservation = JSON.parse(sessionStorage.getItem('currentReservation'));
    if (!currentReservation) {
        alert("No se ha encontrado ninguna reserva para procesar. Volviendo al dashboard.");
        window.location.href = 'dashboard.html';
        return;
    }

    const paymentOptions = document.querySelectorAll('.payment-option');
    const paymentModal = document.getElementById('payment-modal');
    const modalTitle = document.getElementById('modal-title');
    const paymentForm = document.getElementById('payment-form');
    const cancelPaymentBtn = document.getElementById('cancel-payment-btn');

    // Abrir el modal al seleccionar una opción de pago
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            const paymentMethod = option.getAttribute('data-method');
            modalTitle.textContent = `Pagar con ${paymentMethod}`;
            paymentModal.style.display = 'block';
        });
    });

    // Cerrar el modal al hacer clic en "Cancelar"
    cancelPaymentBtn.addEventListener('click', () => {
        paymentModal.style.display = 'none';
    });

    // Cerrar el modal si se hace clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target == paymentModal) {
            paymentModal.style.display = 'none';
        }
    });

    // Manejar el envío del formulario de pago
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const cardNumber = document.getElementById('card-number').value;
        const cedula = document.getElementById('cedula').value;

        // Validación simple
        if (!cardNumber || !cedula) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        // Simulación de proceso de pago
        console.log(`Procesando pago... Tarjeta: ${cardNumber}, Cédula: ${cedula}`);

        // Ocultar el modal
        paymentModal.style.display = 'none';

        // Mostrar mensaje de éxito y redirigir a la factura
        alert('¡Pago exitoso!');
        window.location.href = 'factura.html';
    });
});

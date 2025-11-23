// Función principal para inicializar la reservación con un nombre de hotel configurable
function inicializarReservacion(hotelNombre) {
    // Variables para los elementos del DOM
    const modal = document.getElementById('miModal');
    const abrirBtn = document.getElementById('abrirModalBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');
    const reservarAhoraBtn = document.getElementById('reservarAhoraBtn');
    const selectIntegrantes = document.getElementById('integrantes');
    const otroIntegrantesDiv = document.getElementById('otroIntegrantesDiv');
    const cantidadOtroInput = document.getElementById('cantidadOtro');

    // --- FUNCIONALIDAD PARA ABRIR Y CERRAR EL MODAL ---

    // Abrir Modal al hacer clic en el botón "Reservar" principal
    abrirBtn.onclick = function() {
        modal.style.display = 'block';
    }

    // Cerrar Modal al hacer clic en el botón "Cancelar"
    cancelarBtn.onclick = function() {
        modal.style.display = 'none';
    }

    // Cerrar Modal si el usuario hace clic fuera del contenido del modal
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    // --- LÓGICA PARA EL CAMPO "INTEGRANTES" ---

    selectIntegrantes.onchange = function() {
        if (selectIntegrantes.value === 'otro') {
            // Mostrar la casilla de texto para "Otro"
            otroIntegrantesDiv.classList.remove('input-hidden');
            cantidadOtroInput.setAttribute('required', 'required');
        } else {
            // Ocultar la casilla de texto para "Otro"
            otroIntegrantesDiv.classList.add('input-hidden');
            cantidadOtroInput.removeAttribute('required');
            cantidadOtroInput.value = ''; // Limpiar el valor
        }
    }

    // --- LÓGICA PARA EL BOTÓN "RESERVAR AHORA" ---

    // Dentro de inicializarReservacion(hotelNombre) - Modifica solo la parte del botón "RESERVAR AHORA"

    reservarAhoraBtn.onclick = async function() {
        const nombre = document.getElementById('nombreHuesped').value;
        const fecha = document.getElementById('fechaReservacion').value;
        const tipoIntegrantes = selectIntegrantes.value;
        let cantidadIntegrantes = '';

        // Validar campos (igual que antes)
        if (!nombre || !fecha || !tipoIntegrantes) {
            alert("Por favor, complete todos los campos requeridos (Nombre, Tipo de Reservación y Fecha).");
            return;
        }

        // Determinar cantidadIntegrantes (igual que antes)
        if (tipoIntegrantes === 'otro') {
            cantidadIntegrantes = cantidadOtroInput.value;
            if (!cantidadIntegrantes || isNaN(cantidadIntegrantes) || parseInt(cantidadIntegrantes) <= 0) {
                alert("Por favor, ingrese una cantidad válida de integrantes para la opción 'Otro'.");
                return;
            }
        } else {
            // Mapea a números para simplificar (ajusta según necesites)
            const mappings = { '1-6': 6, '1-12': 12, '2': 2 };
            cantidadIntegrantes = mappings[tipoIntegrantes] || 1; // Fallback
        }

        // Preparar datos para enviar al backend
        const reservationData = {
            nombreHuesped: nombre,
            fechaReservacion: fecha,
            tipoIntegrantes: tipoIntegrantes,
            cantidadIntegrantes: parseInt(cantidadIntegrantes),
            hotel: hotelNombre // Usando el parámetro
        };

        try {
            // Enviar al backend (ajusta la URL si es diferente)
            const token = localStorage.getItem('token'); // Asume que tienes el JWT guardado
            const response = await fetch('/api/reservation/create', { // URL del endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Para autenticación
                },
                body: JSON.stringify(reservationData)
            });

            if (response.ok) {
                const result = await response.json();
                alert(`✅ ¡Reservación Exitosa!\n\nHuésped: ${nombre}\nTipo/Integrantes: ${tipoIntegrantes}\nFecha: ${fecha}\nReservado en: ${hotelNombre}`);
                // Limpiar formulario (igual que antes)
                document.getElementById('nombreHuesped').value = '';
                document.getElementById('fechaReservacion').value = '';
                selectIntegrantes.value = '';
                otroIntegrantesDiv.classList.add('input-hidden');
                cantidadOtroInput.value = '';
                modal.style.display = 'none';
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error al enviar reservación:', error);
            alert('Error al procesar la reservación. Inténtalo de nuevo.');
        }
    };
}

// Ejemplos de uso: Llama la función con el nombre del hotel/paquete deseado
// Para Hotel 1
inicializarReservacion("La Montaña Mágica");
// Para Hotel 2
inicializarReservacion("Hotel La Palmera Dorada");
// Para Hotel 3
inicializarReservacion("El Paraíso Perdido");
//----------------------------------------------------------
// Para Paquete 1
inicializarReservacion("La Montaña Mágica (Paquete)");
// Para Paquete 2
inicializarReservacion("Hotel La Palmera Dorada (Paquete)");
// Para Paquete 3
inicializarReservacion("El Paraíso Perdido (Paquete)");

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. MANEJO DEL MODAL DE CREAR CUENTA (Se mantiene)
    // ----------------------------------------------------
    const openRegisterButton = document.getElementById('open-register-modal');
    const closeRegisterButton = document.getElementById('close-register-modal');
    const registerModal = document.getElementById('register-modal');

    // Utilities: accessible modal open/close + focus trap
    function getFocusableElements(container) {
        const selectors = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
        return Array.from(container.querySelectorAll(selectors)).filter(el => el.offsetParent !== null);
    }

    function openModal(modalEl) {
        if (!modalEl) return;
        modalEl.setAttribute('aria-hidden', 'false');
        modalEl.style.display = 'flex';
        // save previously focused
        modalEl.__previouslyFocused = document.activeElement;
        // focus first focusable element or the modal content container
        const content = modalEl.querySelector('.modal-content') || modalEl;
        const focusables = getFocusableElements(modalEl);
        if (focusables.length) focusables[0].focus();
        else if (content) content.focus();
        // add keydown handler for Esc and tab trap
        modalEl.__keydownHandler = function (e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeModal(modalEl);
            } else if (e.key === 'Tab') {
                const focusable = getFocusableElements(modalEl);
                if (focusable.length === 0) { e.preventDefault(); return; }
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
                } else {
                    if (document.activeElement === last) { e.preventDefault(); first.focus(); }
                }
            }
        };
        document.addEventListener('keydown', modalEl.__keydownHandler);
    }

    function closeModal(modalEl) {
        if (!modalEl) return;
        modalEl.setAttribute('aria-hidden', 'true');
        modalEl.style.display = 'none';
        // remove key handler
        if (modalEl.__keydownHandler) document.removeEventListener('keydown', modalEl.__keydownHandler);
        // restore focus
        try {
            const prev = modalEl.__previouslyFocused;
            if (prev && typeof prev.focus === 'function') prev.focus();
        } catch (err) { /* ignore */ }
    }

    if (openRegisterButton) openRegisterButton.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(registerModal);
    });
    if (closeRegisterButton) closeRegisterButton.addEventListener('click', () => {
        closeModal(registerModal);
    });

    // ----------------------------------------------------
    // 2. MANEJO DE LA SECUENCIA DE RECUPERACIÓN (NUEVO)
    // ----------------------------------------------------

    // Referencias para el Paso 1
    const openRecoverButton = document.getElementById('open-recover-modal');
    const recoverModalStep1 = document.getElementById('recover-modal-step1');
    const closeStep1Button = document.getElementById('close-recover-modal-step1');
    const goToStep2Button = document.getElementById('go-to-step2');

    // Referencias para el Paso 2
    const recoverModalStep2 = document.getElementById('recover-modal-step2');
    const backToStep1Button = document.getElementById('back-to-step1');

    // ** Lógica para ABRIR el Paso 1 **
    if (openRecoverButton) openRecoverButton.addEventListener('click', (e) => {
        e.preventDefault();
        // Cierra cualquier otro modal abierto (como el de registro)
        closeModal(registerModal);
        // Abre el Paso 1
        openModal(recoverModalStep1);
    });

    // ** Lógica para CERRAR el Paso 1 (Atrás) **
    if (closeStep1Button) closeStep1Button.addEventListener('click', () => {
        closeModal(recoverModalStep1);
    });

    // ** Lógica para pasar del Paso 1 al Paso 2 (Botón "Recuperar") **
    if (goToStep2Button) goToStep2Button.addEventListener('click', (e) => {
        e.preventDefault();
        // Validación básica del correo
        const emailRecoverInput = document.getElementById('email-recover');
        const emailVal = emailRecoverInput ? emailRecoverInput.value.trim() : '';
        if (!emailVal || typeof isValidEmail === 'function' && !isValidEmail(emailVal)) {
            alert('Por favor ingrese un correo electrónico válido para recuperar su contraseña.');
            return;
        }

        // Simular envío de código: generar 4 dígitos y guardarlos en una variable global temporal
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        window.__recoverCode = code; // variable global temporal
        console.log('Código de recuperación (simulado):', code);

        // Mostrar mensaje en la UI del paso 2 para pruebas (simulado)
        const recoverSentMessage = document.getElementById('recoverSentMessage');
        if (recoverSentMessage) {
            recoverSentMessage.style.display = 'block';
            recoverSentMessage.textContent = 'Código enviado (simulado): ' + code + ' — revisa tu correo o SMS.';
        }

        // Cierra el Paso 1 y abre el Paso 2
        closeModal(recoverModalStep1);
        openModal(recoverModalStep2);
    });

    // ** Lógica para regresar del Paso 2 al Paso 1 (Botón "Atrás") **
    if (backToStep1Button) backToStep1Button.addEventListener('click', () => {
        // Cierra el Paso 2
        closeModal(recoverModalStep2);
        // Abre de nuevo el Paso 1
        openModal(recoverModalStep1);
    });

    // Manejar envío del formulario del Paso 2 (validar código)
    const recoverFormStep2 = document.getElementById('recoverFormStep2');
    if (recoverFormStep2) {
        recoverFormStep2.addEventListener('submit', (e) => {
            e.preventDefault();
            const codeInput = document.getElementById('code-recover');
            const entered = codeInput ? codeInput.value.trim() : '';
            const expected = window.__recoverCode || null;
            if (!expected) {
                alert('No se ha enviado ningún código aún. Por favor solicite el código primero.');
                // Volver al paso 1
                closeModal(recoverModalStep2);
                openModal(recoverModalStep1);
                return;
            }
            if (entered === expected) {
                alert('Código correcto. Ahora puede establecer una nueva contraseña o iniciar sesión.');
                // Cerrar modal y limpiar
                closeModal(recoverModalStep2);
                window.__recoverCode = null;
                if (codeInput) codeInput.value = '';
            } else {
                alert('Código incorrecto. Por favor verifique el código enviado.');
            }
        });
    }

});
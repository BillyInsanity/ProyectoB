// =======================================================
// === 1. LÓGICA PARA EL FORMULARIO DE INICIO DE SESIÓN (LOGIN) ===
// =======================================================

// A. Obtener elementos del DOM para LOGIN
const loginForm = document.getElementById('loginForm');
const loginEmailInput = document.getElementById('email');
const loginPasswordInput = document.getElementById('password');
const loginEmailError = document.getElementById('emailError');
const loginPasswordError = document.getElementById('passwordError');

// Función para validar el formato básico de un email (usada por ambos)
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// B. Función principal de validación para LOGIN
function validateLoginForm(event) {
    event.preventDefault();

    let isValid = true;
    const loginFormAlert = document.getElementById('loginFormAlert');
    if (loginFormAlert) { loginFormAlert.style.display = 'none'; loginFormAlert.textContent = ''; }

    // --- VALIDACIÓN DE CORREO ELECTRÓNICO (LOGIN) ---
    const emailValue = loginEmailInput.value.trim();
    loginEmailInput.classList.remove('input-error');
    loginEmailError.textContent = '';

    if (emailValue === '' || !isValidEmail(emailValue)) {
        loginEmailInput.classList.add('input-error');
        loginEmailError.textContent = 'Por favor introduzca un correo válido';
        isValid = false;
    }

    // --- VALIDACIÓN DE CONTRASEÑA (LOGIN) ---
    const passwordValue = loginPasswordInput.value;
    loginPasswordInput.classList.remove('input-error');
    loginPasswordError.textContent = '';

    if (passwordValue.length !== 8) {
        loginPasswordInput.classList.add('input-error');
        loginPasswordError.textContent = 'Por favor introduzca una contraseña de 8 dígitos';
        isValid = false;
    }

    // --- ENVÍO AL BACKEND SI ES VÁLIDO ---
    if (isValid) {
        sendLoginData(emailValue, passwordValue);
    } else {
        if (loginFormAlert) {
            loginFormAlert.style.display = 'block';
            loginFormAlert.textContent = 'Por favor corrija los campos marcados antes de enviar.';
        }
    }
}

// Nueva función: Enviar datos de login al backend
async function sendLoginData(email, password) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            alert(result.message);
            window.location.href = 'index.html';
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error en login:', error);
        alert('Error al iniciar sesión. Inténtelo de nuevo.');
    }
}

// C. Asignar el evento al formulario de LOGIN
if (loginForm) {
    loginForm.addEventListener('submit', validateLoginForm);
}

// ========================================================
// === 2. LÓGICA PARA EL FORMULARIO DE REGISTRO (REGISTER) ===
// ========================================================

// A. Obtener elementos del DOM para REGISTRO
const registerForm = document.getElementById('registerForm');
const registerUsernameInput = document.getElementById('username-reg');
const registerEmailInput = document.getElementById('email-reg');
const registerPasswordInput = document.getElementById('password-reg');
const registerUsernameError = document.getElementById('usernameError');
const registerEmailError = document.getElementById('emailError-reg') || document.getElementById('emailErrordos');
const registerPasswordError = document.getElementById('passwordError-reg') || document.getElementById('passwordErrordos');

// B. Función principal para validar el formulario de REGISTRO
function validateRegisterForm() {
    let isValid = true;

    // --- 1. Validar Nombre de Usuario (REGISTRO) ---
    if (registerUsernameInput && registerUsernameInput.value.trim() === '') {
        registerUsernameInput.classList.add('input-error');
        if (registerUsernameError) registerUsernameError.textContent = 'Por favor introduzca un nombre de usuario';
        isValid = false;
    } else if (registerUsernameInput) {
        registerUsernameInput.classList.remove('input-error');
        if (registerUsernameError) registerUsernameError.textContent = '';
    }

    // --- 2. Validar Correo Electrónico (REGISTRO) ---
    if (registerEmailInput && !isValidEmail(registerEmailInput.value)) {
        registerEmailInput.classList.add('input-error');
        if (registerEmailError) registerEmailError.textContent = 'Por favor introduzca un correo valido';
        isValid = false;
    } else if (registerEmailInput) {
        registerEmailInput.classList.remove('input-error');
        if (registerEmailError) registerEmailError.textContent = '';
    }

    // --- 3. Validar Contraseña (8 dígitos exactos) (REGISTRO) ---
    if (registerPasswordInput && registerPasswordInput.value.length !== 8) {
        registerPasswordInput.classList.add('input-error');
        if (registerPasswordError) registerPasswordError.textContent = 'Por favor cree una contraseña de 8 dígitos';
        isValid = false;
    } else if (registerPasswordInput) {
        registerPasswordInput.classList.remove('input-error');
        if (registerPasswordError) registerPasswordError.textContent = '';
    }

    return isValid;
}

// Nueva función: Enviar datos de registro al backend
async function sendRegisterData(nombre, email, password) {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password })
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            window.location.href = 'index.html';
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error en registro:', error);
        alert('Error al registrar. Inténtelo de nuevo.');
    }
}

// C. Escuchamos el evento de envío del formulario de REGISTRO
if (registerForm) {
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const registerFormAlert = document.getElementById('registerFormAlert');
        if (registerFormAlert) { registerFormAlert.style.display = 'none'; registerFormAlert.textContent = ''; }

        if (validateRegisterForm()) {
            const nombre = registerUsernameInput.value.trim();
            const email = registerEmailInput.value.trim();
            const password = registerPasswordInput.value;
            sendRegisterData(nombre, email, password);
        } else {
            if (registerFormAlert) {
                registerFormAlert.style.display = 'block';
                registerFormAlert.textContent = 'Completa los campos requeridos marcados.';
            }
            console.log('Validación de registro fallida. Revise los campos.');
        }
    });

    // Opcional: Validar al perder el foco
    if (registerUsernameInput) registerUsernameInput.addEventListener('blur', validateRegisterForm);
    if (registerEmailInput) registerEmailInput.addEventListener('blur', validateRegisterForm);
    if (registerPasswordInput) registerPasswordInput.addEventListener('blur', validateRegisterForm);
}

// ==============================================
// 3. FLUJO DE RECUPERACIÓN (ENVÍO Y VERIFICACIÓN)
// ==============================================

const RECOVERY_API = {
    send: null, // null para modo simulado
    verify: null
};

const recoverStep1 = document.getElementById('recover-modal-step1');
const recoverStep2 = document.getElementById('recover-modal-step2');
const goToStep2Btn = document.getElementById('go-to-step2');
const closeRecoverStep1Btn = document.getElementById('close-recover-modal-step1');
const backToStep1Btn = document.getElementById('back-to-step1');
const recoverSentMessage = document.getElementById('recoverSentMessage');
const recoverFormStep2 = document.getElementById('recoverFormStep2');
const emailRecoverInput = document.getElementById('email-recover');
const codeRecoverInput = document.getElementById('code-recover');

function simulateSendCode(email) {
    return new Promise((resolve) => {
        const code = ('' + Math.floor(1000 + Math.random() * 9000));
        window.__recoverCode = code;
        console.info('Simulated recover code for', email, ':', code);
        setTimeout(() => resolve({ ok: true, simulated: true }), 700);
    });
}

function simulateVerifyCode(email, code) {
    return new Promise((resolve) => {
        const ok = (window.__recoverCode && String(code).trim() === String(window.__recoverCode));
        setTimeout(() => resolve({ ok }), 300);
    });
}

async function sendRecoveryCode(email) {
    if (!email) throw new Error('Email requerido');
    if (RECOVERY_API.send) {
        try {
            const res = await fetch(RECOVERY_API.send, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            return { ok: res.ok, data };
        } catch (err) {
            return { ok: false, error: String(err) };
        }
    }
    return simulateSendCode(email);
}

async function verifyRecoveryCode(email, code) {
    if (!email || !code) return { ok: false };
    if (RECOVERY_API.verify) {
        try {
            const res = await fetch(RECOVERY_API.verify, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });
            const data = await res.json();
            return { ok: res.ok, data };
        } catch (err) {
            return { ok: false, error: String(err) };
        }
    }
    return simulateVerifyCode(email, code);
}

function showModal(el) { if (!el) return; el.style.display = 'flex'; }
function hideModal(el) { if (!el) return; el.style.display = 'none'; }

if (goToStep2Btn) {
    goToStep2Btn.addEventListener('click', async () => {
        const email = emailRecoverInput ? emailRecoverInput.value.trim() : '';
        if (!email || !isValidEmail(email)) {
            alert('Introduce un correo válido para recuperar la contraseña.');
            return;
        }

        if (recoverSentMessage) { recoverSentMessage.style.display = 'block'; recoverSentMessage.style.color = 'black'; recoverSentMessage.textContent = 'Enviando código...'; }

        const result = await sendRecoveryCode(email);

        if (result && result.ok) {
            if (result.simulated && result.code) {
                if (recoverSentMessage) {
                    recoverSentMessage.style.display = 'block';
                    recoverSentMessage.style.color = 'green';
                    recoverSentMessage.textContent = `Código enviado (simulado): ${result.code} — úsalo para verificar.`;
                }
            } else {
                if (recoverSentMessage) { recoverSentMessage.style.display = 'block'; recoverSentMessage.style.color = 'green'; recoverSentMessage.textContent = 'Código enviado. Revisa tu correo (o SMS).'; }
            }
            hideModal(recoverStep1);
            showModal(recoverStep2);
        } else {
            const msg = (result && result.error) ? result.error : 'Error al enviar el código. Intente de nuevo.';
            if (recoverSentMessage) { recoverSentMessage.style.display = 'block'; recoverSentMessage.style.color = 'red'; recoverSentMessage.textContent = msg; }
        }
    });
}

if (backToStep1Btn) {
    backToStep1Btn.addEventListener('click', () => {
        hideModal(recoverStep2);
        showModal(recoverStep1);
    });
}

if (closeRecoverStep1Btn) {
    closeRecoverStep1Btn.addEventListener('click', () => hideModal(recoverStep1));
}

if (recoverFormStep2) {
    recoverFormStep2.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailRecoverInput ? emailRecoverInput.value.trim() : '';
        const code = codeRecoverInput ? codeRecoverInput.value.trim() : '';
        if (!code || code.length < 3) {
            alert('Introduce el código de 4 dígitos recibido.');
            return;
        }

        const verification = await verifyRecoveryCode(email, code);
        if (verification && verification.ok) {
            alert('Código verificado. Ahora puedes restablecer tu contraseña. (Simulado)');
            hideModal(recoverStep2);
            window.location.href = 'index.html';
        } else {
            alert('Código incorrecto o expirado. Verifica e intenta de nuevo.');
        }
    });
}

// Verificar sesión al cargar
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
        const userDisplay = document.getElementById('user-display');
        if (userDisplay) userDisplay.textContent = `Bienvenido, ${user.nombre}`;
    }
});
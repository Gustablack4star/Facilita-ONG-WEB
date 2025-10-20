//menu mobile
const menuToggle = document.querySelector('.menu-toggle');
const mainMenu = document.getElementById('main-menu');

if (menuToggle && mainMenu) {
    menuToggle.addEventListener('click', function() {
        mainMenu.classList.toggle('active');
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
        menuToggle.setAttribute('aria-expanded', !isExpanded);
    });
}


//LÓGICA DE MÁSCARAS DE INPUT 

const cleanValue = (value) => value.replace(/\D/g, '');

// --- Máscara de CPF (000.000.000-00) ---
function maskCPF(e) {
    let value = cleanValue(e.target.value);
    // Limita a 11 dígitos
    value = value.substring(0, 11);

    if (value.length > 9) {
        value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
        value = value.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1.$2.$3');
    } else if (value.length > 3) {
        value = value.replace(/^(\d{3})(\d{3})$/, '$1.$2');
    } else if (value.length > 0) {
        value = value.replace(/^(\d{3})$/, '$1');
    }
    e.target.value = value;
}

// --- Máscara de Telefone/Celular ((99) 99999-9999) ---
function maskPhone(e) {
    let value = cleanValue(e.target.value);
    // Limita a 11 dígitos
    value = value.substring(0, 11);

    if (value.length > 10) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3'); // Celular (11 dígitos)
    } else if (value.length > 6) {
        value = value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3'); // Fixo (10 dígitos)
    } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d+)$/, '($1) $2');
    } else if (value.length > 0) {
        value = value.replace(/^(\d+)$/, '($1');
    }
    e.target.value = value;
}

// --- Máscara de CEP (00000-000) ---
function maskCEP(e) {
    let value = cleanValue(e.target.value);
    // Limita a 8 dígitos
    value = value.substring(0, 8);
    
    if (value.length > 5) {
        value = value.replace(/^(\d{5})(\d{3})$/, '$1-$2');
    }
    e.target.value = value;
}

// Aplica os event listeners após o carregamento da página
document.addEventListener('DOMContentLoaded', () => {
    const inputCPF = document.getElementById('cpf');
    const inputTelefone = document.getElementById('telefone');
    const inputCEP = document.getElementById('cep');

    if (inputCPF) {
        inputCPF.addEventListener('input', maskCPF);
    }
    if (inputTelefone) {
        inputTelefone.addEventListener('input', maskPhone);
    }
    if (inputCEP) {
        inputCEP.addEventListener('input', maskCEP);
    }
    
    // Simulação de Progresso (função original)
    const fill = document.querySelector('.progress-bar-fill');
    if (fill) {
        fill.style.width = fill.style.width; 
    }
});

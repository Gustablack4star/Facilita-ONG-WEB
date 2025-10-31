// ===============================================
// validation.js - Lógica de Validação de Formulários
// ===============================================

// Expressões Regulares para validação de consistência
const REGEX = {
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    password: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/, // Mínimo 8 caracteres, 1 maiúscula, 1 número, 1 símbolo
    date: /^\d{4}-\d{2}-\d{2}$/, // Formato YYYY-MM-DD
    phone: /^\(\d{2}\) \d{4,5}-\d{4}$/ // Exemplo (99) 99999-9999
};

/**
 * Cria e insere uma mensagem de feedback (erro) sob o campo.
 * @param {HTMLElement} input - O campo de formulário.
 * @param {string} message - A mensagem de erro a ser exibida.
 */
function displayFeedback(input, message) {
    let feedback = input.nextElementSibling;
    
    // Se não existir, cria a div de feedback
    if (!feedback || !feedback.classList.contains('validation-feedback')) {
        feedback = document.createElement('div');
        feedback.classList.add('validation-feedback');
        // WCAG: Adiciona role alert para que leitores de tela anunciem o erro
        feedback.setAttribute('role', 'alert'); 
        input.parentNode.insertBefore(feedback, input.nextSibling);
    }
    
    feedback.textContent = message;
    feedback.style.display = 'block';
    // WCAG: Adiciona aria-describedby para ligar o campo ao feedback
    input.setAttribute('aria-describedby', input.id + '-feedback');
    feedback.id = input.id + '-feedback';
}

/**
 * Remove a mensagem de feedback.
 * @param {HTMLElement} input - O campo de formulário.
 */
function removeFeedback(input) {
    const feedback = input.nextElementSibling;
    if (feedback && feedback.classList.contains('validation-feedback')) {
        feedback.style.display = 'none';
    }
    input.removeAttribute('aria-describedby');
}


/**
 * Executa a validação de um campo individualmente.
 * @param {HTMLElement} input - O campo de formulário.
 * @returns {boolean} - Retorna true se o campo for válido, false caso contrário.
 */
function validateField(input) {
    // Campos ignorados 
    if (input.type === 'submit' || input.type === 'reset' || input.type === 'hidden') return true;
    
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Validação de campo obrigatório 
    if (input.required && value === '' || (input.tagName === 'SELECT' && value === '')) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório.';
    } 
    
    // Validação por tipo 
    else if (input.type === 'email' && !REGEX.email.test(value)) {
        isValid = false;
        errorMessage = 'Por favor, insira um endereço de e-mail válido.';
    } 
    
    // Validação de Senha 
    else if (input.type === 'password' && input.name.toLowerCase().includes('senha') && !REGEX.password.test(value)) {
        isValid = false;
        errorMessage = 'A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, um número e um símbolo (!@#$...).';
    }
    
    //Validação de Data 
    else if (input.type === 'date' && !REGEX.date.test(value)) {
        isValid = false;
        errorMessage = 'Formato de data inválido (AAAA-MM-DD).';
    }
    
    // 5. Validação de Número Mínimo/Máximo
    else if (input.type === 'number') {
        const min = input.getAttribute('min');
        const max = input.getAttribute('max');
        const numValue = parseFloat(value);

        if (min && numValue < parseFloat(min)) {
            isValid = false;
            errorMessage = `O valor mínimo é ${min}.`;
        } else if (max && numValue > parseFloat(max)) {
            isValid = false;
            errorMessage = `O valor máximo é ${max}.`;
        }
    }


    // Aplica os estilos e feedback
    input.classList.toggle('is-invalid', !isValid);
    input.classList.toggle('is-valid', isValid && value !== '');
    
    if (!isValid) {
        displayFeedback(input, errorMessage);
        // WCAG: Adiciona aria-invalid quando inválido
        input.setAttribute('aria-invalid', 'true'); 
    } else {
        removeFeedback(input);
        input.removeAttribute('aria-invalid');
    }

    return isValid;
}


/**
 * Função principal para inicializar a validação em todos os formulários.
function initValidation() {
    // Encontra todos os formulários com o atributo data-validate="true"
    const formsToValidate = document.querySelectorAll('form[data-validate="true"]');

    formsToValidate.forEach(form => {
        // Remove listeners antigos para evitar duplicação no SPA
        form.removeEventListener('submit', handleSubmit);
        form.removeEventListener('input', handleInput);
        form.removeEventListener('change', handleInput); // para selects e radio/checkbox

        // Adiciona listeners
        form.addEventListener('submit', handleSubmit);
        // Validação em tempo real (WCAG)
        form.addEventListener('input', handleInput);
        form.addEventListener('change', handleInput); 
    });
}

/**
 * Manipulador de evento para o envio do formulário.
 */
function handleSubmit(e) {
    let form = e.currentTarget;
    let allValid = true;
    
    // Valida todos os campos no submit
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (!validateField(input)) {
            allValid = false;
        }
    });

    if (!allValid) {
        e.preventDefault(); // Impede o envio se houver campos inválidos
        
        // WCAG: Foca no primeiro campo inválido
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
            firstInvalid.focus();
        }
    } else {
        // Se válido, simula um envio bem-sucedido com feedback visual
        e.preventDefault(); 
        
        // Exibe mensagem de sucesso 
        const successMessage = document.createElement('div');
        successMessage.className = 'alert success';
        successMessage.textContent = 'Formulário enviado com sucesso (Simulação)!';
        form.parentNode.insertBefore(successMessage, form);

        // Oculta o formulário e remove o feedback
        form.style.display = 'none';
        
        // Remove a mensagem após 5 segundos
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }
}

function handleInput(e) {
    // Valida o campo que disparou o evento
    validateField(e.target);
}


// Inicializa a validação quando a página carrega pela primeira vez
document.addEventListener('DOMContentLoaded', initValidation);

// Torna a função de inicialização global para ser usada pelo SPA (main.js)
window.initValidation = initValidation;

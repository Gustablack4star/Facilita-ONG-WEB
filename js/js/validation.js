
// Se for rodado via SPA, precisa ser global
const setupValidation = () => {
    // Seleciona todos os formulários que precisam de validação
    const forms = document.querySelectorAll('form[data-validate="true"]');
    
    // Expressões regulares para validação
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Mapeamento de regras de validação por campo (pode ser expandido)
    const validationRules = {
        'email': (value) => emailRegex.test(value.trim()),
        'required': (value) => value.trim().length > 0,
        'date': (value) => !isNaN(new Date(value)),
        'min-length-8': (value) => value.trim().length >= 8,
    };

    // Função que aplica o feedback visual no campo
    const displayFeedback = (input, isValid, message = '') => {
        const fieldGroup = input.closest('.field-group');
        let feedback = fieldGroup ? fieldGroup.querySelector('.validation-feedback') : null;
        
        if (!feedback) {
            // Cria o elemento de feedback se ele não existir
            feedback = document.createElement('p');
            feedback.classList.add('validation-feedback');
            // Adiciona o elemento de feedback APÓS o campo de input
            input.parentNode.insertBefore(feedback, input.nextSibling);
        }

        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            feedback.textContent = '';
            feedback.style.display = 'none';
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            feedback.textContent = message;
            feedback.style.display = 'block';
        }
    };
    
    // Função principal de validação de um campo específico
    const validateField = (input) => {
        let isValid = true;
        let errorMessage = '';
        const value = input.value;
        
        // Verifica a regra de required
        if (input.required && !validationRules['required'](value)) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório.';
        } 
        
        // Verifica o tipo 'email'
        else if (input.type === 'email' && !validationRules['email'](value)) {
            isValid = false;
            errorMessage = 'Por favor, insira um endereço de e-mail válido.';
        }
        
        // Verifica o atributo data-minlength
        else if (input.dataset.minlength && value.trim().length < parseInt(input.dataset.minlength)) {
            isValid = false;
            errorMessage = `Mínimo de ${input.dataset.minlength} caracteres.`;
        }

        // Verifica a validação de data
        else if (input.type === 'date' && !validationRules['date'](value)) {
             isValid = false;
             errorMessage = 'Por favor, insira uma data válida.';
        }
        
        // Aplica o feedback visual
        displayFeedback(input, isValid, errorMessage);
        
        return isValid;
    };
    
    // Adiciona event listeners para validação em tempo real
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        // Validação no evento blur
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateField(input);
            });
            
            // Validação no evento input
            if (input.type === 'email' || input.dataset.minlength) {
                 input.addEventListener('input', () => {
                    validateField(input);
                });
            }
        });
        
        // Validação no SUBMIT do formulário
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let formIsValid = true;
            
            // Valida todos os campos antes de enviar
            inputs.forEach(input => {
                if (!validateField(input)) {
                    formIsValid = false;
                }
            });
            
            if (formIsValid) {
                // Se tudo estiver válido, simula o envio e exibe um alerta de sucesso
                console.log('Formulário enviado com sucesso!');
                
                // Exibe um alert customizado de sucesso
                const alertSuccess = document.createElement('div');
                alertSuccess.classList.add('alert', 'success');
                alertSuccess.textContent = 'Obrigado! Seu formulário foi enviado com sucesso. Entraremos em contato em breve.';
                
                // Adiciona o alerta acima do formulário
                form.insertAdjacentElement('beforebegin', alertSuccess);

                // Limpa o formulário e remove o alerta após 5 segundos
                form.reset();
                setTimeout(() => {
                    alertSuccess.remove();
                }, 5000);
                
            } else {
                console.log('Formulário possui erros de validação. O envio foi bloqueado.');
                // Rola para o primeiro campo inválido
                form.querySelector('.is-invalid').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
};

// Se a página não for carregada via SPA, inicializa a validação na carga do DOM
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        setupValidation();
    });
}

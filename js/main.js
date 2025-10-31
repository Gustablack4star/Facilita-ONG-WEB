// main.js -SPA, Menu, Acessibilidade

document.addEventListener('DOMContentLoaded', () => {
    // LÓGICA DO MENU MOBILE 
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.getElementById('main-menu');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            // Alterna o estado do menu
            const isExpanded = mainMenu.classList.toggle('active');
            
            // WCAG: Atualiza o atributo aria-expanded para leitores de tela
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Lógica para dropdowns funciona no desktop com hover e no mobile com click
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        // WCAG: Adiciona atributo para indicar que é um menu dropdown
        link.setAttribute('aria-haspopup', 'true');
        link.setAttribute('aria-expanded', 'false');

        // Toggle do dropdown no click para mobile/acessibilidade por teclado
        link.addEventListener('click', (e) => {
            // Evita a navegação para o link pai se for um click no mobile
            if (window.innerWidth < 768) {
                 e.preventDefault();
            }
            
            // Alterna a classe 'active' apenas se o menu estiver em modo mobile
            if (window.innerWidth < 768) {
                const isActive = dropdown.classList.toggle('active');
                link.setAttribute('aria-expanded', isActive);
            }
        });

        // Adiciona evento de teclado para fechar o dropdown com ESC (WCAG)
        dropdown.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                dropdown.classList.remove('active');
                link.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // LÓGICA DO SPA BÁSICO 
    
    // Função para carregar o conteúdo principal de uma URL
    const loadContent = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Erro ao carregar a página: ' + response.statusText);
            
            const html = await response.text();
            
            // Cria um contêiner temporário para analisar o HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Encontra o conteúdo principal do novo documento
            const newContent = doc.querySelector('#main-content');
            
            if (newContent) {
                const mainContainer = document.getElementById('main-content');
                // Substitui o conteúdo principal
                mainContainer.innerHTML = newContent.innerHTML;
                
                // Atualiza o título da página
                document.title = doc.title;
                
                // Rola para o topo e re-inicializa validações/eventos
                window.scrollTo(0, 0);
                // Verifica se a função de validação existe garantido pelo escopo global
                if (typeof window.initValidation === 'function') {
                    window.initValidation();
                }
            } else {
                console.error("Conteúdo principal (#main-content) não encontrado na página carregada.");
            }
        } catch (error) {
            console.error('Falha ao carregar o conteúdo SPA:', error);
            // Em caso de falha, redireciona o usuário para a página completa fallback
            window.location.href = url;
        }
    };

    // Função que lida com o clique nos links
    const handleLinkClick = (e) => {
        const link = e.currentTarget;
        const url = link.getAttribute('href');

        // Verifica se o link é interno e não é um link para âncora (#)
        if (url && (url.startsWith('/') || url.startsWith('./') || url.endsWith('.html'))) {
            // Links que levam a um novo formulário ou seção que não queremos processar
            if (link.classList.contains('cta-button') || url.includes('#')) {
                return; // Deixa o navegador lidar com o link CTA ou âncora
            }

            e.preventDefault(); // Impede a recarga da página
            
            // Esconde o menu mobile se estiver aberto
            mainMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', false);

            // Carrega o novo conteúdo e atualiza o histórico do navegador
            loadContent(url);
            history.pushState(null, '', url);
        }
    };

    // Adiciona o listener para todos os links na navegação
    document.addEventListener('click', (e) => {
        // Verifica se o elemento clicado é um link dentro do menu principal ou cabeçalho,
        // mas não um botão CTA que deve recarregar a página ou ser um link externo
        if (e.target.matches('#main-menu a:not(.cta-button), header a:not(.cta-button)')) {
            handleLinkClick(e);
        }
    });

    // Lida com a navegação do histórico 
    window.addEventListener('popstate', () => {
        loadContent(window.location.pathname);
    });
    
    // ACESSIBILIDADE ALTO CONTRASTE WCAG
    const HIGH_CONTRAST_KEY = 'highContrastEnabled';
    const body = document.body;
    const contrastToggle = document.getElementById('high-contrast-toggle');

    // Carrega a preferência de alto contraste do armazenamento local
    const loadContrastSetting = () => {
        const isEnabled = localStorage.getItem(HIGH_CONTRAST_KEY) === 'true';
        if (isEnabled) {
            body.classList.add('high-contrast');
            if (contrastToggle) {
                contrastToggle.setAttribute('aria-pressed', 'true');
            }
        } else {
            body.classList.remove('high-contrast');
            if (contrastToggle) {
                contrastToggle.setAttribute('aria-pressed', 'false');
            }
        }
    };

    // Alterna o estado de alto contraste
    const toggleHighContrast = () => {
        const isEnabled = body.classList.toggle('high-contrast');
        localStorage.setItem(HIGH_CONTRAST_KEY, isEnabled);
        
        // WCAG: Atualiza o atributo aria-pressed
        if (contrastToggle) {
            contrastToggle.setAttribute('aria-pressed', isEnabled);
            
            // Feedback simples no console
            const currentMode = isEnabled ? "Modo Alto Contraste Ativado" : "Modo Padrão Ativado";
            console.log(currentMode);
        }
    };

    if (contrastToggle) {
        // Evento de click para alternar
        contrastToggle.addEventListener('click', toggleHighContrast);
        
        // WCAG: Define o papel e o estado inicial para leitores de tela
        contrastToggle.setAttribute('role', 'button');
        contrastToggle.setAttribute('aria-label', 'Alternar Modo de Alto Contraste');
    }

    // Carrega a configuração na inicialização
    loadContrastSetting();
});
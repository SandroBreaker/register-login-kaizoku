// Protocolo Zero-Bug: Espera o DOM carregar.
document.addEventListener('DOMContentLoaded', () => {

    // --- Seletores de Navegação ---
    const screens = document.querySelectorAll('.screen');
    const navButtons = document.querySelectorAll('.nav-item');
    
    // --- Seletores do Modal de Depósito ---
    const depositModal = document.getElementById('deposit-modal');
    const openModalBtn = document.getElementById('btn-depositar');
    const closeModalBtn = document.getElementById('modal-close');
    const depositInput = document.getElementById('deposit-amount-input');
    const depositDisplay = document.getElementById('deposit-value-display');
    const presetButtons = document.querySelectorAll('.preset-amount');
    const copyPixBtn = document.getElementById('btn-copy-pix');
    const pixCodeInput = document.getElementById('pix-code-string');

    // --- Constantes ---
    const DEFAULT_DEPOSIT = 50.00; // Valor padrão definido

    // ===================================
    // FUNÇÕES DE LÓGICA
    // ===================================

    /**
     * [FUNÇÃO EXISTENTE]
     * Lê o usuário do localStorage e atualiza a UI.
     */
    function initializeUserData() {
        const userEmail = localStorage.getItem('currentUserEmail');
        
        if (!userEmail) {
            // Fallback se não houver usuário (ex: abriu home.html direto)
            console.warn('Nenhum usuário logado. Usando dados padrão.');
            // Os dados padrão (Nome do Player) já estão no HTML.
            return; 
        }

        // UX: Converte o e-mail em um nome de exibição (ex: 'user@email.com' -> 'user')
        const displayName = userEmail.split('@')[0];

        // Atualiza o header (usando o ID robusto)
        const headerName = document.getElementById('header-user-name');
        if (headerName) {
            headerName.textContent = displayName;
        }

        // Atualiza o perfil (usando o ID robusto)
        const profileName = document.getElementById('profile-user-name');
        if (profileName) {
            profileName.textContent = displayName;
        }
    }


    /**
     * [FUNÇÃO EXISTENTE]
     * Centraliza a atualização do valor de depósito.
     * Garante que Input e Display estejam sempre sincronizados.
     * @param {string|number} amount - O valor a ser definido.
     */
    function updateDepositValue(amount) {
        // Converte para número e formata
        let numericAmount = parseFloat(amount);
        
        // Proteção contra valores inválidos (NaN, null, < 0)
        if (isNaN(numericAmount) || numericAmount < 0) {
            numericAmount = DEFAULT_DEPOSIT;
        }
        
        const formattedAmount = numericAmount.toFixed(2);
        
        // Atualiza ambos os elementos
        depositInput.value = formattedAmount;
        depositDisplay.textContent = `R$ ${formattedAmount.replace('.', ',')}`; // Formato BR
    }

    /**
     * [FUNÇÃO AJUSTADA - LÓGICA ZERO-BUG]
     * Alterna a tela visível e atualiza o estado 'active' da navegação.
     * Inclui a correção para fechar o modal (card do jogo/depósito) ao navegar.
     * @param {string} targetId - O ID da tela a ser mostrada (ex: 'tela-inicio').
     */
    function switchScreen(targetId) {
        // AJUSTE CRÍTICO (UX/CX): Fechar o modal ao mudar de tela garante que
        // o overlay não persista e bloqueie interações em outras telas.
        // Se a solicitação do usuário implica que o modal estava aberto na home,
        // ele DEVE ser fechado ao navegar para outra tela.
        if (depositModal && !depositModal.classList.contains('hidden')) {
            toggleModal(false);
        }

        // 1. Esconde todas as telas
        screens.forEach(screen => {
            screen.classList.add('hidden');
            screen.classList.remove('active');
        });

        // 2. Mostra a tela alvo
        const targetScreen = document.getElementById(targetId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            targetScreen.classList.add('active');
        }

        // 3. Atualiza o estado 'active' da navegação
        navButtons.forEach(btn => {
            // Compara o ID do botão (ex: 'nav-home') com o ID da tela (ex: 'tela-home')
            const screenName = btn.id.split('-')[1]; // 'home', 'bonus', 'perfil'
            if (targetId.includes(screenName)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * [FUNÇÃO EXISTENTE]
     * Gerencia a visibilidade do modal.
     * @param {boolean} show - True para mostrar, false para esconder.
     */
    function toggleModal(show) {
        if (show) {
            // UX: Ao abrir, garante que o valor exibido está sincronizado com o input
            updateDepositValue(depositInput.value); 
            depositModal.classList.remove('hidden');
        } else {
            depositModal.classList.add('hidden');
        }
    }

    /**
     * [FUNÇÃO EXISTENTE]
     * Copia o código PIX para a área de transferência com feedback de UX.
     */
    async function copyPixCode() {
        try {
            await navigator.clipboard.writeText(pixCodeInput.value);
            copyPixBtn.textContent = 'Copiado!'; // Feedback UX
            
            // Usando variáveis de cor do tema
            copyPixBtn.style.backgroundColor = '#28a745'; // Sucesso (verde)

            setTimeout(() => {
                copyPixBtn.textContent = 'Copiar Código';
                // Lógica Zero-Bug: Usar 'var(--accent)' é mais robusto
                copyPixBtn.style.backgroundColor = 'var(--accent)'; 
            }, 2000);
        } catch (err) {
            console.error('Falha ao copiar:', err);
            copyPixBtn.textContent = 'Falhou!'; // Feedback UX
            // Lógica Zero-Bug: Usar 'var(--luffy)' é mais robusto
            copyPixBtn.style.backgroundColor = 'var(--luffy)'; 
        }
    }

    // ===================================
    // INICIALIZAÇÃO E EVENT LISTENERS
    // ===================================

    // 1. Navegação Principal
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const screenName = e.currentTarget.id.split('-')[1]; // 'home', 'bonus', 'perfil'
            switchScreen(`tela-${screenName}`);
        });
    });

    // 2. Modal de Depósito
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => toggleModal(true));
    }
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => toggleModal(false));
    }
    
    // UX: Clicar fora do modal (no overlay) também fecha
    depositModal.addEventListener('click', (e) => {
        if (e.target === depositModal) { // Verifica se o clique foi no overlay
            toggleModal(false);
        }
    });

    // 3. Lógica de Valores de Depósito
    
    // Atualiza o display quando o usuário digita no input
    depositInput.addEventListener('input', (e) => {
        // Apenas atualiza o display; o valor real é formatado no 'blur' (ao sair)
        let value = e.target.value.replace(',', '.');
        depositDisplay.textContent = `R$ ${value || '0,00'}`;
    });

    // Garante a formatação correta quando o usuário sai do input
    depositInput.addEventListener('blur', (e) => {
        updateDepositValue(e.target.value);
    });

    // Atualiza input/display ao clicar nos botões de preset
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.dataset.value; // Pega o valor do 'data-value'
            updateDepositValue(value);
        });
    });

    // 4. Copiar PIX
    copyPixBtn.addEventListener('click', copyPixCode);

    // 5. Estado Inicial
    initializeUserData(); // Carrega dados do usuário
    updateDepositValue(DEFAULT_DEPOSIT); // Define o valor padrão no carregamento
    switchScreen('tela-inicio'); // Garante que a tela 'Início' é a primeira a ser vista

});

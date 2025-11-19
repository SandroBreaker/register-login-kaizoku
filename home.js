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

    // --- Constantes e Templates ---
    const DEFAULT_DEPOSIT = 50.00;

    // [NOVO] Template HTML do Card do Jogo (O "Modal" da Home)
    // Isso garante que temos a estrutura original salva na memória do JS.
    const GAME_CARD_TEMPLATE = `
        <section class="game-wallpaper">
            <a href="https://sandrobreaker.github.io/kaizouku-slot/" class="btn-play">Jogar</a>
        </section>
    `;

    // ===================================
    // FUNÇÕES DE LÓGICA
    // ===================================

    /**
     * [NOVA FUNÇÃO CRÍTICA]
     * Renderiza o Card do Jogo dinamicamente.
     * Limpa a tela inicial e injeta o HTML novo para evitar que ele suma.
     */
    function renderHome() {
        const homeScreen = document.getElementById('tela-inicio');
        if (homeScreen) {
            // 1. Limpa o conteúdo atual (Sanitize)
            homeScreen.innerHTML = ''; 
            // 2. Injeta o "Modal/Card" do zero (Re-hydrate)
            homeScreen.innerHTML = GAME_CARD_TEMPLATE;
        }
    }

    /**
     * Lê o usuário do localStorage e atualiza a UI.
     */
    function initializeUserData() {
        const userEmail = localStorage.getItem('currentUserEmail');
        
        if (!userEmail) {
            console.warn('Nenhum usuário logado. Usando dados padrão.');
            return; 
        }

        const displayName = userEmail.split('@')[0];
        const headerName = document.getElementById('header-user-name');
        if (headerName) headerName.textContent = displayName;
        
        const profileName = document.getElementById('profile-user-name');
        if (profileName) profileName.textContent = displayName;
    }

    /**
     * Centraliza a atualização do valor de depósito.
     */
    function updateDepositValue(amount) {
        let numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount < 0) {
            numericAmount = DEFAULT_DEPOSIT;
        }
        const formattedAmount = numericAmount.toFixed(2);
        depositInput.value = formattedAmount;
        depositDisplay.textContent = `R$ ${formattedAmount.replace('.', ',')}`;
    }

    /**
     * [FUNÇÃO AJUSTADA]
     * Alterna a tela visível e dispara a renderização da Home se necessário.
     */
    function switchScreen(targetId) {
        // 1. Gerenciamento de Estado: Se for para a Home, recria o card.
        if (targetId === 'tela-inicio') {
            renderHome(); // <--- A MÁGICA ACONTECE AQUI
        }

        // 2. Esconde todas as telas
        screens.forEach(screen => {
            screen.classList.add('hidden');
            screen.classList.remove('active');
        });

        // 3. Mostra a tela alvo
        const targetScreen = document.getElementById(targetId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            targetScreen.classList.add('active');
        }

        // 4. Atualiza navegação
        navButtons.forEach(btn => {
            const screenName = btn.id.split('-')[1];
            if (targetId.includes(screenName)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * Gerencia a visibilidade do modal de depósito.
     */
    function toggleModal(show) {
        if (show) {
            updateDepositValue(depositInput.value); 
            depositModal.classList.remove('hidden');
        } else {
            depositModal.classList.add('hidden');
        }
    }

    /**
     * Copia o código PIX.
     */
    async function copyPixCode() {
        try {
            await navigator.clipboard.writeText(pixCodeInput.value);
            copyPixBtn.textContent = 'Copiado!'; 
            copyPixBtn.style.backgroundColor = '#28a745'; 
            setTimeout(() => {
                copyPixBtn.textContent = 'Copiar Código';
                copyPixBtn.style.backgroundColor = 'var(--accent)'; 
            }, 2000);
        } catch (err) {
            console.error('Falha ao copiar:', err);
            copyPixBtn.textContent = 'Falhou!';
            copyPixBtn.style.backgroundColor = 'var(--luffy)'; 
        }
    }

    // ===================================
    // INICIALIZAÇÃO E EVENT LISTENERS
    // ===================================

    // 1. Navegação Principal
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const screenName = e.currentTarget.id.split('-')[1]; 
            switchScreen(`tela-${screenName}`);
        });
    });

    // 2. Modal de Depósito
    if (openModalBtn) openModalBtn.addEventListener('click', () => toggleModal(true));
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => toggleModal(false));
    
    depositModal.addEventListener('click', (e) => {
        if (e.target === depositModal) toggleModal(false);
    });

    // 3. Lógica de Valores de Depósito
    depositInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(',', '.');
        depositDisplay.textContent = `R$ ${value || '0,00'}`;
    });

    depositInput.addEventListener('blur', (e) => {
        updateDepositValue(e.target.value);
    });

    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            updateDepositValue(btn.dataset.value);
        });
    });

    // 4. Copiar PIX
    copyPixBtn.addEventListener('click', copyPixCode);

    // 5. Estado Inicial
    initializeUserData(); 
    updateDepositValue(DEFAULT_DEPOSIT);
    
    // INICIALIZAÇÃO FORÇADA: Renderiza a home na primeira carga também
    renderHome(); 
    switchScreen('tela-inicio'); 

});

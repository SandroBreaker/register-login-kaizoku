// Protocolo Zero-Bug: Espera o DOM carregar.
document.addEventListener('DOMContentLoaded', () => {

    // ===================================
    // CONFIGURAÇÕES DA API (Invictus Pay)
    // ===================================
    const API_CONFIG = {
        ENDPOINT: 'https://api.invictuspay.app.br/api/public/v1/transactions',
        // ATENÇÃO: Em produção, nunca exponha tokens no Front-end. Use um Proxy/Backend.
        TOKEN: 'wsxiP0Dydmf2TWqjOn1iZk9CfqwxdZBg8w5eQVaTLDWHnTjyvuGAqPBkAiGU', 
        OFFER_HASH: 'png8aj6v6p' // Hash padrão ou dinâmico conforme sua regra
    };

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
    const pixQrImage = document.querySelector('.pix-qr-code'); // Seletor da Imagem QR

    // --- Constantes e Templates ---
    const DEFAULT_DEPOSIT = 50.00;

    // Template HTML do Card do Jogo (Mantido para Hydration)
    const GAME_CARD_TEMPLATE = `
        <section class="game-wallpaper">
            <a href="https://sandrobreaker.github.io/kaizouku-slot/" class="btn-play">Jogar</a>
        </section>
    `;

    // ===================================
    // FUNÇÕES DE INTEGRAÇÃO (BACKEND/API)
    // ===================================

    /**
     * Monta os dados do cliente. 
     * NOTA: A API exige CPF e Telefone. Como não temos no cadastro simplificado,
     * estou enviando dados de teste. Em produção, solicite isso ao usuário.
     */
    function getCustomerData() {
        const email = localStorage.getItem('currentUserEmail') || 'cliente@teste.com';
        const name = email.split('@')[0];

        return {
            name: name,
            email: email,
            phone_number: "11999999999", // Mock
            document: "00000000000",     // Mock (CPF Genérico)
            street_name: "Rua Digital",
            number: "123",
            neighborhood: "Centro",
            city: "São Paulo",
            state: "SP",
            zip_code: "01001000"
        };
    }

    /**
     * Chama a API da Invictus Pay para gerar o PIX
     */
    async function generatePixPayment() {
        const amountFloat = parseFloat(depositInput.value);
        const amountInCents = Math.round(amountFloat * 100); // API espera centavos (int)

        // Feedback Visual de Carregamento
        const originalBtnText = copyPixBtn.textContent;
        copyPixBtn.textContent = "Gerando PIX...";
        copyPixBtn.disabled = true;
        pixQrImage.style.opacity = "0.5";

        const payload = {
            amount: amountInCents,
            offer_hash: API_CONFIG.OFFER_HASH,
            payment_method: "pix",
            customer: getCustomerData(),
            items: [ // 'cart' no JSON original, ajustado para padrão comum ou mantido 'cart' se a API for estrita
                {
                    title: `Créditos: R$ ${amountFloat.toFixed(2)}`,
                    quantity: 1,
                    price: amountInCents,
                    tangible: false
                }
            ]
        };

        try {
            console.log("Enviando requisição PIX...", payload);

            const response = await fetch(`${API_CONFIG.ENDPOINT}?api_token=${API_CONFIG.TOKEN}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log("Resposta API:", data);

            if (response.ok && data) {
                // AJUSTE AQUI: Dependendo da resposta exata da Invictus, os campos podem mudar.
                // Baseado em padrões, estou assumindo que 'qrcode' e 'qrcode_text' virão no data.
                // Se a API retornar dentro de 'data.transaction', ajuste: data.transaction.pix_...
                
                // Exemplo de mapeamento (Ajuste conforme o console.log real):
                const qrCodeImage = data.pix_qrcode_url || data.qr_code_image || 'assets/QRcode.png'; 
                const pixString = data.pix_qrcode_text || data.qr_code || data.emv || '';

                // Atualiza UI
                pixQrImage.src = qrCodeImage;
                pixCodeInput.value = pixString;
                
                copyPixBtn.textContent = "Copiar Código";
                copyPixBtn.style.backgroundColor = "var(--gold)";
            } else {
                throw new Error(data.message || "Erro ao gerar PIX");
            }

        } catch (error) {
            console.error("Erro PIX:", error);
            copyPixBtn.textContent = "Erro na API";
            copyPixBtn.style.backgroundColor = "var(--luffy)";
            
            // Fallback para não quebrar a UX visualmente
            alert("Simulação: API Token não configurado ou Erro de CORS. Verifique o Console.");
        } finally {
            copyPixBtn.disabled = false;
            pixQrImage.style.opacity = "1";
        }
    }

    // ===================================
    // FUNÇÕES DE LÓGICA E UX
    // ===================================

    function renderHome() {
        const homeScreen = document.getElementById('tela-inicio');
        if (homeScreen) {
            homeScreen.innerHTML = ''; 
            homeScreen.innerHTML = GAME_CARD_TEMPLATE;
        }
    }

    function initializeUserData() {
        const userEmail = localStorage.getItem('currentUserEmail');
        if (!userEmail) return; 

        const displayName = userEmail.split('@')[0];
        const headerName = document.getElementById('header-user-name');
        if (headerName) headerName.textContent = displayName;
        
        const profileName = document.getElementById('profile-user-name');
        if (profileName) profileName.textContent = displayName;
    }

    function updateDepositValue(amount) {
        let numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount < 0) {
            numericAmount = DEFAULT_DEPOSIT;
        }
        const formattedAmount = numericAmount.toFixed(2);
        depositInput.value = formattedAmount;
        depositDisplay.textContent = `R$ ${formattedAmount.replace('.', ',')}`;
        
        // UX: Reseta o campo de PIX para indicar que precisa gerar um novo para o novo valor
        pixCodeInput.value = "Clique em 'Gerar PIX' para atualizar";
        pixQrImage.style.opacity = "0.3"; // Diminui opacidade para indicar "desatualizado"
    }

    function switchScreen(targetId) {
        if (targetId === 'tela-inicio') {
            renderHome();
        }
        screens.forEach(screen => {
            screen.classList.add('hidden');
            screen.classList.remove('active');
        });
        const targetScreen = document.getElementById(targetId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            targetScreen.classList.add('active');
        }
        navButtons.forEach(btn => {
            const screenName = btn.id.split('-')[1];
            if (targetId.includes(screenName)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function toggleModal(show) {
        if (show) {
            updateDepositValue(depositInput.value); 
            
            // Injeta/Verifica botão de Gerar PIX se não existir
            setupGenerateButton();

            depositModal.classList.remove('hidden');
        } else {
            depositModal.classList.add('hidden');
        }
    }

    // [NOVO] Configura o botão de gerar PIX dinamicamente
    function setupGenerateButton() {
        // Verifica se já criamos o botão para não duplicar
        let generateBtn = document.getElementById('btn-gerar-pix-api');
        
        if (!generateBtn) {
            // Cria o botão
            generateBtn = document.createElement('button');
            generateBtn.id = 'btn-gerar-pix-api';
            generateBtn.textContent = "GERAR PIX AGORA";
            generateBtn.className = "btn-primary"; // Usa estilo do tema
            generateBtn.style.width = "100%";
            generateBtn.style.marginTop = "15px";
            generateBtn.style.marginBottom = "15px";
            generateBtn.style.backgroundColor = "#28a745"; // Verde destaque

            // Insere logo após o display de valor (antes do QR Code)
            const infoContainer = document.querySelector('.deposit-info');
            const valueDisplay = document.getElementById('deposit-value-display');
            
            // Insere após o H2 do valor
            valueDisplay.parentNode.insertBefore(generateBtn, valueDisplay.nextSibling);

            // Event Listener
            generateBtn.addEventListener('click', generatePixPayment);
        }
    }

    async function copyPixCode() {
        const code = pixCodeInput.value;
        if (!code || code.includes("Clique em")) {
            alert("Gere o PIX primeiro!");
            return;
        }

        try {
            await navigator.clipboard.writeText(code);
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

    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const screenName = e.currentTarget.id.split('-')[1]; 
            switchScreen(`tela-${screenName}`);
        });
    });

    if (openModalBtn) openModalBtn.addEventListener('click', () => toggleModal(true));
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => toggleModal(false));
    
    depositModal.addEventListener('click', (e) => {
        if (e.target === depositModal) toggleModal(false);
    });

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

    copyPixBtn.addEventListener('click', copyPixCode);

    initializeUserData(); 
    updateDepositValue(DEFAULT_DEPOSIT);
    renderHome(); 
    switchScreen('tela-inicio'); 
});

document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // --- FUNÇÕES DE ALTERNÂNCIA DE TELA ---
    function showSection(sectionToShow) {
        if (sectionToShow === 'register') {
            loginSection.style.display = 'none';
            registerSection.style.display = 'block';
        } else { // 'login'
            registerSection.style.display = 'none';
            loginSection.style.display = 'block';
        }
    }

    // Eventos de clique para alternar
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('register');
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('login');
        });
    }

    // --- LÓGICA DO FORMULÁRIO DE LOGIN (SIMULADA) ---
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // Simulação de autenticação.
            if (email && password) {
                console.log(`Tentativa de Login:\nEmail: ${email}\nSenha: ${password}`);
                
                // Em um ambiente real, você faria uma chamada fetch() aqui.
                // Se a chamada retornar sucesso:
                
                alert('Login Bem-Sucedido (Simulado)! Redirecionando...');
                
                // -----------------------------------------------------------------
                // LOCAL DO REDIRECIONAMENTO: Mude 'dashboard.html' para o seu link
                window.location.href = 'dashboard.html'; 
                // -----------------------------------------------------------------

            } else {
                alert('Por favor, preencha todos os campos.');
            }
        });
    }


    // --- LÓGICA DO FORMULÁRIO DE REGISTRO (COM VALIDAÇÃO) ---
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirmPassword');
            // referralCodeInput não é validado, apenas coletado

            const email = emailInput.value;
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            let isValid = true;

            // 1. Validação de E-mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emailError = document.getElementById('emailError');
            if (!emailRegex.test(email)) {
                emailError.style.display = 'block';
                isValid = false;
            } else {
                emailError.style.display = 'none';
            }

            // 2. Validação de Senha (Mínimo 6 caracteres)
            const passwordError = document.getElementById('passwordError');
            if (password.length < 6) {
                passwordError.style.display = 'block';
                isValid = false;
            } else {
                passwordError.style.display = 'none';
            }

            // 3. Validação de Confirmação de Senha
            const confirmPasswordError = document.getElementById('confirmPasswordError');
            if (password !== confirmPassword) {
                confirmPasswordError.style.display = 'block';
                isValid = false;
            } else {
                confirmPasswordError.style.display = 'none';
            }

            // Se tudo estiver válido, simula o registro
            if (isValid) {
                console.log(`Registro BEM-SUCEDIDO (Simulado)!`);
                alert('Registro concluído! Agora faça login.');
                
                // Limpa o formulário de registro e volta para o login
                registerForm.reset();
                showSection('login'); 
            }
        });
    }
});

                  

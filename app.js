document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Novo: Elemento para exibir o erro de login
    const loginErrorDisplay = document.getElementById('loginErrorDisplay');


    // --- FUNÇÕES DE PERSISTÊNCIA (localStorage) ---

    // Carrega todos os usuários registrados
    function loadUsers() {
        const users = localStorage.getItem('registeredUsers');
        // Retorna o objeto de usuários ou um objeto vazio se nada for encontrado
        return users ? JSON.parse(users) : {};
    }

    // Salva o objeto de usuários atualizado
    function saveUsers(users) {
        localStorage.setItem('registeredUsers', JSON.stringify(users));
    }

    // Exibe uma mensagem de erro na tela de login
    function displayLoginError(message) {
        loginErrorDisplay.textContent = message;
        loginErrorDisplay.style.display = 'block';
        setTimeout(() => {
            loginErrorDisplay.style.display = 'none';
        }, 5000); // Esconde a mensagem após 5 segundos
    }

    // --- FUNÇÕES DE ALTERNÂNCIA DE TELA ---
    function showSection(sectionToShow) {
        if (sectionToShow === 'register') {
            // Limpa mensagens de erro ao alternar
            if(loginErrorDisplay) loginErrorDisplay.style.display = 'none';
            loginSection.style.display = 'none';
            registerSection.style.display = 'block';
        } else { // 'login'
            // Limpa mensagens de erro ao alternar
            document.querySelectorAll('.error').forEach(el => el.style.display = 'none');
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

    // --- LÓGICA DO FORMULÁRIO DE LOGIN (VALIDAÇÃO REAL SIMULADA) ---
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Oculta erros anteriores
            if(loginErrorDisplay) loginErrorDisplay.style.display = 'none';

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // 1. Validação básica
            if (!email || !password) {
                displayLoginError('Por favor, preencha todos os campos.');
                return;
            }

            // 2. Autenticação simulada com localStorage
            const users = loadUsers();
            const storedUser = users[email];

            if (storedUser && storedUser.password === password) {
                console.log(`Login Bem-Sucedido para: ${email}`);
                
                // ### AJUSTE AQUI ### 
                // Salva o e-mail do usuário logado para a próxima página ler
                localStorage.setItem('currentUserEmail', email);

                // Redireciona para o Lobby (home.html)
                console.log('Redirecionando para o Lobby (home.html)...');
                window.location.href = 'home.html'; 

            } else {
                // Falha na autenticação (usuário não existe ou senha incorreta)
                displayLoginError('Credenciais inválidas. Tente novamente ou cadastre-se.');
                document.getElementById('loginPassword').value = ''; // Limpa o campo senha por segurança
            }
        });
    }


    // --- LÓGICA DO FORMULÁRIO DE REGISTRO (COM VALIDAÇÃO E SALVAMENTO) ---
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirmPassword');
            const referralCode = document.getElementById('referralCode').value;

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

            // 4. Verificação de usuário existente
            const users = loadUsers();
            if (users[email]) {
                displayLoginError('Este e-mail já está registrado.'); // Reutilizando o display de erro, mas pode ser melhor criar um para registro
                isValid = false;
            }


            // Se tudo estiver válido, SALVA o registro
            if (isValid) {
                users[email] = {
                    password: password, // ATENÇÃO: Senha salva como texto puro (apenas para simulação!)
                    referralCode: referralCode,
                    registeredAt: new Date().toISOString()
                };

                saveUsers(users);

                console.log(`Registro de ${email} BEM-SUCEDIDO e salvo no LocalStorage.`);

                // Limpa o formulário de registro e volta para o login
                registerForm.reset();
                showSection('login'); 
            }
        });
    }
});

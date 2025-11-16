# Plataforma DDRR (Slot)

Este projeto consiste em um sistema de autenticação (Login/Registro) que direciona para um "lobby" principal (Home, Bônus, Perfil), construído com HTML, CSS e JavaScript puro.

O sistema é desenhado para servir como a entrada principal antes de direcionar o usuário ao jogo (Slot).

---

## 🚀 Arquitetura e Fluxo

O projeto é dividido em duas partes principais:

1.  **Autenticação (`index.html`)**
2.  **Lobby/Home (`home.html`)**

### Fluxo de Usuário

1.  **`index.html` (Login/Registro):**
    * O usuário pode alternar entre as telas de Login e Registro.
    * O `app.js` gerencia a validação (e-mail válido, senhas) e salva os usuários no **`localStorage`**.
2.  **Autenticação:**
    * Ao logar, `app.js` valida as credenciais com os dados do `localStorage`.
    * Se o login for bem-sucedido, o e-mail do usuário é salvo em `localStorage.setItem('currentUserEmail', email)`.
    * O usuário é redirecionado para `home.html`.
3.  **`home.html` (Lobby):**
    * `home.js` é carregado e executa a função `initializeUserData()`.
    * Esta função lê o `currentUserEmail` do `localStorage` e atualiza o nome do usuário no header e na tela de perfil.
    * O usuário pode navegar entre as abas "Home", "Bônus" e "Perfil" (controlado por `home.js`).
    * O botão "Jogar" (em "Home") direciona para a URL do jogo.
4.  **Perfil e Depósito:**
    * Na tela "Perfil", o botão "Depositar" abre um modal (`#deposit-modal`).
    * Toda a lógica do modal (seleção de valores, input, cópia do PIX) é controlada pelo `home.js`.

---

## 📁 Estrutura de Arquivos

* `/index.html`: Tela de Login e Registro.
* `/styles.css`: CSS para `index.html` (Tema One Piece).
* `/app.js`: Lógica de Login, Registro e persistência no `localStorage`.
* `/home.html`: Tela principal (Lobby) com as seções Home, Bônus e Perfil.
* `/home.css`: CSS para `home.html` (reutiliza as variáveis de tema do `styles.css`).
* `/home.js`: Lógica de navegação do Lobby, personalização da UI e Modal de Depósito.
* `/assets/`: Contém as imagens (ícones, wallpaper, QR code).

---

## 🛠️ Funcionalidades Implementadas

* **Autenticação:** Registro e Login com persistência local.
* **Navegação SPA (Simulada):** O lobby (`home.html`) alterna entre as telas (`<main>`) sem recarregar a página.
* **Passagem de Dados:** O `localStorage` (`currentUserEmail`) é usado para passar a identidade do usuário entre `index.html` e `home.html`.
* **UI Reativa:** O nome do usuário é exibido dinamicamente no lobby.
* **Modal de Depósito:** Fluxo completo de depósito com valores pré-definidos e input customizado.
* **Consistência de Tema:** O `home.css` utiliza as mesmas variáveis de cor (`:root`) definidas no `styles.css` para manter a identidade visual.

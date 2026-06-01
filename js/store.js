document.addEventListener("DOMContentLoaded", () => {
    // 1. Elementos da Janela Modal
    const modal = document.getElementById("productModal");
    const closeModalBtn = document.querySelector(".close-modal");
    
    const modalImg = document.getElementById("modalProductImg");
    const modalName = document.getElementById("modalProductName");
    const modalPrice = document.getElementById("modalProductPrice");
    const modalDesc = document.getElementById("modalProductDesc");
    const modalSpecs = document.getElementById("modalProductSpecs");
    const modalRedirectBtn = document.getElementById("modalRedirectBtn");

    // Variável para guardar o card que está ativo no momento
    let cardAtivo = null;

    // 2. Captura todos os cards de produtos para abrir a modal
    const productCards = document.querySelectorAll(".card");

    productCards.forEach(card => {
        card.addEventListener("click", (event) => {
            // Se o clique for em um link (caso tenha algum solto), não faz nada
            if (event.target.tagName === 'A') return;

            // Guarda a referência do card clicado para usar depois no botão do carrinho
            cardAtivo = card;

            // Coleta os dados básicos do card
            const titulo = card.querySelector("h3").innerText;
            const imagem = card.querySelector(".card-image img").getAttribute("src");
            const precoTexto = card.querySelector(".price").innerText;
            
            // Coleta as especificações extras dos atributos data-* do HTML
            const productDesc = card.getAttribute("data-desc") || "Descrição detalhada em breve.";
            const productSpecs = card.getAttribute("data-specs") || "Especificações técnicas não informadas.";

            // Injeta os dados na modal para o usuário ler
            modalImg.src = imagem;
            modalImg.alt = titulo;
            modalName.innerText = titulo;
            modalPrice.innerText = precoTexto;
            modalDesc.innerText = productDesc;
            modalSpecs.innerText = productSpecs;

            // Abre a modal suavemente respeitando o CSS (display + transition)
            modal.style.display = "flex";
            setTimeout(() => {
                modal.classList.add("show");
            }, 10);
        });
    });

    // 3. Lógica do botão de confirmação DENTRO da modal (Ir para o carrinho)
    if (modalRedirectBtn) {
        modalRedirectBtn.addEventListener("click", (event) => {
            // Evita o redirecionamento imediato para rodar a sua lógica de negócio antes
            event.preventDefault();

            if (!cardAtivo) return;

            // Executa a sua lógica exata de tratamento de dados usando o card ativo
            const titulo = cardAtivo.querySelector("h3").innerText;
            const imagem = cardAtivo.querySelector(".card-image img").getAttribute("src");
            let precoTexto = cardAtivo.querySelector(".price").innerText;
            
            // Limpa o preço para formato numérico puro
            let precoLimpo = parseFloat(precoTexto.replace("R$", "").replace(".", "").replace(",", ".").trim());

            // Cria o objeto do produto com o ID temporário e o desconto do PIX (~13.5% off)
            const produtoParaCarrinho = {
                id: Math.random().toString(36).substr(2, 9), 
                nome: titulo,
                precoCard: precoLimpo, 
                precoPix: precoLimpo * 0.865, 
                imagem: imagem,
                quantidade: 1
            };

            // Salva no localStorage exatamente na chave que seu carrinho espera
            localStorage.setItem("itemCarrinho", JSON.stringify(produtoParaCarrinho));

            // Redireciona para a página do carrinho
            window.location.href = "../html/carrinho.html";
        });
    }

    // 4. Funções para fechar a modal de forma limpa
    function closeModal() {
        modal.classList.remove("show");
        setTimeout(() => {
            modal.style.display = "none";
        }, 300); // 300ms é o tempo da transição do seu CSS
    }

    // Fecha no botão (X)
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeModal);
    }

    // Fecha se clicar fora da caixinha preta (no fundo desfocado)
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
});
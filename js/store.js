
document.addEventListener("DOMContentLoaded", () => {
    // Captura todos os botões de comprar
    const botoesComprar = document.querySelectorAll(".btn-buy");

    botoesComprar.forEach(botao => {
        botao.addEventListener("click", (event) => {
            // Evita o redirecionamento imediato para podermos rodar o script antes
            event.preventDefault();

            // Sobe até o container pai (".card") para buscar os dados específicos deste item
            const card = botao.closest(".card");
            
            const titulo = card.querySelector("h3").innerText;
            const imagem = card.querySelector(".card-image img").getAttribute("src");
            
            // Pega o texto do preço e limpa para salvar como número puro no banco local
            let precoTexto = card.querySelector(".price").innerText;
            let precoLimpo = parseFloat(precoTexto.replace("R$", "").replace(".", "").replace(",", ".").trim());

            // Cria o objeto do produto
            const produtoParaCarrinho = {
                id: Math.random().toString(36).substr(2, 9), // Gera um ID temporário único
                nome: titulo,
                precoCard: precoLimpo, // Valor total no cartão
                precoPix: precoLimpo * 0.865, // Aplica o desconto proporcional ao seu print (~13.5% off)
                imagem: imagem,
                quantidade: 1
            };

            // Salva no localStorage (simulando a inserção em uma tabela de sessão)
            localStorage.setItem("itemCarrinho", JSON.stringify(produtoParaCarrinho));

            // Agora sim, redireciona para a página do carrinho
            window.location.href = "../html/carrinho.html";
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container-produtos-carrinho");
    
    // Elementos do resumo lateral
    const txtSubtotal = document.getElementById("resumo-subtotal");
    const txtTotal = document.getElementById("resumo-total");
    const txtPix = document.getElementById("resumo-pix");
    const txtEconomia = document.getElementById("resumo-economia");

    // Puxa o produto vindo do "banco de dados" local
    const produto = JSON.parse(localStorage.getItem("itemCarrinho"));

    if (!produto) {
        container.innerHTML = "<p style='color: white; padding: 20px;'>Seu carrinho está vazio.</p>";
        return;
    }

    // Função interna para renderizar o layout do print na tela
    function renderizarCarrinho() {
        container.innerHTML = `
            <div class="carrinho-item" style="display: flex; align-items: center; background: #111; padding: 15px; margin-bottom: 15px; border-radius: 8px; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${produto.imagem}" alt="${produto.nome}" style="width: 80px; height: 80px; object-fit: contain;">
                    <div>
                        <h3 style="color: white; margin: 0;">${produto.nome}</h3>
                        <p style="color: #666; margin: 5px 0;">CÓD: ${produto.id.toUpperCase()}</p>
                        <button id="btn-remover-item" style="color: #ff4d4d; background: none; border: none; cursor: pointer; padding: 0;">REMOVER</button>
                    </div>
                </div>
                
                <div style="display: flex; align-items: center; gap: 20px;">
                    <div class="qtd-control" style="background: #222; border-radius: 4px; display: flex; align-items: center;">
                        <button id="qtd-menos" style="background: none; border: none; color: #00A19B; padding: 5px 10px; cursor: pointer;">-</button>
                        <span id="qtd-valor" style="color: white; padding: 0 10px;">${produto.quantidade}</span>
                        <button id="qtd-mais" style="background: none; border: none; color: #00A19B; padding: 5px 10px; cursor: pointer;">+</button>
                    </div>
                    
                    <div style="text-align: right;">
                        <span style="color: #666; display: block; font-size: 12px;">À vista no PIX</span>
                        <strong style="color: #00A19B; font-size: 18px;">${formatarMoeda(produto.precoPix * produto.quantidade)}</strong>
                        <span style="color: #666; display: block; font-size: 12px;">ou ${formatarMoeda(produto.precoCard * produto.quantidade)} no cartão</span>
                    </div>
                </div>
            </div>
        `;

        atualizarResumoFinanceiro();
        adicionarEventosBotoes();
    }

    // Executa as contas matemáticas baseadas na quantidade selecionada
    function atualizarResumoFinanceiro() {
        const totalCartao = produto.precoCard * produto.quantidade;
        const totalPix = produto.precoPix * produto.quantidade;
        const economia = totalCartao - totalPix;

        txtSubtotal.innerText = formatarMoeda(totalCartao);
        txtTotal.innerText = formatarMoeda(totalCartao);
        txtPix.innerText = formatarMoeda(totalPix);
        txtEconomia.innerText = formatarMoeda(economia);
    }

    // Adiciona escuta de cliques nos botões de + , - e remover gerados dinamicamente
    function adicionarEventosBotoes() {
        document.getElementById("qtd-mais").addEventListener("click", () => {
            produto.quantidade++;
            salvarERecarregar();
        });

        document.getElementById("qtd-menos").addEventListener("click", () => {
            if (produto.quantidade > 1) {
                produto.quantidade--;
                salvarERecarregar();
            }
        });

        document.getElementById("btn-remover-item").addEventListener("click", () => {
            localStorage.removeItem("itemCarrinho");
            window.location.reload();
        });
    }

    function salvarERecarregar() {
        localStorage.setItem("itemCarrinho", JSON.stringify(produto));
        renderizarCarrinho();
    }

    function formatarMoeda(valor) {
        return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    // Inicializa a página carregando o produto correto
    renderizarCarrinho();
});
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container-produtos-carrinho");
    
    // Elementos do resumo lateral
    const txtSubtotal = document.getElementById("resumo-subtotal");
    const txtTotal = document.getElementById("resumo-total");
    const txtPix = document.getElementById("resumo-pix");
    const txtEconomia = document.getElementById("resumo-economia");

    // Puxa o produto vindo do "banco de dados" local (unificado para todas as páginas)
    const produto = JSON.parse(localStorage.getItem("itemCarrinho"));

    // Se não houver produto salvo, avisa que o carrinho está vazio
    if (!produto) {
        if (container) {
            container.innerHTML = "<p style='color: white; padding: 20px;'>Seu carrinho está vazio.</p>";
        }
        zerarResumo();
        return;
    }

    // Função para formatar números em formato de moeda real (R$)
    function formatarMoeda(valor) {
        return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    // Zera o painel lateral caso não existam itens
    function zerarResumo() {
        if(txtSubtotal) txtSubtotal.innerText = formatarMoeda(0);
        if(txtTotal) txtTotal.innerText = formatarMoeda(0);
        if(txtPix) txtPix.innerText = formatarMoeda(0);
        if(txtEconomia) txtEconomia.innerText = formatarMoeda(0);
    }

    // Executa as contas matemáticas baseadas na quantidade selecionada
    function atualizarResumoFinanceiro() {
        const totalCartao = produto.precoCard * produto.quantidade;
        const totalPix = produto.precoPix * produto.quantidade;
        const economia = totalCartao - totalPix;

        if (txtSubtotal) txtSubtotal.innerText = formatarMoeda(totalCartao);
        if (txtTotal) txtTotal.innerText = formatarMoeda(totalCartao);
        if (txtPix) txtPix.innerText = formatarMoeda(totalPix);
        if (txtEconomia) txtEconomia.innerText = formatarMoeda(economia);
    }

    // Adiciona escuta de cliques nos botões de + , - e remover gerados dinamicamente
    function adicionarEventosBotoes() {
        const btnMais = document.getElementById("qtd-mais");
        const btnMenos = document.getElementById("qtd-menos");
        const btnRemover = document.getElementById("btn-remover-item");

        if (btnMais) {
            btnMais.addEventListener("click", () => {
                produto.quantidade++;
                salvarERecarregar();
            });
        }

        if (btnMenos) {
            btnMenos.addEventListener("click", () => {
                if (produto.quantidade > 1) {
                    produto.quantidade--;
                    salvarERecarregar();
                }
            });
        }

        if (btnRemover) {
            btnRemover.addEventListener("click", () => {
                localStorage.removeItem("itemCarrinho");
                window.location.reload();
            });
        }
    }

    function salvarERecarregar() {
        localStorage.setItem("itemCarrinho", JSON.stringify(produto));
        renderizarCarrinho();
    }

    // Função interna para renderizar o layout do item na tela
    function renderizarCarrinho() {
        if (!container) return;

        container.innerHTML = `
            <div class="carrinho-item" style="display: flex; align-items: center; background: #111; padding: 15px; margin-bottom: 15px; border-radius: 8px; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${produto.imagem}" alt="${produto.nome}" style="width: 80px; height: 80px; object-fit: contain;">
                    <div>
                        <h3 style="color: white; margin: 0; font-size: 16px;">${produto.nome}</h3>
                        <p style="color: #666; margin: 5px 0; font-size: 13px;">CÓD: ${produto.id.toUpperCase()}</p>
                        <button id="btn-remover-item" style="color: #ff4d4d; background: none; border: none; cursor: pointer; padding: 0; font-weight: bold; font-size: 12px;">REMOVER</button>
                    </div>
                </div>
                
                <div style="display: flex; align-items: center; gap: 20px;">
                    <div class="qtd-control" style="background: #222; border-radius: 4px; display: flex; align-items: center; border: 1px solid #333;">
                        <button id="qtd-menos" style="background: none; border: none; color: #00A19B; padding: 8px 12px; cursor: pointer; font-weight: bold;">-</button>
                        <span id="qtd-valor" style="color: white; padding: 0 5px; font-family: monospace;">${produto.quantidade}</span>
                        <button id="qtd-mais" style="background: none; border: none; color: #00A19B; padding: 8px 12px; cursor: pointer; font-weight: bold;">+</button>
                    </div>
                    
                    <div style="text-align: right; min-width: 150px;">
                        <span style="color: #888; display: block; font-size: 11px;">À vista no PIX</span>
                        <strong style="color: #00A19B; font-size: 18px; display: block;">${formatarMoeda(produto.precoPix * produto.quantidade)}</strong>
                        <span style="color: #666; display: block; font-size: 11px;">ou ${formatarMoeda(produto.precoCard * produto.quantidade)} no cartão</span>
                    </div>
                </div>
            </div>
        `;

        atualizarResumoFinanceiro();
        adicionarEventosBotoes();
    }

    // Inicializa a página carregando o produto correto
    renderizarCarrinho();
});
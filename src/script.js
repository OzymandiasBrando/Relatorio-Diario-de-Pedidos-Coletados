document.addEventListener("DOMContentLoaded", () => {
    const coresLojas = {
        shopee: "#FB5430",
        americas: "#ED0030",
        mercado_livre: "#F2D500",
        kabum: "#004D8E",
        submarino: "#0254F7"
    };

    const nomesLojas = {
        shopee: "Shopee",
        americas: "Lojas Americanas",
        mercado_livre: "Mercado Livre",
        kabum: "Kabum",
        submarino: "Submarino"
    };

    function calcularAtraso(storeId, chartId) {
        const store = document.getElementById(storeId);
        if (!store) return;

        const pedidosColetadosInput = store.querySelector('tr:nth-child(2) input');
        const pedidosAtrasoInput = store.querySelector('tr:nth-child(3) input');
        const porcentagemAtrasoTd = store.querySelector('tr:nth-child(4) td:last-child');

        const canvas = document.getElementById(chartId);
        const ctx = canvas?.getContext('2d');
        let grafico = null;

        // cria/pega um container onde vamos mostrar as porcentagens detalhadas
        let infoBox = canvas.parentNode.querySelector('.percentual-diferenca');
        if (!infoBox) {
            infoBox = document.createElement('div');
            infoBox.className = 'percentual-diferenca';
            Object.assign(infoBox.style, { marginTop: '10px', fontWeight: '700', textAlign: 'center' });
            canvas.parentNode.appendChild(infoBox);
        }

        function atualizarCalculo() {
            const coletados = Number(pedidosColetadosInput.value) || 0;
            const atrasados = Number(pedidosAtrasoInput.value) || 0;
            const dentro = Math.max(coletados - atrasados, 0);

            const pctAtraso = coletados > 0 ? (atrasados / coletados) * 100 : 0;
            const pctDentro = coletados > 0 ? (dentro / coletados) * 100 : 0;

            // atualiza célula da tabela
            porcentagemAtrasoTd.textContent = pctAtraso.toFixed(2) + "%";

            // mostra todos os valores ao lado do gráfico
            infoBox.innerHTML = `
            <div>Dentro do prazo: ${pctDentro.toFixed(2)}%</div>
            <div>Atrasados: ${pctAtraso.toFixed(2)}%</div>
        `;

            // atualiza gráfico
            if (ctx) {
                if (grafico) grafico.destroy();

                grafico = new Chart(ctx, {
                    type: "doughnut",
                    data: {
                        labels: ["Dentro do Prazo", "Atrasados"],
                        datasets: [{
                            data: [dentro, atrasados],
                            backgroundColor: ["#16730b", "#ff1100ff"]
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: "bottom" },
                            title: { display: true, text: "Distribuição de Pedidos" },
                            datalabels: {
                                color: "#fff",
                                font: { weight: "bold", size: 12 },
                                formatter: (value) => value
                            }
                        }
                    },
                    plugins: [ChartDataLabels]
                });
            }
        }

        pedidosColetadosInput.addEventListener("input", atualizarCalculo);
        pedidosAtrasoInput.addEventListener("input", atualizarCalculo);

        atualizarCalculo();
    }



    ["shopee", "mercado_livre", "americas", "kabum", "submarino"].forEach(loja => {
        calcularAtraso(loja, `grafico-${loja}`);
    });

    const botoes = document.querySelectorAll(".store-btn");
    const storeContainer = document.querySelector("main");
    const titulo = storeContainer.querySelector("h2");

    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            botoes.forEach(b => b.classList.remove("active"));
            botao.classList.add("active");

            const loja = botao.dataset.store;

            storeContainer.className = "";
            storeContainer.classList.add(`${loja}-theme`);

            if (titulo) titulo.textContent = nomesLojas[loja] || loja;
        });
    });
});

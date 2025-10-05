document.addEventListener("DOMContentLoaded", () => {
    if (typeof Highcharts === 'undefined') {
        console.error('Highcharts não foi carregado.');
        return;
    }

    const charts = {};

    function criarOuAtualizarGrafico(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return console.warn('Container não encontrado:', containerId);

        if (charts[containerId]) {
            charts[containerId].series[0].setData(data, true, true, false);
            return;
        }

        charts[containerId] = Highcharts.chart(containerId, {
            chart: {
                type: 'pie',
                options3d: { enabled: true, alpha: 45, beta: 0 },
                backgroundColor: 'transparent',
                height: 280,
            },
            title: { text: null },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y})',
                backgroundColor: 'rgba(0,0,0,0.8)',
                borderRadius: 8,
                style: { color: '#fff', fontSize: '13px' }
            },
            plotOptions: {
                pie: {
                    innerSize: '50%',
                    size: '100%',
                    depth: 45,
                    allowPointSelect: true,
                    cursor: 'pointer',
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    dataLabels: {
                        enabled: true,
                        distance: 10,
                        style: {
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: '#000',
                            textOutline: 'none'
                        },
                        connectorPadding: 3,
                        connectorShape: 'crookedLine',
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series: [{ name: 'Porcentagem', data }],
            credits: { enabled: false }
        });
    }

    function configurarGraficoLoja(storeId, graficoId) {
        const store = document.getElementById(storeId);
        if (!store) return;

        const inputs = store.querySelectorAll('input[type="number"]');
        const get = i => Number(inputs[i]?.value) || 0;

        function atualizar() {
            const pedidos = get(0), coletados = get(1), prosegur = get(2), saque = get(3), ti = get(4);
            const isTransportadora = storeId.includes('expresso') || storeId.includes('bras') || storeId.includes('24h');
            const saqueFinal = isTransportadora ? 0 : saque;
            const restante = Math.max(pedidos - (coletados + prosegur + saqueFinal + ti), 0);

            const data = [
                { name: "Expedidos", y: coletados, color: "#12d623" },
                { name: "Prosegur", y: prosegur, color: "#F1C40F" },
                { name: "TI", y: ti, color: "#22dfe6" },
                ...(isTransportadora ? [] : [{ name: "Saque", y: saqueFinal, color: "#100dc4" }]),
                { name: "Restante", y: restante, color: "#e0230d" }
            ];

            criarOuAtualizarGrafico(graficoId, data);
            atualizarConsolidado();
        }

        inputs.forEach(i => i.addEventListener('input', atualizar));
        atualizar();
    }

    // Mapeia todas as lojas/transportadoras
    const mapa = [
        ['shopee', 'grafico-3d-shopee'],
        ['mercado_livre', 'grafico-3d-mercado_livre'],
        ['total_expresso', 'grafico-3d-total_expresso'],
        ['total_bras', 'grafico-3d-total_bras'],
        ['total_24h', 'grafico-3d-total_24h']
    ];
    mapa.forEach(([s, g]) => configurarGraficoLoja(s, g));

    // Oculta "Tratativa Saque" nas transportadoras
    document.querySelectorAll('#expressos .store table tr').forEach(tr => {
        const label = tr.querySelector('td:first-child');
        if (label && label.textContent.trim().toLowerCase().includes('saque')) {
            tr.style.display = 'none';
        }
    });

    // Alternar abas
    const lojasBtn = document.getElementById('lojas-btn');
    const expressosBtn = document.getElementById('expressos-btn');
    const consolidadoBtn = document.getElementById('consolidado-btn');
    const lojasSection = document.getElementById('lojas');
    const expressosSection = document.getElementById('expressos');
    const consolidadoSection = document.getElementById('consolidado');

    function mostrarAba(aba) {
        [lojasSection, expressosSection, consolidadoSection].forEach(sec => sec.style.display = 'none');
        [lojasBtn, expressosBtn, consolidadoBtn].forEach(btn => btn.classList.remove('active'));
        aba.section.style.display = 'flex';
        aba.btn.classList.add('active');
    }

    lojasBtn.addEventListener('click', () => mostrarAba({ section: lojasSection, btn: lojasBtn }));
    expressosBtn.addEventListener('click', () => mostrarAba({ section: expressosSection, btn: expressosBtn }));
    consolidadoBtn.addEventListener('click', () => mostrarAba({ section: consolidadoSection, btn: consolidadoBtn }));

    mostrarAba({ section: lojasSection, btn: lojasBtn });

    // 🔹 Atualiza gráfico Consolidado automaticamente
    function atualizarConsolidado() {
        const totalExp = Number(document.querySelector('#total_expresso input[type=number]')?.value) || 0;
        const totalBras = Number(document.querySelector('#total_bras input[type=number]')?.value) || 0;
        const total24h = Number(document.querySelector('#total_24h input[type=number]')?.value) || 0;
        const shopee = Number(document.querySelector('#shopee input[type=number]')?.value) || 0;

        const data = [
            { name: 'BRASPRESS', y: totalBras, color: '#1565c0ff' },
            { name: 'TOTAL', y: totalExp, color: '#E53935' },
            { name: 'TOTAL24HRS', y: total24h, color: '#E57373' },
            { name: 'SHOPEE', y: shopee, color: '#FB5430' },
            { name: 'MERCADO LIVRE', y: mercado_livre, color: '#F2D500' }
        ];

        criarOuAtualizarGrafico('grafico-3d-consolidado', data);
    }
});

/* Consolidados */

document.addEventListener("DOMContentLoaded", () => {
    if (typeof Highcharts === "undefined") {
        console.error("Highcharts não foi carregado.");
        return;
    }

    const charts = {};

    // =========================
    // Função de criação de gráfico
    // =========================
    function criarGraficoConsolidado(data) {
        if (charts["grafico-3d-consolidado"]) {
            charts["grafico-3d-consolidado"].update({ series: [{ data }] }, true, true);
            return;
        }

        charts["grafico-3d-consolidado"] = Highcharts.chart("grafico-3d-consolidado", {
            chart: {
                type: "pie",
                options3d: { enabled: true, alpha: 45 },
                backgroundColor: "transparent",
                height: 280,
            },
            title: { text: null },
            tooltip: {
                pointFormat: "<b>{point.percentage:.1f}%</b> ({point.y})",
                backgroundColor: "rgba(0,0,0,0.75)",
                style: { color: "#fff", fontSize: "13px" },
            },
            plotOptions: {
                pie: {
                    innerSize: "50%",
                    depth: 45,
                    dataLabels: {
                        enabled: true,
                        format: "<b>{point.name}</b>: {point.percentage:.1f} %",
                        style: { color: "#000", fontSize: "12px", fontWeight: "bold" },
                    },
                },
            },
            series: [{ name: "Expedições", data }],
            credits: { enabled: false },
        });
    }

    // =========================
    // Função de atualização
    // =========================
    function atualizarConsolidado() {
        const linhas = document.querySelectorAll("#consolidado-section table tr");
        const transportadoras = [];

        let totalPedidos = 0;
        let totalTransp = 0;
        let totalSist = 0;

        linhas.forEach((linha) => {
            const celulas = linha.querySelectorAll("td");
            if (celulas.length < 6) return;

            const nome = celulas[0].innerText.trim();
            if (["TRANSPORTADORA", "Total Volumes", "Total Pedido"].includes(nome)) return;

            const inputs = linha.querySelectorAll('input[type="number"]');
            if (inputs.length < 3) return;

            const qtdPedidos = Number(inputs[0].value) || 0;
            const qtdTransp = Number(inputs[1].value) || 0;
            const qtdSist = Number(inputs[2].value) || 0;
            const diferenca = qtdTransp - qtdSist;

            const celulaDif = linha.querySelector(".valor#diferenca");
            if (celulaDif) {
                celulaDif.textContent = diferenca;
                if (diferenca >= 0) {
                    celulaDif.style.background = "limegreen";
                    celulaDif.style.color = "white";
                } if (diferenca === 0) {
                    celulaDif.style.background = "yellow";
                    celulaDif.style.color = "black";
                } else {
                    celulaDif.style.background = "red";
                    celulaDif.style.color = "white";
                }
            }

            // Soma para os totais
            totalPedidos += qtdPedidos;
            totalTransp += qtdTransp;
            totalSist += qtdSist;

            const cores = {
                "SHOPEE": "#FB5430",
                "MERCADO LIVRE": "#F2D500",
                "BRASPRESS": "#1565c0",
                "TOTAL": "#E53935",
                "TOTAL24HRS": "#E57373"
            };

            const cor = cores[nome.toUpperCase()] || "#ccc"; // cor padrão se não estiver mapeado
            transportadoras.push({ name: nome, y: qtdPedidos, color: cor });

        });

        // Atualiza totais
        const totalLinha = document.querySelector(".total_volume");
        if (totalLinha) {
            const tds = totalLinha.querySelectorAll(".valor");
            if (tds.length >= 4) {
                const difTotal = totalTransp - totalSist;
                tds[0].textContent = totalPedidos;
                tds[1].textContent = totalTransp;
                tds[2].textContent = totalSist;
                tds[3].textContent = difTotal;

                // 🔹 Altera cor conforme o valor da diferença
                if (difTotal > 0) {
                    tds[3].style.background = "limegreen";
                    tds[3].style.color = "white";
                } else if (difTotal === 0) {
                    tds[3].style.background = "yellow";
                    tds[3].style.color = "black";
                } else {
                    tds[3].style.background = "red";
                    tds[3].style.color = "white";
                }
            }
        }


        const totalPedidoCel = document.querySelector('.total_pedido .valor');
        if (totalPedidoCel) totalPedidoCel.textContent = totalPedidos;


        // Atualiza gráfico
        criarGraficoConsolidado(transportadoras.filter(t => t.y > 0));
    }

    // =========================
    // Eventos de input
    // =========================
    const inputs = document.querySelectorAll("#consolidado-section input[type='number']");
    inputs.forEach((inp) => inp.addEventListener("input", atualizarConsolidado));

    atualizarConsolidado(); // inicializa gráfico

    // =========================
    // Controle de abas
    // =========================
    const lojasBtn = document.getElementById("lojas-btn");
    const expressosBtn = document.getElementById("expressos-btn");
    const consolidadoBtn = document.getElementById("consolidado-btn");
    const lojasSection = document.getElementById("lojas");
    const expressosSection = document.getElementById("expressos");
    const consolidadoSection = document.getElementById("consolidado");

    function mostrarAba(aba) {
        lojasSection.style.display = "none";
        expressosSection.style.display = "none";
        consolidadoSection.style.display = "none";

        lojasBtn.classList.remove("active");
        expressosBtn.classList.remove("active");
        consolidadoBtn.classList.remove("active");

        if (aba === "lojas") {
            lojasSection.style.display = "flex";
            lojasBtn.classList.add("active");
        } else if (aba === "expressos") {
            expressosSection.style.display = "flex";
            expressosBtn.classList.add("active");
        } else if (aba === "consolidado") {
            consolidadoSection.style.display = "flex";
            consolidadoBtn.classList.add("active");
        }
    }

    lojasBtn.addEventListener("click", () => mostrarAba("lojas"));
    expressosBtn.addEventListener("click", () => mostrarAba("expressos"));
    consolidadoBtn.addEventListener("click", () => mostrarAba("consolidado"));
});

document.addEventListener("DOMContentLoaded", () => {

    function criarGraficos(storeId, graficoColetadoId, graficoProcegurId) {
        const store = document.getElementById(storeId);
        if (!store) return;

        const pedidosEnviarInput = store.querySelector('tr:nth-child(2) input');
        const coletadosInput = store.querySelector('tr:nth-child(3) input');
        const procegurInput = store.querySelector('tr:nth-child(4) input');

        let graficoColetado = null;
        let graficoProcegur = null;

        function atualizar() {
            const enviar = Number(pedidosEnviarInput.value) || 0;
            const coletados = Number(coletadosInput.value) || 0;
            const procegur = Number(procegurInput.value) || 0;

            const restanteColetado = Math.max(enviar - coletados, 0);
            const restanteProcegur = Math.max(enviar - procegur, 0);

            const percColetado = enviar > 0 ? ((coletados / enviar) * 100).toFixed(2) : 0;
            const percRestanteC = enviar > 0 ? ((restanteColetado / enviar) * 100).toFixed(2) : 0;

            const percProcegur = enviar > 0 ? ((procegur / enviar) * 100).toFixed(2) : 0;
            const percRestanteP = enviar > 0 ? ((restanteProcegur / enviar) * 100).toFixed(2) : 0;

            // ----- Gráfico Coletado -----
            if (graficoColetado) graficoColetado.destroy();
            graficoColetado = new Chart(document.getElementById(graficoColetadoId), {
                type: "doughnut",
                data: {
                    labels: ["Coletados", "Restante"],
                    datasets: [{
                        data: [coletados, restanteColetado],
                        backgroundColor: ["#16730b", "#ff1100"]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: "bottom" },
                        title: { display: true, text: "% Coletado" },
                        datalabels: {
                            color: "#fff",
                            font: { weight: "bold", size: 14 },
                            formatter: (value) => value
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });

            // Atualiza % abaixo do gráfico
            const outputColetado = document.getElementById(`percentual-${graficoColetadoId}`);
            if (outputColetado) {
                outputColetado.innerHTML = `
                <b>Coletado:</b> ${percColetado}% <b>Restante:</b> ${percRestanteC}%
            `;
            }

            // ----- Gráfico Procegur -----
            if (graficoProcegur) graficoProcegur.destroy();
            graficoProcegur = new Chart(document.getElementById(graficoProcegurId), {
                type: "doughnut",
                data: {
                    labels: ["Separados", "Restante"],
                    datasets: [{
                        data: [procegur, restanteProcegur],
                        backgroundColor: ["#0055ff", "#ff9900"]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: "bottom" },
                        title: { display: true, text: "% Procegur" },
                        datalabels: {
                            color: "#fff",
                            font: { weight: "bold", size: 14 },
                            formatter: (value) => value
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });

            // Atualiza % abaixo do gráfico
            const outputProcegur = document.getElementById(`percentual-${graficoProcegurId}`);
            if (outputProcegur) {
                outputProcegur.innerHTML = `
                <b>Procegur:</b> ${percProcegur}% <b>Restante:</b> ${percRestanteP}%
            `;
            }
        }

        pedidosEnviarInput.addEventListener("input", atualizar);
        coletadosInput.addEventListener("input", atualizar);
        procegurInput.addEventListener("input", atualizar);

        atualizar();
    }


    // ---- Inicializar gráficos ----
    criarGraficos("shopee", "grafico-coletado-shopee", "grafico-procegur-shopee");
    criarGraficos("mercado_livre", "grafico-coletado-mercado_livre", "grafico-procegur-mercado_livre");

    criarGraficos("total_expresso", "grafico-coletado-total_expresso", "grafico-procegur-total_expresso");
    criarGraficos("total_24h", "grafico-coletado-total_24h", "grafico-procegur-total_24h");
    criarGraficos("total_bras", "grafico-coletado-total_bras", "grafico-procegur-total_bras");

    // ---- Alternar entre Lojas e Transportadoras ----
    const lojasBtn = document.getElementById("lojas-btn");
    const expressosBtn = document.getElementById("expressos-btn");
    const lojasSection = document.getElementById("lojas");
    const expressosSection = document.getElementById("expressos");

    lojasBtn.addEventListener("click", () => {
        lojasBtn.classList.add("active");
        expressosBtn.classList.remove("active");
        lojasSection.style.display = "flex";
        expressosSection.style.display = "none";
    });

    expressosBtn.addEventListener("click", () => {
        expressosBtn.classList.add("active");
        lojasBtn.classList.remove("active");
        expressosSection.style.display = "flex";
        lojasSection.style.display = "none";
    });

    // Começar com "Lojas"
    lojasSection.style.display = "flex";
    expressosSection.style.display = "none";
});

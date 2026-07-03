const selectMercados = document.getElementById('mercados');
const containerOdds = document.getElementById('container-odds-contrarias');
const buttonCalcular = document.getElementById('calcular-button');

let mercadosData = {};

function updateOddsContraria() {
    const numMercados = Number(selectMercados.value);
    const numOddsContrarias = numMercados - 1;

    containerOdds.innerHTML = '';
    
    for (let i = 1; i <= numOddsContrarias; i++) {
        const newDiv = document.createElement('div');
        newDiv.className = 'input-group-modern';
        
        newDiv.innerHTML = `
            <label for="odd-contraria-${i}">Odd Contrária ${i}</label>
            <input type="text" inputmode="decimal" id="odd-contraria-${i}">
        `;
        
        containerOdds.appendChild(newDiv);
    }
}

selectMercados.addEventListener('change', updateOddsContraria);

function calculateEV() {
    const oddAnalisadaInput = document.getElementById('odd-analisada').value;
    const oddApostaInput = document.getElementById('odd-encontrada').value;
    
    const oddAnalisada = parseFloat(oddAnalisadaInput.replace(',', '.'));
    const oddAposta = parseFloat(oddApostaInput.replace(',', '.'));

    // Check for empty values
    if (!oddAnalisada || !oddAposta || oddAnalisada <= 1 || oddAposta <= 1) {
        alert("Por favor, preencha a Odd Analisada e a Sua Aposta com valores válidos (maiores que 1).");
        return;
    }

    // Margem calc
    let margem = (1 / oddAnalisada);
    const numMercados = Number(selectMercados.value);

    // Sums all probability of all "Odds Contrarias"
    for (let i = 1; i < numMercados; i++) {
        let oddContrariaInput = document.getElementById(`odd-contraria-${i}`).value;
        const oddContraria = parseFloat(oddContrariaInput.replace(',', '.'));
        
        if (!oddContraria || oddContraria <= 1) {
            alert(`Por favor, preencha corretamente a Odd Contrária ${i}.`);
            return;
        }
        
        margem += (1 / oddContraria);
    }

    // Main calcs
    const payout = (1 / margem) * 100;
    const probJusta = (1 / oddAnalisada) / margem; 
    const oddJusta = 1 / probJusta;

    // Main EV calc
    const evDecimal = (probJusta * oddAposta) - 1;
    const evPercent = evDecimal * 100;

    // Stake Calc
    let kellyPercent = ((evDecimal / (oddAposta - 1)) * 100) / 2;
    if (kellyPercent < 0) {
        kellyPercent = 0;
    }

    // Update on HTML
    const resultados = document.querySelectorAll('.res-value');
    resultados[0].innerText = payout.toFixed(2).replace('.', ',') + '%';
    resultados[1].innerText = oddJusta.toFixed(2).replace('.', ',');
    resultados[2].innerText = kellyPercent.toFixed(2).replace('.', ',') + '%';

    // Update card if positive or negative
    const painelVerdict = document.querySelector('.calc-verdict');
    const tituloVerdict = document.querySelector('.v-title');
    const numeroVerdict = document.querySelector('.v-number');

    painelVerdict.classList.remove('positive', 'negative');

    // if > 0 then adds a + else -
    const sinal = evPercent > 0 ? '+' : '';
    numeroVerdict.innerText = sinal + evPercent.toFixed(2).replace('.', ',') + '%';

    if (evPercent > 0) {
        painelVerdict.classList.add('positive');
        tituloVerdict.innerText = 'Valor Positivo (EV+)';
    } else {
        painelVerdict.classList.add('negative');
        tituloVerdict.innerText = 'Valor Negativo (EV-)';
    }
}

buttonCalcular.addEventListener('click', calculateEV);
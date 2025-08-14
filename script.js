// Estado do jogo
let gameState = {
    currentMode: null, // 'soap' ou 'alcohol'
    currentStep: 0,
    score: 0,
    startTime: null,
    timer: null,
    timeElapsed: 0,
    stepsCompleted: [],
    totalSteps: 0,
    minTime: 0,
    maxTime: 0
};

// Configurações dos modos de jogo
const gameModes = {
    soap: {
        title: "Higienizando as mãos certinho - Água e Sabão",
        instruction: "O procedimento deve durar entre 40 e 60 segundos. Siga as instruções para higienizar cada área.",
        howToPlay: "Clique nas ferramentas e botões das áreas das mãos na ordem indicada para completar a higienização.",
        minTime: 40,
        maxTime: 60,
        handImage: "assets/hand_dirty.png",
        steps: [
            { id: 'faucet', name: 'Molhe as mãos', tool: 'tool-faucet', points: 10 },
            { id: 'soap', name: 'Aplique sabão', tool: 'tool-soap', points: 10 },
            { id: 'palms', name: 'Friccione as palmas', tool: 'tool-palms', points: 15 },
            { id: 'fingers', name: 'Friccione entre os dedos', tool: 'tool-fingers', points: 15 },
            { id: 'back', name: 'Friccione o dorso', tool: 'tool-back', points: 15 },
            { id: 'thumbs', name: 'Friccione os polegares', tool: 'tool-thumbs', points: 15 },
            { id: 'nails', name: 'Friccione as unhas', tool: 'tool-nails', points: 15 },
            { id: 'rinse', name: 'Enxágue as mãos', tool: 'tool-faucet', points: 10 },
            { id: 'dry', name: 'Seque as mãos', tool: 'tool-towel', points: 10 }
        ]
    },
    alcohol: {
        title: "Higienizando as mãos certinho - Álcool 70%",
        instruction: "Este procedimento dura entre 20 e 30 segundos. O álcool 70% é usado quando não há sujeira visível.",
        howToPlay: "Clique nas ferramentas e botões das áreas das mãos na ordem indicada para completar a higienização.",
        minTime: 20,
        maxTime: 30,
        handImage: "assets/hand_alcohol.png",
        steps: [
            { id: 'alcohol', name: 'Aplique álcool 70%', tool: 'tool-alcohol', points: 15 },
            { id: 'palms', name: 'Friccione as palmas', tool: 'tool-palms', points: 20 },
            { id: 'fingers', name: 'Friccione entre os dedos', tool: 'tool-fingers', points: 20 },
            { id: 'back', name: 'Friccione o dorso', tool: 'tool-back', points: 20 },
            { id: 'thumbs', name: 'Friccione os polegares', tool: 'tool-thumbs', points: 20 },
            { id: 'nails', name: 'Friccione as unhas', tool: 'tool-nails', points: 20 }
        ]
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});

function initializeGame() {
    // Event listeners para os botões da tela inicial
    document.getElementById('start-soap').addEventListener('click', () => startGame('soap'));
    document.getElementById('start-alcohol').addEventListener('click', () => startGame('alcohol'));
    
    // Event listeners para os botões da tela de feedback
    document.getElementById('play-again').addEventListener('click', restartGame);
    document.getElementById('back-to-menu').addEventListener('click', backToMenu);
    
    // Event listeners para as ferramentas e áreas
    setupToolListeners();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startGame(mode) {
    gameState.currentMode = mode;
    gameState.currentStep = 0;
    gameState.score = 0;
    gameState.stepsCompleted = [];
    gameState.timeElapsed = 0;
    
    const modeConfig = gameModes[mode];
    
    // Embaralhar os passos, exceto os de molhar/aplicar/enxaguar/secar
    let shuffledSteps = [];
    let fixedSteps = [];

    if (mode === 'soap') {
        fixedSteps.push(modeConfig.steps[0]); // Molhar as mãos
        fixedSteps.push(modeConfig.steps[1]); // Aplicar sabão
        shuffledSteps = shuffleArray(modeConfig.steps.slice(2, -2)); // Fricção
        fixedSteps.push(...shuffledSteps);
        fixedSteps.push(modeConfig.steps[modeConfig.steps.length - 2]); // Enxágue
        fixedSteps.push(modeConfig.steps[modeConfig.steps.length - 1]); // Secagem
    } else { // alcohol
        fixedSteps.push(modeConfig.steps[0]); // Aplicar álcool
        shuffledSteps = shuffleArray(modeConfig.steps.slice(1)); // Fricção
        fixedSteps.push(...shuffledSteps);
    }

    modeConfig.steps = fixedSteps;
    gameState.totalSteps = modeConfig.steps.length;
    gameState.minTime = modeConfig.minTime;
    gameState.maxTime = modeConfig.maxTime;
    
    // Configurar interface
    document.getElementById('game-title').textContent = modeConfig.title;
    document.getElementById('instruction').textContent = modeConfig.instruction;
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('hand-image').src = modeConfig.handImage; // Define a imagem da mão
    
    // Adicionar instrução de como jogar
    const howToPlayElement = document.getElementById('how-to-play-instruction');
    if (howToPlayElement) {
        howToPlayElement.textContent = modeConfig.howToPlay;
    }

    // Configurar ferramentas visíveis
    setupToolsForMode(mode);
    
    // Mostrar tela do jogo
    showScreen('game-screen');
    
    // Iniciar timer
    startTimer();
    
    // Mostrar primeiro passo
    showCurrentStep();
}

function setupToolsForMode(mode) {
    const tools = document.querySelectorAll('.tool');
    tools.forEach(tool => {
        tool.style.display = 'none'; // Esconde todos por padrão
        tool.classList.remove('active', 'disabled');
    });
    
    // Mostra apenas as ferramentas e áreas relevantes para o modo
    if (mode === 'soap') {
        document.getElementById('tool-faucet').style.display = 'block';
        document.getElementById('tool-soap').style.display = 'block';
        document.getElementById('tool-towel').style.display = 'block';
        document.getElementById('tool-palms').style.display = 'block';
        document.getElementById('tool-fingers').style.display = 'block';
        document.getElementById('tool-back').style.display = 'block';
        document.getElementById('tool-thumbs').style.display = 'block';
        document.getElementById('tool-nails').style.display = 'block';
    } else { // alcohol
        document.getElementById('tool-alcohol').style.display = 'block';
        document.getElementById('tool-palms').style.display = 'block';
        document.getElementById('tool-fingers').style.display = 'block';
        document.getElementById('tool-back').style.display = 'block';
        document.getElementById('tool-thumbs').style.display = 'block';
        document.getElementById('tool-nails').style.display = 'block';
    }
}

function setupToolListeners() {
    const tools = document.querySelectorAll('.tool');
    tools.forEach(tool => {
        tool.addEventListener('click', () => handleToolClick(tool.id));
    });
}

function startTimer() {
    gameState.startTime = Date.now();
    gameState.timer = setInterval(updateTimer, 100);
}

function updateTimer() {
    gameState.timeElapsed = (Date.now() - gameState.startTime) / 1000;
    const minutes = Math.floor(gameState.timeElapsed / 60);
    const seconds = Math.floor(gameState.timeElapsed % 60);
    const milliseconds = Math.floor((gameState.timeElapsed % 1) * 10);
    
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}`;

    // Fazer o placar de tempo piscar se estiver passando da hora
    const timerContainer = document.querySelector('.timer-container');
    if (gameState.timeElapsed > gameState.maxTime) {
        timerContainer.classList.add('blinking');
    } else {
        timerContainer.classList.remove('blinking');
    }
}

function showCurrentStep() {
    const modeConfig = gameModes[gameState.currentMode];
    const currentStepData = modeConfig.steps[gameState.currentStep];
    
    if (!currentStepData) {
        endGame();
        return;
    }
    
    // Atualizar texto do passo atual
    document.getElementById('current-step').textContent = 
        `Passo ${gameState.currentStep + 1}: ${currentStepData.name}`;
    
    // Atualizar barra de progresso
    const progress = ((gameState.currentStep) / gameState.totalSteps) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    
    // Destacar ferramenta ou área necessária
    highlightRequiredElement(currentStepData);
}

function highlightRequiredElement(stepData) {
    // Remover destaques anteriores
    document.querySelectorAll('.tool').forEach(tool => tool.classList.remove('active'));
    
    // Destacar elemento necessário
    if (stepData.tool) {
        const tool = document.getElementById(stepData.tool);
        if (tool && tool.style.display !== 'none') {
            tool.classList.add('active');
        }
    }
}

function handleToolClick(toolId) {
    const modeConfig = gameModes[gameState.currentMode];
    const currentStepData = modeConfig.steps[gameState.currentStep];
    
    if (currentStepData && currentStepData.tool === toolId) {
        completeStep();
    } else {
        // Feedback negativo
        showFeedback('Ação incorreta! Siga a sequência correta.', 'error');
    }
}

function completeStep() {
    const modeConfig = gameModes[gameState.currentMode];
    const currentStepData = modeConfig.steps[gameState.currentStep];
    
    // Adicionar pontos
    gameState.score += currentStepData.points;
    document.getElementById('score').textContent = gameState.score;
    
    // Marcar passo como completado
    gameState.stepsCompleted.push(currentStepData.id);
    
    // Feedback positivo
    showFeedback('Correto!', 'success');
    
    // Avançar para próximo passo
    gameState.currentStep++;
    
    // Pequeno delay antes de mostrar próximo passo
    setTimeout(() => {
        showCurrentStep();
    }, 500);
}

function showFeedback(message, type) {
    // Criar elemento de feedback temporário
    const feedback = document.createElement('div');
    feedback.className = `feedback-popup ${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'success' ? '#4CAF50' : '#F44336'};
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: bold;
        z-index: 1000;
        animation: fadeInOut 1s ease-in-out;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        document.body.removeChild(feedback);
    }, 1000);
}

function endGame() {
    // Parar timer
    clearInterval(gameState.timer);
    
    // Calcular pontuação final
    calculateFinalScore();
    
    // Mostrar tela de feedback
    showFeedbackScreen();
}

function calculateFinalScore() {
    let timeBonus = 0;
    let timePenalty = 0;
    
    // Bônus/penalidade baseado no tempo
    if (gameState.timeElapsed >= gameState.minTime && gameState.timeElapsed <= gameState.maxTime) {
        timeBonus = 50; // Bônus por tempo ideal
    } else if (gameState.timeElapsed < gameState.minTime) {
        timePenalty = 20; // Penalidade por ser muito rápido
    } else {
        timePenalty = Math.min(30, Math.floor((gameState.timeElapsed - gameState.maxTime) * 2)); // Penalidade por ser muito lento
    }
    
    gameState.score = Math.max(0, gameState.score + timeBonus - timePenalty);
}

function showFeedbackScreen() {
    // Atualizar pontuação final
    document.getElementById('final-score').textContent = gameState.score;
    
    // Calcular estrelas (1-5 baseado na pontuação)
    const maxScore = gameModes[gameState.currentMode].steps.reduce((sum, step) => sum + step.points, 0) + 50;
    const stars = Math.max(1, Math.min(5, Math.ceil((gameState.score / maxScore) * 5)));
    
    // Mostrar estrelas
    const starContainer = document.getElementById('star-rating');
    starContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = i <= stars ? 'star' : 'star empty';
        star.textContent = '★';
        starContainer.appendChild(star);
    }
    
    // Gerar mensagem de feedback
    let feedbackMessage = '';
    if (stars >= 4) {
        feedbackMessage = 'Excelente! Você dominou a técnica de higienização das mãos!';
    } else if (stars >= 3) {
        feedbackMessage = 'Muito bem! Você completou a higienização corretamente!';
    } else if (stars >= 2) {
        feedbackMessage = 'Bom trabalho! Continue praticando para melhorar sua técnica.';
    } else {
        feedbackMessage = 'Você pode melhorar! Revise os passos e tente novamente.';
    }
    
    document.getElementById('feedback-text').textContent = feedbackMessage;
    
    // Mostrar detalhes do desempenho
    showPerformanceDetails();
    
    // Mostrar tela de feedback
    showScreen('feedback-screen');
}

function showPerformanceDetails() {
    const detailsList = document.getElementById('performance-details');
    detailsList.innerHTML = '';
    
    const modeConfig = gameModes[gameState.currentMode];
    
    // Verificar cada passo
    modeConfig.steps.forEach((step, index) => {
        const li = document.createElement('li');
        const completed = gameState.stepsCompleted.includes(step.id);
        
        li.innerHTML = `
            <span>${step.name}</span>
            <span class="${completed ? 'check-mark' : 'x-mark'}">
                ${completed ? '✓' : '✗'}
            </span>
        `;
        
        detailsList.appendChild(li);
    });
    
    // Adicionar informação sobre tempo
    const timeLi = document.createElement('li');
    const timeInRange = gameState.timeElapsed >= gameState.minTime && gameState.timeElapsed <= gameState.maxTime;
    
    timeLi.innerHTML = `
        <span>Tempo adequado (${gameState.minTime}-${gameState.maxTime}s): ${gameState.timeElapsed.toFixed(1)}s</span>
        <span class="${timeInRange ? 'check-mark' : 'x-mark'}">
            ${timeInRange ? '✓' : '✗'}
        </span>
    `;
    
    detailsList.appendChild(timeLi);
}

function restartGame() {
    showScreen('welcome-screen'); // Volta para a tela de boas-vindas para re-inicializar o jogo
    
    // Limpar timer se estiver rodando
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    
    // Resetar estado
    gameState = {
        currentMode: null,
        currentStep: 0,
        score: 0,
        startTime: null,
        timer: null,
        timeElapsed: 0,
        stepsCompleted: [],
        totalSteps: 0,
        minTime: 0,
        maxTime: 0
    };
}

function backToMenu() {
    showScreen('welcome-screen');
    
    // Limpar timer se estiver rodando
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    
    // Resetar estado
    gameState = {
        currentMode: null,
        currentStep: 0,
        score: 0,
        startTime: null,
        timer: null,
        timeElapsed: 0,
        stepsCompleted: [],
        totalSteps: 0,
        minTime: 0,
        maxTime: 0
    };
}

function showScreen(screenId) {
    // Esconder todas as telas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar tela solicitada
    document.getElementById(screenId).classList.add('active');
}

// Adicionar animação CSS para feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style);


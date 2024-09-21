const timerEl = document.getElementById('timer');
const markslist = document.getElementById('marks-list');
let intervalId = null;
let timer = 0; 
let marks = [];

// Formata o tempo para HH:MM:SS:MS
const formatTime = (time) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const hundredths = Math.floor((time % 1000) / 10);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${hundredths.toString().padStart(2, '0')}`;
};

// Adiciona a marca à lista
const addMarktoList = (markIndex, markTime) => {
    markslist.insertAdjacentHTML('beforeend', `<p>${markIndex}: ${formatTime(markTime)}</p>`);
};

// Marca o tempo atual
const markTime = () => {
    marks.push(timer);
    addMarktoList(marks.length, timer);
};

// Alterna o estado do cronômetro
const toggleTimer = () => {
    const button = document.getElementById('power');
    const action = button.getAttribute('action');

    if (action === 'start' || action === 'continue') {
        const startTime = Date.now() - timer; // Calcula o tempo de início
        intervalId = setInterval(() => {
            timer = Date.now() - startTime; // Atualiza o tempo com base no atual
            setTimer(timer);
            localStorage.setItem('timer', timer); // Armazena o tempo no localStorage
        }, 10);
        button.setAttribute('action', 'pause');
        button.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else if (action === 'pause') {
        clearInterval(intervalId);
        button.setAttribute('action', 'continue');
        button.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
};

// Reinicia o cronômetro
const resetTimer = () => {
    clearInterval(intervalId);
    timer = 0;
    marks = [];
    setTimer(timer);
    markslist.innerHTML = '';
    const button = document.getElementById('power');
    button.setAttribute('action', 'start');
    button.innerHTML = '<i class="fa-solid fa-play"></i>';
    localStorage.removeItem('timer'); // Remove o timer do localStorage
};

// Atualiza a exibição do cronômetro
const setTimer = (time) => {
    timerEl.innerText = formatTime(time);
};



// Carrega o tempo armazenado do localStorage ao carregar a página
window.onload = () => {
    const savedTime = localStorage.getItem('timer');
    const button = document.getElementById('power');

    if (savedTime) {
        timer = parseInt(savedTime, 10);
        setTimer(timer);

        // Se o botão estiver em "start", reinicia o cronômetro para zero
        if (button.getAttribute('action') === 'start') {
            timer = 0; // Reinicia o cronômetro para zero
            setTimer(timer);
        } else if (button.getAttribute('action') === 'pause') {
            toggleTimer();
        }
    } else {
        timer = 0; // Se não houver tempo salvo, inicia em zero
        setTimer(timer);
    }
};


// Eventos dos botões
document.getElementById('power').addEventListener('click', toggleTimer);
document.getElementById('mark').addEventListener('click', markTime);
document.getElementById('reset').addEventListener('click', resetTimer);
document.getElementById('borderColor').addEventListener('input', function() {
    const selectedColor = this.value; // Cor escolhida pelo usuário
    const timer = document.getElementById('timer');

    // Definir a nova cor da borda
    timer.style.setProperty('--cor-principal', selectedColor);
    timer.style.setProperty('--cor-secundaria', '#5c2ab8');
});

// --- ANTI-COPY & MONITORING ---
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = (e) => {
    if (e.ctrlKey && [67, 86, 85, 73].includes(e.keyCode)) return false;
};

const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const timerElement = document.getElementById('timer');

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timer

const questions = [
    // --- FROM MODEL PAPER 1 ---
    { question: "1. ವರ್ಗೀಯ ವ್ಯಂಜನದ ಪಂಚಮಾಕ್ಷರಗಳಿವು:", answers: [{ text: "ಮಹಾಪ್ರಾಣಾಕ್ಷರಗಳು", correct: false }, { text: "ಅಲ್ಪಪ್ರಾಣಾಕ್ಷರಗಳು", correct: false }, { text: "ಅನುನಾಸಿಕಗಳು", correct: true }, { text: "ಯೋಗವಾಹಗಳು", correct: false }] },
    { question: "2. 'ಮಾತಂತು' ಪದವು ಈ ಸಂಧಿಗೆ ಸೇರಿದೆ:", answers: [{ text: "ಲೋಪ ಸಂಧಿ", correct: false }, { text: "ಆಗಮ ಸಂಧಿ", correct: true }, { text: "ಆದೇಶ ಸಂಧಿ", correct: false }, { text: "ವೃದ್ಧಿ ಸಂಧಿ", correct: false }] },
    { question: "3. 'ಕೈಮರ' ಪದವು ಈ ಸಮಾಸಕ್ಕೆ ಉದಾಹರಣೆ:", answers: [{ text: "ತತ್ಪುರುಷ ಸಮಾಸ", correct: true }, { text: "ಕರ್ಮಧಾರಯ ಸಮಾಸ", correct: false }, { text: "ದ್ವಿಗು ಸಮಾಸ", correct: false }, { text: "ಅಂಶೀ ಸಮಾಸ", correct: false }] },
    { question: "4. ಸಂಪ್ರದಾನ ಕಾರಕದ ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯ:", answers: [{ text: "ಷಷ್ಠಿ", correct: false }, { text: "ಪಂಚಮಿ", correct: false }, { text: "ಚತುರ್ಥಿ", correct: true }, { text: "ತೃತೀಯ", correct: false }] },
    { question: "5. 'ಆಹಾ!' ಪದವು ಯಾವ ಅವ್ಯಯಕ್ಕೆ ಉದಾಹರಣೆ:", answers: [{ text: "ಭಾವಸೂಚಕ ಅವ್ಯಯ", correct: true }, { text: "ಅನುಕರಣ ಅವ್ಯಯ", correct: false }, { text: "ಕ್ರಿಯಾರ್ಥಕ ಅವ್ಯಯ", correct: false }, { text: "ಸಂಬಂಧಸೂಚಕ ಅವ್ಯಯ", correct: false }] },
    { question: "6. 'ಹುಲಿ' ಪದದ ಸ್ತ್ರೀಲಿಂಗ ರೂಪ:", answers: [{ text: "ಹುಲಿತಿ", correct: false }, { text: "ಹೆಣ್ಣು ಹುಲಿ", correct: true }, { text: "ಹುಲಿಯಮ್ಮ", correct: false }, { text: "ಹುಲಿಗಾರ್ತಿ", correct: false }] },

    // --- FROM MODEL PAPER 2 ---
    { question: "7. ಕನ್ನಡ ವರ್ಣಮಾಲೆಯ ಪ್ರತಿ ವರ್ಗದ ಎರಡು ಮತ್ತು ನಾಲ್ಕನೆಯ ಅಕ್ಷರಗಳು:", answers: [{ text: "ಅಲ್ಪಪ್ರಾಣಾಕ್ಷರಗಳು", correct: false }, { text: "ಅನುನಾಸಿಕಾಕ್ಷರಗಳು", correct: false }, { text: "ಮಹಾಪ್ರಾಣಾಕ್ಷರಗಳು", correct: true }, { text: "ಯೋಗವಾಹಗಳು", correct: false }] },
    { question: "8. 'ಗಿಡಮರಗಳು' ಪದವು ಈ ವ್ಯಾಕರಣ ಅಂಶಕ್ಕೆ ಉದಾಹರಣೆ:", answers: [{ text: "ದ್ವಿರುಕ್ತಿ", correct: false }, { text: "ಜೋಡುನುಡಿ", correct: true }, { text: "ನುಡಿಗಟ್ಟು", correct: false }, { text: "ಅವ್ಯಯ", correct: false }] },
    { question: "9. 'ಪದ್ಮ' ಪದದ ತದ್ಭವ ರೂಪ:", answers: [{ text: "ಹೂವು", correct: false }, { text: "ಪದುಮ", correct: true }, { text: "ಕಮಲ", correct: false }, { text: "ಪಚ್ಚೆ", correct: false }] },
    { question: "10. ಒಂದು ಪೂರ್ಣಾಭಿಪ್ರಾಯವನ್ನು ನೀಡುವ ವಾಕ್ಯದ ಕೊನೆಯಲ್ಲಿ ಬಳಸುವ ಲೇಖನ ಚಿಹ್ನೆ:", answers: [{ text: "ಪ್ರಶ್ನಾರ್ಥಕ ಚಿಹ್ನೆ", correct: false }, { text: "ಭಾವಸೂಚಕ ಚಿಹ್ನೆ", correct: false }, { text: "ಅಲ್ಪವಿರಾಮ", correct: false }, { text: "ಪೂರ್ಣವಿರಾಮ", correct: true }] },
    { question: "11. 'ಷಟ್ಪದಿ' ಛಂದಸ್ಸಿನಲ್ಲಿ ಒಟ್ಟು ಎಷ್ಟು ಸಾಲುಗಳಿರುತ್ತವೆ?", answers: [{ text: "ನಾಲ್ಕು", correct: false }, { text: "ಎಂಟು", correct: false }, { text: "ಆರು", correct: true }, { text: "ಎರಡು", correct: false }] },
    { question: "12. 'ಕಣ್ಣು' ಪದದ ಸಮಾನಾರ್ಥಕ ಪದ:", answers: [{ text: "ನೇತ್ರ", correct: true }, { text: "ಕರ್ಣ", correct: false }, { text: "ನಾಸಿಕ", correct: false }, { text: "ಹಸ್ತ", correct: false }] },

    // --- FROM MODEL PAPER 3 ---
    { question: "13. ಕನ್ನಡ ವರ್ಣಮಾಲೆಯಲ್ಲಿರುವ ಒಟ್ಟು ದೀರ್ಘಸ್ವರಗಳ ಸಂಖ್ಯೆ:", answers: [{ text: "ಒಂಬತ್ತು", correct: false }, { text: "ಏಳು", correct: true }, { text: "ಐದು", correct: false }, { text: "ಹದಿಮೂರು", correct: false }] },
    { question: "14. 'ವಿದ್ಯಾರ್ಥಿ' ಪದವು ಈ ಸಂಧಿಗೆ ಉದಾಹರಣೆ:", answers: [{ text: "ಗುಣ ಸಂಧಿ", correct: false }, { text: "ವೃದ್ಧಿ ಸಂಧಿ", correct: false }, { text: "ಸವರ್ಣದೀರ್ಘ ಸಂಧಿ", correct: true }, { text: "ಯಣ್ ಸಂಧಿ", correct: false }] },
    { question: "15. 'ಅರಮನೆ' ಯಾವ ಸಮಾಸಕ್ಕೆ ಉದಾಹರಣೆ?", answers: [{ text: "ತತ್ಪುರುಷ ಸಮಾಸ", correct: true }, { text: "ದ್ವಂದ್ವ ಸಮಾಸ", correct: false }, { text: "ಅಂಶೀ ಸಮಾಸ", correct: false }, { text: "ಕರ್ಮಧಾರಯ ಸಮಾಸ", correct: false }] },
    { question: "16. 'ಬರೆದನು' ಪದದಲ್ಲಿರುವ ಪ್ರತ್ಯಯ:", answers: [{ text: "ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯ", correct: false }, { text: "ಆಖ್ಯಾತ ಪ್ರತ್ಯಯ", correct: true }, { text: "ತದ್ಧಿತ ಪ್ರತ್ಯಯ", correct: false }, { text: "ಕೃದಂತ ಪ್ರತ್ಯಯ", correct: false }] },
    { question: "17. 'ಲಗುಬಗು' ಪದವು ಯಾವ ವ್ಯಾಕರಣ ಅಂಶಕ್ಕೆ ಸೇರಿದೆ?", answers: [{ text: "ಅನುಕರಣ ವಾಚಕ", correct: true }, { text: "ದ್ವಿರುಕ್ತಿ", correct: false }, { text: "ಜೋಡುನುಡಿ", correct: false }, { text: "ಅವ್ಯಯ", correct: false }] },
    { question: "18. ಉಪಮಾನ ಮತ್ತು ಉಪಮೇಯಗಳಿಗೆ ಅಭೇದವನ್ನು ಕಲ್ಪಿಸಿ ಹೇಳುವ ಅಲಂಕಾರ:", answers: [{ text: "ಉಪಮಾ ಅಲಂಕಾರ", correct: false }, { text: "ರೂಪಕ ಅಲಂಕಾರ", correct: true }, { text: "ಉತ್ಪ್ರೇಕ್ಷಾ ಅಲಂಕಾರ", correct: false }, { text: "ದೃಷ್ಟಾಂತ ಅಲಂಕಾರ", correct: false }] },

    // --- FROM MODEL PAPER 4 ---
    { question: "19. ಕನ್ನಡ ವರ್ಣಮಾಲೆಯಲ್ಲಿರುವ ಯೋಗವಾಹಗಳ ಸಂಖ್ಯೆ:", answers: [{ text: "ಮೂರು", correct: false }, { text: "ಎರಡು", correct: true }, { text: "ನಾಲ್ಕು", correct: false }, { text: "ಒಂದು", correct: false }] },
    { question: "20. 'ಉನ್ಮಾದ' ಪದವು ಈ ಸಂಧಿಗೆ ಉದಾಹರಣೆ:", answers: [{ text: "ಶ್ಚುತ್ವ ಸಂಧಿ", correct: false }, { text: "ಜಶ್ತ್ವ ಸಂಧಿ", correct: false }, { text: "ಅನುನಾಸಿಕ ಸಂಧಿ", correct: true }, { text: "ವೃದ್ಧಿ ಸಂಧಿ", correct: false }] },
    { question: "21. 'ಗಜಗಮನೆ' ಯಾವ ಸಮಾಸಕ್ಕೆ ಉದಾಹರಣೆ?", answers: [{ text: "ಬಹುವ್ರೀಹಿ ಸಮಾಸ", correct: true }, { text: "ತತ್ಪುರುಷ ಸಮಾಸ", correct: false }, { text: "ಕರ್ಮಧಾರಯ ಸಮಾಸ", correct: false }, { text: "ದ್ವಿಗು ಸಮಾಸ", correct: false }] },
    { question: "22. 'ಚಂದ್ರ' ಪದದ ತದ್ಭವ ರೂಪ:", answers: [{ text: "ಚಂದಿರಾ", correct: false }, { text: "ಚಂದಿರ", correct: true }, { text: "ಶಶಿ", correct: false }, { text: "ತಿಂಗಳು", correct: false }] },
    { question: "23. ವಾಕ್ಯದಲ್ಲಿ ಪದಗಳ ನಡುವೆ ಹೆಚ್ಚಿನ ವಿರಾಮ ಬೇಕಾದಾಗ ಬಳಸುವ ಲೇಖನ ಚಿಹ್ನೆ:", answers: [{ text: "ಅಲ್ಪವಿರಾಮ", correct: false }, { text: "ಅರ್ಧವಿರಾಮ", correct: true }, { text: "ಭಾವಸೂಚಕ ಚಿಹ್ನೆ", correct: false }, { text: "ಪ್ರಶ್ನಾರ್ಥಕ ಚಿಹ್ನೆ", correct: false }] },
    { question: "24. 'ಸೂರ್ಯ' ಪದಕ್ಕೆ ಸಮಾನಾರ್ಥಕವಾದ ಪದ:", answers: [{ text: "ಚಂದ್ರ", correct: false }, { text: "ಭಾನು", correct: true }, { text: "ನಕ್ಷತ್ರ", correct: false }, { text: "ಆಕಾಶ", correct: false }] }
];

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "ಮುಂದಿನ ಪ್ರಶ್ನೆ (Next)";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
    document.getElementById('progress-bar').style.width = progressPercent + '%';

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) button.dataset.correct = answer.correct;
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
    startTimer();
}

function resetState() {
    clearInterval(timer);
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function startTimer() {
    timeLeft = 30;
    timerElement.innerText = `ಸಮಯ: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = `ಸಮಯ: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            autoSelectCorrect();
        }
    }, 1000);
}

function autoSelectCorrect() {
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === "true") button.classList.add('correct');
        button.disabled = true;
    });
    nextButton.classList.remove('hide');
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add('correct');
        score++;
    } else {
        selectedBtn.classList.add('wrong');
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === "true") button.classList.add('correct');
        button.disabled = true;
    });
    clearInterval(timer);
    nextButton.classList.remove('hide');
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

function showScore() {
    resetState();
    document.getElementById('progress-bar').style.width = '100%';
    
    questionElement.innerHTML = `
        <div style="text-align:center;">
            <h2 style="color: #2c3e50;">ಪರೀಕ್ಷೆಯ ಫಲಿತಾಂಶ (Result)</h2>
            <p style="font-size: 4rem; color: #3498db; margin: 20px 0; font-weight: bold;">${score} / ${questions.length}</p>
            <p style="color: #7f8c8d; font-size: 1.2rem;">ಮುಂದಿನ ಪರೀಕ್ಷೆಗೆ ಸಿದ್ಧರಾಗಿ!</p>
        </div>
    `;
    nextButton.innerHTML = "ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ (Restart)";
    nextButton.classList.remove('hide');
}

nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length) handleNextButton();
    else startQuiz();
});

startQuiz();

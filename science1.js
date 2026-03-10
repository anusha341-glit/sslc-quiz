
// --- ANTI-COPY & MONITORING ---
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = (e) => {
    if (e.ctrlKey && [67, 86, 85, 73].includes(e.keyCode)) return false;
};

// UI Elements
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const timerElement = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timer;

// ಪರೀಕ್ಷೆ 1ರ ಪ್ರಶ್ನೆಗಳು (Science Model Paper 1)
const questions = [
    { 
        question: "1. ವಿಭವಾಂತರದ (Potential Difference) SI ಏಕಮಾನ:", 
        answers: [
            { text: "ವೋಲ್ಟ್ (V)", correct: true }, 
            { text: "ಆಂಪೀರ್ (A)", correct: false }, 
            { text: "ಕೂಲಂ (C)", correct: false }, 
            { text: "ಓಮ್ ಮೀಟರ್ (Ωm)", correct: false }
        ] 
    },
    { 
        question: "2. ಪೀನ ದರ್ಪಣದ (Convex Mirror) ಮುಂದೆ ವಸ್ತುವನ್ನು ಎಲ್ಲಿ ಇರಿಸಿದರೂ ಉಂಟಾಗುವ ಪ್ರತಿಬಿಂಬದ ಸ್ವಭಾವ:", 
        answers: [
            { text: "ಸತ್ಯ ಮತ್ತು ತಲೆಕೆಳಗಾದ", correct: false }, 
            { text: "ಸತ್ಯ ಮತ್ತು ನೇರವಾದ", correct: false }, 
            { text: "ಮಿಥ್ಯ ಮತ್ತು ತಲೆಕೆಳಗಾದ", correct: false }, 
            { text: "ಮಿಥ್ಯ ಮತ್ತು ನೇರವಾದ", correct: true }
        ] 
    },
    { 
        question: "3. ಈ ಕೆಳಗಿನವುಗಳಲ್ಲಿ ಯಾವುದು ಆಮ್ಲೀಯ ಆಕ್ಸೈಡ್ ಆಗಿದೆ?", 
        answers: [
            { text: "Na2O", correct: false }, 
            { text: "MgO", correct: false }, 
            { text: "SO2", correct: true }, 
            { text: "Al2O3", correct: false }
        ] 
    },
    { 
        question: "4. ಆಧುನಿಕ ಆವರ್ತಕ ಕೋಷ್ಟಕದಲ್ಲಿರುವ (Modern Periodic Table) ಆವರ್ತಗಳ ಸಂಖ್ಯೆ:", 
        answers: [
            { text: "18", correct: false }, 
            { text: "7", correct: true }, 
            { text: "8", correct: false }, 
            { text: "10", correct: false }
        ] 
    },
    { 
        question: "5. ಮಾನವನ ಸ್ತ್ರೀ ಜನನಾಂಗ ವ್ಯೂಹಕ್ಕೆ ಸೇರದ ಭಾಗ ಯಾವುದು?", 
        answers: [
            { text: "ಅಂಡಾಶಯ", correct: false }, 
            { text: "ಗರ್ಭಕೋಶ", correct: false }, 
            { text: "ಶುಕ್ರವಾಹಕ", correct: true }, 
            { text: "ಅಂಡವಾಹಕ", correct: false }
        ] 
    },
    { 
        question: "6. ಸಸ್ಯಗಳಲ್ಲಿ ನೀರು ಮತ್ತು ಖನಿಜಗಳ ಸಾಗಾಣಿಕೆಗೆ ಸಹಾಯ ಮಾಡುವ ಅಂಗಾಂಶ:", 
        answers: [
            { text: "ಫ್ಲೋಯಂ", correct: false }, 
            { text: "ಕ್ಲೋರೆಂಕೈಮಾ", correct: false }, 
            { text: "ಪ್ಯಾರೆಂಕೈಮಾ", correct: false }, 
            { text: "ಸೈಲಂ (Xylem)", correct: true }
        ] 
    }
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

    const progress = (currentQuestionIndex / questions.length) * 100;
    progressBar.style.width = `${progress}%`;

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

function showScore() {
    resetState();
    progressBar.style.width = `100%`;

    // ರಿಸಲ್ಟ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಲಾಜಿಕ್
    const testKey = "science_test_1";
    let attempts = parseInt(localStorage.getItem(testKey + "_attempts")) || 0;
    let bestScore = parseInt(localStorage.getItem(testKey + "_best")) || 0;

    attempts++;
    if (score > bestScore) bestScore = score;

    localStorage.setItem(testKey + "_attempts", attempts);
    localStorage.setItem(testKey + "_best", bestScore);

    questionElement.innerHTML = `
        <div class="score-container">
            <h2>ವಿಜ್ಞಾನ ಪರೀಕ್ಷೆ ಮುಕ್ತಾಯ!</h2>
            <span class="score-number">${score} / ${questions.length}</span>
            <hr>
            <div style="text-align: left; margin-top: 20px; background: #f9f9f9; padding: 15px; border-radius: 8px;">
                <p>📊 <b>ನಿಮ್ಮ ಸಾಧನೆ:</b></p>
                <p>ಒಟ್ಟು ಪ್ರಯತ್ನಗಳು: <b>${attempts}</b></p>
                <p>ಉತ್ತಮ ಅಂಕ: <b>${bestScore} / ${questions.length}</b></p>
            </div>
        </div>
    `;
    nextButton.innerHTML = "ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ (Restart)";
    nextButton.classList.remove('hide');
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else if (currentQuestionIndex === questions.length) {
        showScore();
    } else {
        startQuiz();
    }
});

startQuiz();

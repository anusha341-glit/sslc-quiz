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

// Science Model Paper 4 Questions
const questions = [
    { 
        question: "1. ಗೋಳೀಯ ದರ್ಪಣದ ಪ್ರತಿಫಲಿಸುವ ಮೇಲ್ಮೈಯ ವ್ಯಾಸವನ್ನು ಹೀಗೆನ್ನುತ್ತಾರೆ:", 
        answers: [
            { text: "ಧ್ರುವ", correct: false }, 
            { text: "ವಕ್ರತಾ ಕೇಂದ್ರ", correct: false }, 
            { text: "ಅಪರ್ಚರ್ (Aperture)", correct: true }, 
            { text: "ಪ್ರಧಾನಾಕ್ಷ", correct: false }
        ] 
    },
    { 
        question: "2. ಸಮಾನಾಂತರವಾಗಿ ಸಂಪರ್ಕಿಸಲಾದ ರೋಧಕಗಳಲ್ಲಿ ಯಾವುದರ ಪ್ರಮಾಣವು ಬದಲಾಗದೆ ಸಮನಾಗಿರುತ್ತದೆ?", 
        answers: [
            { text: "ವಿದ್ಯುತ್ ಪ್ರವಾಹ", correct: false }, 
            { text: "ವಿಭವಾಂತರ (Potential Difference)", correct: true }, 
            { text: "ರೋಧ", correct: false }, 
            { text: "ಒಟ್ಟು ರೋಧ", correct: false }
        ] 
    },
    { 
        question: "3. ಸಸ್ಯದ ಬೆಳವಣಿಗೆಯನ್ನು ಕುಂಠಿತಗೊಳಿಸುವ ಹಾರ್ಮೋನ್ ಯಾವುದು?", 
        answers: [
            { text: "ಆಕ್ಸಿನ್", correct: false }, 
            { text: "ಗಿಬ್ಬರೆಲಿನ್", correct: false }, 
            { text: "ಸೈಟೋಕಿನಿನ್", correct: false }, 
            { text: "ಅಬ್ಸಿಸಿಕ್ ಆಮ್ಲ (Abscisic acid)", correct: true }
        ] 
    },
    { 
        question: "4. ಶಕ್ತಿಯ ಪಿರಮಿಡ್ ಯಾವಾಗಲೂ ಹೀಗಿರುತ್ತದೆ:", 
        answers: [
            { text: "ತಲೆಕೆಳಗಾಗಿರುತ್ತದೆ", correct: false }, 
            { text: "ನೇರವಾಗಿ ಇರುತ್ತದೆ (Always upright)", correct: true }, 
            { text: "ಓರೆಯಾಗಿರುತ್ತದೆ", correct: false }, 
            { text: "ಬದಲಾಗುತ್ತಿರುತ್ತದೆ", correct: false }
        ] 
    },
    { 
        question: "5. ಓಝೋನ್ ಪದರವು ಸೂರ್ಯನ ಈ ಕಿರಣಗಳಿಂದ ಜೀವಿಗಳನ್ನು ರಕ್ಷಿಸುತ್ತದೆ:", 
        answers: [
            { text: "ಅತಿಗೆಂಪು ಕಿರಣಗಳು", correct: false }, 
            { text: "ಅತಿ ನೇರಳೆ ಕಿರಣಗಳು (UV Rays)", correct: true }, 
            { text: "ಕ್ಷ-ಕಿರಣಗಳು", correct: false }, 
            { text: "ಗಾಮಾ ಕಿರಣಗಳು", correct: false }
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
    progressBar.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;

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
    autoSelectCorrect();
    clearInterval(timer);
}

function showScore() {
    resetState();
    progressBar.style.width = `100%`;
    const testKey = "science_test_4";
    let attempts = parseInt(localStorage.getItem(testKey + "_attempts")) || 0;
    let bestScore = parseInt(localStorage.getItem(testKey + "_best")) || 0;

    attempts++;
    if (score > bestScore) bestScore = score;
    localStorage.setItem(testKey + "_attempts", attempts);
    localStorage.setItem(testKey + "_best", bestScore);

    questionElement.innerHTML = `
        <div class="score-container">
            <h2>ಪರೀಕ್ಷೆ 4 ಮುಕ್ತಾಯ!</h2>
            <span class="score-number">${score} / ${questions.length}</span>
            <div style="text-align: left; margin-top: 20px; background: #fef9e7; padding: 15px; border-radius: 8px;">
                <p>📊 <b>ವರದಿ:</b></p>
                <p>ಒಟ್ಟು ಪ್ರಯತ್ನಗಳು: <b>${attempts}</b></p>
                <p>ಉತ್ತಮ ಅಂಕ: <b>${bestScore} / ${questions.length}</b></p>
            </div>
        </div>`;
    nextButton.innerHTML = "ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ (Restart)";
    nextButton.classList.remove('hide');
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) showQuestion();
    else if (currentQuestionIndex === questions.length) showScore();
    else startQuiz();
});

startQuiz();

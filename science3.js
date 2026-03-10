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

// Science Model Paper 3 Questions
const questions = [
    { 
        question: "1. ದರ್ಪಣವೊಂದು ವಸ್ತುವಿನ ನೇರ ಮತ್ತು ದೊಡ್ಡದಾದ ಪ್ರತಿಬಿಂಬವನ್ನು ಉಂಟುಮಾಡಿದರೆ ಆ ದರ್ಪಣ ಯಾವುದು?", 
        answers: [
            { text: "ಪೀನ ದರ್ಪಣ", correct: false }, 
            { text: "ನಿಮ್ನ ದರ್ಪಣ (Concave Mirror)", correct: true }, 
            { text: "ಸಮತಲ ದರ್ಪಣ", correct: false }, 
            { text: "ಯಾವುದೂ ಅಲ್ಲ", correct: false }
        ] 
    },
    { 
        question: "2. ಈ ಕೆಳಗಿನವುಗಳಲ್ಲಿ ಯಾವುದು ಉಭಯಧರ್ಮಿ ಆಕ್ಸೈಡ್ (Amphoteric Oxide) ಆಗಿದೆ?", 
        answers: [
            { text: "Na2O", correct: false }, 
            { text: "K2O", correct: false }, 
            { text: "Al2O3 (ಅಲ್ಯೂಮಿನಿಯಂ ಆಕ್ಸೈಡ್)", correct: true }, 
            { text: "MgO", correct: false }
        ] 
    },
    { 
        question: "3. ಮಾನವನ ಜೀರ್ಣಾಂಗ ವ್ಯೂಹದಲ್ಲಿ ಪಿತ್ತರಸವು (Bile juice) ಎಲ್ಲಿ ಸಂಗ್ರಹವಾಗುತ್ತದೆ?", 
        answers: [
            { text: "ಪಿತ್ತಕೋಶ (Gall bladder)", correct: true }, 
            { text: "ಪಿತ್ತಜನಕಾಂಗ", correct: false }, 
            { text: "ಜಠರ", correct: false }, 
            { text: "ಮೇದೋಜೀರಕ ಗ್ರಂಥಿ", correct: false }
        ] 
    },
    { 
        question: "4. ವಿದ್ಯುತ್ ಶಕ್ತಿಯ SI ಏಕಮಾನ ಯಾವುದು?", 
        answers: [
            { text: "ಜೌಲ್ (J)", correct: true }, 
            { text: "ವೋಲ್ಟ್ (V)", correct: false }, 
            { text: "ಆಂಪೀರ್ (A)", correct: false }, 
            { text: "ವ್ಯಾಟ್ (W)", correct: false }
        ] 
    },
    { 
        question: "5. ಶುದ್ಧ ನೀರು ವಿದ್ಯುಚ್ಛಕ್ತಿಯ ________ ಆಗಿದೆ.", 
        answers: [
            { text: "ಉತ್ತಮ ವಾಹಕ", correct: false }, 
            { text: "ಅವಾಹಕ (Insulator)", correct: true }, 
            { text: "ಅರೆವಾಹಕ", correct: false }, 
            { text: "ಯಾವುದೂ ಅಲ್ಲ", correct: false }
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
    const testKey = "science_test_3";
    let attempts = parseInt(localStorage.getItem(testKey + "_attempts")) || 0;
    let bestScore = parseInt(localStorage.getItem(testKey + "_best")) || 0;

    attempts++;
    if (score > bestScore) bestScore = score;
    localStorage.setItem(testKey + "_attempts", attempts);
    localStorage.setItem(testKey + "_best", bestScore);

    questionElement.innerHTML = `
        <div class="score-container">
            <h2>ಪರೀಕ್ಷೆ 3 ಮುಕ್ತಾಯ!</h2>
            <span class="score-number">${score} / ${questions.length}</span>
            <div style="text-align: left; margin-top: 20px; background: #e8f6f3; padding: 15px; border-radius: 8px;">
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

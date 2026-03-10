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

// Science Model Paper 1 Questions (Physics, Chemistry, Biology)
const questions = [
    { 
        question: "1. ವಿಭವಾಂತರದ (Potential Difference) SI ಏಕಮಾನ ಯಾವುದು?", 
        answers: [
            { text: "ಆಂಪೀರ್ (A)", correct: false }, 
            { text: "ವೋಲ್ಟ್ (V)", correct: true }, 
            { text: "ಕೂಲಂ (C)", correct: false }, 
            { text: "ಓಮ್ (Ω)", correct: false }
        ] 
    },
    { 
        question: "2. ಪೀನ ದರ್ಪಣವು (Convex Mirror) ಉಂಟುಮಾಡುವ ಪ್ರತಿಬಿಂಬವು ಯಾವಾಗಲೂ ಹೀಗಿರುತ್ತದೆ:", 
        answers: [
            { text: "ಸತ್ಯ ಮತ್ತು ನೇರ", correct: false }, 
            { text: "ಸತ್ಯ ಮತ್ತು ತಲೆಕೆಳಗಾದ", correct: false }, 
            { text: "ಮಿಥ್ಯ ಮತ್ತು ನೇರ", correct: true }, 
            { text: "ಮಿಥ್ಯ ಮತ್ತು ತಲೆಕೆಳಗಾದ", correct: false }
        ] 
    },
    { 
        question: "3. ಆಮ್ಲ ಮತ್ತು ಪ್ರತ್ಯಾಮ್ಲಗಳು ಪರಸ್ಪರ ವರ್ತಿಸಿದಾಗ ಲವಣ ಮತ್ತು ನೀರು ಉಂಟಾಗುವ ಕ್ರಿಯೆಯನ್ನು ಏನೆಂದು ಕರೆಯುತ್ತಾರೆ?", 
        answers: [
            { text: "ಉತ್ಕರ್ಷಣ", correct: false }, 
            { text: "ಅಪಕರ್ಷಣ", correct: false }, 
            { text: "ತಟಸ್ಥೀಕರಣ (Neutralization)", correct: true }, 
            { text: "ಸ್ಥಳಾಂತರ", correct: false }
        ] 
    },
    { 
        question: "4. ಆಧುನಿಕ ಆವರ್ತಕ ಕೋಷ್ಟಕದ ಪಿತಾಮಹ ಎಂದು ಯಾರನ್ನು ಕರೆಯುತ್ತಾರೆ?", 
        answers: [
            { text: "ಮೆಂಡಲೀವ್", correct: false }, 
            { text: "ನ್ಯೂಲ್ಯಾಂಡ್ಸ್", correct: false }, 
            { text: "ಹೆನ್ರಿ ಮೋಸ್ಲೆ", correct: true }, 
            { text: "ಡೋಬರೈನರ್", correct: false }
        ] 
    },
    { 
        question: "5. ಕೆಳಗಿನವುಗಳಲ್ಲಿ ಯಾವುದು ಸ್ತ್ರೀ ಲೈಂಗಿಕ ಹಾರ್ಮೋನ್ ಆಗಿದೆ?", 
        answers: [
            { text: "ಟೆಸ್ಟೋಸ್ಟಿರೋನ್", correct: false }, 
            { text: "ಇನ್ಸುಲಿನ್", correct: false }, 
            { text: "ಈಸ್ಟ್ರೋಜನ್", correct: true }, 
            { text: "ಥೈರಾಕ್ಸಿನ್", correct: false }
        ] 
    },
    { 
        question: "6. ಸಸ್ಯಗಳಲ್ಲಿ ಆಹಾರವನ್ನು ಸಾಗಾಣಿಕೆ ಮಾಡುವ ಅಂಗಾಂಶ ಯಾವುದು?", 
        answers: [
            { text: "ಸೈಲಂ (Xylem)", correct: false }, 
            { text: "ಫ್ಲೋಯಂ (Phloem)", correct: true }, 
            { text: "ಪ್ಯಾರೆಂಕೈಮಾ", correct: false }, 
            { text: "ಕೊಲೆಂಕೈಮಾ", correct: false }
        ] 
    },
    { 
        question: "7. ಮಂಡಲದಲ್ಲಿ ವಿದ್ಯುತ್ ಪ್ರವಾಹವನ್ನು ಅಳೆಯಲು ಬಳಸುವ ಸಾಧನ:", 
        answers: [
            { text: "ವೋಲ್ಟ್ ಮೀಟರ್", correct: false }, 
            { text: "ಗಾಲ್ವನೋ ಮೀಟರ್", correct: false }, 
            { text: "ಅಮ್ಮೀಟರ್", correct: true }, 
            { text: "ಥರ್ಮಾಮೀಟರ್", correct: false }
        ] 
    },
    { 
        question: "8. ಶುದ್ಧ ಕಬ್ಬಿಣವು ಮೃದುವಾಗಿದ್ದು, ಇದನ್ನು ಗಟ್ಟಿಗೊಳಿಸಲು ಏನನ್ನು ಸೇರಿಸಲಾಗುತ್ತದೆ?", 
        answers: [
            { text: "ಕಾರ್ಬನ್", correct: true }, 
            { text: "ತಾಮ್ರ", correct: false }, 
            { text: "ಸತು", correct: false }, 
            { text: "ಬೆಳ್ಳಿ", correct: false }
        ] 
    },
    { 
        question: "9. ಈ ಕೆಳಗಿನವುಗಳಲ್ಲಿ ಯಾವುದು ಜೈವಿಕ ವಿಘಟನೆಗೆ ಒಳಗಾಗದ ವಸ್ತು?", 
        answers: [
            { text: "ಕಾಗದ", correct: false }, 
            { text: "ಹಣ್ಣಿನ ಸಿಪ್ಪೆ", correct: false }, 
            { text: "ಪ್ಲಾಸ್ಟಿಕ್", correct: true }, 
            { text: "ಹತ್ತಿ ಬಟ್ಟೆ", correct: false }
        ] 
    },
    { 
        question: "10. ಮೆಂಡಲ್ ರವರು ತಮ್ಮ ಅನುವಂಶೀಯತೆಯ ಪ್ರಯೋಗಕ್ಕೆ ಬಳಸಿದ ಸಸ್ಯ ಯಾವುದು?", 
        answers: [
            { text: "ತೆಂಗಿನ ಗಿಡ", correct: false }, 
            { text: "ಬಟಾಣಿ ಗಿಡ (Pea Plant)", correct: true }, 
            { text: "ಗುಲಾಬಿ ಗಿಡ", correct: false }, 
            { text: "ಮಾವಿನ ಗಿಡ", correct: false }
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

    const testKey = "science_test_1";
    let attempts = parseInt(localStorage.getItem(testKey + "_attempts")) || 0;
    let bestScore = parseInt(localStorage.getItem(testKey + "_best")) || 0;

    attempts++;
    if (score > bestScore) bestScore = score;

    localStorage.setItem(testKey + "_attempts", attempts);
    localStorage.setItem(testKey + "_best", bestScore);

    questionElement.innerHTML = `
        <div class="score-container">
            <h2>ವಿಜ್ಞಾನ ಪರೀಕ್ಷೆ 1 ಮುಕ್ತಾಯ!</h2>
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

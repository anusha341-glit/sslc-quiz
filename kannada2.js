// --- ANTI-COPY & MONITORING ---
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = (e) => {
    if (e.ctrlKey && [67, 86, 85, 73].includes(e.keyCode)) return false;
};

// UI Elements (Must match the IDs in your HTML)
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const timerElement = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timer;

const questions = [
    { question: "1. 'ಹಲಗಲಿ ಬೇಡರು' ಕವಿತೆಯು ಈ ಕಾವ್ಯ ಪ್ರಕಾರಕ್ಕೆ ಸೇರಿದೆ:", answers: [{ text: "ಭಾವಗೀತೆ", correct: false }, { text: "ವಚನ", correct: false }, { text: "ಲಾವಣಿ", correct: true }, { text: "ರಗಳೆ", correct: false }] },
    { question: "2. 'ಎದೆಗೆ ಬಿದ್ದ ಅಕ್ಷರ' ಈ ಗದ್ಯ ಭಾಗದ ಲೇಖಕರು:", answers: [{ text: "ಸಿದ್ದಲಿಂಗಯ್ಯ", correct: false }, { text: "ನಾಗೇಗೌಡ", correct: false }, { text: "ದೇವನೂರು ಮಹಾದೇವ", correct: true }, { text: "ಪೂರ್ಣಚಂದ್ರ ತೇಜಸ್ವಿ", correct: false }] },
    { question: "3. ಭಗತ್ ಸಿಂಗ್ ಬರೆದ ಪತ್ರ ಯಾರ ಹೆಸರಿನಲ್ಲಿದೆ?", answers: [{ text: "ತಮ್ಮ", correct: true }, { text: "ತಂದೆ", correct: false }, { text: "ತಾಯಿ", correct: false }, { text: "ಸ್ನೇಹಿತ", correct: false }] },
    { question: "4. 'ಲಂಡನ್ ನಗರ' ಈ ಗದ್ಯ ಭಾಗದ ಲೇಖಕರು:", answers: [{ text: "ಶಿವರಾಮ ಕಾರಂತ", correct: false }, { text: "ಮಾಸ್ತಿ", correct: false }, { text: "ವಿನಾಯಕ ಕೃಷ್ಣ ಗೋಕಾಕ", correct: true }, { text: "ಡಿ.ವಿ.ಜಿ", correct: false }] },
    { question: "5. 'ಛಲಮನೆ ಮೆರೆವೆಂ' ಕವಿತೆಯ ಕವಿ:", answers: [{ text: "ಪಂಪ", correct: false }, { text: "ಜನ್ನ", correct: false }, { text: "ಪೊನ್ನ", correct: false }, { text: "ರನ್ನ", correct: true }] },
    { question: "6. 'ಹಕ್ಕಿ ಹಾರುತಿದೆ ನೋಡಿದಿರಾ' ಕವಿತೆಯು ಈ ಸಂಕಲನದಿಂದ ಆಯ್ದುಕೊಳ್ಳಲಾಗಿದೆ:", answers: [{ text: "ನಾಕುತಂತಿ", correct: false }, { text: "ಅರಳುವ ಪ್ರತಿಭೆ", correct: false }, { text: "ಗರಿ", correct: true }, { text: "ಸೂರ್ಯಪಾನ", correct: false }] },
    { question: "7. ಮೈಸೂರು ವಿಶ್ವವಿದ್ಯಾಲಯದ ಸ್ಥಾಪಕರು:", answers: [{ text: "ಒಡೆಯರ್", correct: false }, { text: "ವಿಶ್ವೇಶ್ವರಯ್ಯ", correct: true }, { text: "ಮಿರ್ಜಾ ಇಸ್ಮಾಯಿಲ್", correct: false }, { text: "ಕೆಂಗಲ್ ಹನುಮಂತಯ್ಯ", correct: false }] },
    { question: "8. 'ಷಟ್ಪದಿ'ಯ ಬ್ರಹ್ಮ ಎಂದು ಯಾರನ್ನು ಕರೆಯುತ್ತಾರೆ?", answers: [{ text: "ಕುಮಾರವ್ಯಾಸ", correct: false }, { text: "ಲಕ್ಷ್ಮೀಶ", correct: false }, { text: "ರಾಘವಾಂಕ", correct: true }, { text: "ಪಂಪ", correct: false }] },
    { question: "9. 'ಲಗಾಮು' ಯಾವ ಭಾಷೆಯ ಪದ?", answers: [{ text: "ಪೋರ್ಚುಗೀಸ್", correct: false }, { text: "ಹಿಂದೂಸ್ತಾನಿ", correct: false }, { text: "ಪಾರ್ಸಿ", correct: true }, { text: "ಇಂಗ್ಲಿಷ್", correct: false }] },
    { question: "10. 'ಪರಸ್ಪರ ಅಕ್ಷರಗಳ ಸೇರುವಿಕೆಯೇ':", answers: [{ text: "ಸಮಾಸ", correct: false }, { text: "ಸಂಧಿ", correct: true }, { text: "ಛಂದಸ್ಸು", correct: false }, { text: "ಅಲಂಕಾರ", correct: false }] },
    { question: "11. ಹೊಸಗನ್ನಡದ ಪಂಚಮೀ ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯ:", answers: [{ text: "ಇಂದ", correct: false }, { text: "ಅನ್ನು", correct: false }, { text: "ದಿಸೆಯಿಂದ", correct: true }, { text: "ಅಲ್ಲಿ", correct: false }] },
    { question: "12. 'ವಿದ್ಯಾರ್ಥಿ' ಪದವು ಈ ಸಂಧಿಗೆ ಉದಾಹರಣೆ:", answers: [{ text: "ಸವರ್ಣದೀರ್ಘ", correct: true }, { text: "ಗುಣ", correct: false }, { text: "ವೃದ್ಧಿ", correct: false }, { text: "ಯಣ್", correct: false }] },
    { question: "13. 'ಗಜಗಮನೆ' ಯಾವ ಸಮಾಸ?", answers: [{ text: "ತತ್ಪುರುಷ", correct: false }, { text: "ಬಹುವ್ರೀಹಿ", correct: true }, { text: "ಕರ್ಮಧಾರಯ", correct: false }, { text: "ದ್ವಿಗು", correct: false }] },
    { question: "14. 'ಹೊಟ್ಟೆ ಕಿಚ್ಚು' ನುಡಿಗಟ್ಟಿನ ಅರ್ಥ:", answers: [{ text: "ಹಸಿವು", correct: false }, { text: "ಉದರ ರೋಗ", correct: false }, { text: "ಅಸೂಯೆ", correct: true }, { text: "ಕೋಪ", correct: false }] },
    { question: "15. 'ಕುಮಾರವ್ಯಾಸ ಭಾರತ' ಯಾವ ಛಂದಸ್ಸಿನಲ್ಲಿದೆ?", answers: [{ text: "ವಾರ್ಧಕ ಷಟ್ಪದಿ", correct: false }, { text: "ಭಾಮಿನಿ ಷಟ್ಪದಿ", correct: true }, { text: "ಕಂದಪದ್ಯ", correct: false }, { text: "ರಗಳೆ", correct: false }] },
    { question: "16. 'ದೇವನೂರು ಮಹಾದೇವ' ಅವರ ಪ್ರಸಿದ್ಧ ಕಾದಂಬರಿ:", answers: [{ text: "ಚೋಮನ ದುಡಿ", correct: false }, { text: "ಭಾರತೀಪುರ", correct: false }, { text: "ಕುಸುಮಬಾಲೆ", correct: true }, { text: "ಸಂಸ್ಕಾರ", correct: false }] },
    { question: "17. ಸಂಪ್ರದಾನ ಕಾರಕಾರ್ಥ ಯಾವ ವಿಭಕ್ತಿಗೆ ಸೇರಿದೆ?", answers: [{ text: "ಷಷ್ಠಿ", correct: false }, { text: "ತೃತಿಯಾ", correct: false }, { text: "ಪ್ರಥಮಾ", correct: false }, { text: "ಚತುರ್ಥಿ", correct: true }] },
    { question: "18. 'ಅತಿಬೆಳ್ಳಗೆ' ಪದವು ಯಾವ ವ್ಯಾಕರಣ ಅಂಶಕ್ಕೆ ಸೇರಿದೆ?", answers: [{ text: "ದ್ವಿರುಕ್ತಿ", correct: true }, { text: "ಜೋಡುನುಡಿ", correct: false }, { text: "ಅನುಕರಣ ವಾಚಕ", correct: false }, { text: "ಅವ್ಯಯ", correct: false }] },
    { question: "19. 'ಮೈದೊಳೆ' ಯಾವ ಸಮಾಸಕ್ಕೆ ಉದಾಹರಣೆ?", answers: [{ text: "ತತ್ಪುರುಷ", correct: false }, { text: "ಕ್ರಿಯಾ ಸಮಾಸ", correct: true }, { text: "ಗಮಕ", correct: false }, { text: "ಅಂಶೀ", correct: false }] },
    { question: "20. 'ಜೈಮಿನಿ ಭಾರತ'ದ ಕರ್ತೃ:", answers: [{ text: "ಕುಮಾರವ್ಯಾಸ", correct: false }, { text: "ರಾಘವಾಂಕ", correct: false }, { text: "ಲಕ್ಷ್ಮೀಶ", correct: true }, { text: "ಹರಿಹರ", correct: false }] },
    { question: "21. 'ವೃಷಭ' ಪದದ ತದ್ಭವ ರೂಪ:", answers: [{ text: "ಬಸವ", correct: true }, { text: "ಎತ್ತು", correct: false }, { text: "ಕರು", correct: false }, { text: "ಹೋರಿ", correct: false }] },
    { question: "22. ಕನ್ನಡದ ಪ್ರಥಮ ನಾಟಕ ಯಾವುದು?", answers: [{ text: "ಪ್ರತಿಮಾ ನಾಟಕ", correct: false }, { text: "ಶಾಕುಂತಲ", correct: false }, { text: "ಮಿತ್ರವಿಂದ ಗೋವಿಂದ", correct: true }, { text: "ಹರಿಶ್ಚಂದ್ರ", correct: false }] },
    { question: "23. 'ಶಬ್ದಮಣಿದರ್ಪಣ' ಕೃತಿಯ ಕರ್ತೃ:", answers: [{ text: "ನೃಪತುಂಗ", correct: false }, { text: "ಕೇಶಿರಾಜ", correct: true }, { text: "ಶ್ರೀವಿಜಯ", correct: false }, { text: "ನಾಗವರ್ಮ", correct: false }] },
    { question: "24. ವಿಶ್ವೇಶ್ವರಯ್ಯನವರು ದಿವಾನ್ ಪದವಿಗೆ ರಾಜೀನಾಮೆ ನೀಡಲು ಕಾರಣ:", answers: [{ text: "ಆರೋಗ್ಯ ಸರಿ ಇಲ್ಲದಿದ್ದುದರಿಂದ", correct: false }, { text: "ಹಿಂದುಳಿದ ವರ್ಗದವರಿಗೆ ಮೀಸಲಾತಿ ನೀಡಲು ವಿರೋಧಿಸಿದ ಹಿನ್ನೆಲೆಯಲ್ಲಿ", correct: true }, { text: "ಬ್ರಿಟಿಷ್ ಸರ್ಕಾರದ ಒತ್ತಡದಿಂದ", correct: false }, { text: "ವಯಸ್ಸಾದ ಕಾರಣದಿಂದ", correct: false }] },
    { question: "25. ಭಗತ್ ಸಿಂಗ್ ಬರೆದ ಪತ್ರದಲ್ಲಿ ಯಾವ ಭಾವನೆ ವ್ಯಕ್ತವಾಗಿದೆ?", answers: [{ text: "ದೇಶಪ್ರೇಮ ಮತ್ತು ತ್ಯಾಗ", correct: true }, { text: "ಕುಟುಂಬದ ಮೇಲಿನ ಅತಿಯಾದ ವ್ಯಾಮೋಹ", correct: false }, { text: "ಇಂಗ್ಲಿಷರ ಮೇಲಿನ ಹೆದರಿಕೆ", correct: false }, { text: "ಮದುವೆಯ ಬಯಕೆ", correct: false }] },
    { question: "26. ಹಲಗಲಿ ಗ್ರಾಮದ ಮೇಲೆ ಬ್ರಿಟಿಷರು ದಾಳಿ ಮಾಡಲು ಕಾರಣವೇನು?", answers: [{ text: "ಕಂದಾಯ ಪಾವತಿಸದಿದ್ದಕ್ಕೆ", correct: false }, { text: "ಶಸ್ತ್ರಾಸ್ತ್ರ ಕಾಯ್ದೆಯನ್ನು ವಿರೋಧಿಸಿ ಆಯುಧ ಒಪ್ಪಿಸಲು ನಿರಾಕರಿಸಿದ್ದಕ್ಕೆ", correct: true }, { text: "ಬ್ರಿಟಿಷ್ ಅಧಿಕಾರಿಗಳನ್ನು ಕೊಂದಿದ್ದಕ್ಕೆ", correct: false }, { text: "ಗ್ರಾಮದ ಸಂಪತ್ತನ್ನು ಲೂಟಿ ಮಾಡಲು", correct: false }] },
    { question: "27. ಮೈಸೂರು ಸ್ಯಾಂಡಲ್ ಸೋಪ್ ಕಾರ್ಖಾನೆಯ ಸ್ಥಾಪನೆಗೆ ಪ್ರೇರಣೆ ನೀಡಿದವರು:", answers: [{ text: "ಮಿರ್ಜಾ ಇಸ್ಮಾಯಿಲ್", correct: false }, { text: "ನಾಲ್ವಡಿ ಕೃಷ್ಣರಾಜ ಒಡೆಯರ್", correct: false }, { text: "ಸರ್ ಎಂ. ವಿಶ್ವೇಶ್ವರಯ್ಯ", correct: true }, { text: "ದೇವನ್ ಪೂರ್ಣಯ್ಯ", correct: false }] },
    { question: "28. 'ಕೈ' ಪದದ ತತ್ಸಮ ರೂಪ:", answers: [{ text: "ಕರ", correct: true }, { text: "ಸೈ", correct: false }, { text: "ಹಸ್ತ", correct: false }, { text: "ಪಾಣಿ", correct: false }] },
    { question: "29. 'ಹೊಸಗನ್ನಡ' ಪದವು ಈ ಸಮಾಸಕ್ಕೆ ಉದಾಹರಣೆ:", answers: [{ text: "ತತ್ಪುರುಷ", correct: false }, { text: "ಕರ್ಮಧಾರಯ", correct: true }, { text: "ದ್ವಿಗು", correct: false }, { text: "ಅಂಶೀ", correct: false }] },
    { question: "30. 'ಕೆರೆತೊರೆ' ಪದವು ಯಾವ ಸಮಾಸ?", answers: [{ text: "ದ್ವಂದ್ವ ಸಮಾಸ", correct: true }, { text: "ಗಮಕ ಸಮಾಸ", correct: false }, { text: "ಬಹುವ್ರೀಹಿ ಸಮಾಸ", correct: false }, { text: "ತತ್ಪುರುಷ ಸಮಾಸ", correct: false }] }
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

    // Progress Bar Update
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
    questionElement.innerHTML = `
        <div class="score-container">
            <h2>ಪರೀಕ್ಷೆ ಮುಕ್ತಾಯಗೊಂಡಿದೆ!</h2>
            <span class="score-number">${score} / ${questions.length}</span>
            <p>ನಿಮ್ಮ ಸಾಧನೆಗೆ ಅಭಿನಂದನೆಗಳು!</p>
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

// Important: Run the start function immediately when script loads
startQuiz();

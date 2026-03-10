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
let timer;

const questions = [
    { question: "1. ಸಾರಾ ಅಬೂಬಕ್ಕರ್ ಅವರ ಜನ್ಮಸ್ಥಳ:", answers: [{ text: "ಧಾರವಾಡ", correct: false }, { text: "ಬಿಜಾಪುರ", correct: false }, { text: "ಮೈಸೂರು", correct: false }, { text: "ಕಾಸರಗೋಡು", correct: true }] },
    { question: "2. ವಿಶ್ವೇಶ್ವರಯ್ಯನವರ ತಂದೆಯ ಹೆಸರು:", answers: [{ text: "ಶ್ರೀನಿವಾಸ ಶಾಸ್ತ್ರಿ", correct: true }, { text: "ವೆಂಕಟಲಕ್ಷ್ಮಮ್ಮ", correct: false }, { text: "ಮೋಕ್ಷಗುಂಡಂ", correct: false }, { text: "ರಾಮಶಾಸ್ತ್ರಿ", correct: false }] },
    { question: "3. ಭಗತ್ ಸಿಂಗ್ ಅವರ ತಾಯಿ:", answers: [{ text: "ವಿದ್ಯಾವತಿ", correct: true }, { text: "ಪಾರ್ವತಿ", correct: false }, { text: "ಲಕ್ಷ್ಮಿ", correct: false }, { text: "ಸರಸ್ವತಿ", correct: false }] },
    { question: "4. 'ಶಬರಿ' ಗೀತನಾಟಕದ ಕರ್ತೃ:", answers: [{ text: "ಕುವೆಂಪು", correct: false }, { text: "ಪು.ತಿ. ನರಸಿಂಹಾಚಾರ್", correct: true }, { text: "ದ.ರಾ. ಬೇಂದ್ರೆ", correct: false }, { text: "ಜಿ.ಎಸ್. ಶಿವರುದ್ರಪ್ಪ", correct: false }] },
    { question: "5. 'ಆನೆ ಬಂತು ಆನೆ' ಕವನದ ಕವಿ:", answers: [{ text: "ಕುವೆಂಪು", correct: false }, { text: "ಪಂಜೆ ಮಂಗೇಶರಾಯರು", correct: false }, { text: "ಜಿ.ಪಿ. ರಾಜರತ್ನಂ", correct: true }, { text: "ಚೆನ್ನವೀರ ಕಣವಿ", correct: false }] },
    { question: "6. 'ಹಲಗಲಿ ಬೇಡರು' ಕವಿತೆಯು ಈ ಕಾವ್ಯ ಪ್ರಕಾರಕ್ಕೆ ಸೇರಿದೆ:", answers: [{ text: "ಭಾವಗೀತೆ", correct: false }, { text: "ವಚನ", correct: false }, { text: "ಲಾವಣಿ", correct: true }, { text: "ರಗಳೆ", correct: false }] },
    { question: "7. 'ಎದೆಗೆ ಬಿದ್ದ ಅಕ್ಷರ' ಈ ಗದ್ಯ ಭಾಗದ ಲೇಖಕರು:", answers: [{ text: "ದೇವನೂರು ಮಹಾದೇವ", correct: true }, { text: "ಸಿದ್ದಲಿಂಗಯ್ಯ", correct: false }, { text: "ನಾಗೇಗೌಡ", correct: false }, { text: "ಪೂರ್ಣಚಂದ್ರ ತೇಜಸ್ವಿ", correct: false }] },
    { question: "8. ಭಗತ್ ಸಿಂಗ್ ಬರೆದ ಪತ್ರ ಯಾರ ಹೆಸರಿನಲ್ಲಿದೆ?", answers: [{ text: "ತಂದೆ", correct: false }, { text: "ತಾಯಿ", correct: false }, { text: "ತಮ್ಮ", correct: true }, { text: "ಸ್ನೇಹಿತ", correct: false }] },
    { question: "9. 'ಲಂಡನ್ ನಗರ' ಈ ಗದ್ಯ ಭಾಗದ ಲೇಖಕರು:", answers: [{ text: "ವಿನಾಯಕ ಕೃಷ್ಣ ಗೋಕಾಕ", correct: true }, { text: "ಶಿವರಾಮ ಕಾರಂತ", correct: false }, { text: "ಮಾಸ್ತಿ", correct: false }, { text: "ಡಿ.ವಿ.ಜಿ", correct: false }] },
    { question: "10. 'ಛಲಮನೆ ಮೆರೆವೆಂ' ಕವಿತೆಯ ಕವಿ:", answers: [{ text: "ಪಂಪ", correct: false }, { text: "ರನ್ನ", correct: true }, { text: "ಜನ್ನ", correct: false }, { text: "ಪೊನ್ನ", correct: false }] },
    { question: "11. 'ಸನ್ಮಾರ್ಗ' ಪದವು ಈ ಸಂಧಿಗೆ ಉದಾಹರಣೆ:", answers: [{ text: "ಜಶ್ತ್ವ", correct: false }, { text: "ಶ್ಚುತ್ವ", correct: false }, { text: "ಅನುನಾಸಿಕ", correct: true }, { text: "ವೃದ್ಧಿ", correct: false }] },
    { question: "12. 'ಕಡೆಗಣ್ಣು' ಪದವು ಈ ಸಮಾಸಕ್ಕೆ ಉದಾಹರಣೆ:", answers: [{ text: "ಅಂಶೀ ಸಮಾಸ", correct: true }, { text: "ಕ್ರಿಯಾ ಸಮಾಸ", correct: false }, { text: "ಬಹುವೀಹಿ ಸಮಾಸ", correct: false }, { text: "ಗಮಕ ಸಮಾಸ", correct: false }] },
    { question: "13. 'ಬಸ್ಸು' ಎಂಬುದು ಯಾವ ಭಾಷೆಯ ಪದ?", answers: [{ text: "ಇಂಗ್ಲಿಷ್ (ಅನ್ಯದೇಶೀಯ)", correct: true }, { text: "ಪಾರ್ಸಿ", correct: false }, { text: "ದೇಶ್ಯ", correct: false }, { text: "ತತ್ಸಮ", correct: false }] },
    { question: "14. ಹಳಗನ್ನಡದ ಸಪ್ತಮೀ ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯ:", answers: [{ text: "ಒಳ್", correct: true }, { text: "ಇಂದ", correct: false }, { text: "ಅಲ್ಲಿ", correct: false }, { text: "ಅತ್ತಣಿಂ", correct: false }] },
    { question: "15. ಉಪ್ಪಿಗಿಂತ ರುಚಿಯಿಲ್ಲ : ತಾಯಿಗಿಂತ _________", answers: [{ text: "ಯೌವನವಿಲ್ಲ", correct: false }, { text: "ಬಂಧುವಿಲ್ಲ", correct: true }, { text: "ಮುಪ್ಪಿಲ್ಲ", correct: false }, { text: "ನೆಂಟರಿಲ್ಲ", correct: false }] },
    { question: "16. ಎರಡು ವಾಕ್ಯಗಳ ಅರ್ಥಸಾದೃಶ್ಯದಿಂದ ಬಿಂಬ ಪ್ರತಿಬಿಂಬ ಭಾವ ತೋರಿ ಬಂದರೆ ಅದು:", answers: [{ text: "ದೃಷ್ಟಾಂತ ಅಲಂಕಾರ", correct: true }, { text: "ಉಪಮಾ ಅಲಂಕಾರ", correct: false }, { text: "ರೂಪಕ ಅಲಂಕಾರ", correct: false }, { text: "ಉತ್ಪ್ರೇಕ್ಷಾ ಅಲಂಕಾರ", correct: false }] },
    { question: "17. ಕನ್ನಡಿಗರ ಕುಲದೇವತೆ ಯಾರು?", answers: [{ text: "ಚಾಮುಂಡೇಶ್ವರಿ", correct: false }, { text: "ಭುವನೇಶ್ವರಿ", correct: true }, { text: "ಶಾರದಾಂಬೆ", correct: false }, { text: "ಸರಸ್ವತಿ", correct: false }] },
    { question: "18. 'ಲಗಾಮು' ಯಾವ ಭಾಷೆಯ ಪದ?", answers: [{ text: "ಪಾರ್ಸಿ", correct: true }, { text: "ಹಿಂದೂಸ್ತಾನಿ", correct: false }, { text: "ಪೋರ್ಚುಗೀಸ್", correct: false }, { text: "ಇಂಗ್ಲಿಷ್", correct: false }] },
    { question: "19. 'ಪದ್ಮ' ಪದದ ತದ್ಭವ ರೂಪವೇನು?", answers: [{ text: "ಹೂವು", correct: false }, { text: "ಕಮಲ", correct: false }, { text: "ಪದುಮ", correct: true }, { text: "ಪಚ್ಚೆ", correct: false }] },
    { question: "20. 'ಹಕ್ಕಿ ಹಾರುತಿದೆ ನೋಡಿದಿರಾ' ಕವಿತೆಯು ಈ ಸಂಕಲನದಿಂದ ಆಯ್ದುಕೊಳ್ಳಲಾಗಿದೆ:", answers: [{ text: "ಗರಿ", correct: true }, { text: "ನಾಕುತಂತಿ", correct: false }, { text: "ಅರಳುವ ಪ್ರತಿಭೆ", correct: false }, { text: "ಸೂರ್ಯಪಾನ", correct: false }] },
    { question: "21. ಮೈಸೂರು ವಿಶ್ವವಿದ್ಯಾಲಯದ ಸ್ಥಾಪಕರು:", answers: [{ text: "ವಿಶ್ವೇಶ್ವರಯ್ಯ", correct: true }, { text: "ಮಿರ್ಜಾ ಇಸ್ಮಾಯಿಲ್", correct: false }, { text: "ಒಡೆಯರ್", correct: false }, { text: "ಕೆಂಗಲ್ ಹನುಮಂತಯ್ಯ", correct: false }] },
    { question: "22. 'ಷಟ್ಪದಿ'ಯ ಬ್ರಹ್ಮ ಎಂದು ಯಾರನ್ನು ಕರೆಯುತ್ತಾರೆ?", answers: [{ text: "ಕುಮಾರವ್ಯಾಸ", correct: false }, { text: "ಲಕ್ಷ್ಮೀಶ", correct: false }, { text: "ರಾಘವಾಂಕ", correct: true }, { text: "ಪಂಪ", correct: false }] },
    { question: "23. 'ಕವಿರಾಜಮಾರ್ಗ'ದ ಪ್ರಕಾರ ಕನ್ನಡ ನಾಡು ಇಲ್ಲಿಂದ ಇಲ್ಲಿಯವರೆಗೆ ಹಬ್ಬಿತ್ತು:", answers: [{ text: "ಕಾವೇರಿಯಿಂದ ಗೋದಾವರಿ", correct: true }, { text: "ಕೃಷ್ಣೆಯಿಂದ ಗೋದಾವರಿ", correct: false }, { text: "ಕಾವೇರಿಯಿಂದ ಕೃಷ್ಣೆ", correct: false }, { text: "ಮಲಪ್ರಭಾದಿಂದ ಕೃಷ್ಣೆ", correct: false }] },
    { question: "24. 'ಪರಸ್ಪರ ಅಕ್ಷರಗಳ ಸೇರುವಿಕೆಯೇ':", answers: [{ text: "ಸಂಧಿ", correct: true }, { text: "ಸಮಾಸ", correct: false }, { text: "ಛಂದಸ್ಸು", correct: false }, { text: "ಅಲಂಕಾರ", correct: false }] },
    { question: "25. ಹೊಸಗನ್ನಡದ ಪಂಚಮೀ ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯ:", answers: [{ text: "ಇಂದ", correct: false }, { text: "ದಿಸೆಯಿಂದ", correct: true }, { text: "ಅನ್ನು", correct: false }, { text: "ಅಲ್ಲಿ", correct: false }] },
    { question: "26. 'ವಿದ್ಯಾರ್ಥಿ' ಪದವು ಈ ಸಂಧಿಗೆ ಉದಾಹರಣೆ:", answers: [{ text: "ಸವರ್ಣದೀರ್ಘ", correct: true }, { text: "ಗುಣ", correct: false }, { text: "ವೃದ್ಧಿ", correct: false }, { text: "ಯಣ್", correct: false }] },
    { question: "27. 'ಗಜಗಮನೆ' ಯಾವ ಸಮಾಸ?", answers: [{ text: "ಬಹುವ್ರೀಹಿ", correct: true }, { text: "ತತ್ಪುರುಷ", correct: false }, { text: "ಕರ್ಮಧಾರಯ", correct: false }, { text: "ದ್ವಿಗು", correct: false }] },
    { question: "28. 'ನುಡಿಗಟ್ಟು' ಎಂದರೆ:", answers: [{ text: "ಭಾಷೆಯ ಶೈಲಿ", correct: false }, { text: "ವಿಶೇಷ ಅರ್ಥ ನೀಡುವ ಪದಸಮೂಹ", correct: true }, { text: "ಜೋಡು ಪದ", correct: false }, { text: "ವ್ಯಾಕರಣದ ಭಾಗ", correct: false }] },
    { question: "29. 'ಹೊಟ್ಟೆ ಕಿಚ್ಚು' ನುಡಿಗಟ್ಟಿನ ಅರ್ಥ:", answers: [{ text: "ಹಸಿವು", correct: false }, { text: "ಅಸೂಯೆ", correct: true }, { text: "ಉದರ ರೋಗ", correct: false }, { text: "ಕೋಪ", correct: false }] },
    { question: "30. 'ಕುಮಾರವ್ಯಾಸ ಭಾರತ' ಯಾವ ಛಂದಸ್ಸಿನಲ್ಲಿದೆ?", answers: [{ text: "ಭಾಮಿನಿ ಷಟ್ಪದಿ", correct: true }, { text: "ವಾರ್ಧಕ ಷಟ್ಪದಿ", correct: false }, { text: "ಕಂದಪದ್ಯ", correct: false }, { text: "ರಗಳೆ", correct: false }] },
    { question: "31. ವಿವರಣಾತ್ಮಕ ಚಿಹ್ನೆಯ ರೂಪ ಯಾವುದು?", answers: [{ text: ":-", correct: true }, { text: "?", correct: false }, { text: "!", correct: false }, { text: ",", correct: false }] },
    { question: "32. 'ದೇವನೂರು ಮಹಾದೇವ' ಅವರ ಪ್ರಸಿದ್ಧ ಕಾದಂಬರಿ:", answers: [{ text: "ಕುಸುಮಬಾಲೆ", correct: true }, { text: "ಚೋಮನ ದುಡಿ", correct: false }, { text: "ಭಾರತೀಪುರ", correct: false }, { text: "ಸಂಸ್ಕಾರ", correct: false }] },
    { question: "33. 'ಕೈಕೆಸರಾದರೆ ಬಾಯಿಮೊಸರು' ಇದು ಒಂದು:", answers: [{ text: "ಗಾದೆ", correct: true }, { text: "ನುಡಿಗಟ್ಟು", correct: false }, { text: "ಒಗಟು", correct: false }, { text: "ಶ್ಲೋಕ", correct: false }] },
    { question: "34. ಸಂಪ್ರದಾನ ಕಾರಕಾರ್ಥ ಯಾವ ವಿಭಕ್ತಿಗೆ ಸೇರಿದೆ?", answers: [{ text: "ಚತುರ್ಥಿ", correct: true }, { text: "ಷಷ್ಠಿ", correct: false }, { text: "ತೃತಿಯಾ", correct: false }, { text: "ಪ್ರಥಮಾ", correct: false }] },
    { question: "35. 'ಅತಿಬೆಳ್ಳಗೆ' ಪದವು ಯಾವ ವ್ಯಾಕರಣ ಅಂಶಕ್ಕೆ ಸೇರಿದೆ?", answers: [{ text: "ದ್ವಿರುಕ್ತಿ", correct: true }, { text: "ಜೋಡುನುಡಿ", correct: false }, { text: "ಅನುಕರಣ ವಾಚಕ", correct: false }, { text: "ಅವ್ಯಯ", correct: false }] },
    { question: "36. 'ಮೈದೊಳೆ' ಯಾವ ಸಮಾಸಕ್ಕೆ ಉದಾಹರಣೆ?", answers: [{ text: "ಕ್ರಿಯಾ ಸಮಾಸ", correct: true }, { text: "ತತ್ಪುರುಷ", correct: false }, { text: "ಗಮಕ", correct: false }, { text: "ಅಂಶೀ", correct: false }] },
    { question: "37. 'ಜೈಮಿನಿ ಭಾರತ'ದ ಕರ್ತೃ:", answers: [{ text: "ಲಕ್ಷ್ಮೀಶ", correct: true }, { text: "ಕುಮಾರವ್ಯಾಸ", correct: false }, { text: "ರಾಘವಾಂಕ", correct: false }, { text: "ಹರಿಹರ", correct: false }] },
    { question: "38. 'ವೃಷಭ' ಪದದ ತದ್ಭವ ರೂಪ:", answers: [{ text: "ಬಸವ", correct: true }, { text: "ಎತ್ತು", correct: false }, { text: "ಕರು", correct: false }, { text: "ಹೋರಿ", correct: false }] },
    { question: "39. ಕನ್ನಡದ ಪ್ರಥಮ ನಾಟಕ ಯಾವುದು?", answers: [{ text: "ಮಿತ್ರವಿಂದ ಗೋವಿಂದ", correct: true }, { text: "ಪ್ರತಿಮಾ ನಾಟಕ", correct: false }, { text: "ಶಾಕುಂತಲ", correct: false }, { text: "ಹರಿಶ್ಚಂದ್ರ", correct: false }] },
    { question: "40. 'ಶಬ್ದಮಣಿದರ್ಪಣ' ಕೃತಿಯ ಕರ್ತೃ:", answers: [{ text: "ಕೇಶಿರಾಜ", correct: true }, { text: "ನೃಪತುಂಗ", correct: false }, { text: "ಶ್ರೀವಿಜಯ", correct: false }, { text: "ನಾಗವರ್ಮ", correct: false }] }
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
            autoSelectWrong();
        }
    }, 1000);
}

function autoSelectWrong() {
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
            <h2>ಪರೀಕ್ಷೆಯ ಫಲಿತಾಂಶ (Result)</h2>
            <p style="font-size: 3rem; color: #3498db; margin: 20px 0;">${score} / ${questions.length}</p>
        </div>
    `;
    nextButton.innerHTML = "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ (Restart)";
    nextButton.classList.remove('hide');
}

nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length) handleNextButton();
    else startQuiz();
});

startQuiz();

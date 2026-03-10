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

const questions = [
    { question: "1. ವಿದ್ಯುತ್ ಪ್ರವಾಹದ (Electric Current) SI ಏಕಮಾನ ಯಾವುದು?", answers: [{ text: "ಓಮ್", correct: false }, { text: "ವೋಲ್ಟ್", correct: false }, { text: "ಆಂಪೀರ್ (A)", correct: true }, { text: "ವ್ಯಾಟ್", correct: false }] },
    { question: "2. ಈ ಕೆಳಗಿನವುಗಳಲ್ಲಿ ಯಾವುದು ಅಲೋಹೀಯ ಆಕ್ಸೈಡ್ ಆಗಿದೆ?", answers: [{ text: "Na2O", correct: false }, { text: "CO2", correct: true }, { text: "MgO", correct: false }, { text: "CaO", correct: false }] },
    { question: "3. ಪ್ಲನೇರಿಯಾವು ಈ ಕೆಳಗಿನ ಯಾವ ವಿಧಾನದಿಂದ ಸಂತಾನೋತ್ಪತ್ತಿ ನಡೆಸುತ್ತದೆ?", answers: [{ text: "ಮೊಗ್ಗುವಿಕೆ", correct: false }, { text: "ಪುನರುತ್ಪಾದನೆ (Regeneration)", correct: true }, { text: "ದ್ವಿವಿದಳನ", correct: false }, { text: "ತುಂಡಾಗುವಿಕೆ", correct: false }] },
    { question: "4. ಆವರ್ತಕ ಕೋಷ್ಟಕದ ವರ್ಗದಲ್ಲಿ ಮೇಲಿನಿಂದ ಕೆಳಕ್ಕೆ ಬಂದಂತೆ ಪರಮಾಣು ಗಾತ್ರವು ಏನಾಗುತ್ತದೆ?", answers: [{ text: "ಕಡಿಮೆಯಾಗುತ್ತದೆ", correct: false }, { text: "ಹೆಚ್ಚಾಗುತ್ತದೆ", correct: true }, { text: "ಬದಲಾಗುವುದಿಲ್ಲ", correct: false }, { text: "ಮೊದಲು ಹೆಚ್ಚಾಗಿ ನಂತರ ಕಡಿಮೆ", correct: false }] },
    { question: "5. ವಾತಾವರಣದಲ್ಲಿ ಅತಿ ಹೆಚ್ಚು ಪ್ರಮಾಣದಲ್ಲಿರುವ ಹಸಿರುಮನೆ ಅನಿಲ ಯಾವುದು?", answers: [{ text: "ಆಮ್ಲಜನಕ", correct: false }, { text: "ಸಾರಜನಕ", correct: false }, { text: "ಕಾರ್ಬನ್ ಡೈ ಆಕ್ಸೈಡ್", correct: true }, { text: "ಮೀಥೇನ್", correct: false }] }
];

function startQuiz() {
    currentQuestionIndex = 0; score = 0;
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

function resetState() { clearInterval(timer); nextButton.classList.add('hide'); while (answerButtonsElement.firstChild) answerButtonsElement.removeChild(answerButtonsElement.firstChild); }

function startTimer() {
    timeLeft = 30; timerElement.innerText = `ಸಮಯ: ${timeLeft}s`;
    timer = setInterval(() => { timeLeft--; timerElement.innerText = `ಸಮಯ: ${timeLeft}s`; if (timeLeft <= 0) { clearInterval(timer); autoSelectCorrect(); } }, 1000);
}

function autoSelectCorrect() { Array.from(answerButtonsElement.children).forEach(button => { if (button.dataset.correct === "true") button.classList.add('correct'); button.disabled = true; }); nextButton.classList.remove('hide'); }

function selectAnswer(e) {
    const selectedBtn = e.target; const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) { selectedBtn.classList.add('correct'); score++; } else { selectedBtn.classList.add('wrong'); }
    autoSelectCorrect(); clearInterval(timer);
}

function showScore() {
    resetState(); progressBar.style.width = `100%`;
    const testKey = "science_test_2";
    let attempts = parseInt(localStorage.getItem(testKey + "_attempts")) || 0;
    let bestScore = parseInt(localStorage.getItem(testKey + "_best")) || 0;
    attempts++; if (score > bestScore) bestScore = score;
    localStorage.setItem(testKey + "_attempts", attempts); localStorage.setItem(testKey + "_best", bestScore);

    questionElement.innerHTML = `
        <div class="score-container">
            <h2>ಪರೀಕ್ಷೆ 2 ಮುಕ್ತಾಯ!</h2>
            <span class="score-number">${score} / ${questions.length}</span>
            <div style="text-align: left; margin-top: 20px; background: #e8f6f3; padding: 15px; border-radius: 8px;">
                <p>ಒಟ್ಟು ಪ್ರಯತ್ನಗಳು: <b>${attempts}</b></p>
                <p>ಉತ್ತಮ ಅಂಕ: <b>${bestScore} / ${questions.length}</b></p>
            </div>
        </div>`;
    nextButton.innerHTML = "ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ"; nextButton.classList.remove('hide');
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) showQuestion();
    else if (currentQuestionIndex === questions.length) showScore();
    else startQuiz();
});

startQuiz();

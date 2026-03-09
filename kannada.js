const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const timerElement = document.getElementById('timer');

let currentQuestionIndex = 0;
let score = 0; // ಅಂಕಗಳನ್ನು ಉಳಿಸಲು
let timeLeft = 60;
let timer;

const questions = [
    {
        question: "'ಶಬರಿ' ಪಾಠದ ಲೇಖಕರು ಯಾರು? (2023)",
        answers: [
            { text: "ಕುವೆಂಪು", correct: false },
            { text: "ಪು.ತಿ. ನರಸಿಂಹಾಚಾರ್", correct: true },
            { text: "ಜಿ.ಎಸ್. ಶಿವರುದ್ರಪ್ಪ", correct: false },
            { text: "ದ.ರಾ. ಬೇಂದ್ರೆ", correct: false }
        ]
    },
    {
        question: "'ಹಕ್ಕಿ ಹಾರುತಿದೆ ನೋಡಿದಿರಾ' ಕವನದ ಕವಿ ಯಾರು? (Repeated)",
        answers: [
            { text: "ದ.ರಾ. ಬೇಂದ್ರೆ", correct: true },
            { text: "ಚನ್ನವೀರ ಕಣವಿ", correct: false },
            { text: "ಕುವೆಂಪು", correct: false },
            { text: "ಸಿದ್ದಲಿಂಗಯ್ಯ", correct: false }
        ]
    },
    {
        question: "'ಕನ್ನಡದ ಆಸ್ತಿ' ಎಂದು ಯಾರನ್ನು ಕರೆಯುತ್ತಾರೆ? (2023)",
        answers: [
            { text: "ಶಿವರಾಮ ಕಾರಂತ", correct: false },
            { text: "ಡಿ.ವಿ.ಜಿ", correct: false },
            { text: "ಬಿ.ಎಂ. ಶ್ರೀ", correct: false },
             { text: "ಮಾಸ್ತಿ ವೆಂಕಟೇಶ ಅಯ್ಯಂಗಾರ್", correct: true }
        ]
    },
    {
        question: "'ಷಟ್ಪದಿ'ಯ ಬ್ರಹ್ಮ ಎಂದು ಯಾರನ್ನು ಕರೆಯುತ್ತಾರೆ? (Most Imp)",
        answers: [
            { text: "ಪಂಪ", correct: false },
            { text: "ಕುಮಾರವ್ಯಾಸ", correct: false },
            { text: "ರಾಘವಾಂಕ", correct: true },
            { text: "ಲಕ್ಷ್ಮೀಶ", correct: false }
        ]
    },
    {
        question: "'ಲಕ್ಷ್ಮೀಶ' ಕವಿಯ ಪ್ರಸಿದ್ಧ ಕೃತಿ ಯಾವುದು? (2024)",
        answers: [
            { text: "ಗದುಗಿನ ಭಾರತ", correct: false },
            { text: "ಜೈಮಿನಿ ಭಾರತ", correct: true },
            { text: "ರಾಮಾಯಣ ದರ್ಶನಂ", correct: false },
            { text: "ಚೆನ್ನಬಸವ ಪುರಾಣ", correct: false }
        ]
    },
    {
        question: "'ಲಗಾಮು' ಎಂಬುದು ಯಾವ ಭಾಷೆಯ ಪದ? (2022)",
        answers: [
            { text: "ಪಾರ್ಸಿ", correct: true },
            { text: "ಹಿಂದೂಸ್ತಾನಿ", correct: false },
            { text: "ಇಂಗ್ಲಿಷ್", correct: false },
            { text: "ಪೋರ್ಚುಗೀಸ್", correct: false }
        ]
    },
    {
        question: "'ಕೈಯಾಸೆ' ಪದವು ಯಾವ ಸಮಾಸಕ್ಕೆ ಉದಾಹರಣೆ? (2024)",
        answers: [
            { text: "ಅಂಶಿ ಸಮಾಸ", correct: false },
            { text: "ಕರ್ಮಧಾರಯ ಸಮಾಸ", correct: false },
            { text: "ತತ್ಪುರುಷ ಸಮಾಸ", correct: true },
            { text: "ದ್ವಂದ್ವ ಸಮಾಸ", correct: false }
        ]
    },
    {
        question: "'ವೃಷಭ' ಪದದ ತದ್ಭವ ರೂಪವೇನು? (2023)",
        answers: [
            { text: "ಎತ್ತು", correct: false },
            { text: "ಬಸವ", correct: true },
            { text: "ಕರು", correct: false },
            { text: "ಹೋರಿ", correct: false }
        ]
    },
    {
        question: "'ಅತಿಬೆಳ್ಳಗೆ' ಪದವು ಯಾವ ವ್ಯಾಕರಣ ಅಂಶಕ್ಕೆ ಸೇರಿದೆ? (2021)",
        answers: [
            { text: "ಜೋಡುನುಡಿ", correct: false },
            { text: "ಅನುಕರಣ ವಾಚಕ", correct: false },
            { text: "ನುಡಿಗಟ್ಟು", correct: false },
            { text: "ದ್ವಿರುಕ್ತಿ", correct: true }
        ]
    },
    {
        question: "'ಮುಖಕಮಲ' ಎಂಬುದು ಈ ಅಲಂಕಾರಕ್ಕೆ ಉದಾಹರಣೆ:",
        answers: [
            { text: "ಉಪಮಾಲಂಕಾರ", correct: false },
            { text: "ರೂಪಕಾಲಂಕಾರ", correct: true },
            { text: "ಉತ್ಪ್ರೇಕ್ಷಾಲಂಕಾರ", correct: false },
            { text: "ದೃಷ್ಟಾಂತಾಲಂಕಾರ", correct: false }
        ]
    },
    {
        question: "'ಹೊಸಗನ್ನಡ' ಪದವು ಯಾವ ಸಮಾಸ? (2024)",
        answers: [
            { text: "ಕರ್ಮಧಾರಯ", correct: true },
            { text: "ಗಮಕ", correct: false },
            { text: "ದ್ವಿಗು", correct: false },
            { text: "ಬಹುವ್ರೀಹಿ", correct: false }
        ]
    },
    {
        question: "ಕನ್ನಡ ವರ್ಣಮಾಲೆಯಲ್ಲಿರುವ ಒಟ್ಟು ಅಕ್ಷರಗಳು ಎಷ್ಟು?",
        answers: [
            { text: "50", correct: false },
            { text: "51", correct: false },
             { text: "49", correct: true },
            { text: "48", correct: false }
        ]
    },
    {
        question: "'ಅಂಗೈ' ಪದವು ಈ ಸಮಾಸಕ್ಕೆ ಉದಾಹರಣೆ:",
        answers: [
            { text: "ತತ್ಪುರುಷ", correct: false },
            { text: "ಅಂಶಿ ಸಮಾಸ", correct: true },
            { text: "ಅವ್ಯಯೀಭಾವ", correct: false },
            { text: "ದ್ವಂದ್ವ", correct: false }
        ]
    },
    {
        question: "'ಗಜ' ಪದದ ಸಮಾನಾರ್ಥಕ ಪದ ಯಾವುದು?",
        answers: [
            { text: "ಕುದುರೆ", correct: false },
            { text: "ಸಿಂಹ", correct: false },
            { text: "ಹುಲಿ", correct: false },
            { text: "ಆನೆ", correct: true }
        ]
    },
    {
        question: "'ಕವಿರಾಜಮಾರ್ಗ' ಗ್ರಂಥದ ಕರ್ತೃ ಯಾರು?",
        answers: [
            { text: "ಶ್ರೀವಿಜಯ", correct: true },
            { text: "ಪಂಪ", correct: false },
            { text: "ರನ್ನ", correct: false },
            { text: "ಪೊನ್ನ", correct: false }
        ]
    },
    {
        question: "ಲೋಪ ಸಂಧಿಗೆ ಒಂದು ಉದಾಹರಣೆ ನೀಡಿ:",
        answers: [
            { text: "ಮನೆಗೆ", correct: false },
            { text: "ಗಿಡದ", correct: false },
             { text: "ಊರೂರು", correct: true },
            { text: "ಹೊಸಗನ್ನಡ", correct: false }
        ]
    },
    {
        question: "'ಜೋಡುನುಡಿ'ಗೆ ಉದಾಹರಣೆ ಯಾವುದು?",
        answers: [
            { text: "ಗೆಲುವಿನ", correct: false },
            { text: "ಗಿಡಗಂಟೆ", correct: true },
            { text: "ಅತಿಬೆಳ್ಳಗೆ", correct: false },
            { text: "ಬರಬರುತ್ತಾ", correct: false }
        ]
    },
    {
        question: "ಷಷ್ಠೀ ವಿಭಕ್ತಿಯ ಪ್ರತ್ಯಯ ಯಾವುದು?",
        answers: [
            { text: "ಇಂದ", correct: false },
            { text: "ಅಲ್ಲಿ", correct: false },
            { text: "ಉ", correct: false },
            { text: "ಅ", correct: true }
        ]
    },
    {
        question: "ಕನ್ನಡದ ಪ್ರಥಮ ನಾಟಕ 'ಮಿತ್ರವಿಂದ ಗೋವಿಂದ'ದ ಕರ್ತೃ ಯಾರು?",
        answers: [
            { text: "ಸಿಂಗರಾರ್ಯ", correct: true },
            { text: "ಲಕ್ಷ್ಮೀಶ", correct: false },
            { text: "ಪಂಪ", correct: false },
            { text: "ರನ್ನ", correct: false }
        ]
    },
    {
        question: "'ಹಲಗಲಿ ಬೇಡರು' ಕವಿತೆಯು ಈ ಕಾವ್ಯ ಪ್ರಕಾರಕ್ಕೆ ಸೇರಿದೆ:",
        answers: [
            { text: "ಭಾವಗೀತೆ", correct: false },
            { text: "ವಚನ", correct: false },
            { text: "ಲಾವಣಿ", correct: true },
            { text: "ರಗಳೆ", correct: false }
        ]
    },
    {
        question: "'ಆಗಮ ಸಂಧಿ'ಗೆ ಉದಾಹರಣೆ ಯಾವುದು?",
        answers: [
            { text: "ಮನೆಯನ್ನು", correct: true },
            { text: "ಊರೂರು", correct: false },
            { text: "ಬೆಟ್ಟದಾವರೆ", correct: false },
            { text: "ಕೈಮರ", correct: false }
        ]
    },
    {
        question: "'ಕ್ರಿಯಾಸಮಾಸ'ಕ್ಕೆ ಉದಾಹರಣೆ ಕೊಡಿ:",
        answers: [
            { text: "ಹೆಬ್ಬಾಗಿಲು", correct: false },
            { text: "ಮೈದೊಳೆ", correct: true },
            { text: "ಪಂಚವಟಿ", correct: false },
            { text: "ಗಿಡಗಂಟೆ", correct: false }
        ]
    },
    {
        question: "'ವಿದ್ಯಾರ್ಥಿ' ಪದವು ಈ ಸಂಧಿಗೆ ಉದಾಹರಣೆ:",
        answers: [
            { text: "ಗುಣ ಸಂಧಿ", correct: false },
            { text: "ವೃದ್ಧಿ ಸಂಧಿ", correct: false },
            { text: "ಯಣ್ ಸಂಧಿ", correct: false },
            { text: "ಸವರ್ಣದೀರ್ಘ ಸಂಧಿ", correct: true }
        ]
    },
    {
        question: "'ಗಮಕ ಸಮಾಸ'ಕ್ಕೆ ಉದಾಹರಣೆ ಯಾವುದು?",
        answers: [
            { text: "ಆಗಸದಾವರೆ", correct: false },
            { text: "ಬಿಳಿಯಕುದುರೆ", correct: false },
            { text: "ಆ ಮಾತು", correct: true },
            { text: "ಮನೆಗೆಲಸ", correct: false }
        ]
    },
    {
        question: "'ಅನ್ವರ್ಥನಾಮ'ಕ್ಕೆ ಉದಾಹರಣೆ ಯಾವುದು?",
        answers: [
            { text: "ವ್ಯಾಪಾರಿ", correct: true },
            { text: "ರಾಮ", correct: false },
            { text: "ಬೆಂಗಳೂರು", correct: false },
            { text: "ನದೀ", correct: false }
        ]
    },
    {
        question: "'ದ್ವಿಗು ಸಮಾಸ'ಕ್ಕೆ ಉದಾಹರಣೆ:",
        answers: [
            { text: "ಗಿಡಮರ", correct: false },
            { text: "ಪಂಚವಟಿ", correct: true },
            { text: "ತಲೆನೋವು", correct: false },
            { text: "ಹಿಂಗಾಲು", correct: false }
        ]
    },
    {
        question: "'ಅಂಕಿತನಾಮ'ಕ್ಕೆ ಉದಾಹರಣೆ:",
        answers: [
            { text: "ವೈದ್ಯ", correct: false },
            { text: "ಪರ್ವತ", correct: false },
            { text: "ಊರು", correct: false },
            { text: "ಕೃಷ್ಣ", correct: true }
        ]
    },
    {
        question: "'ತೃತಿಯಾ' ವಿಭಕ್ತಿಯ ಪ್ರತ್ಯಯ ಯಾವುದು?",
        answers: [
            { text: "ಇಂದ", correct: true },
            { text: "ಅಕ್ಕೆ", correct: false },
            { text: "ಅನ್ನು", correct: false },
            { text: "ಅಲ್ಲಿ", correct: false }
        ]
    },
    {
        question: "'ಪಂಪ' ಕವಿಯ ಬಿರುದು ಯಾವುದು?",
        answers: [
            { text: "ಕವಿಚಕ್ರವರ್ತಿ", correct: false },
            { text: "ಉಭಯಕವಿ", correct: false },
            { text: "ಆದಿಕವಿ", correct: true },
            { text: "ಶಬ್ದಮಣಿ", correct: false }
        ]
    },
    {
        question: "'ಬೆಟ್ಟದಾವರೆ' ಈ ಸಂಧಿಗೆ ಉದಾಹರಣೆ:",
        answers: [
            { text: "ಜಶ್ತ್ವ ಸಂಧಿ", correct: false },
            { text: "ಆದೇಶ ಸಂಧಿ", correct: true },
            { text: "ಲೋಪ ಸಂಧಿ", correct: false },
            { text: "ಆಗಮ ಸಂಧಿ", correct: false }
        ]
    },
    {
        question: "'ಹಳಗನ್ನಡ'ದ ಪ್ರಥಮ ಕವಿ ಯಾರು?",
        answers: [
            { text: "ಪೊನ್ನ", correct: false },
            { text: "ರನ್ನ", correct: false },
            { text: "ಜನ್ನ", correct: false },
            { text: "ಪಂಪ", correct: true }
        ]
    },
    {
        question: "'ಅನುಕರಣ ವಾಚಕ'ಕ್ಕೆ ಉದಾಹರಣೆ:",
        answers: [
            { text: "ಘುಳುಘುಳು", correct: true },
            { text: "ಬರಬರುತ್ತಾ", correct: false },
            { text: "ಕೆರೆಕಟ್ಟೆ", correct: false },
            { text: "ಸಣ್ಣಪುಟ್ಟ", correct: false }
        ]
    },
    {
        question: "'ಸಪ್ತಮಿ' ವಿಭಕ್ತಿಯ ಪ್ರತ್ಯಯ ಯಾವುದು?",
        answers: [
            { text: "ಅನ್ನು", correct: false },
            { text: "ಇಂದ", correct: false },
            { text: "ಅಲ್ಲಿ", correct: true },
            { text: "ಅ", correct: false }
        ]
    },
    {
        question: "'ಗುಣ ಸಂಧಿ'ಕ್ಕೆ ಒಂದು ಉದಾಹರಣೆ:",
        answers: [
            { text: "ವೈದ್ಯ", correct: false },
            { text: "ಬರಗಾಲ", correct: false },
            { text: "ಹೊಸಗನ್ನಡ", correct: false },
            { text: "ದೇವೇಶ್ವರ", correct: true },
        ]
    },
    {
        question: "'ಯಣ್ ಸಂಧಿ'ಗೆ ಉದಾಹರಣೆ:",
        answers: [
            { text: "ಶಾಲೆಯಲ್ಲಿ", correct: false },
            { text: "ಗಿಡಮರ", correct: false },
            { text: "ಪ್ರತ್ಯುತ್ತರ", correct: true },
            { text: "ಬೆಟ್ಟದಾವರೆ", correct: false }
        ]
    },
    {
        question: "'ಚತುರ್ಥಿ' ವಿಭಕ್ತಿಯ ಕಾರಕಾರ್ಥ ಯಾವುದು?",
        answers: [
            { text: "ಸಂಪ್ರದಾನ", correct: true },
            { text: "ಕರ್ತೃ", correct: false },
            { text: "ಕರ್ಮ", correct: false },
            { text: "ಕರಣ", correct: false }
        ]
    },
    {
        question: "'ಸಂಧಿ' ಎಂದರೆ ಏನು?",
        answers: [
            { text: "ಪದಗಳ ಸೇರುವಿಕೆ", correct: false },
            { text: "ಅರ್ಥದ ಸೇರುವಿಕೆ", correct: false },
            { text: "ವಾಕ್ಯದ ಸೇರುವಿಕೆ", correct: false },
            { text: "ಅಕ್ಷರಗಳ ಸೇರುವಿಕೆ", correct: true }
        ]
    },
    {
        question: "'ಸಮಾಸ' ಎಂದರೆ ಏನು?",
        answers: [
            { text: "ಪದಗಳ ಸೇರುವಿಕೆ", correct: true },
            { text: "ಅಕ್ಷರಗಳ ಸೇರುವಿಕೆ", correct: false },
            { text: "ಧಾತುಗಳ ಸೇರುವಿಕೆ", correct: false },
            { text: "ವಾಚ್ಯಗಳ ಸೇರುವಿಕೆ", correct: false }
        ]
    },
    {
        question: "'ಕುದುರೆಗಳು' ಈ ಪದದಲ್ಲಿರುವ ಪ್ರತ್ಯಯ ಯಾವುದು?",
        answers: [
            { text: "ಸ್ತ್ರೀಲಿಂಗ ಪ್ರತ್ಯಯ", correct: false },
            { text: "ಬಹುವಚನ ಪ್ರತ್ಯಯ", correct: true },
            { text: "ಪುಲ್ಲಿಂಗ ಪ್ರತ್ಯಯ", correct: false },
            { text: "ಕಾರಕ ಪ್ರತ್ಯಯ", correct: false }
        ]
    },
    {
        question: "'ಪರ್ವತ' ಎಂಬುದು ಯಾವ ನಾಮಪದ?",
        answers: [
            { text: "ಅಂಕಿತನಾಮ", correct: false },
            { text: "ಅನ್ವರ್ಥನಾಮ", correct: false },
            { text: "ಭಾವನಾಮ", correct: false },
            { text: "ರೂಢನಾಮ", correct: true }
        ]
    },
    {
        question: "ಕನ್ನಡ ವರ್ಣಮಾಲೆಯಲ್ಲಿ ಎಷ್ಟು ವರ್ಗೀಯ ವ್ಯಂಜನಗಳಿವೆ?",
        answers: [
            { text: "25", correct: true },
            { text: "9", correct: false },
            { text: "34", correct: false },
            { text: "13", correct: false }
        ]
    },
    {
        question: "'ದ್ವಿರುಕ್ತಿ'ಗೆ ಒಂದು ಉದಾಹರಣೆ:",
        answers: [
            { text: "ಹಾಲುಜೇನು", correct: false },
            { text: "ತಲೆನೋವು", correct: false },
            { text: "ಬೇಗಬೇಗ", correct: true },
            { text: "ಬರಬರುತ್ತಾ", correct: false }
        ]
    },
    {
        question: "'ತತ್ಪುರುಷ ಸಮಾಸ'ದಲ್ಲಿ ಯಾವ ಪದದ ಅರ್ಥ ಮುಖ್ಯವಾಗಿರುತ್ತದೆ?",
        answers: [
            { text: "ಪೂರ್ವ ಪದದ", correct: false },
            { text: "ಉತ್ತರ ಪದದ", correct: true },
            { text: "ಎರಡೂ ಪದದ", correct: false },
            { text: "ಅನ್ಯ ಪದದ", correct: false }
        ]
    },
    {
        question: "'ಬಹುತೇಕ' ಪದವು ಈ ಸಂಧಿಗೆ ಉದಾಹರಣೆ:",
        answers: [
            { text: "ಗುಣ ಸಂಧಿ", correct: false },
            { text: "ಯಣ್ ಸಂಧಿ", correct: false },
            { text: "ಲೋಪ ಸಂಧಿ", correct: false },
            { text: "ವೃದ್ಧಿ ಸಂಧಿ", correct: true }
        ]
    },
    {
        question: "'ಗುರ್ವಿ' ಪದದ ಪುಲ್ಲಿಂಗ ರೂಪವೇನು?",
        answers: [
            { text: "ಗುರು", correct: true },
            { text: "ಗೌಡ", correct: false },
            { text: "ರಾಜ", correct: false },
            { text: "ದೇವ", correct: false }
        ]
    },
    {
        question: "'ಜಶ್ತ್ವ ಸಂಧಿ'ಗೆ ಉದಾಹರಣೆ ಯಾವುದು?",
        answers: [
            { text: "ಸತ್ಕಾರ", correct: false },
            { text: "ಲೋಕೈಕ", correct: false },
            { text: "ವಾಗ್ದೇವಿ", correct: true },
            { text: "ಉತ್ತರ", correct: false }
        ]
    },
    {
        question: "'ಬಹುವ್ರೀಹಿ ಸಮಾಸ'ಕ್ಕೆ ಉದಾಹರಣೆ:",
        answers: [
            { text: "ಪಂಚವಟಿ", correct: false },
            { text: "ಮುಕ್ಕಣ್ಣ", correct: true },
            { text: "ಕೆರೆಕಟ್ಟೆ", correct: false },
            { text: "ಹಿಂಗಾಲು", correct: false }
        ]
    },
    {
        question: "'ವೃಕ್ಷ' ಪದದ ತದ್ಭವ ರೂಪವೇನು?",
        answers: [
            { text: "ಗಿಡ", correct: false },
            { text: "ಮರ", correct: false },
            { text: "ಬೆಳವು", correct: false },
            { text: "ರುಕ್ಕ", correct: true }
        ]
    },
    {
        question: "ಕನ್ನಡದ ಮೊದಲ ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿ ಪುರಸ್ಕೃತರು ಯಾರು?",
        answers: [
            { text: "ಕುವೆಂಪು", correct: true },
            { text: "ಬೇಂದ್ರೆ", correct: false },
            { text: "ಕಾರಂತ", correct: false },
            { text: "ಗಿರೀಶ್ ಕಾರ್ನಾಡ್", correct: false }
        ]
    },
    {
        question: "ಷಟ್ಪದಿಯ ಪ್ರತಿ ಪಾದದ ಅಂತ್ಯದಲ್ಲಿ ಯಾವ ಮಾತ್ರಾಗಣವಿರುತ್ತದೆ?",
        answers: [
            { text: "ಯತಿ", correct: false },
            { text: "ಪಾಸ", correct: false },
            { text: "ಪ್ರಾಸ", correct: true },
            { text: "ಲಘು", correct: false }
        ]
    }
];

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0; // ಸ್ಕೋರ್ ರೀಸೆಟ್
    nextButton.innerHTML = "ಮುಂದಿನ ಪ್ರಶ್ನೆ (Next)";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    // --- PROGRESS BAR UPDATE ---
    const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById('progress-bar').style.width = progressPercent + '%';
    // ---------------------------

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
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
    timeLeft = 60;
    timerElement.innerText = `ಸಮಯ: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = `ಸಮಯ: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleNextButton(); // ಸಮಯ ಮುಗಿದರೆ ಮುಂದಿನ ಪ್ರಶ್ನೆಗೆ
        }
    }, 1000);
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
        if (button.dataset.correct === "true") {
            button.classList.add('correct');
        }
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
    questionElement.innerText = `ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ಅಂಕಗಳು: ${score} / ${questions.length}`;
    nextButton.innerHTML = "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ (Restart)";
    nextButton.classList.remove('hide');
}

nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

startQuiz();



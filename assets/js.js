'use strict';

let timerInterval;

let correctAnswers = 0;

let timerValue = 60;

let highscores = [];

const questions = [
    {
        text: "Who is the main played character in smash bros ultimate?",
        answers: [
            "Kirby", "Cloud", "Mario", "Luigi",
        ],
        correctAnswerIndex: 1,
    },
    {
        text: "who can u beat in a fight",
        answers: [
            "a shark", "a punching bag", "batman", "incredible hulk",
        ],
        correctAnswerIndex: 1,
    },
    {
        text: "badda bing badda ...",
        answers: [
            "womp", "BOOM!", "pew", "flush",
        ],
        correctAnswerIndex: 1,
    },
    {
        text: "What type of lion never roars?",
        answers: [
            "A Mountain lion", "Your pet cat", "A lion cub", "A dandelion",
        ],
        correctAnswerIndex:  3,
    },
    {
        text: "dial m for?",
        answers: [
            "murder", "a log", "mom", "monchichi",
        ],
        correctAnswerIndex: 1,
    },
    {
        text: "finish the movie qoute 'I hate...'",
        answers: [
            "snakes", "planes", "rats", "unicorns",
        ],
        correctAnswerIndex: 0,
    },
];

let currentQuestionIndex = 0;

// hide everything function
function hideAll() {
    let intro = document.getElementById("intro");
    intro.classList.add("hide");
    let quiz = document.getElementById("quiz");
    quiz.classList.add("hide");
    let top = document.getElementById("top-section");
    top.classList.add("hide");
    let sub = document.getElementById("submit");
    sub.classList.add("hide");
    let score = document.getElementById("highscores-container");
    score.classList.add("hide");
    let status = document.getElementById("status-text");
    status.classList.add("hide");
}

function displayIntro() {
    hideAll();

    handleRenderingTimer();

    let intro = document.getElementById("intro");
    intro.classList.remove("hide");

    endQuiz();
}

// Get paragraph element with text
function getParagraph(text) {
    const p = document.createElement('p');

    p.innerText = text;

    return p;
}

function showStatusText() {
    document.getElementById('status-text').classList.remove('hide');
}

function hideStatusText() {
    document.getElementById('status-text').classList.add('hide');
}

function startQuiz() {
    hideAll();

    handleRenderingTimer();

    document.getElementById('quiz').classList.remove('hide');

    // Reset quiz state
    currentQuestionIndex = 0;
    correctAnswers = 0;

    renderQuiz();
    startTimer();
}

function endQuiz() {
    timerValue = 60;

    clearInterval(timerInterval);
}

function startTimer() {
    // Reset timer (in seconds)
    timerValue = 60;

    handleRenderingTimer();

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timerValue -= 1;

        handleRenderingTimer();
    }, 1000);
}

function handleRenderingTimer() {
    document.getElementById('top-section').classList.remove('hide');

    if (timerValue <= 0) {
        displaySubmitForm();
        clearInterval(timerInterval);
        return;
    }

    document.getElementById('timer').innerText = 'Time: ' + timerValue;
}

function renderQuiz() {
    const question = questions[currentQuestionIndex];

    document.getElementById('question').innerText = question.text;

    const answers = question.answers;

    for (let i = 0; i < answers.length; i++) {
        const answerText = answers[i];
        answerEles[i].innerText = answerText;
    }
}

function selectAnswer(index) {
    const question = questions[currentQuestionIndex];

    // Handle if they got the right or wrong answer
    if (question.correctAnswerIndex === index) {
        correctAnswers += 1;
        setStatusText('Correct!');
    } else {
        setStatusText('Wrong!');

        // 10 second penality for getting the wrong answer
        timerValue -= 10;

        handleRenderingTimer();
    }

    currentQuestionIndex += 1;

    if (currentQuestionIndex >= questions.length) {
        displaySubmitForm();
        return;
    }

    renderQuiz();
}

let statusTextTimeout;

function setStatusText(text) {
    clearTimeout(statusTextTimeout)
    document.getElementById('status-text').innerText = text;

    showStatusText();

    statusTextTimeout = setTimeout(() => {
        hideStatusText();
    }, 1000);
}

function displaySubmitForm() {
    hideAll();
    document.getElementById('submit').classList.remove('hide');

    endQuiz();

    document.getElementById('score').innerText = correctAnswers;
}

function submitScore(initals, score) {
    highscores.push({
        initals: initals || "ABC",
        score: score,
    });

    highscores.sort((a, b) => {
        return b.score - a.score;
    });

    displayHighscores();
}

function displayHighscores() {
    hideAll();

    document.getElementById('highscores-container').classList.remove('hide');

    endQuiz();

    const highscoresEle = document.getElementById('highscores');

    highscoresEle.innerHTML = "";

    if (!highscores.length) {
        highscoresEle.append(getParagraph('No highscores'));
    }

    for (let i = 0; i < highscores.length; i++) {
        const initals = highscores[i].initals;
        const score = highscores[i].score;

        const p = getParagraph((i + 1) + '. ' + initals + ' - ' + score);

        p.classList.add('highlight');

        highscoresEle.append(p);
    }
}

function clearHighscores() {
    highscores = [];

    displayHighscores();
}

// Top Section
document.getElementById('highscore-link').onclick = () => {
    displayHighscores();
}

// Intro
document.getElementById('start').onclick = () => {
    startQuiz();
}

// Quiz
const answerEles = [
    document.getElementById('answer-1'),
    document.getElementById('answer-2'),
    document.getElementById('answer-3'),
    document.getElementById('answer-4'),
];

for (let i = 0; i < answerEles.length; i++) {
    const answerEle = answerEles[i];

    answerEle.onclick = () => {
        selectAnswer(i);
    }
}

// Highscores
document.getElementById('back').onclick = () => {
    displayIntro();
}

document.getElementById('clear-highscores').onclick = () => {
    clearHighscores();
}

// Submit
document.getElementById('submit-initals').onclick = () => {
    const initals = document.getElementById('initals').value;

    submitScore(initals, correctAnswers);
}

displayIntro();

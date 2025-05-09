const buttons = document.querySelectorAll(".letter-btn");
const gameOverModal = new bootstrap.Modal(document.getElementById("game-over-modal"));
const maxAttempts = 6;
const fiveLetterButton = document.getElementById('five-letters-btn');
const sixLetterButton = document.getElementById('six-letters-btn');
const overlay = document.getElementById('initial-choice-overlay');
const gameboardContainer = document.querySelector('.game-board-container');
const keyboardContainer = document.querySelector('.keyboard-container');

let cells = document.querySelectorAll(".cell");
let currentCell = null;
let currentRow = null;
let currentWordGuess = "";
let numberOfAttempts = 0;
let gameOver = false;
let maxLetters = 5;

///////////////////////////////////////////////////////////////////////////////
/////////////////////////////////  Functions  /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
async function getWordsAndStart(maxLettersChoice) {
    const response = await fetch("words/five_letter_words.txt");
    const text = await response.text();
    const fiveLetterWords = text.split("\n").map(x => x.trim()).filter(Boolean);

    const response2 = await fetch("words/six_letter_words.txt");
    const text2 = await response2.text();
    const sixLetterWords = text2.split("\n").map(x => x.trim()).filter(Boolean);

    const response3 = await fetch("words/five_letter_words_all.txt");
    const text3 = await response3.text();

    const response4 = await fetch("words/six_letter_words_all.txt");
    const text4 = await response4.text();

    const allWords = text3.split("\n").map(x => x.trim()).filter(Boolean).concat(
        text4.split("\n").map(x => x.trim()).filter(Boolean));

    maxLetters = maxLettersChoice;
    if (maxLetters == 6) {
        rowClass = 'row-lg';
    } else {
        rowClass = 'row-md';
    }

    for (let i = 1; i < 7; i++) {
        const container = document.getElementById('row-' + i)
        container.classList.add(rowClass);
        for (let j = 0; j < maxLetters; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add('col');
            container.appendChild(cell);
        }
    }

    hideOverlay();
    startGame(fiveLetterWords, sixLetterWords, allWords);
}

function startGame(fiveLetterWords, sixLetterWords, allWords) {
    currentWord = restart(fiveLetterWords, sixLetterWords);
    setEventListeners(fiveLetterWords, sixLetterWords, allWords);
}

function restart(fiveLetterWords, sixLetterWords) {
    resetCells();
    currentCell = getFirstEmptyCell();
    currentRow = currentCell.parentElement;
    numberOfAttempts = 0;
    gameOver = false;
    currentWordGuess = "";
    return getNewWord(fiveLetterWords, sixLetterWords).toUpperCase()
}

function setEventListeners(fiveLetterWords, sixLetterWords, allWords) {
    const enterButton = document.getElementById("ENTER");
    const backspaceButton = document.getElementById("BACKSPACE");
    const playAgainButtons = document.querySelectorAll('.restart-game');

    buttons.forEach(button => {
        button.addEventListener("click", function() {
            let letterButton = getFirstEmptyCell();
            if (!letterButton || currentWordGuess.length == maxLetters
                    || gameOver) {
                return;
            }
            letterButton.textContent = this.textContent;
            currentCell = letterButton;
            currentRow = letterButton.parentElement;
            currentWordGuess += this.textContent;
        })
    })
    
    enterButton.addEventListener("click", function() {
        // Check if there's 5 letters
        if (!gameOver && currentCell === currentRow.lastElementChild) {
            checkAnswer(allWords);
        }
    })
    
    document.addEventListener("keydown", function(event) {
        let button = document.getElementById(event.key.toUpperCase())
        if (!gameOver && button != null) {
            button.click()
        }
    })
    
    backspaceButton.addEventListener("click", function() {
        if (!gameOver && currentWordGuess.length != 0) {
            currentCell.textContent = "";
            // If no more cells are filled, we must go back to the first empty cell
            currentCell = getLastFilledCell() || getFirstEmptyCell();
            currentRow = currentCell.parentElement;
            currentWordGuess = currentWordGuess.slice(0, -1)
        }
    })

    playAgainButtons.forEach(button => {
        button.addEventListener("click", function () {
            gameOverModal.hide();
            showOverlay();
        })
    })

    sixLetterButton.onclick = function() {
        if (maxLetters == 5) {
            for (let i = 1; i < 7; i++) {
                const container = document.getElementById('row-' + i);
                container.classList.remove('row-md');
                container.classList.add('row-lg');
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.classList.add('col');
                container.appendChild(cell);
            }
            maxLetters = 6;
        }
        hideOverlay();
        currentWord = restart(fiveLetterWords, sixLetterWords);
    }

    fiveLetterButton.onclick = function() {
        if (maxLetters == 6) {
            for (let i = 1; i < 7; i++) {
                const container = document.getElementById('row-' + i);
                container.classList.remove('row-lg');
                container.classList.add('row-md');
                container.removeChild(container.lastElementChild);
            }
            maxLetters = 5;
        }
        hideOverlay();
        currentWord = restart(fiveLetterWords, sixLetterWords);
    }
}

function getFirstEmptyCell() {
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent === "") {
            return cells[i];
        }
    }
}

function getLastFilledCell() {
    let lastCell = null;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent != "") {
            lastCell = cells[i];
        }
    }
    return lastCell;
}

function checkAnswer(allWords) {
    if (!allWords.includes(currentWordGuess.toLowerCase())) {
        showMessage("This word is not part of the word list, try again :)");
        return
    }
    let allChildren = currentRow.children;
    let currentLetters = currentWord;
    for (let i = 0; i < allChildren.length; i ++) {
        let letter = allChildren[i].textContent;
        let letterElem = document.getElementById(letter);
        if (currentWord[i] == letter) {
            allChildren[i].classList.add("right");
            letterElem.classList.remove('almost');
            letterElem.classList.add("right");
            currentLetters = currentLetters.replace(letter, '');
        }
    }

    for (let i = 0; i < allChildren.length; i ++) {
        let letter = allChildren[i].textContent;
        let letterElem = document.getElementById(letter);
        if (currentLetters.includes(letter)
                && !allChildren[i].classList.contains('right')) {
            allChildren[i].classList.add("almost");
            if (!letterElem.classList.contains('right')) {
                letterElem.classList.add("almost");
            }
            currentLetters = currentLetters.replace(letter, '');
        } else if (!allChildren[i].classList.contains('right')) {
            allChildren[i].classList.add("bg-dark");
            if (!letterElem.classList.contains('right')
                    && !letterElem.classList.contains('almost')) {
                letterElem.classList.add("wrong");
            }
        }
    }

    numberOfAttempts += 1;
    if (currentWord === currentWordGuess) {
        const label = document.getElementById("game-over-label");
        const modalBody = document.getElementById("game-over-modal-body");
        gameOver = true;
        label.textContent = "Congratulations! 🎉";
        modalBody.textContent = "You guessed the right word: " + currentWord;
        gameOverModal.show();
    } else if (numberOfAttempts >= maxAttempts) {
        const label = document.getElementById("game-over-label");
        const modalBody = document.getElementById("game-over-modal-body");
        gameOver = true;
        label.textContent = "Game Over ☹️";
        modalBody.textContent = "The correct answer was: " + currentWord;
        gameOverModal.show();
    }
    currentWordGuess = "";
}

function showMessage(text, duration=1500) {
    const messageElem = document.getElementById("message");
    messageElem.textContent = text;
    messageElem.style.display = "block";
    setTimeout(() => {
        messageElem.style.display = "none";
        messageElem.textContent = "";
    }, duration)
}

function hideOverlay() {
    overlay.classList.remove('fade-in');
    overlay.classList.add('fade-out');
    setTimeout(() => {        
        gameboardContainer.classList.remove('fade-out');
        gameboardContainer.classList.add('fade-in');
        keyboardContainer.classList.remove('fade-out');
        keyboardContainer.classList.add('fade-in');
    }, 50);
}

function showOverlay() {
    setTimeout(() => {        
        gameboardContainer.classList.remove('fade-in');
        gameboardContainer.classList.add('fade-out');
        keyboardContainer.classList.remove('fade-in');
        keyboardContainer.classList.add('fade-out');
    }, 50);
    overlay.classList.remove('fade-out');
    overlay.classList.add('fade-in');
}

function resetCells() {
    cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('bg-dark');
        cell.classList.remove('right');
        cell.classList.remove('almost');
    })
    buttons.forEach(button => {
        button.classList.remove('wrong');
        button.classList.remove('right');
        button.classList.remove('almost');
    })
}

function getNewWord(fiveLetterWords, sixLetterWords) {
    if (maxLetters == 6) {
        return sixLetterWords[Math.floor(Math.random() * sixLetterWords.length)]
    } else if (maxLetters == 5) {
        return fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)]
    }
}

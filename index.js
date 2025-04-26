const buttons = document.querySelectorAll(".letter-btn");
const gameOverModal = new bootstrap.Modal(document.getElementById("game-over-modal"));
const cells = document.querySelectorAll(".cell");
const maxLetters = 5;
const maxAttempts = 6;
let currentCell = firstEmptyCell();
let currentRow = currentCell.parentElement;
let currentWordGuess = "";
let numberOfAttempts = 0;
let gameOver = false;

///////////////////////////////////////////////////////////////////////////////
/////////////////////////////////  Functions  /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function setEventListeners(words) {
    const enterButton = document.getElementById("ENTER")
    const backspaceButton = document.getElementById("BACKSPACE")
    const playAgainButtons = document.querySelectorAll('.restart-game')

    buttons.forEach(button => {
        button.addEventListener("click", function() {
            let letterButton = firstEmptyCell();
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
            checkAnswer(words)
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
            currentCell = lastFilledCell() || firstEmptyCell();
            currentRow = currentCell.parentElement
            currentWordGuess = currentWordGuess.slice(0, -1)
        }
    })

    playAgainButtons.forEach(button => {
        button.addEventListener("click", function () {
            currentWord = restart(words).toUpperCase();
            gameOverModal.hide();
            console.log(currentWord)
        })
    })
}

function firstEmptyCell() {
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent === "") {
            return cells[i];
        }
    }
}

function lastFilledCell() {
    let lastCell = null;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].textContent != "") {
            lastCell = cells[i];
        }
    }
    return lastCell;
}

function checkAnswer(words) {
    if (!words.includes(currentWordGuess.toLowerCase())) {
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
            allChildren[i].classList.add("wrong");
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

async function getWordsAndStart() {
    const response = await fetch("words.txt");
    const text = await response.text();
    const words = text.split("\n").map(x => x.trim()).filter(Boolean);
    startGame(words)
}

function restart(words) {
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('wrong');
        cell.classList.remove('right');
        cell.classList.remove('almost');
    })
    buttons.forEach(button => {
        button.classList.remove('wrong');
        button.classList.remove('right');
        button.classList.remove('almost');
    })
    numberOfAttempts = 0;
    gameOver = false;
    return words[Math.floor(Math.random() * words.length)]
}

function startGame(words) {
    currentWord = restart(words).toUpperCase();
    setEventListeners(words);
    // delete this after
    console.log(currentWord);
    // 
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

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////  Start  ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
getWordsAndStart();

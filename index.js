const buttons = document.querySelectorAll(".letter-btn");
const enterButton = document.getElementById("ENTER")
const backspaceButton = document.getElementById("BACKSPACE")
const cells = document.querySelectorAll(".cell");
const maxLetters = 5;
let words = [];
let currentCell = firstEmptyCell();
let currentRow = currentCell.parentElement;
let letterCount = 0;

buttons.forEach(button => {
    button.addEventListener("click", function() {
        let letterButton = firstEmptyCell();
        if (!letterButton || letterCount == maxLetters) {
            return;
        }
        letterButton.textContent = this.textContent;
        currentCell = letterButton;
        currentRow = letterButton.parentElement;
        letterCount += 1;
    })
})

enterButton.addEventListener("click", function() {
    // Check if there's 5 letters
    if (currentCell === currentRow.lastElementChild) {
        checkAnswer()
    }
})

document.addEventListener("keydown", function(event) {
    let button = document.getElementById(event.key.toUpperCase())
    if (button != null) {
        button.click()
    }
})

backspaceButton.addEventListener("click", function() {
    if (letterCount != 0) {
        currentCell.textContent = "";
        // If no more cells are filled, we must go back to the first empty cell
        currentCell = lastFilledCell() || firstEmptyCell();
        currentRow = currentCell.parentElement
        letterCount -= 1;
    }
})

getWordsAndStart();

// Functions
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

function checkAnswer() {
    let allChildren = currentRow.children;
    for (let i = 0; i < allChildren.length; i ++) {
        let letter = allChildren[i].textContent;
        if (currentWord[i] == letter) {
            allChildren[i].classList.add("right")
            document.getElementById(currentWord[i]).classList.add("right")
        } else if (currentWord.includes(letter)){
            allChildren[i].classList.add("almost")
            document.getElementById(currentWord[i]).classList.add("almost")
        } else {
            allChildren[i].classList.add("wrong")
            document.getElementById(letter).classList.add("wrong")
        }
    }
    letterCount = 0;
}

async function getWordsAndStart() {
    const response = await fetch("words.txt");
    const text = await response.text()
    const words = text.split("\n").map(x => x.trim()).filter(Boolean);
    startGame(words)
}

function restart(words) {
    cells.forEach(cell => {
        cell.textContent = "";
    })
    return words[Math.floor(Math.random() * words.length)]
}

function startGame(words) {
    currentWord = restart(words).toUpperCase()
    // delete this after
    console.log(currentWord);
    // 
}
const buttons = document.querySelectorAll(".letter-btn");
const cells = document.querySelectorAll(".cell");
const maxLetters = 5;
let words = []

buttons.forEach(button => {
    button.addEventListener("click", function() {
        letterButton = firstEmptyCell();
        if (!letterButton) {
            return;
        }
        letterButton.textContent = this.textContent;
        console.log("Button clicked:", this.textContent);
    })
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
    current_word = restart(words)
    // delete this after
    console.log(current_word);
    // 

}
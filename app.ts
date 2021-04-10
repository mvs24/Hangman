const wordElement = document.querySelector(".word")! as HTMLDivElement;
const hangmanParts = Array.from(document.querySelectorAll(".figure-part"));

interface State {
  selectedWord: string[];
  wrongLetters: string[];
  rightLetters: string[];
  lost: boolean;
  won: boolean;
}

const words = [
  "nodejs",
  "deno",
  "microservices",
  "graphql",
  "apollo",
  "typescript",
];

const getRandomWord: (words: string[]) => string[] = function (
  words: string[]
) {
  const randomIndex = Math.floor(Math.random() * words.length);

  return words[randomIndex].split("");
};

const state: State = {
  selectedWord: getRandomWord(words),
  wrongLetters: [],
  rightLetters: [],
  lost: false,
  won: false,
};

const drawEmptyLetter: (letter: string) => void = function (letter) {
  const emptyLetterMarkup: string = `
        <span class='letter' data-letter='${letter}'></span>
    `;

  wordElement.insertAdjacentHTML("beforeend", emptyLetterMarkup);
};

const populateHiddenWord = function () {
  state.selectedWord.forEach(drawEmptyLetter);
};

const updateHangmanParts = function () {
  hangmanParts[0].classList.remove("figure-part");
  hangmanParts.shift();
};

const showAlertMessage = function (msg: string) {
  setTimeout(() => {
    alert(msg);
  });
};

const updateHiddenLetters = function (letter: string) {
  const rightLetters = document.querySelectorAll(`[data-letter='${letter}']`);
  rightLetters.forEach((letterElement) => {
    letterElement.textContent = letter;
  });
};

const wonGameHandler = function () {
  state.won = true;
  showAlertMessage("You won the game");
};

const lostGameHandler = function () {
  state.lost = true;
  showAlertMessage("You lost the game");
};

const repeatedLetterHandler = function (
  letters: string[],
  letter: string
): boolean {
  if (letters.indexOf(letter) !== -1) {
    showAlertMessage("Repeated letter");
    return false;
  }
  return true;
};

const wrongLetterHandler = function (letter: string): void {
  state.wrongLetters.push(letter);

  if (state.wrongLetters.length === 6) lostGameHandler();
  else showAlertMessage(`Wrong letter ${letter}`);

  updateHangmanParts();
};

const updateRightLettersState = function (letter: string) {
  let numberOfRightLetterInSelectedWord = state.selectedWord.filter(
    (el) => el === letter
  ).length;
  while (numberOfRightLetterInSelectedWord > 0) {
    state.rightLetters.push(letter);
    numberOfRightLetterInSelectedWord--;
  }
};

const rightLetterHandler = function (letter: string) {
  updateRightLettersState(letter);

  if (state.rightLetters.length === state.selectedWord.length) wonGameHandler();
  updateHiddenLetters(letter);
};

const processWrongAndRepeatedLetterHandler = function (letter: string) {
  if (!state.selectedWord.some((el) => el === letter)) {
    if (repeatedLetterHandler(state.wrongLetters, letter) === false) return;

    wrongLetterHandler(letter);
  }
};

const processRightAndRepeatedLetterHandler = function (letter: string) {
  if (state.selectedWord.some((el) => el === letter)) {
    if (repeatedLetterHandler(state.rightLetters, letter) === false) return;
    rightLetterHandler(letter);
  }
};

const keyupLetterHandler = function (e: KeyboardEvent) {
  const letter = e.key;

  processWrongAndRepeatedLetterHandler(letter);
  processRightAndRepeatedLetterHandler(letter);
};

window.addEventListener("load", populateHiddenWord);
document.addEventListener("keyup", (e: KeyboardEvent) => {
  if (state.lost === false && state.won === false) {
    keyupLetterHandler(e);
  } else {
    showAlertMessage("You game has finished");
  }
});

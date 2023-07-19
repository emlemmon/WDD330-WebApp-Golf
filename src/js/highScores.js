import { getLocalStorage } from "./utils.mjs";

export function initScores() {
  let savedScores = getLocalStorage("Scores");
  if (!savedScores) {
    document.querySelector(".noScores").innerHTML =
      "No scores saved currently. Start playing and winning to save your high scores here!";
  } else {
    savedScores.sort((a, b) => a.playerScore - b.playerScore);
    console.log(savedScores);
    for (let i = 0; i < savedScores.length; i++) {
      let newScore = `<p>${savedScores[i].firstName} ${
        savedScores[i].lastName
      } - ${new Date(savedScores[i].date).toDateString()}</p>
                <p>${savedScores[i].playerScore} -- ${
        savedScores[i].computerScore
      }</p>
                <br>`;
      document
        .querySelector(".noScores")
        .insertAdjacentHTML("beforeBegin", newScore);
    }
  }
}

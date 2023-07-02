import { loadPartial, toggleNav } from "./utils.mjs";
import { initHowToPlay } from "./howToPlay";
import { initPlayGolf } from "./playGolf";
import { initScores } from "./highScores";
import { initSettings } from "./settings";
import { initNew4Card } from "./new4Card";

loadPartial("new4Card", initNew4Card);
document.querySelector("#menu-icon").addEventListener("click", toggleNav);
document.querySelector(".menu-close").addEventListener("click", toggleNav);

document
  .querySelector(".playGolfPg")
  .addEventListener("click", () => loadPartial("playGolf", initPlayGolf));
document
  .querySelector(".scoresPg")
  .addEventListener("click", () => loadPartial("scores", initScores));
document
  .querySelector(".howToPlayPg")
  .addEventListener("click", () => loadPartial("howToPlay", initHowToPlay));
document
  .querySelector(".settingsPg")
  .addEventListener("click", () => loadPartial("settings", initSettings));

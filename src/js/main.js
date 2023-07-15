import { initializeApp, loadPartial, toggleNav } from "./utils.mjs";

initializeApp();
document.querySelector("#menu-icon").addEventListener("click", toggleNav);
document.querySelector(".menu-close").addEventListener("click", toggleNav);

document
  .querySelector(".playGolfPg")
  .addEventListener("click", () => loadPartial("playGolf"));
document
  .querySelector(".scoresPg")
  .addEventListener("click", () => loadPartial("scores"));
document
  .querySelector(".howToPlayPg")
  .addEventListener("click", () => loadPartial("howToPlay"));
document
  .querySelector(".settingsPg")
  .addEventListener("click", () => loadPartial("settings"));

window.onpopstate = function (event) {
  loadPartial(event.state.selectedPartial, false);
  console.log("popping" + event.state.selectedPartial);
};
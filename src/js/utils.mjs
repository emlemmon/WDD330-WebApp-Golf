
import { initScores } from "./highScores";
import { initHowToPlay } from "./howToPlay";
import { initNew4Card } from "./new4Card";
import { initNew9Card } from "./new9Card";
import { initPlayGolf } from "./playGolf";
import { initSettings } from "./settings";
import { initPreviousGame } from "./previousGame";

export function initializeApp() {

  let state = {selectedPartial: "playGolf"}; 
  window.history.replaceState(state, null, "");
  loadPartial(state.selectedPartial, initPlayGolf);
}

function loadTemplate(path) {
  return async function () {
    const res = await fetch(path);
    if (res.ok) {
      const html = await res.text();
      return html;
    }
  };
}
  
async function renderWithTemplate(
  templateFn,
  parentElement,
  data,
  callback,
  position = "afterbegin",
  clear = true
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlString = await templateFn(data);
  parentElement.insertAdjacentHTML(position, htmlString);
  if (callback) {
    callback(data);
  }
}
  
export async function loadPartial(selectedPartial, saveHistory = true) {
  let newPage;
  if (selectedPartial === "loadPrevious") {
    newPage = await loadTemplate(`/partials/new4Card.html`);
  } else {
    newPage = await loadTemplate(`/partials/${selectedPartial}.html`);
  }
  const element = document.querySelector("main");
  await renderWithTemplate(newPage, element);
  if (selectedPartial === "howToPlay") {
    initHowToPlay();
  } else if (selectedPartial === "new4Card") {
    initNew4Card();
  // }  else if (selectedPartial === "new9Card") {
  //   initNew9Card();
  }  else if (selectedPartial === "playGolf") {
    initPlayGolf();
  }  else if (selectedPartial === "scores") {
    initScores();
  }  else if (selectedPartial === "settings") {
    initSettings();
  } else if (selectedPartial === "loadPrevious") {
    initPreviousGame();
  }
  if (saveHistory){
  console.log("pushing" + selectedPartial);
  window.history.pushState({selectedPartial:selectedPartial}, null, "");
  }
  document.getElementById("menu-icon").classList.remove("open");
  document.getElementById("menu").classList.remove("menu-open");
}

export function toggleNav() {
  const updateElement = document.getElementById("menu-icon");
  //toggle adds a class if it's not there or removes it if it is.
  updateElement.classList.toggle("open");

  const openMenu = document.getElementById("menu");
  openMenu.classList.toggle("menu-open");
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function formDataToJSON(formElement) {
  const formData = new FormData(formElement),
    convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

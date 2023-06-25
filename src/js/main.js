import { initHowToPlay } from "./howToPlay";
import { initPlayGolf } from "./playGolf";
import { initScores } from "./scores";
import { initSettings } from "./settings";
import { initNew4Card } from "./new4Card";


function loadTemplate(path) {

    return async function () {
        const res = await fetch(path);
        if (res.ok) {
        const html = await res.text();
        return html;
        }
    };
} 

async function renderWithTemplate(templateFn, parentElement, data, callback, position="afterbegin", clear=true) {
   
    if (clear) {
        parentElement.innerHTML = "";
    }
    const htmlString = await templateFn(data);
    parentElement.insertAdjacentHTML(position, htmlString);
    if(callback) {
        callback(data);
    }
}

async function loadPartial(selectedPartial, initFn) {
    const newPage = await loadTemplate(`/partials/${selectedPartial}.html`);
    const element = document.querySelector("main");
    await renderWithTemplate(newPage, element);
    initFn();
}

export function toggleNav() {
    const updateElement = document.getElementById("menu-icon");
    //toggle adds a class if it's not there or removes it if it is.
    updateElement.classList.toggle("open");
    
    const openMenu = document.getElementById("menu");
    openMenu.classList.toggle("menu-open");
}

loadPartial("new4Card", initNew4Card)
document.querySelector('#menu-icon').addEventListener('click', toggleNav);
document.querySelector('.menu-close').addEventListener('click', toggleNav);

document.querySelector('.playGolfPg').addEventListener('click', () => loadPartial("playGolf", initPlayGolf));
document.querySelector('.scoresPg').addEventListener('click', () => loadPartial("scores", initScores));
document.querySelector('.howToPlayPg').addEventListener('click', () => loadPartial("howToPlay", initHowToPlay));
document.querySelector('.settingsPg').addEventListener('click', () => loadPartial("settings", initSettings));


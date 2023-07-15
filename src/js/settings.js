import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { cardBack1, cardBack2 } from "./card.mjs";

export function initSettings() {
  changeBacks();
  document.querySelectorAll("input[name='backColor']").forEach((radioButton) => 
  radioButton.addEventListener("change", onChange));
}

function changeBacks() {
  let isPink = getLocalStorage("isPink");
  if (isPink === null) {
    isPink = true;
  }
  if (isPink) {
    document.getElementById("pink").checked = true;
  } else {
    document.getElementById("blue").checked = true;
  }
}

function onChange() {
  const radioBtns = document.querySelectorAll("input[name='backColor']");
  for (const i of radioBtns) {
      if (i.checked && i.value === "pink") {
        setLocalStorage("isPink", true);
      } else if (i.checked && i.value === "blue") {
        setLocalStorage("isPink", false);
      }
  }
}


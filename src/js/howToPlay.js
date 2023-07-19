import { loadPartial } from "./utils.mjs";

export function initHowToPlay() {
  document
    .querySelector(".new4CardPg2")
    .addEventListener("click", () => loadPartial("new4Card"));
}

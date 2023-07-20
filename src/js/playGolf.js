import { loadPartial } from "./utils.mjs";

export function initPlayGolf() {
  document
    .querySelector(".new4CardPg")
    .addEventListener("click", () => loadPartial("new4Card"));
  // document
  //   .querySelector(".new9CardPg")
  //   .addEventListener("click", () => loadPartial("new9Card"));
  document
    .querySelector(".loadPreviousPg")
    .addEventListener("click", () => loadPartial("loadPrevious"));
}

import { getLocalStorage } from "./utils.mjs";
import { Game } from "./game.mjs";

export async function initPreviousGame() {
    let savedGame = getLocalStorage("savedGame");
    const loadPreviousGame = new Game(savedGame.deckId, savedGame.cardsPerPlayer, savedGame.playerCards, savedGame.computerCards, savedGame.discardPile);
    localStorage.removeItem("savedGame");
}
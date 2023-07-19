import { newDeck } from "./deckService.mjs";
import { Game } from "./game.mjs";

export async function initNew4Card() {
  const deckId = await newDeck();
  const newGame = new Game(deckId, 4);
}

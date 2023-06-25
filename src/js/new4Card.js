import { newDeck, drawCards } from "./deckService.mjs";
import { Card, cardBack1 } from "./card.mjs";


export async function initNew4Card() {
    const deckId = await newDeck();
    const dealCards = await drawCards(deckId, 8);
    const gridItems = document.querySelectorAll(".grid-item");


    
    const drawPile = document.querySelector(".drawPile");
    drawPile.innerHTML = `${cardBack1}`;
    const discardPile = document.querySelector(".discardPile");
    const getOneCard = await drawCards(deckId, 1);
    const discard = new Card(getOneCard[0]);
    discardPile.appendChild(discard.element);
    discard.flip();
}



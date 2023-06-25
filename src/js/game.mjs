import { Card, cardBack1 } from "./card.mjs";
import { drawCards } from "./deckService.mjs";

export class Game {
    deckId;
    playerCards;
    computerCards;
    currentTurn;
    deckElement;
    discardStack;
    selectedCard;
    cardsPerPlayer;

    constructor(deckId, cardsPerPlayer) {
        this.deckId = deckId;
        this.cardsPerPlayer = cardsPerPlayer;
        this.playerCards = [];
        this.computerCards = [];
        this.initCards();
    }

    async initCards() {
        const dealCards = await drawCards(deckId, this.cardsPerPlayer*2);
        for (let i = 0; i < this.cardsPerPlayer; i++) {
            this.playerCards.push(new Card(dealCards[i*2]));
            this.computerCards.push(new Card(dealCards[(i+2)+1]))
        }
        console.log(this.playerCards);
        console.log(this.computerCards);

        this.addCardsToDom(this.playerCards, document.querySelectorAll(".playerGridItem"));
        this.addCardsToDom(this.computerCards, document.querySelectorAll(".computerGridItem"));
    }

    addCardsToDom(cardArray, elementArray) {
        for (let i = 0; i < this.cardsPerPlayer; i++) {
            elementArray[i].appendChild(cardArray[i].element);
            }; 
    }

    async onClickDeck() {
        newCardData = await drawCards(deckId, 1);
        const drawnCard = new Card(newCardData[0]);
        const element = document.querySelector(".currentCardDrawn");
        element.appendChild(drawnCard.element);
        drawnCard.flip();
        this.selectedCard = drawnCard;
    }

    onClickPlayerCard(cardClicked) {
        if (!this.selectedCard) {
            return;
        } else {
            for (let i = 0; i < this.playerCards.length; i++) {
                if (cardClicked === this.playerCards[i]) {
                    this.playerCards[i].element.parentNode.replaceChild(
                        this.selectedCard.element,
                        this.playerCards[i].element);
                    this.playerCards[i] = this.selectedCard;
                    return;
                }
            }
        }
    }

    knock() {

    }
}
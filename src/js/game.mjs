import { Card, cardBack1, cardBack2 } from "./card.mjs";
import { drawCards } from "./deckService.mjs";
import { getLocalStorage, loadPartial, setLocalStorage, formDataToJSON } from "./utils.mjs";

export class Game {
    deckId;
    playerCards;
    computerCards;
    drawPile;
    discardPile;
    drawnCard;
    newCardData;
    selectedCard;
    cardsPerPlayer;
    playersTurn;
    turnsRemaining;
    gameOver;

    constructor(deckId, cardsPerPlayer, playerCards, computerCards, discardPile) {
        this.deckId = deckId;
        this.cardsPerPlayer = cardsPerPlayer;
        this.playerCards = [];
        this.computerCards = [];

        if (playerCards) {
            this.playerCards = playerCards.map((card) => new Card(card));
        }
        if (computerCards) {
            this.computerCards = computerCards.map((card) => new Card(card));
        }
        if (discardPile) {
            this.discardPile = new Card(discardPile);
        }
        this.initCards();

        this.playersTurn = true;
        this.knocked = false;
        this.gameOver = false;

        window.addEventListener('beforeunload', () => {
            if (this.gameOver) {
                return;
            } else {
                let currentGame = {
                deckId: this.deckId,
                cardsPerPlayer: this.cardsPerPlayer,
                playerCards: this.playerCards.map((card) => card.data),
                computerCards: this.computerCards.map((card) => card.data),
                discardPile: this.discardPile.data
                };
                setLocalStorage("savedGame", currentGame);
            }
        });
    }

    async initCards() {
        if (this.playerCards.length == 0) {
            const dealCards = await drawCards(this.deckId, this.cardsPerPlayer*2);
            for (let i = 0; i < this.cardsPerPlayer; i++) {
                this.playerCards.push(new Card(dealCards[i*2]));
                this.computerCards.push(new Card(dealCards[(i*2)+1]))
            }
            //populate discard pile
            this.newCardData = await drawCards(this.deckId, 1); //remember that newCardData is an array
            this.discardPile = new Card(this.newCardData[0]);    
        }
        const discardPileEl = document.querySelector(".discardPile");
        discardPileEl.appendChild(this.discardPile.element);
        this.discardPile.flip();

        //populate player and computer cards
        this.addCardsToDom(this.playerCards, document.querySelectorAll(".playerGridItem"));
        if (this.cardsPerPlayer === 4) {
            this.playerCards[2].flip(true);
            this.playerCards[3].flip(true);
            setTimeout(() => {
                this.playerCards[2].flip(false);
                this.playerCards[3].flip(false);} , 3000);
        }
        this.addCardsToDom(this.computerCards, document.querySelectorAll(".computerGridItem"));

        if (this.computerCards.length === 4) {
            this.computerCards[0].canBeSeen = false;
            this.computerCards[1].canBeSeen = false; 
        } else {
            this.computerCards[1].canBeSeen = false;
            this.computerCards[2].canBeSeen = false;
            this.computerCards[4].canBeSeen = false;
            this.computerCards[5].canBeSeen = false;
            this.computerCards[7].canBeSeen = false;
            this.computerCards[8].canBeSeen = false;
        }

        //populate draw pile
        this.drawPile = document.querySelector(".drawPile");
        let isPink = getLocalStorage("isPink");
        if (isPink === null) {
            isPink = true;
          }
          if (isPink) {
            this.drawPile.innerHTML = `${cardBack1}`;
          } else {
            this.drawPile.innerHTML = `${cardBack2}`;
          }

        //listen for onclicks
        this.drawPile.addEventListener("click", () => this.onClickDeck());
        discardPileEl.addEventListener("click", () => this.onClickDiscardPile());
        document.querySelectorAll(".playerGridItem").forEach((element, index) => {
            element.addEventListener("click", () => this.onClickPlayerCard(this.playerCards[index]))
        });
        document.querySelector(".knockBtn").addEventListener("click", () => this.knock());
        //
    }

    addCardsToDom(cardArray, elementArray) {
        for (let i = 0; i < this.cardsPerPlayer; i++) {
            elementArray[i].appendChild(cardArray[i].element);
            }; 
        
    }

    async onClickDeck() {
        //if there is already a card drawn, don't do anything
        if (this.selectedCard || this.gameOver === true || !this.playersTurn) {
            return;
        }    

        this.newCardData = await drawCards(this.deckId, 1);
        this.drawnCard = new Card(this.newCardData[0]);
        this.drawPile.appendChild(this.drawnCard.element);
        this.drawnCard.flip(true);
        this.selectedCard = this.drawnCard;
    }

    swapSelectedCard(cardArray, index) {
        const cardToReplace = cardArray[index];
        //get the parent node of the card that's going to be replaced
        const parent = cardToReplace.element.parentNode;
        //put the card to be replaced in the discard pile (both the element and the data of the card)
        this.discardPile.element.parentNode.replaceChild(
            cardToReplace.element, 
            this.discardPile.element);
        this.discardPile = cardToReplace;
        //put selected card in the card to be replaced's spot that is now empty 
        parent.appendChild(this.selectedCard.element);
        cardArray[index] = this.selectedCard;
        this.selectedCard.canBeSeen = true;
        this.selectedCard = undefined; 
        if (cardArray[index].element.classList.contains("front")) {
            cardArray[index].flip();
        } 
        if (this.discardPile.element.classList.contains("back")) {
            this.discardPile.flip(true);
        }
    }

    onClickPlayerCard(cardClicked) {
        if (!this.selectedCard || this.gameOver === true || !this.playersTurn) {
            return;
        } else {
            for (let i = 0; i < this.playerCards.length; i++) {
                if (cardClicked === this.playerCards[i]) {
                    this.swapSelectedCard(this.playerCards, i);
                    this.togglePlayersTurn();
                    return;
                }
            }
        }
    }

    onClickDiscardPile() {
        if (this.gameOver === true || !this.playersTurn) {
            return;
        } else if (!this.selectedCard) {
            this.selectedCard = this.discardPile;
            this.enlarge(".discardPile", 1.05);            
        } else if (this.selectedCard != this.discardPile) {
            this.discardPile.element.parentNode.replaceChild(
            this.selectedCard.element,
            this.discardPile.element);
            this.discardPile = this.selectedCard;
            this.selectedCard = undefined;                
            this.togglePlayersTurn();
            
        }
    }

    async computerTurn(cardArray) {
        const sortedArray = [];
        //put the cards that can be seen by computer into an array, then sort the array highest to lowest
        for (let i = 0; i < cardArray.length; i++) {
            if (cardArray[i].canBeSeen === true) {
                sortedArray.push(cardArray[i]);
            }
        }
        sortedArray.sort((card1, card2) => card2.value - card1.value);
        console.log(sortedArray);

        const unseenIndex = this.computerCards.findIndex((card) => !card.canBeSeen);

        if (this.discardPile.value < 3 && unseenIndex >= 0) { //if discardPile is <3, select it and put it into unseen index
            this.selectedCard = this.discardPile;
            this.enlarge(".discardPile", 1.05);
            this.swapSelectedCard(this.computerCards, unseenIndex);

        } else if (this.discardPile.value < sortedArray[0].value && this.discardPile.value < 5) { //if discardPile is <5, select it and put it into sortedArray
           this.selectedCard = this.discardPile;
           this.enlarge(".discardPile", 1.05);
           this.swapSelectedCard(this.computerCards, this.computerCards.indexOf(sortedArray[0]));

        } else { //draw a new card
            this.enlarge(".drawPile", 1.05);
            this.newCardData = await drawCards(this.deckId, 1);
            this.drawnCard = new Card(this.newCardData[0]);
            this.selectedCard = this.drawnCard;

            if (this.selectedCard.value < 3 && unseenIndex >= 0) { //if drawnCard is <3, select it and put it into unseen index
                this.swapSelectedCard(this.computerCards, unseenIndex);

            } else if (this.selectedCard.value < sortedArray[0].value && this.selectedCard.value < 5) { //if drawnCard is <5, select it and put it into sortedArray
                this.swapSelectedCard(this.computerCards, this.computerCards.indexOf(sortedArray[0]));

            } else { //put drawnCard into discardPile
                setTimeout(() => {
                this.discardPile.element.parentNode.replaceChild(
                this.selectedCard.element,
                this.discardPile.element);
                this.discardPile = this.selectedCard;
                this.discardPile.flip(true);
                this.selectedCard = undefined} , 250);
            }
        }

        setTimeout(() => {
            this.computerknock(sortedArray); //check if computer should knock}
            this.togglePlayersTurn();
            console.log("now it's the players turn")} , 300);
    }

    togglePlayersTurn() {
        this.playersTurn = !this.playersTurn;
        if (this.turnsRemaining != undefined) {
            this.turnsRemaining -= 1;
        }
        if (this.turnsRemaining === 0) {
            this.onComplete();
        } else if (!this.playersTurn) {
            setTimeout(() => {
            this.computerTurn(this.computerCards)} , 600);            
        }
    } 
    computerknock() {
        if (this.knocked === true) {
            return;
        } else if (this.computerCards.filter((card) => card.canBeSeen).length === 4 && this.getScore(this.computerCards) <= 12) {
            this.knocked = true;
            this.turnsRemaining = 3;
            const closePopup = document.getElementById("popupclose");
            popup.style.display = 'block';
            saveScoreForm.style.display = 'none';
            document.querySelector(".winMessage").innerHTML = "Computer knocked! You have one more turn.";
            closePopup.onclick = function() {
                popup.style.display = 'none'; 
            }
            console.log("computer knocked");
        }
    }
    knock() {
        if (this.knocked === true || !this.playersTurn || !this.selectedCard) {
            return;
        }
        this.enlarge(".knockBtn", 1.1);
        this.knocked = true;
        this.turnsRemaining = 3;
        console.log("player knocked");
    }

    enlarge(selected, amount) {
        document.querySelector(selected).style.transform = `scale(${amount})`;
        document.querySelector(selected).style.transition = ".2s";
        setTimeout(() => {
            document.querySelector(selected).style.transform = "scale(1)";
            document.querySelector(selected).style.transition = ".2s";
        } , 200);
    }
    onComplete() {
        this.gameOver = true;
        //console.log("game is over, no one should be able to do any more turns");
        for (let i = 0; i < this.cardsPerPlayer; i++) {
            setTimeout(() => {
                this.playerCards[i].flip(true);
                this.computerCards[i].flip(true);
            } , ((i+1)*2)*200);
        }

        const playerScore = this.getScore(this.playerCards);
        const computerScore = this.getScore(this.computerCards);
        console.log(playerScore, computerScore);

        setTimeout(() => {
            if (playerScore < computerScore) {  
                document.querySelector("#saveScoreForm").style.display = 'block';
                this.gameOverMessage("You won!", playerScore, computerScore);
                const saveScores = document.querySelector("#scoreForm");
                saveScores.addEventListener("submit", () => 
                    this.checkAndSubmitForm(scoreForm, playerScore, computerScore));    

            } else if (computerScore < playerScore) {
                this.gameOverMessage("You lost!", playerScore, computerScore);
                
            } else {
                this.gameOverMessage("It's a tie!", playerScore, computerScore);
            }
        } , 2400);
    }

    getScore(cardArray) {
        const sumOfValues = cardArray.reduce(
        (accumulator, currentValue) => accumulator + currentValue.value, 0);
        return sumOfValues;
    }

    gameOverMessage(message, score1, score2) {
        const closePopup = document.getElementById("popupclose");
        const choices = document.querySelector(".choices");

        overlay.style.display = 'block';
        popup.style.display = 'block';
        choices.style.display = 'block';
        document.querySelector(".winMessage").innerHTML = message;
        document.querySelector(".scoreMessage").innerHTML = `${score1}  --  ${score2}`;
        closePopup.onclick = function() {
            overlay.style.display = 'none';
            popup.style.display = 'none';
        };

        document
            .querySelector(".scoresPg2")
            .addEventListener("click", () => loadPartial("scores"));
        document
            .querySelector(".new4CardPg")
            .addEventListener("click", () => loadPartial("new4Card"));
        document
            .querySelector(".new9CardPg")
            .addEventListener("click", () => loadPartial("new9Card"));
    }

    checkAndSubmitForm(form, score1, score2) {

            let myForm = form;
            let chkStatus = myForm.checkValidity();
            myForm.reportValidity();
            if (!chkStatus) {
                throw error;
            } else {
                const formData = formDataToJSON(form);
                let savedScores = getLocalStorage("Scores");
                if (!savedScores) {
                    savedScores = [];
                }
                formData.playerScore = score1;
                formData.computerScore = score2;
                savedScores.push(formData);
                console.log(savedScores);
                setLocalStorage("Scores", savedScores);
                document.querySelector("#saveScoreForm").style.display = 'none';
          }

    }
}
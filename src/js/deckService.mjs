const newDeck_URL = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=2";

export async function newDeck() {
    const response = await fetch(newDeck_URL);
    const data = await response.json();
    return data.deck_id;
}

export async function drawCards(deck_id, num) {
    const drawCard_URL = `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${num}`;
    const response = await fetch(drawCard_URL);
    const data = await response.json();
    return data.cards;
}


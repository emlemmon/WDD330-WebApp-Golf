export class Card {
  data;
  element;
  value;
  canBeSeen;

  constructor(data){
    this.data = data;
    this.element = document.createElement("div");
    this.element.className = "card front";
    this.element.innerHTML = `<img src="${data.image}">${cardBack1}`;
    this.value = this.findValue(data);
    this.canBeSeen = true;
  }

  flip() {
    this.element.classList.toggle("back");
    this.element.classList.toggle("front")
  }

  findValue() {
    const valueString = this.data.value;
    if (valueString === "KING") {
      return 0;
    } else if (valueString === "ACE") {
      return 1;
    }
    let cardValue = parseInt(valueString);
    if (isNaN(cardValue)) {
      cardValue = 10;
    }
    return cardValue;
  }
}


export const cardBack1 = `<svg class="first cardBack" height=322 width=229 viewBox="0,0,229,320">
<rect id="card1" x="0" height="320" width="228.57" y="0" rx="10" ry="10"/>
<defs>
  <linearGradient id="gradient" class="middleCircle">
    <stop offset="0%" style="stop-color: #63064D"></stop>
    <stop offset="50%" style="stop-color: #FE34A0"></stop>
    <stop offset="100%" style="stop-color: #63064D"></stop>
  </linearGradient>
  <linearGradient id="gradient2">
    <stop offset="0%" style="stop-color: #FE34A0"></stop>
    <stop offset="50%" style="stop-color: #FEC2D0"></stop>
    <stop offset="100%" style="stop-color: #FE34A0"></stop>
  </linearGradient>
  <polygon id="star" class="star" points="25,2.5 10,49.5 47.5,19.5 2.5,19.5 40,49.5" />
  <g id="background">
    <rect class="bg_rect" width="208.57" height="300" rx="5" ry="5" fill="url(#gradient2)" />
    <use xlink:href="#star" x="0" y="0" />
    <use xlink:href="#star" x="158.57" y="0" />
    <use xlink:href="#star" x="0" y="247.5" />
    <use xlink:href="#star" x="158.57" y="247.5" />
    <use xlink:href="circle1" x="0" y="0" />
  </g>
</defs>
<use id="first-stars" xlink:href="#background" x="10" y="10"/> 
<circle id="circle1" class="circle" cx="114" cy="160" r="45" fill="url(#gradient)"/>
</svg>`

export const cardBack2 = `<svg class="second cardback" height=322 width=229 viewBox="0,0,229,320">
  <rect id="card2" x="0" height="320" width="228.57" y="0" rx="10" ry="10"/>
  <defs>
    <linearGradient id="gradient3" class="middleCircle2">
      <stop offset="0%" style="stop-color: #003952"></stop>
      <stop offset="50%" style="stop-color: #6CD4FF"></stop>
      <stop offset="100%" style="stop-color: #003952"></stop>
    </linearGradient>
    <linearGradient id="gradient4">
      <stop offset="0%" style="stop-color: #6CD4FF"></stop>
      <stop offset="50%" style="stop-color: #DFEFF6"></stop>
      <stop offset="100%" style="stop-color: #6CD4FF"></stop>
    </linearGradient>
    <polygon id="star" class="star" points="25,2.5 10,49.5 47.5,19.5 2.5,19.5 40,49.5" />
    <g id="background2">
      <rect class="bg_rect" width="208.57" height="300" rx="5" ry="5" fill="url(#gradient4)" />
      <use xlink:href="#star" x="0" y="0" />
      <use xlink:href="#star" x="158.57" y="0" />
      <use xlink:href="#star" x="0" y="247.5" />
      <use xlink:href="#star" x="158.57" y="247.5" />
      <use xlink:href="circle2" x="0" y="0" />
    </g>
  </defs>
  <use id="first-starsB" xlink:href="#background2" x="10" y="10"/> 
  <circle id="circle2" class="circle" cx="114" cy="160" r="45" fill="url(#gradient3)"/>
</svg>`
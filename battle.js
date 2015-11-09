var card_numbers = [2,3,4,5,6,7,8,9,10,11,12,13,14];
var card_types = [ "spades", "cross", "hearts", "diamonds" ];
var card_costs = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 2,
  12: 20,
  13: 4,
  14: 11,
}; // не уверен что это нужно, но спер у тебя. Посмотрим, может пристрою или видоизменю.

function getRandomFromArr(arr) {
  return Math.floor(Math.random() * arr.length);
}; // достаем произвольное индекс из массива

function createCard(){
 var randomCardNumber = card_numbers[getRandomFromArr(card_numbers)];
 var randomCardType = card_types[getRandomFromArr(card_types)];
 return [randomCardNumber, randomCardType].join('@');
}; // создаем карту, на выходе имеем текстовое название карты типа 12@spades.

function fillNewDeck(){
 var deck = [];
 for (var i = 0; i < 6; i++){
  var a = createCard();
    if (a == deck.indexOf(a)){
   i--;
   }
   deck.push(a);
 }
return deck;
}; // функция заполнения первоначальной колоды игрока\бота.

// тест


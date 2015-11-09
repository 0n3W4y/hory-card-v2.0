var card_numbers = [2,3,4,5,6,7,8,9,10,11,12,13,14];
var card_types = [ "spades", "cross", "hearts", "diamonds" ]; 
//spades - Магический Урон, //cross - Добавление к защите, //hearts - Лечение, //diamonds - Физический урон
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

function getRandomFromArr(arr) {                  // достаем произвольное индекс из массива
  return Math.floor(Math.random() * arr.length);
}; 

function createCard(){                          // создаем карту, на выходе имеем текстовое название карты типа 12@spades.
 var randomCardNumber = card_numbers[getRandomFromArr(card_numbers)];
 var randomCardType = card_types[getRandomFromArr(card_types)];
 return [randomCardNumber, randomCardType].join('@');
}; 

function fillNewDeck(cards){                      // функция заполнения первоначальной колоды игрока\бота.
 var deck = [];
 for (var i = 0; i < cards; i++){
  var a = createCard();
    if (a == deck.indexOf(a)){
   i--;
   }
   deck.push(a);
 }
return deck;
};

function calculateDamage(arr){              // подсчет дамага в массиве ( общей деке карт ).
 var result = 0;
 for (var i = 0; i < arr.length; i++){
  var a = card_costs[arr[i].split("@")[0]];
  result += a;
  }
  
  return result;
}; 


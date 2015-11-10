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


var cardsDeck = 52; //количество кард в колоде
var playerCardDeck = []; //Колода карт игрока, для взятие карт в руки
var enemyCardDeck = []; //Колода карт противника, для взятия карт в руки
var playerHandDeck = []; //Колода карт игрока в руках.
var playerDeckHistory = []; //колода для истории( которая будет отображаться на "столе").
var enemyHandDeck = []; //колода карт противника в руках.
var enemyDeckHistory = []; //колода для истории противника.
var shareDeck = []; //колода битвы
var shareDeckHistory = []; //колода для истории ходов.

function getRandomFromArr(arr) { // Рандомно вытаскиваем с массива index
  return Math.floor(Math.random() * arr.length);
};

function createCard(){ //Создаем карту из преддставленного выбора.
 var randomCardNumber = card_numbers[getRandomFromArr(card_numbers)];
 var randomCardType = card_types[getRandomFromArr(card_types)];
 return [randomCardNumber, randomCardType].join('@');
};

//..function fillNewDeck(cards){ //старая функция заполнения начальнйо колоды на руки игрока.
// var deck = [];
// for (var i = 0; i < cards; i++){
//  var a = createCard();
//  
//  if (a == deck.indexOf(a)){
//   i--;
//   }
//   deck.push(a);
//    
// }
// return deck;
//};

function isNumeric(n) {    //Проверка на число.
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function calculateDamage(arr){ //Парный подсчет очков от карт. пока без мастей.
 var sumArr = [];
 for (var i = 0; i < arr.length; i++){
  var a = card_costs[arr[i].split("@")[0]];
  var b = card_costs[arr[i+1].split("@")[0]];
   if ( isNumeric(b) ){
   sumArr.push(a+b);
   i++;
   }else{
   sumArr.push(a);
   }
 }
 return sumArr;
};

function createCardDeck(func, arr, cardsDeck){ // Создание колоды карт, дял взятия оттуда карт.
 for (var i = 0; i < cardsDeck; i++){
  var a = func;
  if (arr.indexOf(a) < 0){
   i--;
  }else{
   arr.push(a);
  }
 }
 return arr;
};

function takeCardFromDeck(func, arr, arr2, cards){ //Так выглядит взятие карт(ы) в руки из ранее созданной колоды.
 for (var i = 0; i < cards; i++){
  var a = func;
  arr.push(arr[a]);
  arr2.splice(1, a);
 }
};

function putCardIntoBattle(arr,card){ // Перемещение карты в колоду боя.
 
};

function doCardIntoHistory(){ //Перемещение отработанной карты в историю.
 
};

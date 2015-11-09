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
};

function getRandomFromArr(arr) {
  return Math.floor(Math.random() * arr.length);
};

function createCard(){
 var randomCardNumber = card_numbers[getRandomFromArr(card_numbers)];
 var randomCardType = card_types[getRandomFromArr(card_types)];
 return [randomCardNumber, randomCardType].join(',');

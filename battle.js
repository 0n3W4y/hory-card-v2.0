
//spades - Магический Урон, //cross - Добавление к защите, //hearts - Лечение, //diamonds - Физический урон
var cardsDeck ={
 numbers : [2,3,4,5,6,7,8,9,10,11,12,13,14],
 types : [ "spades", "cross", "hearts", "diamonds" ],
 costs : {2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 2, 12: 20, 13: 4, 14: 11}
};

var battleGround = {
 battleDeck : [],
 battleDeckHistory : []
};

function getRandomCard(card_numbers, card_types){
 var a = getRandomFromArr(card_numbers);
 var b = getRandomFromArr(card_types);
 return [card_numbers[a], card_types[b]];
};

function getRandomFromArr(arr) {
  return Math.floor(Math.random() * arr.length);
};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
/*
function calculateDamage(arr){
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
*/
/*
function createCardDeck(card_numbers, card_types){
 var arr = [];
 for (var i = 0; i < card_types.length; i++){
  var a = card_types[i];
  for (var j = 0; j < card_numbers.length; j++){
   var b = card_numbers[j];
   arr.push([b, a]);
  }
 }
 arrShuffle(arr);
 return arr;
};
*/

/*
function arrShuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var num = Math.floor(Math.random() * (i + 1));
        var d = arr[num];
        arr[num] = arr[i];
        arr[i] = d;
    }
    return arr;
};
*/


 
//---------------------------------------------

var Player = klass(function (name, race) {
  this.name = name;
  this.race = race;
  this.experience = 1;
  this.level = 1;
  this.deck = [];
})	
  .methods({
    getcard: function(cards){    
	  for (var i = 0; i < cards; i++){
	  var a = Math.floor(Math.random() * cardsDeck.numbers.length);
	  var b = Math.floor(Math.random() * cardsDeck.type.length);
	  var num = [cardsDeck.numbers[a], cardsDeck.type[b]];
	  this.deck.push(num);
      }
    }
  });
 
 
var Inventory = $.trait({
  inventory:{
		firtsbag : {},
		secondbag : {},
		thirdbag : {},
		fourthbag : {},
		fifthbag : {}
		}
});

var Stats = $.trait({
  stats: {
		STR : 1, 
		AGI : 1, 
		END : 1, 
		INT : 1, 
		ATK : 1, 
		DEF : 1,
		MDF : 1,
		BR : 1, 
		DDG : 1, 
		HP : 1, 
		SP : 1 
		}
});
/*


//spades - Магический Урон, //cross - Добавление к защите, //hearts - Лечение, //diamonds - Физический урон
var cardsDeck ={ // сделал объект, возможно так будет быстрее, проще, и т.п.
 numbers : [2,3,4,5,6,7,8,9,10,11,12,13,14],
 types : [ "spades", "cross", "hearts", "diamonds" ],
 costs : {2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 2, 12: 20, 13: 4, 14: 11}
};

var battleGround = { // сделал объкт для *стола* 
 battleDeck : [],
 battleDeckHistory : []
};

function getRandomCard(cardsDeck.numbers, cardsDeck.types){ // генерируем карту, без ограничений.
 var a = getRandomFromArr(cardsDeck.numbers);
 var b = getRandomFromArr(cardsDeck.types);
 return [cardsDeck.numbers[a], cardsDeck.types[b]];
};

function getRandomFromArr(arr) { // рандомный индекс из массива
  return Math.floor(Math.random() * arr.length);
};

function isNumeric(n) { // проверка на число
  return !isNaN(parseFloat(n)) && isFinite(n);
}

//---------------------------------------------

var Player = $.klass({ // класс для игроков.
  init: function(name, race) {  
  this.name = name;
  this.race = race;
  this.experience = 1;
  this.level = 1;
  this.deck = [];
  this.deckHistory = [],
  this.battleDeck = battleGround.battleDeck; // ссылка на глобальный объект *стола*
  },
  getcard: function(cards){ // генерируем карту и кладем ее к игроку в деку, количество карт можно задать числом cards
   for (var i = 0; i < cards; i++){
	var a = Math.floor(Math.random() * cardsDeck.numbers.length);
	var b = Math.floor(Math.random() * cardsDeck.types.length);
	var num = [cardsDeck.numbers[a], cardsDeck.types[b]];
	this.deck.push(num);
   }
  }
  givecardtobattle: function(selectedCard){ //выкладываем выбранную карту в глобальный объект *стол*
   this.battleDeck.length = 0;
   this.battleDeck.push(selectedCard);
   var a = deck.indexOf(selectedCard);
   this.deck.splice(1, a);
  }
  calculateDamage: function(battleGround.battleDeck){ // просчитываем дамага после того, ка игрок нажмет кнопку - конец хода.
   
  }
});


var Inventory = $.trait({ // трейт инвентарь
  inventory:{
  		character : {}, // то что надето на пресонаже
		firtsbag : {},
		secondbag : {},
		thirdbag : {},
		fourthbag : {},
		fifthbag : {}
		}
});

var Stats = $.trait({ //трейт со статами
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

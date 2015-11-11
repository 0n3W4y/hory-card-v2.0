
//spades - Магический Урон, //cross - Добавление к защите, //hearts - Лечение, //diamonds - Физический урон
var cardsDeck ={
 numbers : [2,3,4,5,6,7,8,9,10,11,12,13,14],
 types : [ "spades", "cross", "hearts", "diamonds" ],
 costs : {2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 2, 12: 20, 13: 4, 14: 11}
};

var battleGround = { // пока глобальный объект стол, как класс не могу сделать. Может позже
 battleDeck : [], // что бы была
 battleDeckHistory : [], // лог боев
 damage : [], // приходящий массив из баттледеки игрока
 calculatedmg: function(){ // функция подсчета дамага из массива.
  var sum = 0;
  for (var i = 0; i < battleGround.damage.length; i++){
   sum += battleGround.damage[i];
  }
  return sum;
 }
};

function getRandomCard(){ // генератор карт
 var a = getRandomFromArr(cardsDeck.numbers);
 var b = getRandomFromArr(cardsDeck.types);
 return [cardsDeck.numbers[a], cardsDeck.types[b]];
};

function getRandomFromArr(arr) { //генератор индексов массива
  return Math.floor(Math.random() * arr.length);
};

function isNumeric(n) { // проверка на число
  return !isNaN(parseFloat(n)) && isFinite(n);
}

//---------------------------------------------

var Inventory = $.trait({ // трейт инвентаря ( доделать )
  inventory:{
		character : {},
		firtsbag : {},
		secondbag : {},
		thirdbag : {},
		fourthbag : {},
		fifthbag : {}
		}
});

var Stats = $.trait({ // трейт стат ( доделать )
  stats: function (){
  this.stats = {
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
	}
});

var Player = $.klass({ // класс для игрока
  init: function(name, race) {  
  this.name = name;
  this.race = race;
  this.experience = 1;
  this.level = 1;
  this.deck = []; // руки с картами
  this.deckHistory = []; // лог выкладки карт игрока
  this.battleDeck = null; // дека для боя
  },
  getcard: function(cards){ // взять cards карт и положить себе в  руки
   for (var i = 0; i < cards; i++){
	var a = Math.floor(Math.random() * cardsDeck.numbers.length);
	var b = Math.floor(Math.random() * cardsDeck.types.length);
	var num = [cardsDeck.numbers[a], cardsDeck.types[b]];
	this.deck.push(num);
   }
  },
  givecardtobattle: function(selectedCard){ // положить карту из рук в деку с боем
   if (this.battleDeck === null){
    this.battleDeck = []
   };
   this.battleDeck.push(selectedCard);
   var a = this.deck.indexOf(selectedCard);
   this.deck.splice(1, a); // удалить карту из рук
  },
  calculateDamage: function(){ // подсчет дамага без мастей, тупо достоинство карт.
   var sumArr = [];
     for (var i = 0; i < this.battleDeck.length; i++){
      var a = cardsDeck.costs[this.battleDeck[i][0]];
      var b = cardsDeck.costs[this.battleDeck[i+1][0]];
      if ( isNumeric(b) ){ // проверка , четное или не четное количество карт в деке боя.
      sumArr.push(a+b);
      i++;
      }else{
      sumArr.push(a);
      }
     }
   return sumArr;
  },
  startbattle: function(cards){ // стартбоя
   this.battleDeck = battleGround.battleDeck; // маунтим из глобального объекта деку с боем игроку ( впринципе не нужно )
   this.stats.HP = this.stats.HP - battleGround.calculatedmg(); // вычитаем урон их ХП, от игрока, ходившего раньше.
   this.getcard(cards); // берем cards карт
   
   //alert( "Ваш ход!" ); 
  },
  endbattle: function(){ // окончание хода игрока
   battleGround.battleDeckHistory = $.merge( battleGround.battleDeckHistory, this.battleDeck );//собираем массив в историю.
   battleGround.damage = this.calculateDamage(); // считаем урон из положенных карт в декубоя, присваимаем массив столу.
   
   this.battleDeck.length = 0; // обнуляем деку боя ( свою )
  },
  
 _traits: [Inventory, Stats], // добаляем трейты ( не работает )
});

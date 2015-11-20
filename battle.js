//spades - Магический Урон, //cross - Добавление к защите, //hearts - Лечение, //diamonds - Физический урон
var cardsDeck ={
 numbers : [2,3,4,5,6,7,8,9,10,11,12,13,14],
 types : [ "spades", "cross", "hearts", "diamonds" ],
 costs : {2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 2, 12: 20, 13: 4, 14: 11}
};

var Battleground = $.klass({ // класс для полебоя
 init: function (name, timer, cards, cardsEveryTurn){
  this.name = name;
  this.deck = null;
  this.historyDeck = null;
  this.timer = timer;
  this.cards = cards;
  this.player = null;
  this.enemy = null;
  this.cardsEveryTurn = cardsEveryTurn;
 },
 
 calculateDamage: function (player){ // функция подсчета дамага, пока без мастей и комбо
   var sumArr = [];
   var sum = 0;
     for (var i = 0; i < this.deck.length; i++){
	  if (this.deck[i+1]){ //проверка на существования последнего индекса в массиве, после каждой операции сложения.
      var a = cardsDeck.costs[this.deck[i][0]];
      var b = cardsDeck.costs[this.deck[i+1][0]];
	  sumArr.push(a+b);
	  i++      
      }else{
	  var a = cardsDeck.costs[this.deck[i][0]]
      sumArr.push(a);
      }
     }
	 
   for (var i = 0; i < sumArr.length; i++){ // складываем весь дамаг, находящийся в массиве попарно.
    sum += sumArr[i]; 
  }
  player.stats.HP = player.stats.HP - sum; // сразу же наносим урон игроку.
 },
 
 battleStart: function (firstPlayer){	 // начало Игры.
  this.player.battleDeck = [];
  this.player.deck = [];
  this.enemy.battleDeck = [];
  this.enemy.deck = [];
  this.deck = [];
  this.historyDeck = [];
  if (Math.round(Math.random)){
	var firstPlayer = this.player;
  }else{
	var firstPlayer = this.enemy;
  };
  this.turnStart(firstPlayer);
 },
 
 battleEnd: function(player){ // конец игры ( вывод сообщений подсчет очков, статистика )
	if (this.player == player){
		alert ( " ВЫ проиграли сражение " );
	}else{
		alert ( " ВЫ выйграли сражение " );
	}
  },
 
 turnStart: function (player){ //начало хода для игрока
  player.battleDeck.length = 0; // обнуляем боевую деку игрока, от предыдущих значений.
  this.calculateDamage(player); // собираем урон, оставленный предыдущим хода другого игрока.
  this.deck.length = 0; // после сбора урона обнуляем деку полебоя куда копируются карты из баттлдеки игрока.
  if (player.currentStats.HP <= 0){
	  this.battleEnd(player);
  }else{
	this.giveCard(player);
	var timer = this.timer;
	this.runTimer(timer ,player);
  }
 },
 
 turnEnd: function (player){ // заканчиваем ходигрока
  this.deck = player.battleDeck; // коопируем набросанные карты из его деки в деку полебоя
  var tempArr = [player.name, [this.deck]]; // создаем массив из хода игрока.
  this.historyDeck = $.merge( this.historyDeck, tempArr ); // совмещаем массивы в итосрии полебоя
  if (this.player.player == player){
	  var nextPlayer = this.enemy;
  }else{
	  var nextPlayer = this.player;
  }
  alert( " doshlo do turnEnd(); " + nextPlayer.name );
  //this.turnStart(nextPlayer);
 },
 
 giveCard: function (player){ //раздача карт игроку.
  if (player.deck.length == 0){
	  var cards = this.cards;
  }else{
	  var cards = this.cardEveryTurn;
  }
  for (var i = 0; i < cards; i++){
   var a = Math.floor(Math.random() * cardsDeck.numbers.length);
   var b = Math.floor(Math.random() * cardsDeck.types.length);
   var num = [cardsDeck.numbers[a], cardsDeck.types[b]];
   if (player.playerType == "player"){
	   var a = "<li class='card'>" + num + "</li>";
	   $( a ).appendTo("#connectedSortable");
   }else{
   player.deck.push(num);
   }
  }
 },
 runTimer: function(timer, player){
	var i = timer;
	var timerId = setInterval(function(){
		if (i >= 0){
		$("#time-left").text(i--);
		}else{
		clearInterval(timerId);
		this.turnEnd(player)
		}
	}, 1000);
 }

  
});

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

var Inventory = $.trait({ // трейт инвентаря , для заполенния нужно вызвать %name%.stats();
 inventory: function() {
  this.inventory = {
		character : {},
		firtsbag : {},
		secondbag : {},
		thirdbag : {},
		fourthbag : {},
		fifthbag : {}
		}
	}
});

var Stats = $.trait({ // трейт стат, для заполнения нужно вызывать %name%.stats();
  stats: function () {
    this.stats = {
		STR : 1,
		AGI : 1,
		END : 1,
		INT : 1,
		ATK : 1,
		MATK : 1,
		DEF : 1,
		MDF : 1,
		BR : 1,
		DDG : 1,
		HP : 1,
		SP : 1
	},
	this.currentStats = {
		STR : 1,
		AGI : 1,
		END : 1,
		INT : 1,
		ATK : 1,
		MATK : 1,
		DEF : 1,
		MDF : 1,
		BR : 1,
		DDG : 1,
		HP : 1,
		SP : 1
	}
  }
});

var Player = $.klass({
  init: function(name, race) {  
  this.name = name;
  this.race = race;
  this.experience = 1;
  this.level = 1;
  this.deck = null;
  this.deckHistory = null; // пока не задействована.( возможно не нужна будет )
  this.battleDeck = null;
  this.playerType = null;
  },
  
  givecardtobattle: function(selectedCard){ // передача выбранной карты в бой
   this.battleDeck.push(selectedCard);
   var a = this.deck.indexOf(selectedCard);
   this.deck.splice(a, 1); //обязательное удаление карты из руки игрока.
  },
  
 _traits: [Inventory, Stats],
 
});

function checkStartForm(){
	var name = document.forms.preStart.elements.nickname.value;
	var cards = Math.round(+document.forms.preStart.elements.cards.value);
	var timer = Math.round(+document.forms.preStart.elements.timeturn.value);
	if (name.length > 15){
		alert( '${name} +  слишком длинное имя, сделайте его короче!' );
		return false;
	}else if(name.length < 1){
		alert( 'Слишком короткое имя ');
		return false;
	}
	
	if ( !isNumeric(cards) || cards <= 3 || cards >= 52){
		alert( cards + '- не верно, 3< число карт < 52 ');
		return false;
	}
	
	if ( (!isNumeric(timer)) || timer <= 15 || timer >= 60){
		alert( timer + '- не верно, 15< вермя на ход <= 60');
		return false;
	}
	
	return startBattle();
};




function startBattle(){
	
	var name = document.forms.preStart.elements.nickname.value;
	for (var i = 0;i < document.forms.preStart.elements.race.length; i++){
		if (document.forms.preStart.elements.race[i].selected == true){
			var race = document.forms.preStart.elements.race[i].value;
		}
	}
	var cards = +document.forms.preStart.elements.cards.value;
	var timer = +document.forms.preStart.elements.timeturn.value;
	var cardsEveryTurn = +document.forms.preStart.elements.cardeveryturn.value;
	
	var avatar1 = null;
	if (race == "human"){
		avatar1 = "img/c.jpg";
	}else if (race == "orc"){
		avatar1 = "img/a.jpg";
	}else{
		avatar1 = "img/b.jpg";
	}
	

/*	var botEnable = document.forms.preStart.elements.botEnable;
		if( botEnable == ){
			var botplayer = new Player(generateName(), renerateRace())
			botplayer.stats();
			botplayer.stats.HP = generateHP();
			botplayer.stats.SP = generateSP();
			...
		}
*/	
	var p1 = new Player(name, race);
	p1.stats();
	p1.playerType = "player"
	p1.stats.HP = 100;
	p1.currentStats.HP = 100;
	$("div#bottom-playername").html(name);
	
		
	// сгенерирую постоянного бота
	
	var p2 = new Player("Robot", "human");
	p2.stats();
	p2.playerType = "enemy"
	p2.stats.HP = 150;
	p2.stats.SP = 50;
	p2.currentStats.HP = 150;
	p2.currentStats.SP = 50;
	$("div#top-playername").html(p2.name);
	
	//добавлю красные и зеленые бары
	
	$("#bpb-hp span").css("width", "100%");
	$("#tpb-hp span").css("width", "100%");
	$("#bpb-sp span").css("width", "100%");
	$("#tpb-sp span").css("width", "100%");
	
	//добавлю аватарку
	
	$("#bottomavatar img").attr("src", avatar1);
	$("#topavatar img").attr("src", "img/c.jpg");
	
	//закрою окно, выведу что все готово.
	$('#overlay').css('display', 'none');
	
	var battleground = new Battleground("abyssal crypt", timer, cards, cardsEveryTurn);
	battleground.player = p1;
	battleground.enemy = p2;
	

	
	battleground.battleStart();
}
/*
$(document).ready(fucntion (){
	
	
	$player1 = $("#botplayer .player_deck ul");
	$desk = $("#play_desk .player_deck ul");
	$full_deck = $("#full_deck");
 
 
	var info1 = $("<div></br>Уровень 1</br>Воин</br>Жизнь 5</br>Cила 3</br>Броня 2</br></div>");
	var pinfo1 = $("#player_1 .avatar");
	appendTooltip(pinfo1, info1);
	var info2 = $("<div>Horaghorn</br>Уровень 3</br>Воин</br>Жизнь 8</br>Cила 9</br>Броня 3</br></div>");
	var pinfo2 = $("#player_2 .avatar");
	appendTooltip(pinfo2, info2);
})
*/

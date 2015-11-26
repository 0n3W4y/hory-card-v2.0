//spades - Магический Урон, //cross - Добавление к защите, //hearts - Лечение, //diamonds - Физический урон
var cardsDeck ={
 numbers : [2,3,4,5,6,7,8,9,10,11,12,13,14],
 types : [ "spades", "cross", "hearts", "diamonds" ],
 costs : {2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 2, 12: 20, 13: 4, 14: 11}
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
};


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
	this.current = {
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
  this.playerType = null;
  },
  
  givecardtobattle: function(){ // передача выбранной карты в бой

   if (checkCard(this.battleDeck[this.battleDeck.length - 1], selectedCard)){
   this.battleDeck.push(selectedCard);
   var a = this.deck.indexOf(selectedCard);
   this.deck.splice(a, 1); //обязательное удаление карты из руки игрока.
   }else{
	   alert( "karta ne podhodit" );
	   // подсвечиваем карту красненьким.
	   // выдаем быстрое сообщение игроку - что не подходит карта.
   }
  },
  
  checkCard: function(lastcard, newcard){
	  if (lastcard[0] == necard[0] || lastcard[1] == newcard[1]){
		  return true;
	  }else{
		  return false;
	  }
  },
  
 _traits: [Inventory, Stats],
 
});

var Battleground = $.klass({ // класс для полебоя
	init: function (name, timer, cards, cardsEveryTurn, enemy, player){
	this.name = name;
	this.deck = null;
	this.historyDeck = null;
	this.timer = timer;
	this.cards = cards;
	this.player = player;
	this.enemy = enemy;
	this.cardsEveryTurn = cardsEveryTurn;
	this.timerId = null;
	},
 
	calculateDamage: function (){ // функция подсчета дамага, пока без мастей и комбо
		var sumArr = [];
		var sum = 0;
		for (var i = 1; i < this.deck.length; i++){ // ставим i=1, что бы он не считал последнюю карту от предыдущего игрока.
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
		
		return sum;
	},
 
	battleStart: function (){	 // начало Игры.
		this.player.deck = [];
		this.enemy.deck = [];
		this.deck = [];
		this.historyDeck = [];
		var firstPlayer;
		if (Math.round(Math.random()*10)){ // выбор первого, кто ходит. // сейчас стоит что Игрок ходит первым, а не бот.
			firstPlayer = this.player;
			
		}else{
			firstPlayer = this.enemy;
		};
		
		this.turnStart(firstPlayer, 0);
	},
 
	battleEnd: function(player){ // конец игры ( вывод сообщений подсчет очков, статистика )
		if (this.player == player){
			alert ( " ВЫ проиграли сражение " );
			
		}else{
			alert ( " ВЫ выйграли сражение " );
		}
	},
 
	turnStart: function (player, damage){ //начало хода для игрока
		player.current.HP = player.current.HP - damage;
		if (player.current.HP <= 0){
			this.battleEnd(player);
			
		}else{
			this.giveCard(player);
			var timer = this.timer;
			this.runTimer(timer , player);
		}

	},
 
	turnEnd: function (player){ // заканчиваем ходигрока
		clearInterval(this.timerId);
		$("#time-left").text(i--);
		if (this.historyDeck.length == 0){ // проверка на 1 ход после начала игры.
			var tempArr = [player.name, [this.deck]]; // создаем массив из хода игрока.
			this.historyDeck = $.merge( this.historyDeck, tempArr ); // совмещаем массивы в итосрии полебоя.
			
		}else{ // проверяем, положил ли игрок какую нибудь карту, перед тем, как окончить свой ход.
			var arrPreviousTurn = [];
			arrPreviousTurn = this.historyDeck[this.historydeck.length -1][1]; // писваиваем во временный массив, массив карт из предыдущего хода.
			
			if (this.deck[this.deck.length - 1] != arrPreviousTurn[arrPreviousTurn.length - 1]){ // проверка, положил ли игрок какую-нибудь карту в свой ход.
				var tempArr = [player.name, [this.deck]]; // создаем массив из хода игрока.
				this.historyDeck = $.merge( this.historyDeck, tempArr ); // совмещаем массивы в иcтории полебоя.
			}else{
				
			}
		}
		
		if (this.deck.length > 1){ // проверяем сколько карт положил игрок.
			this.deck.splice(0, this.deck.length - 1); // если больше 1-ой карты, убираем все, кроме последнего элемента.
			
		}else{
			
		}
		
		var damage = this.calculateDamage();
		if (this.player.playerType == "player"){
			var nextPlayer = this.enemy;
			
		}else{
			var nextPlayer = this.player;
		}
		
		alert( " doshlo do turnEnd(); " + nextPlayer.name );
		//this.turnStart(nextPlayer, damage);
	},
 
	generateCard: function(){
		var a = Math.floor(Math.random() * cardsDeck.numbers.length);
		var b = Math.floor(Math.random() * cardsDeck.types.length);
		return [cardsDeck.numbers[a], cardsDeck.types[b]];
	},
 
	giveCard: function (player) { //раздача карт игроку.
		if (player.deck.length == 0){
			var cards = this.cards;
		
		}else{
			var cards = this.cardEveryTurn;
		}
		
		
		for (var i = 0; i < cards; i++){
			this.addCard(player);
		}
	},
	
	addCard: function(player) {
		var card = this.generateCard();
		player.deck.push(card);
		
		if (player.playerType == "player"){
			var uiCard = "<li class='card' id='" + card.join("_") + "'>" + card + "</li>"; 
			$( uiCard ).appendTo( $("ul.connectedSortable") ).click( function(){
				function test(player, card){
					this.moveCardToBattle(player, card);
				}
				return test.apply(World.battleground, [player, card]);
				});
				
		}else{
				// делаем карту рубашкой вверх, и кладем ее к нему в невидимую деку
			}
	},
	
	moveCardToBattle: function(player, card) {
		var bgSelf = this;
		var cardId = "#" + card.join("_");
		if (checkCard(card)){
			$(cardId).appendTo( $("ul.bd_connected")).unbind("click");
			this.deck.push(card);
			var cardToDelete = player.deck.indexOf(card);
			player.deck.splice(cardToDelete, 1); //обязательное удаление карты из руки игрока.
			
		}else{
			$(cardId).effect( 'highlight', { color:'red' }, 800); // подсветить, если карта не подходит.
		}
		function checkCard(card){
			if (bgSelf.deck.length == 0){
				return true;
			}else{
				if (card[0] == bgSelf.deck[bgSelf.deck.length - 1][0] || card[1] == bgSelf.deck[bgSelf.deck.length - 1][1]){
					return true;
			
				}else{
					return false;
				}
			alert( "4to-to poshlo ne tak" );
			return false;
			}
		}
	},
 
	runTimer: function(timer, player){
		var bgSelf = this;
		var i = timer;
		this.timerId = setInterval(function(){
			if (i >= 0){
			$("#time-left").text(i--);
			
			}else{
			clearInterval(bgSelf.timerId);
			bgSelf.turnEnd(player);
			}
		}, 1000);
	}

  
});


var World = {
	name : "world",
	battleground: null,
	player: null,
	enemy: null,
	
	closeModalWindow: function(){
		$('#overlay').css('display', 'none')
		if (confirm( "Что бы запустить игру, выберите все пункты меню, и нажмите начать игру. \n Обновите окно" )){
			window.location.reload("true");
		}
	},
	
	checkStartForm: function(){
		var name = document.forms.preStart.elements.nickname.value;
		var cards = Math.round(+document.forms.preStart.elements.cards.value);
		var timer = Math.round(+document.forms.preStart.elements.timeturn.value);
		var cardsEveryTurn = +document.forms.preStart.elements.cardeveryturn.value;
		
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
		
		if ( cardsEveryTurn > 4 || cardsEveryTurn <= 0 || (!(isNumeric(cardsEveryTurn))) ){
			alert( cardsEveryTurn + " - не верно, 1 <= число карт за ход < 5" );
			return false;
		}
	
		return this.startBattle();
	},
	
	startBattle: function(){
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
	
		this.player = new Player(name, race);
		this.player.stats();
		this.player.playerType = "player"
		this.player.stats.HP = 100;
		this.player.current.HP = 100;
		$("div#bottom-playername").html(name);
		$("#bpb-hp span").css("width", "100%");
		$("#bpb-sp span").css("width", "100%");	
		$("#bottomavatar img").attr("src", avatar1);	
	
		// сгенерирую постоянного бота
	
		this.enemy = new Player("Robot", "human");
		this.enemy.stats();
		this.enemy.playerType = "enemy"
		this.enemy.stats.HP = 150;
		this.enemy.stats.SP = 50;
		this.enemy.current.HP = 150;
		this.enemy.current.SP = 50;
		$("div#top-playername").html(this.enemy.name);
		$("#tpb-hp span").css("width", "100%");
		$("#tpb-sp span").css("width", "100%");
		$("#topavatar img").attr("src", "img/c.jpg");	

		
		//закрою окно, выведу что все готово.
		$('#overlay').css('display', 'none');
	
		this.battleground = new Battleground("abyssal crypt", timer, cards, cardsEveryTurn, this.enemy, this.player);
	
	
		this.battleground.battleStart();
	
	},
	
	endBattle: function(){
		
	},
	
	moveCard: function() {
		return this.battleground.moveCardToBattle();
	}
}
$(document).ready(function() {
	
	setTimeout(function(){
		$('#overlay').css('display', 'block');
		$("input.close").attr("onclick", "World.closeModalWindow()");
		$("input.startBattle").attr("onclick", "World.checkStartForm()");
		$("input#turn").attr("onclick", "World.battleground.turnEnd(World.player)");
	}, 1000);
	
});
//spades - Магический Урон, //cross - Добавление к защите, //hearts - Лечение, //diamonds - Физический урон
var cardsDeck ={
 numbers : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
 types : [ "spades", "cross", "hearts", "diamonds" ],
 costs : {1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, 13: 13}
};
var races = {
	human: {STR:5, END:5, AGI:5, INT:5, ATK:5, DEF:5, BR:0, DDG:2, HP:50, MP:50, AP:0, LL:0, HR:0, MR:0, lvlup: {STR:1, END:1, AGI:1, INT:1, ATK:0, DEF:0.25, BR:0, DDG:0, HP:2, MP:2, AP:0, LL:0, HR:0, MR:0} },
}

function getRandomFromArr(arr) { //генератор индексов массива
  return Math.floor(Math.random() * arr.length);
};

function isNumeric(n) { // проверка на число
  return !isNaN(parseFloat(n)) && isFinite(n);
};


//---------------------------------------------

var Inventory = $.trait({ // трейт инвентаря , для заполенния нужно вызвать %name%.inventory();
 inventory: function() {
  this.inventory = {
		character : {
			head: null,
			arms: null,
			torso: null,
			legs: null,
			boots: null
		},
		firtsbag : {},
		secondbag : {},
		thirdbag : {},
		fourthbag : {},
		fifthbag : {}
		}
	}
});

var Stats = $.trait({ // трейт стат, для заполнения нужно вызывать %name%.%race%();
  stats: function () {
    this.stats = {
		STR : null,
		AGI : null,
		END : null,
		INT : null,
		ATK : null,
		DEF : null,
		BR :  null,
		DDG : null,
		HP : null,
		MP : null,
		AP : null, //armor piercing
		LL : null, // life leech
		HR : null, // health recovery
		MR : null // mana recovery
	}
  }
});

var Player = $.klass({
  init: function(name, race, experience, lvl) {  
  this.name = name;
  this.race = race;
  this.experience = experience;
  this.level = lvl;
  this.deck = null;
  this.battleDeck = null;
  this.type = null;
  this.damage = null;
  this.getStats = function(x){
	  var curRace = races.human;
	  if( x == "STR" ){
		  return Math.round( curRace.STR + curRace.lvlup.STR*this.level );
	  }else if( x == "END" ){
		  return Math.round( curRace.END + curRace.lvlup.END*this.level );
	  }else if( x == "AGI" ){
		  return Math.round( curRace.AGI + curRace.lvlup.AGI*this.level );
	  }else if( x == "INT" ){
		  return Math.round( curRace.INT + curRace.lvlup.INT*this.level );
	  }else if( x == "ATK" ){
		  return Math.round( curRace.ATK + curRace.lvlup.ATK*this.level + curRace.STR*this.level/5 );
	  }else if( x == "DEF" ){
		  return Math.round( curRace.DEF + curRace.lvlup.DEF*this.level + curRace.END*this.level/10 );
	  }else if( x == "DDG" ){
		  return Math.round( curRace.DDG + curRace.lvlup.DDG*this.level + curRace.AGI*this.level/10 );
	  }else if( x == "HP" ){
		  return Math.round( curRace.HP + curRace.lvlup.HP*this.level + curRace.END*this.level/5 );
	  }else if( x == "MP" ){
		  return Math.round( curRace.MP + curRace.lvlup.MP*this.level + curRace.INT*this.level/5 );
	  }else if( x == "BR" ){
		  return Math.round( curRace.BR + curRace.lvlup.BR*this.level );
	  }else if( x == "AP" ){
		  return Math.round( curRace.AP + curRace.lvlup.AP*this.level );
	  }else if( x == "LL" ){
		  return Math.round( curRace.LL + curRace.lvlup.LL*this.level );
	  }else if( x == "HR" ){
		  return Math.round( curRace.HR + curRace.lvlup.HR*this.level );
	  }else if( x == "MR" ){
		  return Math.round( curRace.MR + curRace.lvlup.MR*this.level );
	  }else{
		  return null;
	  }
	};
	this.fillStats = function(){
		for(var index in this.stats) { 
			this.stats[index] = this.getStats(index);
		};
	};
  },
 
 _traits: [Inventory, Stats],
 
});

var Battleground = $.klass({ // класс для полебоя
	init: function (name, timer, cards, cardsEveryTurn, enemy, player){
	this.name = name;
	this.historyDeck = null;
	this.timer = timer;
	this.cards = cards;
	this.player = player;
	this.enemy = enemy;
	this.cardsEveryTurn = cardsEveryTurn;
	this.timerId = null;
	this.round = null;
	this.turnCounter = null;
	},
	
	doCombo: function(comboArr, costsArr, player){
		var castCombo = {value:0, stat:0, to:0, effect:"none", value2:"none"}; // effect: AP(armorPiercing), RE(recovery), ADD(add(++)), SU(substract)
		if ( comboArr[0] == "spades" ){
			if ( comboArr[1] == "spades" ){
				if ( comboArr[2] == "spades" ){ // критический урон (х3)
					castCombo.value = Math.round( player.stats.ATK + ((costsArr[1] + costsArr[2])*3)*costsArr[0]/100 );
					castCombo.stat = "HP";
					castCombo.to = "enemy";
				}else if ( comboArr[2] == "diamonds" ){ // критический урон (х2) с использованием маны 
					castCombo.value = Math.round( player.stats.ATK + ((costsArr[1])*2)*costsArr[0]/100 + player.stats.MP + costsArr[2]*costsArr[0]/100 );
					castCombo.stat = "HP";
					castCombo.to = "enemy";
				}else if ( comboArr[2] == "cross" ){ // критический урон (х2) пробивающий броню 
					castCombo.value = Math.round( player.stats.ATK + ((costsArr[1])*2)*costsArr[0]/100 );
					castCombo.stat = "HP";
					castCombo.to = "enemy";
					castCombo.value2 = Math.round( costsArr[2]*costsArr[0]/100);
					castCombo.effect = "AP";
				
				}else{ // критчиеский урон (х2) с вампиризмом
					castCombo.value = Math.round( player.stats.ATK + (costsArr[1]*2)*costsArr[0]/100 );
					castCombo.stat = "HP";
					castCombo.to = "enemy";
					castCombo.value2 = Math.round( costsArr[2]*costsArr[0]/100);
					castCombo.effect = "RE"
				};
				
			}else if( comboArr[1] == "diamonds" ){
				if ( comboArr[2] == "spades" ){ //критический урон (х2) по мане  
					Math.round( (player.stats.ATK + (costsArr[1]*2)) * (costsArr[2]*costsArr[0]/100)/100 );
				
				}else if ( comboArr[2] == "diamonds" ){ // Урон по мане с использованием маны 
					Math.round( (player.stats.ATK + costsArr[1]*costsArr[0]/100 + player.stats.MP + (costsArr[2]*costsArr[0]/100))*costsArr[0]/100 );
				
				}else if ( comboArr[2] == "cross" ){ // урон по мане с пробиванием брони 
					Math.round( (player.stats.ATK + costsArr[1]*costsArr[0]/100)*costsArr[0]/100 );
					Math.round( costsArr[2]*costsArr[0]/100 ); //-DEF
				
				}else{ //урон по мане с вампиризмом overmana не может быть!
					Math.round( (player.stats.ATK + costsArr[1]*costsArr[0]/100)*costsArr[0]/100 );
					Math.round( costsArr[2]*costsArr[0]/100 ); //+MP
				};
				
			}else if( comboArr[1] == "cross" ){
				if ( comboArr[2] == "spades" ){ // уменьшение урона
					 Math.round( player.stats.AGI*((costsArr[1]+costsArr[2])*costsArr[0]/100) );
				}else if ( comboArr[2] == "diamonds" ){
					return 
				}else if ( comboArr[2] == "cross" ){
					return 
				}else{
					return
				};
			}else{
				if ( comboArr[2] == "spades" ){
					return 
				}else if ( comboArr[2] == "diamonds" ){
					return 
				}else if ( comboArr[2] == "cross" ){
					return 
				}else{
					return
				};
			};
		}else if ( comboArr[0] == "diamonds" ){
			if ( comboArr[1] == "spades" ){
				if ( comboArr[2] == "spades" ){
					return 
				}else if ( comboArr[2] == "diamonds" ){
					return 
				}else if ( comboArr[2] == "cross" ){
					return 
				}else{
					return
				};
			}else if( comboArr[1] == "diamonds" ){
				if ( comboArr[2] == "spades" ){
					return 
				}else if ( comboArr[2] == "diamonds" ){
					return 
				}else if ( comboArr[2] == "cross" ){
					return 
				}else{
					return
				};
			}else if( comboArr[1] == "cross" ){
				if ( comboArr[2] == "spades" ){
					return 
				}else if ( comboArr[2] == "diamonds" ){
					return 
				}else if ( comboArr[2] == "cross" ){
					return 
				}else{
					return
				};
			}else{
				if ( comboArr[2] == "spades" ){
					return 
				}else if ( comboArr[2] == "diamonds" ){
					return 
				}else if ( comboArr[2] == "cross" ){
					return 
				}else{
					return
				};
			};
		}else if ( comboArr[0] == "cross" ){
			if ( comboArr[1] == "spades" ){
				if ( comboArr[2] == "spades" ){
					return 
				}else if ( comboArr[2] == "diamonds" ){
					return 
				}else if ( comboArr[2] == "cross" ){
					return 
				}else{
					return
				};
			}else if( comboArr[1] == "diamonds" ){
				if ( comboArr[2] == "spades" ){
					return 
				}else if ( comboArr[2] == "diamonds" ){
					return 
				}else if ( comboArr[2] == "cross" ){
					return 
				}else{
					return
				};
			}else if( comboArr[1] == "cross" ){
				if ( comboArr[2] == "spades" ){
					return 
				}else if ( comboArr[2] == "diamonds" ){
					return 
				}else if ( comboArr[2] == "cross" ){
					return 
				}else{
					return
				};
			}else{
				if ( comboArr[2] == "spades" ){
					return 
				}else if ( comboArr[2] == "diamonds" ){
					return 
				}else if ( comboArr[2] == "cross" ){
					return 
				}else{
					return
				};
			};	
		}else{
			if ( comboArr[1] == "spades" ){
				if ( comboArr[2] == "spades" ){
					return 
				}else if ( comboArr[2] == "diamonds" ){
					return 
				}else if ( comboArr[2] == "cross" ){
					return 
				}else{
					return
				};
			}else if( comboArr[1] == "diamonds" ){
				if ( comboArr[2] == "spades" ){
					return 
				}else if ( comboArr[2] == "diamonds" ){
					return 
				}else if ( comboArr[2] == "cross" ){
					return 
				}else{
					return
				};
			}else if( comboArr[1] == "cross" ){
				if ( comboArr[2] == "spades" ){
					return 
				}else if ( comboArr[2] == "diamonds" ){
					return 
				}else if ( comboArr[2] == "cross" ){
					return 
				}else{
					return
				};
			}else{
				if ( comboArr[2] == "spades" ){
					return 
				}else if ( comboArr[2] == "diamonds" ){
					return 
				}else if ( comboArr[2] == "cross" ){
					return 
				}else{
					return
				};
			};	
		}
	},
	
	calculateDamage: function (player){ // функция подсчета дамага, пока без мастей и комбо
		var cardN1 = player.battleDeck[0]; //1 карта от плеера на полебоя
		var cardN2 = player.battleDeck[1]; //2 карта от плеера на полебоя
		var cardN3 = player.battleDeck[2]; //3 карта от плеера на полебоя
		var costsArr = [cardN1[1], cardN2[1], cardN3[1]]; // делаем массив из достоинств, для последующего сложения
		var comboArr = [cardN1[0], cardN2[0], cardN3[0]]; // делаем массив из мастей, для последующей проверки комбинации
		// складываем достоинства по мастям.
		for (var i = 3; i < player.battleDeck.length; i++){  
			if ( cardN1[0] == player.battleDeck[i][0] ){
				costsArr[0] += player.battleDeck[i][1];
				i++
			}else if( cardN2[0] == player.battleDeck[i][0] ){
				costsArr[1] += player.battleDeck[i][1];
				i++
			}else if( cardN3[0] == player.battleDeck[i][0] ){
				costsArr[2] += player.battleDeck[i][1];
				i++
			}else{
			};
		};
		this.doCombo(comboArr, costsArr, player); // присваиваем значение, в виде объекта {х:у}
		
	},
 
	battleStart: function (){	 // начало Игры.
		var bgSelf = this;
		this.round = 0;

		this.historyDeck = []; // определяем деку истории боя.
		this.giveCard(this.player, this.cards); // раздаем карты игроку
		setTimeout(function() {bgSelf.giveCard(bgSelf.enemy, bgSelf.cards)}, 800); // раздаем карты противнику ( боту )
		
		function rndBoolean(){ // функция определения первого хода.
			var num = Math.random();
			if (Math.round(num)){
				return bgSelf.player;
			}else{
				return bgSelf.enemy;
			}
		};
		
		var firstPlayer = rndBoolean(); // выбираем кто ходит первый.
		setTimeout(function() {bgSelf.roundStart(firstPlayer)}, 1200); // передаем управлениераундами.
	},
 
	battleEnd: function(player){ // конец игры ( вывод сообщений подсчет очков, статистика )
		if (this.player == player){
			alert ( " ВЫ проиграли сражение " );
			
		}else{
			alert ( " ВЫ выйграли сражение " );
		}
	},
	
	roundStart: function(player) {
		this.turnCounter = 0; // обнуляем счетчик.
		var currentRound = "ROUND " + (this.round + 1); // больше на 1 , так как отсчет внутри кода начниается с 0
		$('#overlay2').css('display', 'block');
		$('#overlay2 #player_turn').text(currentRound).animate({opacity: 1}, 1000, function(){ $('#overlay2').css("display", "none"), $('#overlay2 #player_turn').css("opacity", "0.5") });
		var bgSelf = this;
		setTimeout(function(){bgSelf.turnStart(player)},1100);
	},
	
	roundEnd: function(player, nextPlayer){
		if (player.battleDeck[0][0] == "spades"){
			this.calculateDamage(nextPlayer);
			this.calculateDamage(player);
		}else{
			this.calculateDamage(player);
			this.calculateDamage(nextPlayer);
		}
		$("ul#top-battledeck li").appendTo("body").css( "position", "relative").animate({left: "-500px", opacity: "0"}, 800, function(){
			$(this).remove();
			});
		$("ul#bot-battledeck li").appendTo("body").css( "position", "relative").animate({left: "-500px", opacity: "0"}, 800, function(){
			$(this).remove();
			});
		player.battleDeck.length = 0; // чистим боевую деку от прошлых значений.
		nextPlayer.battleDeck.length = 0; // чистим боевую деку от прошлых значений.
		
		if (player.stats.HP <= 0){ // проверка на смерть игрока
			this.battleEnd(player);
		}else{
			if (nextPlayer.stats.HP <= 0){
				this.battleEnd(nextPlayer);
			}else{
				this.turnStart(player); // - а теперь внимание. Почему плеер? ведь он был последним ходящим. Хочу сделать что бы они менялись, Первый раунд ходит первым 1, а во второй раунд ходит первым 2
			}
		}
	},
	
	turnStart: function (player){ //начало хода для игрока
		player.battleDeck.length = 0; // чистим боевую деку от прошлых значений.
		if (player == this.player){ 
			$('#overlay2').css('display', 'block');
			$('#overlay2 #player_turn').text("Ваш ход").animate({opacity: 1}, 2000, function(){ $('#overlay2').css("display", "none"), $('#overlay2 #player_turn').css("opacity", "0.5") });
			$("#turn").removeAttr('disabled');
			//var playerHp = "#" + "bpb-hp span"; 
		}else{
			$('#overlay2').css('display', 'block');
			$('#overlay2 #player_turn').text("Ход противника").animate({opacity: 1}, 2000, function(){ $('#overlay2').css("display", "none"), $('#overlay2 #player_turn').css("opacity", "0.5") });
			$("#turn").attr('disabled','disabled');
			//var playerHp = "#" + "tpb-hp span";
			//var playerMp = "#" + "tpb-mp span";
		}
		//var curHp = ((player.stats.current.HP/player.stats.HP)*100) + "%"; // меняем бар с ХП у текущего игрока.
		//$(playerHp).css("width", curHp);
		//$(playerHp).text(player.stats.current.HP);
		
		this.giveCard(player, this.cardsEveryTurn); // раздаем карты, помеченные как за каждый новый ход.	
		var timer = this.timer; // биндим количество секунд на ход.
		this.runTimer(timer , player); // запускаем таймера хода.
			
		if (player == this.enemy){ // проверяем, является ли текущий игрок ботом
			this.runAi(); // если да - запускаем логику ИИ.
		}
	},
 
	turnEnd: function (player){ // заканчиваем ходигрока
		clearInterval(this.timerId); // чистим таймер, если вдруг конец хода был вызван вручную.
		$("#time-left").text(0); // показываем, что текущее время хода 0.
		if (player.type == "player"){ // маунтим следующего игрока.
			var nextPlayer = this.enemy; // если да, то выбираем следущего игрока как противник ( бот )
			
		}else{
			var nextPlayer = this.player; // если нет - то выбираем игрока.
		}
		// функция взята из мувКартТубатлле, не стал переделывать переменные
		if ( player.battleDeck.length < 3){ // возвращаем карты в деку, если игрок выложил 2 карты или 1 карту вместо 3-х
			for ( var i = 0; i < player.battleDeck.length; i++ ){
				player.deck.push(player.battleDeck[i]);
				var cardId = "." + player.battleDeck[i].join("") + "#" + player.type;
					if (player.type == "enemy"){
						var cardOffset = $(cardId);
						var cardToBattle = $(".invisible").offset();
			
					}else{
						var cardOffset = $(cardId);
						var cardToBattle = $(".connectedSortable").offset();
					}
					var clone = $(cardId).clone();
					clone.appendTo($(cardToBattle)); 
					var cloneOffset = clone.offset();
					clone.remove();	

					$(cardId)
						.appendTo("body")
						.css({ "position" : "absolute", "top" : (cardOffset.top - 5), "left" : (cardOffset.left - 5) })
						.animate({top: cloneOffset.top, left: cloneOffset.left}, 800, function(){
						$(cardId).remove();
						clone.appendTo($(cardToBattle));
						});
			}
		}else{
		}
		
		if (this.turnCounter == 1){
			this.roundEnd(player, nextPlayer);
		}else{
			this.turnStart(nextPlayer); 
			this.turnCounter++;
		}
		
	},
 
	generateCard: function(){ // генерация значений карты.
		var a = Math.floor(Math.random() * cardsDeck.numbers.length);
		var b = Math.floor(Math.random() * cardsDeck.types.length);
		return [cardsDeck.types[b], cardsDeck.numbers[a]];
	},
 
	giveCard: function (player, cards) { //раздача карт игроку.
		for (var i = 0; i < cards; i++){ // генерируем, раздаем.
			this.addCard(player);
		}
	},
	
	addCard: function(player) { //даем карту игроку. // переделать функцию добавления карт, что бы можно было запускать с таймером.
		var bgSelf = this; // маунт себя для функции движения карты в игровую деку.
		var card = this.generateCard(); // генерируем карту.
		
		for (var i = 0; i < 1;){ // делаем проверку, на то, есть ли такая карта у игрока на руках или нет. во избежании повторов и не правильной работы дальнейших функций (!!!)
			if (player.deck.join(",").indexOf(card.join(",")) == -1){
				player.deck.push(card);
				i = 1;
			}else{
				card = this.generateCard();
			}
		}
		var uiCard = "<li class='card " + card.join("") + "' id='" + player.type + "'></li>";
		var fromCardOffset = $("div#full_deck").offset();
		var cloneSuit = $("div#full_deck").clone();
		
		if (player.type == "player"){ // если плеер - делаем *анимацию* и движение карт в его руки.
			cloneSuit.appendTo("body").css({"position": "absolute", "top": fromCardOffset.top, "left": fromCardOffset.left}).animate({top: "660px", left: "560px"}, 800, function(){ $(this).remove()});
			$( uiCard ).appendTo($("ul.connectedSortable")).click( function(){
				bgSelf.moveCardToBattle(player, card);
			});

		}else{
			cloneSuit.appendTo("body").css({"position": "absolute", "top": fromCardOffset.top, "left": fromCardOffset.left}).animate({top: ($("ul.invisible").offset().top - 150), left: ($("ul.invisible").offset().left + 50)}, 800, function(){ $(this).remove()});
			$( uiCard ).appendTo($("ul.invisible"));
			// делаем карту рубашкой вверх, и кладем ее ко врагу ( боту ) в невидимую деку.
			}
	},
	
	moveCardToBattle: function(player, card) { // функция описывающее само перемещение карты в боевую деку.
		var cardId = "." + card.join("") + "#" + player.type;
		if (player.type == "enemy"){
			var cardOffset = $(".invisible").offset();
			var cardToBattle = $("ul#top-battledeck");
			
		}else{
			var cardOffset = $(cardId).offset();
			var cardToBattle = $("ul#bot-battledeck");
		}
		var clone = $(cardId).clone();
		clone.appendTo($(cardToBattle)); 
		var cloneOffset = clone.offset();
		clone.remove();	

		$(cardId)
			.appendTo("body")
			.css({ "position" : "absolute", "top" : (cardOffset.top - 5), "left" : (cardOffset.left - 5) })
			.animate({top: cloneOffset.top, left: cloneOffset.left}, 800, function(){
				$(cardId).remove();
				clone.appendTo($(cardToBattle));
				clone.css("cursor", "default");
			});
		player.battleDeck.push(card); // пушим боевую деку игрока картой.
		var cardToDelete = player.deck.indexOf(card);
		player.deck.splice(cardToDelete, 1); //обязательное удаление карты из руки игрока. (!!!) - то место, когда задвоенные карты делают свою гадкую работу. (!!!)
	},
 
	runTimer: function(timer, player){ // сам таймер хода.
		var bgSelf = this;
		var i = timer;
		this.timerId = setInterval(function(){ // маунтим его в родительский объект, что бы можно было вызвать его остановку в ручную.
			if (i >= 0){
			$("#time-left").text(i--); // показываем количество оставшися секунд, на самом деле на 1 больше дает :)
			
			}else{
			clearInterval(bgSelf.timerId); // чистим таймер, как только секунды закончатся.
			bgSelf.turnEnd(player); // заканчиваем ход игрока ( плеера берет из стака функций ).
			}
		}, 1000);
	},

	runAi: function(){ 
	var bgSelf = this;
	function aiAttack(){
		var attackArr = [];
		var firstCard = searchLear("spades");
		var secondCard = searchLear("cross");
		var thirdCard = searchLear("diamonds");
		var fourthCard = searchLear("herats");
		if (firstCard.length > 2){
			attackArr.push(firstCard[0]);
			attackArr.push(firstCard[1]);
			attackArr.push(firstCard[2]);
		}else if (firstCard.length = 2){
			attackArr.push(firstCard[0]);
			attackArr.push(firstCard[1]);
				if ( secondCard.length > 1){
					attackArr.push(secondCard[0]);
				}else if( thirdCard.length > 1 ){
					attackArr.push(thirdCard[0]);
				}else{
					attackArr.push(fourthCard[0]);
				}
		}else{
			attackArr.push(firstCard[0]);
				if ( secondCard.length > 2){
					attackArr.push(secondCard[0]);
					attackArr.push(secondCard[1]);
				}else if( thirdCard.length > 2 ){
					attackArr.push(thirdCard[0]);
					attackArr.push(thirdCard[1]);
				}else if( fourthCard.length > 2){
					attackArr.push(fourthCard[0]);
					attackArr.push(fourthCard[1]);
				}else{
					var cardsArray = firstCard.concat(secondCard, thirdCard, fourthCard);
					attackArr.push(cardsArray[getRandomFromArr(cardsArray)]);
					attackArr.push(cardsArray[getRandomFromArr(cardsArray)]);
				}
		}
	return attackArr;
	};
	// теоритически нужна функция анализа врага, которая запустит соответствующий ИИ. пока не заморачиваюсь.
	function aiBuff(){}; //дает каст на себя в виде положительных эффектов, которые добавляются к оснвонвым
	function aiDefend(){}; // дает каст н асебя. для восстанолвения исходных значений.
	function aiDestroy(){}; // пытается сделать каст на врага, что бы уменьшить его сильные стороны.
	
	function aiPlay(arr){
			var num = 0;
		if ( num < 3){
			bgSelf.moveCardToBattle(bgSelf.enemy, arr[i]);
			num++;
		}else{
			clearInterval(botTimer);
			bgSelf.turnEnd(bgSelf.enemy);
		}
	}
	if (this.enemy.deck.indexOf("spades") == -1){
		return this.turnEnd(this.enemy);
	}else{
		var attack = aiAttack();
		var botTimer = setInterval(aiPlay, 1000, attack);
	};
	
	function searchLear(lear){ // функиця поиска карты по масти
		var tempArr = [];
		for (var i = 0; i < bgSelf.enemy.deck.length; i++){
			var index = bgSelf.enemy.deck.indexOf(lear, i);
			i = index;
			tempArr.push(bgSelf.enemy.deck[index]);
		};
		tempArr.sort(function (a, b){ return b - a; });
		return tempArr;
	};

	
	/*function aiCheckCard(){ 
			var properCard = [];
			for (var i = 0; i < bgSelf.enemy.deck.length; i++){ 
				var nextCard = bgSelf.enemy.deck[i];
				if (bgSelf.checkCard(nextCard)){ 
					properCard.push(nextCard); 
				}
			}
			if (properCard.length > 0){
				var randomIndex = getRandomFromArr(properCard);
				var chosenCard = properCard[randomIndex];
				bgSelf.moveCardToBattle(bgSelf.enemy, chosenCard);
			}else{
				clearInterval(botTimer);// останавливаем проверку. когда нет подходящих карт.
				bgSelf.turnEnd(bgSelf.enemy);
			}
		};
		var botTimer = setInterval(aiCheckCard, 1200);
	}*/
	}
});


var World = { // то, что знает про все и про всех :)
	name : "world",
	battleground: null,
	player: null,
	enemy: null,
	
	appendTooltip: function(par, elem)
	{
	$(par).hover(
    function() {
      var d = $('<div id="overlay3">');
      d.append(elem);
      d.appendTo('body').fadeIn('fast');
      $('div#overlay3').css({
		'top': $(par).offset().top,
		'left': ($(par).offset().left + 100)
        });
    },
    function () {
      $('div#overlay3').fadeOut('fast', function(){
        //$(this).remove();
      });
    }
	);
	},
	
	
	closeModalWindow: function(){ // модальное окно с начальными опциями игры.
		$('#overlay').css('display', 'none')
		if (confirm( "Что бы запустить игру, выберите все пункты меню, и нажмите начать игру. \n Обновите окно" )){
			window.location.reload("true");
		}
	},
	
	checkStartForm: function(){ // проверка формы, которую нам отправил игрок ( сингл ).
		var name = document.forms.preStart.elements.nickname.value; // имя игрока
		var cards = Math.round(+document.forms.preStart.elements.cards.value); // количество карт в начале игры
		var timer = Math.round(+document.forms.preStart.elements.timeturn.value); // сколько секунд на ход.
		var cardsEveryTurn = +document.forms.preStart.elements.cardeveryturn.value; // количество карт каждый последующий ход.
			// обычные проверки с алертом.
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
	
		return this.startBattle(); // передаем управление функции начинающий бой
	},
	
	startBattle: function(){ // главная функция, которая генерирует боевую деку, и игроков в ней, пока это игрок и бот.
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
	
		this.player = new Player(name, race, 0, 0);
		this.player.stats();
		this.player.fillStats(this.player.lvl);
		this.player.type = "player"
		this.player.deck = []; // определяем массив карт для игрока
		this.player.battleDeck = [];
		$("div#bottom-playername").html(this.player.name);
		$("#bpb-hp span").css("width", "100%");
		$("#bpb-hp span").text(this.player.stats.HP);
		$("#bpb-mp span").css("width", "100%");
		$("#bpb-mp span").text(this.player.stats.MP);		
		$("#bottom-atk").text(this.player.stats.ATK);
		$("#bottom-def").text(this.player.stats.DEF);
		$("#bottomavatar img").attr("src", avatar1);
		$("#bottom-lvl").text(this.player.level);
	
		// сгенерирую постоянного бота
	
		this.enemy = new Player("Robot", "human", 0, Math.round(Math.random()*10));

		this.enemy.stats();
		this.enemy.fillStats();
		this.enemy.type = "enemy"
		this.enemy.deck = []; // определяем массив карт дял противника ( бота )
		this.enemy.battleDeck = [];
		$("div#top-playername").html(this.enemy.name);
		$("#tpb-hp span").css("width", "100%");
		$("#tpb-hp span").text(this.enemy.stats.HP);
		$("#tpb-mp span").css("width", "100%");
		$("#tpb-mp span").text(this.enemy.stats.MP);
		$("#top-atk").text(this.enemy.stats.ATK);
		$("#top-def").text(this.enemy.stats.DEF);
		$("#topavatar img").attr("src", "img/c.jpg");
		$("#top-lvl").text(this.enemy.level);
		
		// подсказка по наведению на аватарку игрока.
		var pinfo = "<div>" + this.player.name + "</br>Уровень: " + this.player.level + "</br> Раса: " + this.player.race +"</br> Жизни: " + this.player.stats.HP + "</br> Дух: " + this.player.stats.MP + "</br></div>";
		var info2 = $(pinfo);
		var einfo = "<div>" + this.enemy.name + "</br>Уровень: " + this.enemy.level + "</br>Раса: " + this.enemy.race +"</br>Жизни: " + this.enemy.stats.HP + "</br>Дух: " + this.enemy.stats.MP + "</br></div>";
		var info1 = $(einfo);
	
		var etool = $("#topavatar");
		var ptool = $("#bottomavatar");
		this.appendTooltip(etool, info1);
		this.appendTooltip(ptool, info2);
		
		//закрою окно, выведу что все готово.
		$('#overlay').css('display', 'none');
		
		// сгенерировал боевую деку
		this.battleground = new Battleground("abyssal crypt", timer, cards, cardsEveryTurn, this.enemy, this.player);
	
		// передал управление боевой деке начать ходы.

		var bgSelf = this;
		setTimeout(function(){bgSelf.battleground.battleStart();}, 1000);
	
	},
	
	endBattle: function(){
		// по идее должна будет запускаться, как только игроку выйдет сообщение о том, что он победил или проиграл.
		// дальше, экспа, лут, и т.п.
	}
	
};

$(document).ready(function() {
	
	$("button.playAgain").click(function(){ window.location.reload("true")} );
	
	$( "#bpb-hp" ).hover(
		function() {
			$( this ).append("<h1 class='tooltip'>" + World.player.stats.HP + "/" + World.player.getStats('HP') + "</h1>");
		},
		function() {
			$( this ).find("h1.tooltip").remove();
		}
	);
	
	


	// запуск самого модального окошка, и маунт кнопок всех.
	setTimeout(function(){
		$('#overlay').css('display', 'block');
		$("input.close").attr("onclick", "World.closeModalWindow()");
		$("input.startBattle").attr("onclick", "World.checkStartForm()"); 
		$("input#turn").attr("onclick", "World.battleground.turnEnd(World.player)");
	}, 1000);
	

});

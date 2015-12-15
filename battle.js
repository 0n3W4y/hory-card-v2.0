//spades - Магический Урон, //cross - Добавление к защите, //hearts - Лечение, //diamonds - Физический урон
var cardsDeck ={
 numbers : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
 types : [ "spades", "cross", "hearts", "diamonds" ],
 costs : {1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, 13: 13}
};
var races = {
	human: {STR:5, END:5, AGI:5, INT:5, ATK:5, DEF:5, BR:0, DDG:2, HP:50, MP:50, lvlup: {STR:1, END:1, AGI:1, INT:1, ATK:0, DEF:0.25, BR:0, DDG:0, HP:2, MP:2} },
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
  this.player.battleDeck = null;
  this.type = null;
  this.getStats = function(x){
	  var curRace = races.human;
	  var curLvl = this.lvl;
	  if( x == "STR" ){
		  return curRace.STR + curRace.lvlup.STR*curLvl;
	  }else if( x == "END" ){
		  return curRace.END + curRace.lvlup.END*curLvl;
	  }else if( x == "AGI" ){
		  return curRace.AGI + curRace.lvlup.AGI*curLvl;
	  }else if( x == "INT" ){
		  return curRace.INT + curRace.lvlup.INT*curLvl;
	  }else if( x == "ATK" ){
		  return curRace.ATK + curRace.lvlup.ATK*curLvl + curRace.STR/5;
	  }else if( x == "DEF" ){
		  return curRace.DEF + curRace.lvlup.DEF*curLvl + curRace.END/10;
	  }else if( x == "DDG" ){
		  return curRace.DDG + curRace.lvlup.DDG*curLvl + curRace.AGI/10;
	  }else if( x == "HP" ){
		  return curRace.HP + curRace.lvlup.HP*curLvl + curRace.END/5;
	  }else if( x == "MP" ){
		  return curRace.MP + curRace.lvlup.MP*curLvl + curRace.INT/5;
	  }else if( x == "BR" ){
		  return curRace.BR + curRace.lvlup.BR*curLvl;
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
	},
	
	doCombo: function(comboArr, costsArr, currentPlayer, nextPlayer){
		var castCombo = {STR:0, AGI:0, END:0, INT:0, ATK:0, DEF:0, BR:0, DDG:0, HP:0, MP:0, DMG:0};
		if ( comboArr[0] == "spades" ){
			if ( comboArr[1] == "spades" ){
				if ( comboArr[2] == "spades" ){ // критический урон (х3)
					Math.round( currentPlayer.stats.ATK + ((costsArr[1] + costsArr[2])*3)*costsArr[0]/100 );
				
				}else if ( comboArr[2] == "diamonds" ){ // критический урон (х2) с использованием маны 
					Math.round( currentPlayer.stats.ATK + ((costsArr[1])*2)*costsArr[0]/100 + currentPlayer.stats.MP + costsArr[2]*costsArr[0]/100 );
				
				}else if ( comboArr[2] == "cross" ){ // критический урон (х2) пробивающий броню 
					Math.round( currentPlayer.stats.ATK + ((costsArr[1])*2)*costsArr[0]/100 );
					Math.round( costsArr[2]*costsArr[0]/100); // -DEF
				
				}else{ // критчиеский урон (х2) с вампиризмом
					Math.round( currentPlayer.stats.ATK + (costsArr[1]*2)*costsArr[0]/100 );
					Math.round( costsArr[2]*costsArr[0]/100); // +selfHP
				};
				
			}else if( comboArr[1] == "diamonds" ){
				if ( comboArr[2] == "spades" ){ //критический урон (х2) по мане  
					Math.round( (currentPlayer.stats.ATK + (costsArr[1]*2)) * (costsArr[2]*costsArr[0]/100)/100 );
				
				}else if ( comboArr[2] == "diamonds" ){ // Урон по мане с использованием маны 
					Math.round( (currentPlayer.stats.ATK + costsArr[1]*costsArr[0]/100 + currentPlayer.stats.MP + (costsArr[2]*costsArr[0]/100))*costsArr[0]/100 );
				
				}else if ( comboArr[2] == "cross" ){ // урон по мане с пробиванием брони 
					Math.round( (currentPlayer.stats.ATK + costsArr[1]*costsArr[0]/100)*costsArr[0]/100 );
					Math.round( costsArr[2]*costsArr[0]/100 ); //-DEF
				
				}else{ //урон по мане с вампиризмом overmana не может быть!
					Math.round( (currentPlayer.stats.ATK + costsArr[1]*costsArr[0]/100)*costsArr[0]/100 );
					Math.round( costsArr[2]*costsArr[0]/100 ); //+MP
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
	
	calculateDamage: function (currentPlayer, nextPlayer){ // функция подсчета дамага, пока без мастей и комбо
		var cardN1 = currentPlayer.battle.deck[0]; //1 карта от плеера на полебоя
		var cardN2 = currentPlayer.battle.deck[1]; //2 карта от плеера на полебоя
		var cardN3 = currentPlayer.battle.deck[2]; //3 карта от плеера на полебоя
		var costsArr = [cardN1[1], cardN2[1], cardN3[1]]; // делаем массив из достоинств, для последующего сложения
		var comboArr = [cardN1[0], cardN2[0], cardN3[0]]; // делаем массив из мастей, для последующей проверки комбинации
		// складываем достоинства по мастям.
		for (var i = 3; i < currentPlayer.battle.deck.length; i++){  
			if ( cardN1[0] == currentPlayer.battle.deck[i][0] ){
				costsArr[0] += currentPlayer.battle.deck[i][1];
				i++
			}else if( cardN2[0] == currentPlayer.battle.deck[i][0] ){
				costsArr[1] += currentPlayer.battle.deck[i][1];
				i++
			}else if( cardN3[0] == currentPlayer.battle.deck[i][0] ){
				costsArr[2] += currentPlayer.battle.deck[i][1];
				i++
			}else{
			};
		};
		var playerDone = this.doCombo(comboArr, costsArr, currentPlayer, nextPlayer);
		
	},
 
	battleStart: function (){	 // начало Игры.
		var bgSelf = this;
		this.round = 0;
		this.player.deck = []; // определяем массив карт для игрока
		this.player.battleDeck = [];
		this.enemy.deck = []; // определяем массив карт дял противника ( бота )
		this.enemy.battleDeck = [];
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
	
	roundStart: function(firstPlayer) {
		var currentRound = "ROUND " + (this.round + 1); // больше на 1 , так как отсчет внутри кода начниается с 0
		$('#overlay2').css('display', 'block');
		$('#overlay2 #player_turn').text(currentRound).animate({opacity: 1}, 2000, function(){ $('#overlay2').css("display", "none"), $('#overlay2 #player_turn').css("opacity", "0.5") });
		this.turnStarts(firstplayer);
	},
	
	roundEnd: function(){
		this.round++
	},
	
	turnStart: function (player){ //начало хода для игрока
		if (player == this.player){ // выбираем кому менять бар с ХП
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
		player.stats.current.HP = player.stats.current.HP - damage; // вычитаем дамага.
		var curHp = ((player.stats.current.HP/player.stats.HP)*100) + "%"; // меняем бар с ХП у текущего игрока.
		$(playerHp).css("width", curHp);
		$(playerHp).text(player.stats.current.HP);
		
		if (player.stats.current.HP <= 0){ // проверяем помер ли текущий плеер.
			this.battleEnd(player); // если да - заканчиваем,
			
		}else{ // если нет - продолжаем играть.
			if (this.deck.length != 0){
				this.giveCard(player, this.cardsEveryTurn); // раздаем карты, помеченные как за каждый новый ход.
				
			}else{
			}
			
			var timer = this.timer; // биндим количество секунд на ход.
			this.runTimer(timer , player); // запускаем таймера хода.
			
			if (player == this.enemy){ // проверяем, является ли текущий игрок ботом
				this.runAi(); // если да - запускаем логику ИИ.
			}

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
		var arrUiCardsToDelete = this.deck;
		var tempArr; 
		var ptp; // previousTurnPlayer
		
		if (this.historyDeck.length == 0){ // проверка на 1 ход после начала игры.
			tempArr = [player.type, player.name, [this.deck]]; // создаем массив из предыдущего хода игрока, накопленный в боевой деке
			this.historyDeck.push(tempArr); // совмещаем массивы в итосрии полебоя.
			var damage = this.calculateDamage(); // считаем дамаг.
			
			for (var i = 0; i < this.deck.length - 1; i++){ // убираем лишние карты из боевой деки.
				var cardId = "ul.bd_connected li." + this.deck[i].join("");
				$(cardId).css("position", "relative").animate({left: "-350px", opacity: "0"}, 1500, function(){
				$(this).remove();
				});
			};
			
			this.deck.splice(0, this.deck.length - 1); // убираем все, кроме последнего элемента.
			this.turnStart(nextPlayer, damage); // предаем управление функции старта нового хода, с передачей нового игрока и дамага прилетевшего ему.
			
		}else{
			ptp = this.historyDeck[this.historyDeck.length -1][2]; // писваиваем во временный массив, ход предыдущего игрока.
			//и проверяем, ходил ли игрок, или пропустил ход.
			if( [this.deck[this.deck.length - 1]][0] == ptp[ptp.length - 1][0] && [this.deck[this.deck.length - 1]][1] == ptp[ptp.length - 1][1]){
				this.turnStart(nextPlayer, 0);
				
			}else{
				for (var i = 0; i < this.deck.length - 1; i++){ // функция для ui !
					var cardId = "ul.bd_connected li." + this.deck[i].join("");
					$(cardId).css("position", "relative").animate({left: "-150px", opacity: "0"}, 1500, function(){
					$(this).remove();
					});
				};
				
				this.deck.splice(0, 1); // убираем карту от предыдущего игрока.
				tempArr = [player.type, player.name, [this.deck]]; // создаем массив из предыдущего хода игрока, накопленный в боевой деке
				this.historyDeck.push(tempArr); // совмещаем массивы в итосрии полебоя.
				var damage = this.calculateDamage(); // считаем дамаг.
				this.deck.splice(0, this.deck.length - 1); // убираем все, кроме последнего элемента.
				this.turnStart(nextPlayer, damage); // предаем управление функции старта нового хода, с передачей нового игрока и дамага прилетевшего ему.
			}
		}		
	},
 
	generateCard: function(){ // генерация значений карты.
		var a = Math.floor(Math.random() * cardsDeck.numbers.length);
		var b = Math.floor(Math.random() * cardsDeck.types.length);
		return [cardsDeck.types[b], cardsDeck.numbers[a]];
	},
 
	giveCard: function (player, cards) { //раздача карт игроку.
		var bgSelf = this;
		for (var i = 0; i < cards; i++){ // генерируем, раздаем.
			setTimeout(function() {bgSelf.addCard(player)}, 900);
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
		if (this.checkCard(card)){
			if (player.type == "enemy"){
				var cardOffset = $(".invisible").offset();
			}else{
				var cardOffset = $(cardId).offset();
			}
			var clone = $(cardId).clone();
			
			if( $("ul.bd_connected li").length == 0){ // обратить внимание <----------
				clone.appendTo($("ul.bd_connected")); 
			}else{
				clone.insertBefore($("ul.bd_connected li:first"));
			}
			
			var cloneOffset = clone.offset();
			clone.remove();	

			$(cardId)
				.appendTo("body")
				.css({ "position" : "absolute", "top" : (cardOffset.top - 5), "left" : (cardOffset.left - 5) })
				.animate({top: cloneOffset.top, left: cloneOffset.left}, 800, function(){
					$(cardId).remove();
					if( $("ul.bd_connected li:first").length == 0){
						clone.appendTo($("ul.bd_connected"));
					}else{
						clone.insertBefore($("ul.bd_connected li:first"));
					}
					clone.css("cursor", "default");
				});
			this.deck.push(card); // пушим боевую деку картой.
			var cardToDelete = player.deck.indexOf(card);
			player.deck.splice(cardToDelete, 1); //обязательное удаление карты из руки игрока. (!!!) - то место, когда задвоенные карты делают свою гадкую работу. (!!!)
			
		}else{
			$(cardId).effect( 'highlight', { color:'red' }, 800); // подсветить, если карта не подходит.
		}
	},
	
	checkCard: function(card){ // проверка можно ли положить эту карту.
		if (this.deck.length == 0){ // если боевая дека пустая ( самый первый ход )
			return true;
		}else{
			if (card[0] == this.deck[this.deck.length - 1][0] || card[1] == this.deck[this.deck.length - 1][1]){ // проверка содержимого карты и боевой деки.
				return true;
			
			}else{
				return false;
			}
		}
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

	runAi: function(){ // простенький бот.
	var bgSelf = this;
	function aiCheckCard(){ // функция првоерки карт
			var properCard = [];
			for (var i = 0; i < bgSelf.enemy.deck.length; i++){ 
				var nextCard = bgSelf.enemy.deck[i];
				if (bgSelf.checkCard(nextCard)){ // проверка возможности положить карту в боевую деку
					properCard.push(nextCard); // добавляем карту во временный массив подходящих карт.
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
		this.player.fillStats();
		this.player.type = "player"
		$("div#bottom-playername").html(name);
		$("#bpb-hp span").css("width", "100%");
		$("#bpb-hp span").text(this.player.stats.HP);
		$("#bpb-sp span").css("width", "100%");
		$("#bpb-sp span").text(this.player.stats.MP);		
		$("#bottom-atk").text(this.player.stats.ATK);
		$("#bottom-def").text(this.player.stats.DEF);
		$("#bottomavatar img").attr("src", avatar1);	
	
		// сгенерирую постоянного бота
	
		this.enemy = new Player("Robot", "human", 0, 0);
		this.enemy.stats();
		this.enemy.fillStats();
		this.enemy.type = "enemy"
		this.enemy.lvl = Math.round(Math.random()*10); // дам боту рандомный уровень от 1 до 10,
		$("div#top-playername").html(this.enemy.name);
		$("#tpb-hp span").css("width", "100%");
		$("#tpb-hp span").text(this.enemy.stats.HP);
		$("#tpb-sp span").css("width", "100%");
		$("#tpb-sp span").text(this.enemy.stats.MP);
		$("#top-atk").text(this.enemy.stats.ATK);
		$("#top-def").text(this.enemy.stats.DEF);
		$("#topavatar img").attr("src", "img/c.jpg");	

		// подсказка по наведению на аватарку игрока.
		var pinfo = "<div> Имя: " + this.player.name + "</br>Уровень: " + this.player.level + "</br> Раса: " + this.player.race +"</br> Жизни: " + this.player.stats.HP + "</br> Дух: " + this.player.stats.STR + "</br></div>";
		var info2 = $(pinfo);
		var einfo = "<div>Имя: " + this.enemy.name + "</br>Уровень: " + this.enemy.level + "</br>Раса: " + this.enemy.race +"</br>Жизни: " + this.enemy.stats.HP + "</br>Дух: " + this.enemy.stats.STR + "</br></div>";
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
			$( this ).append("<h1 class='tooltip'> 100/100 </h1>");
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

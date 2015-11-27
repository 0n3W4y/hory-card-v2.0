//spades - Магический Урон, //cross - Добавление к защите, //hearts - Лечение, //diamonds - Физический урон
var cardsDeck ={
 numbers : [2,3,4,5,6,7,8,9,10,11,12,13,14],
 types : [ "spades", "cross", "hearts", "diamonds" ],
 costs : {2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 2, 12: 20, 13: 4, 14: 11}
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
  this.playerType = null;
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
		for (var i = 0; i < this.deck.length; i++){ // 
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
		this.player.deck = []; // определяем массив карт для игрока
		this.enemy.deck = []; // определяем массив карт дял противника ( бота )
		this.deck = []; // определяем боевую деку.
		this.historyDeck = []; // определяем деку истории боя.
		
		var tempCards = this.cardsEveryTurn; // сохраняем значение карт каждый ход.
		this.cardsEveryTurn = this.cards; // присваиваем значение количество карт в начале игры.
		this.giveCard(this.player); // раздаем карты игроку
		this.giveCard(this.enemy); // раздаем карты противнику ( боту )
		this.cardsEveryTurn = tempCards; // возвращаяем значение карт каждый ход.
		
		var bgSelf = this;
		function rndBoolean(){ // функция определения первого хода.
			var num = Math.random();
			if (Math.round(num)){
				return bgSelf.player;
			}else{
				return bgSelf.enemy;
			}
		};
		
		var firstPlayer = rndBoolean(); // даем игроку первому ходить.
		this.turnStart(firstPlayer, 0); // стартуем матч, с 0-вым дамагом.
	},
 
	battleEnd: function(player){ // конец игры ( вывод сообщений подсчет очков, статистика )
		if (this.player == player){
			alert ( " ВЫ проиграли сражение " );
			
		}else{
			alert ( " ВЫ выйграли сражение " );
		}
	},
 
	turnStart: function (player, damage){ //начало хода для игрока
		if (player == this.player){ // выбираем кому менять бар с ХП
			$("#turn_player").show().delay(5000).fadeOut(); // не работает! :(
			var playerBar = "#" + "bpb-hp span"; 
		}else{
			$("#turn_enemy").show().delay(5000).fadeOut();
			var playerBar = "#" + "tpb-hp span";
		}
		player.current.HP = player.current.HP - damage; // вычитаем дамага.
		if (player.current.HP <= 0){ // проверяем помер ли текущий плеер.
			this.battleEnd(player); // если да - заканчиваем,
			
		}else{ // если нет - продолжаем играть.
			var curHp = ((player.current.HP/player.stats.HP)*100) + "%"; // меняем бар с ХП у текущего игрока.
			$(playerBar).css("width", curHp);
			this.giveCard(player); // раздаем карты, помеченные как за каждый новый ход.
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
		if (player.playerType == "player"){ // маунтим следующего игрока.
			var nextPlayer = this.enemy; // если да, то выбираем следущего игрока как противник ( бот )
			
		}else{
			var nextPlayer = this.player; // если нет - то выбираем игрока.
		}
		
		var tempArr; 
		var ptp; // previousTurnPlayer
		
		if (this.historyDeck.length == 0){ // проверка на 1 ход после начала игры.
			tempArr = [player.playerType, player.name, [this.deck]]; // создаем массив из предыдущего хода игрока, накопленный в боевой деке
			this.historyDeck.push(tempArr); // совмещаем массивы в итосрии полебоя.
			var damage = this.calculateDamage(); // считаем дамаг.
			this.deck.splice(0, this.deck.length - 1); // убираем все, кроме последнего элемента.
			// функция удаления карты из боевой деки для ui (!)
			this.turnStart(nextPlayer, damage); // предаем управление функции старта нового хода, с передачей нового игрока и дамага прилетевшего ему.
			
		}else{
			ptp = this.historyDeck[this.historyDeck.length -1][2]; // писваиваем во временный массив, ход предыдущего игрока.
			if( [this.deck[this.deck.length - 1]][0] == ptp[ptp.length - 1][0] && [this.deck[this.deck.length - 1]][1] == ptp[ptp.length - 1][1]){
				this.turnStart(nextPlayer, 0);
			}else{
				this.deck.splice(0, 1); // убираем карту от предыдущего игрока.
				tempArr = [player.playerType, player.name, [this.deck]]; // создаем массив из предыдущего хода игрока, накопленный в боевой деке
				this.historyDeck.push(tempArr); // совмещаем массивы в итосрии полебоя.
				var damage = this.calculateDamage(); // считаем дамаг.
				this.deck.splice(0, this.deck.length - 1); // убираем все, кроме последнего элемента.
				// функция удаления карты из боевой деки для ui (!)
				this.turnStart(nextPlayer, damage); // предаем управление функции старта нового хода, с передачей нового игрока и дамага прилетевшего ему.
			}
		}		
	},
 
	generateCard: function(){ // генерация значений карты.
		var a = Math.floor(Math.random() * cardsDeck.numbers.length);
		var b = Math.floor(Math.random() * cardsDeck.types.length);
		return [cardsDeck.numbers[a], cardsDeck.types[b]];
	},
 
	giveCard: function (player) { //раздача карт игроку.
		var cards = this.cardsEveryTurn; // говорим, что количество карт - это количество карт за каждый ход.
		
		for (var i = 0; i < cards; i++){ // генерируем, раздаем.
			this.addCard(player);
		}
	},
	
	addCard: function(player) { //даем карту игроку.
		var bgSelf = this; // маунт себя для функции движения карты в игровую деку.
		var card = this.generateCard(); // генерируем карту.
		
		for (var i = 0; i < 1;){ // делаем проверку, на то, есть ли такая карта у игрока на руках или нет. во избежании повторов и не правильной работы дальнейших функций (!!!)
			if (player.deck.indexOf(card) == -1){
				player.deck.push(card);
				i = 1;
			}else{
				card = this.generateCard();
			}
		}
		
		if (player.playerType == "player"){ // если плеер - делаем *анимацию* и движение карт в его руки.
			var uiCard = "<li class='card' id='" + card.join("_") + "'>" + card + "</li>"; 
			$( uiCard ).appendTo( $("ul.connectedSortable") ).click( function(){
					bgSelf.moveCardToBattle(player, card);
				});
				
		}else{
				// делаем карту рубашкой вверх, и кладем ее ко врагу ( боту ) в невидимую деку.
			}
	},
	
	moveCardToBattle: function(player, card) { // функция описывающее само перемещение карты в боевую деку.
		var cardId = "#" + card.join("_");
		if (this.checkCard(card)){
			$(cardId).appendTo( $("ul.bd_connected")).unbind("click"); // добавляем ui карту в боевую деку
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
		var properCard = [];
		var bgSelf = this; // мантим себя, для функции внутренней проверки подходящих карт бота.
		function aiCheckCard(){ // функция првоерки карт
			properCard.length = 0;
			for (var i = 0; i < bgSelf.enemy.deck.length; i++){ 
				var nextCard = bgSelf.enemy.deck[i];
				if (bgSelf.checkCard(nextCard)){ // проверка возможности положить карту в боевую деку
					properCard.push(nextCard); // добавляем карту во временный массив подходящих карт.
				}
			}
		};
		
		for (var j = 0; j < 1;){ // делаем по кругу, что бы бот мог класть не по 1 карте, а столько, сколько может :D 
			aiCheckCard();
			if (properCard.length > 0){
				var randomIndex = getRandomFromArr(properCard);
				var chosenCard = properCard[randomIndex];
				var uiCard = "<li class='card' id='" + chosenCard.join("_") + "'>" + chosenCard + "</li>"; 
				$( uiCard ).appendTo( $("ul.bd_connected") );
				this.deck.push(chosenCard);
				this.enemy.deck.splice(this.enemy.deck.indexOf(chosenCard), 1);
			}else{
				j++ // останавливаем проверку. когда нет подходящих карт.
			}
		}
		
		this.turnEnd(this.enemy); // передеаем управление функции заканчивающей ход, с параметром того, что бот закончил ход.
	}
	
});


var World = { // то, что знает про все и про всех :)
	name : "world",
	battleground: null,
	player: null,
	enemy: null,
	
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
		
		// сгенерировал боевую деку
		this.battleground = new Battleground("abyssal crypt", timer, cards, cardsEveryTurn, this.enemy, this.player);
	
		// передал управление боевой деке начать ходы.
		this.battleground.battleStart();
	
	},
	
	endBattle: function(){
		// по идее должна будет запускаться, как только игроку выйдет сообщение о том, что он победил или проиграл.
		// дальше, экспа, лут, и т.п.
	}
	
};

$(document).ready(function() {
	// запуск самого модального окошка, и маунт кнопок всех.
	setTimeout(function(){
		$('#overlay').css('display', 'block');
		$("input.close").attr("onclick", "World.closeModalWindow()");
		$("input.startBattle").attr("onclick", "World.checkStartForm()"); // работает не правлиьно. подправь пожалуйста, что бы обновляла всю страницу.
		$("input#turn").attr("onclick", "World.battleground.turnEnd(World.player)");
	}, 1000);
	
});
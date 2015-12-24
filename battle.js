//spades - Магический Урон, //cross - Добавление к защите, //hearts - Лечение, //diamonds - Физический урон
var cardsDeck ={
 numbers : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
 types : [ "spades", "cross", "hearts", "diamonds" ],
 costs : {1: 14, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, 13: 13}
};
var races = {
	human: {STR:5, END:5, AGI:5, INT:5, ATK:5, DEF:5, BR:0, DDG:2, HP:50, MP:50, AP:1, LL:1, HR:1, MR:1, lvlup:
		{STR:1, END:1, AGI:1, INT:1, ATK:0, DEF:0.25, BR:0, DDG:0, HP:2, MP:2, AP:0, LL:0, HR:0, MR:0} },
		
	elf: {STR:4, END:4, AGI:6, INT:6, ATK:4, DEF:4, BR:0, DDG:2, HP:40, MP:60, AP:1, LL:1, HR:1, MR:1, lvlup:
		{STR:0.75, END:1.25, AGI:1, INT:1, ATK:0, DEF:0.25, BR:0, DDG:0.25, HP:1.75, MP:2.25, AP:0, LL:0, HR:0, MR:0} },
		
	troll: {STR:10, END:10, AGI:1, INT:1, ATK:5, DEF:1, BR:0, DDG:0, HP:90, MP:20, AP:1, LL:1, HR:2, MR:1, lvlup: 
		{STR:2, END:2, AGI:0.25, INT:0.25, ATK:0, DEF:0, BR:0, DDG:0, HP:3, MP:0.5, AP:0, LL:0, HR:0, MR:0} },
		
	orc: {STR:9, END:7, AGI:2, INT:2, ATK:6, DEF:3, BR:0, DDG:3, HP:80, MP:20, AP:1, LL:1, HR:1, MR:1, lvlup: 
		{STR:1.75, END:1.75, AGI:0.25, INT:0.25, ATK:0, DEF:0.25, BR:0, DDG:0, HP:2.5, MP:0.5, AP:0, LL:0, HR:0, MR:0} },
		
	werewolf: {STR:7, END:7, AGI:4, INT:2, ATK:6, DEF:2, BR:0, DDG:4, HP:70, MP:30, AP:2, LL:1, HR:1, MR:1, lvlup: 
		{STR:1.75, END:1.5, AGI:0.5, INT:0.5, ATK:0, DEF:0.25, BR:0, DDG:0, HP:2.5, MP:0.5, AP:0, LL:0, HR:0, MR:0} },
		
	dwarf: {STR:9, END:7, AGI:3, INT:1, ATK:6, DEF:6, BR:0, DDG:0, HP:80, MP:20, AP:1, LL:1, HR:1, MR:1, lvlup: 
		{STR:1.5, END:1.5, AGI:0.75, INT:0.25, ATK:0, DEF:0.25, BR:0, DDG:0, HP:2.75, MP:0.75, AP:0, LL:0, HR:0, MR:0} },
		
	goblin: {STR:6, END:4, AGI:6, INT:4, ATK:4, DEF:2, BR:0, DDG:0, HP:60, MP:40, AP:1, LL:1, HR:1, MR:1, lvlup: 
		{STR:1, END:0.75, AGI:1.25, INT:0.75, ATK:0, DEF:0.25, BR:0, DDG:0, HP:1.75, MP:2, AP:0, LL:0, HR:0, MR:0} },
		
	gnome: {STR:3, END:3, AGI:7, INT:8, ATK:4, DEF:2, BR:0, DDG:0, HP:30, MP:70, AP:1, LL:1, HR:1, MR:2, lvlup: 
		{STR:0.75, END:0.75, AGI:1.25, INT:1.5, ATK:0, DEF:0.25, BR:0, DDG:0, HP:1.5, MP:2.5, AP:0, LL:0, HR:0, MR:0} },
		
	vampire: {STR:6, END:6, AGI:4, INT:4, ATK:5, DEF:3, BR:0, DDG:0, HP:50, MP:50, AP:1, LL:2, HR:1, MR:1, lvlup: 
		{STR:0.75, END:1, AGI:1, INT:1.25, ATK:0, DEF:0.25, BR:0, DDG:0, HP:1.5, MP:1.75, AP:0, LL:0, HR:0, MR:0} }
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
  this.id = null;
  this.damage = null;
  this.getStats = function(x){
		var curRace = races[this.race];
	  if( x == "STR" || x == "END" || x == "AGI" || x == "INT" ){
		  return Math.round( curRace[x] + curRace.lvlup[x]*this.level );
	  }else if( x == "ATK" ){
		  return Math.round( curRace.ATK + curRace.lvlup.ATK*this.level + curRace.STR*this.level/2 );
	  }else if( x == "DEF" ){
		  return Math.round( curRace.DEF + curRace.lvlup.DEF*this.level + curRace.END*this.level/10 );
	  }else if( x == "DDG" ){
		  return Math.round( curRace.DDG + curRace.lvlup.DDG*this.level + curRace.AGI*this.level/10 );
	  }else if( x == "HP" || x == "MP"){
		  return Math.round( curRace[x] + curRace.lvlup[x]*this.level + curRace.END*this.level/5 );
	  }else if( x == "BR" || x == "AP" || x == "LL" || x == "HR" || x == "MR"){
		  return Math.round( curRace[x] + curRace.lvlup[x]*this.level );
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
	this.turnQueue = null;
	},
	
	findCombo: function(player){
		var card1cost = player.battleDeck[0][1];
		var card2cost = player.battleDeck[1][1];
		var card3cost = player.battleDeck[2][1];
		var card1lear = player.battleDeck[0][0];
		var card2lear = player.battleDeck[1][0];
		var card3lear = player.battleDeck[2][0];
		var comboArrayCosts = [card1cost, card2cost, card3cost];
		var comboArrayLear = [card1lear, card2lear, card3lear];
		for (var j = 3; j < player.battleDeck.length; j++){
			if( player.battleDeck[j][0] == card1lear){
				comboArrayCosts[0] += player.battleDeck[j][1];
			}else if( player.battleDeck[j][0] == card2lear ){
				comboArrayCosts[1] += player.battleDeck[j][1];
			}else{
				comboArrayCosts[2] += player.battleDeck[j][1];
			}
		}
		return this.doCombo( comboArrayLear, comboArrayCosts, player );
	},
	
	doCombo: function(comboArr, costsArr, player){
		//обратить внимание сюда - castCombo  - то, что мы возвращаем в переменую player.damage, для дальнейшего использования.
		var castCombo = {value:0, stat:null, to:null, value2:0, effect:null, value3:0, effect2:null, info:null}; // effect: AP(armorPiercing), RE(restore), ADD(add(++)), SU(substract)
		if ( comboArr[0] == "spades" ){
			if ( comboArr[1] == "spades" ){
				if ( comboArr[2] == "spades" ){ // критический урон (х3)
					castCombo.value = player.stats.ATK + ((costsArr[1] + costsArr[2])*3)*costsArr[0]/100;
					castCombo.stat = "HP";
					castCombo.to = "enemy";
					castCombo.info = "Критический урон (х3)";
					
				}else if ( comboArr[2] == "diamonds" ){ // критический урон (х2) с использованием маны 
					castCombo.value = player.stats.ATK + ((costsArr[1])*2) + (player.stats.MP*costsArr[2]/10)*costsArr[0]/100;
					castCombo.stat = "HP";
					castCombo.to = "enemy";
					castCombo.info = "критический урон (х2) с использованием маны";
					
				}else if ( comboArr[2] == "cross" ){ // критический урон (х2) пробивающий броню 
					castCombo.value = player.stats.ATK + ((costsArr[1])*2)*costsArr[0]/100;
					castCombo.stat = "HP";
					castCombo.to = "enemy";
					castCombo.value2 = costsArr[2]*costsArr[0]/100;
					castCombo.effect = "AP";
					castCombo.info = "критический урон (х2) пробивающий броню";
				
				}else{ // критчиеский урон (х2) с вампиризмом
					castCombo.value = player.stats.ATK + (costsArr[1]*2)*costsArr[0]/100;
					castCombo.stat = "HP";
					castCombo.to = "enemy";
					castCombo.value2 = player.stats.ATK*costsArr[2]/100;
					castCombo.effect = "RE";
					castCombo.info = "критчиеский урон (х2) с вампиризмом";
				};
				
			}else if( comboArr[1] == "diamonds" ){
				if ( comboArr[2] == "spades" ){ // урон (х2)  по мане  
					castCombo.value = player.stats.ATK + ((costsArr[2]*2)*costsArr[0]/100)*costsArr[2]/100;
					castCombo.stat = "MP";
					castCombo.effect = "SU";
					castCombo.to = "enemy";
					castCombo.info = "урон (х2)  по мане";
					
				}else if ( comboArr[2] == "diamonds" ){ // Урон по мане с использованием маны 
					castCombo.value = player.stats.ATK + costsArr[1] + (player.stats.MP*costsArr[2]/10)*costsArr[0]/100;
					castCombo.stat = "MP";
					castCombo.effect = "SU";
					castCombo.to = "enemy";
					castCombo.info = "урон по мане с использованием маны";
					
				}else if ( comboArr[2] == "cross" ){ // урон по мане с пробиванием брони 
					castCombo.value = player.stats.ATK + costsArr[1]*costsArr[0]/100;
					castCombo.stat = "MP";
					castCombo.to = "enemy";
					castCombo.value2 = costsArr[2]*costsArr[0]/100;
					castCombo.effect2 = "AP";
					castCombo.effect = "SU";
					castCombo.info = "урон по мане с пробиванием брони";
				
				}else{ //урон по мане с вампиризмом overmana не может быть!
					castCombo.value = player.stats.ATK + costsArr[1]*costsArr[0]/100 ;
					castCombo.stat = "MP";
					castCombo.to = "enemy";
					castCombo.value2 = player.stats.ATK*costsArr[2]*costsArr[0]/100;
					castCombo.effect2 = "RE";
					castCombo.effect = "SU";
					castCombo.info = "урон по мане с вампиризмом";
				};
				
			}else if( comboArr[1] == "cross" ){
				if ( comboArr[2] == "spades" ){ // бронебойный (х2) урон
					castCombo.value =  player.stats.ATK + costsArr[2]*costsArr[0]/100; 
					castCombo.stat = "HP";
					castCombo.to = "enemy";
					castCombo.value2 = (costsArr[1]*2)*costsArr[0]/100;
					castCombo.effect = "AP";
					castCombo.info = "бронебойный (х2) урон";
					
				}else if ( comboArr[2] == "diamonds" ){ // бронебойный (х2) урон с использованием маны
					castCombo.value = player.stats.ATK + (player.stats.MP*costsArr[2])*costsArr[0]/100; 
					castCombo.stat = "HP";
					castCombo.to = "enemy";
					castCombo.value2 = (costsArr[1]*2)*costsArr[0]/100;
					castCombo.effect = "AP";
					castCombo.info = "бронебойный (х2) урон с использованием маны";
					
				}else if ( comboArr[2] == "cross" ){ // бронебойный (х3) урон.
					castCombo.value = player.stats.ATK;
					castCombo.stat = "HP";
					castCombo.to = "enemy";
					castCombo.value2 = (costsArr[1]*3)*costsArr[0]/100;
					castCombo.effect = "AP";
					castCombo.info = "бронебойный (х3) урон";
					
				}else{ //бронебойный (х2) урон с вампиризмом
					castCombo.value = player.stats.ATK;
					castCombo.stat = "HP";
					castCombo.to = "enemy";
					castCombo.value2 = (costsArr[1]*2)*costsArr[0]/100;
					castCombo.effect = "AP";
					castCombo.value3 = player.stats.ATK*costsArr[2]*costsArr[0]/100;
					castCombo.effect2 = "RE";
					castCombo.info = "бронебойный (х2) урон с вампиризмом";
				};
				
			}else{
				if ( comboArr[2] == "spades" ){ //урон с вампиризмом
					castCombo.value = player.stats.ATK + costsArr[1]*costsArr[0]/100;
					castCombo.stat = "HP";
					castCombo.to = "enemy";
					castCombo.value2 = player.stats.ATK*costsArr[2]*costsArr[0]/100;
					castCombo.effect = "RE";
					castCombo.info = "урон с вампиризмом";
					
				}else if ( comboArr[2] == "diamonds" ){ //урон с маной
					castCombo.value = player.stats.ATK + costsArr[1]*costsArr[0]/100 + (player.stats.MP + costsArr[2])*costsArr[0]/100;
					castCombo.stat = "HP";
					castCombo.to = "enemy";
					castCombo.info = "урон с маной";
					
				}else if ( comboArr[2] == "cross" ){ // урон с пробиванием
					castCombo.value =  player.stats.ATK + costsArr[1]*costsArr[0]/100;
					castCombo.stat = "HP";
					castCombo.to = "enemy";
					castCombo.value2 = costsArr[2]*costsArr[0]/100;
					castCombo.effect = "AP";
					castCombo.info = "урон с пробиванием";
					
				}else{ // урон 
					castCombo.value = player.stats.ATK + (costsArr[1] + costsArr[2])*costsArr[0]/100;
					castCombo.stat = "HP";
					castCombo.to = "enemy";
					castCombo.info = "урон";
				};
			};
		}else if ( comboArr[0] == "diamonds" ){
			if ( comboArr[1] == "spades" ){
				if ( comboArr[2] == "spades" ){ // уменьшение урона
					castCombo.value = player.stats.AGI*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "ATK";
					castCombo.to = "enemy";
					castCombo.effect = "SU";
					castCombo.info = "уменьшение урона";
					
				}else if ( comboArr[2] == "diamonds" ){ //уменьшение базового значения маны
					castCombo.value = player.stats.AGI*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "MP";
					castCombo.to = "enemy";
					castCombo.effect = "SU";
					castCombo.info = "уменьшение базового значения маны";
					
				}else if ( comboArr[2] == "cross" ){ //уменьшение бронебойности
					castCombo.value = (player.stats.AGI*costsArr[0]/100 + costsArr[1]*costsArr[2]/100)/10;
					castCombo.stat = "AP";
					castCombo.to = "enemy";
					castCombo.effect = "SU";
					castCombo.info = "уменьшение бронебойности";
					
				}else{ //уменьшение вампиризма
					castCombo.value = (player.stats.AGI*costsArr[0]/100 + costsArr[1]*costsArr[2]/100)/10;
					castCombo.stat = "LL";
					castCOmbo.to = "enemy";
					castCombo.effect = "SU";
					castCombo.info = "уменьшение вампиризма";					
				};
				
			}else if( comboArr[1] == "diamonds" ){
				if ( comboArr[2] == "spades" ){ //уменьшение силы
					castCombo.value = player.stats.AGI*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "STR";
					castCombo.to = "enemy";
					castCombo.effect = "SU";
					castCombo.info = "уменьшение силы";
					
				}else if ( comboArr[2] == "diamonds" ){ //уменьшение интеллекта
					castCombo.value = player.stats.AGI*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "INT";
					castCombo.to = "enemy";
					castCombo.effect = "SU";
					castCombo.info = "уменьшение интеллекта";
					
				}else if ( comboArr[2] == "cross" ){ //уменьшение ловкости
					castCombo.value = player.stats.AGI*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "AGI";
					castCombo.to = "enemy";
					castCombo.effect = "SU";
					castCombo.info = "уменьшение ловкости";
					
				}else{ // уменьшение выносливости
					castCombo.value = player.stats.AGI*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "END";
					castCombo.to = "enemy";
					castCombo.effect = "SU";
					castCombo.info = "уменьшение выносливости";
				};
				
			}else if( comboArr[1] == "cross" ){
				if ( comboArr[2] == "spades" ){
					alert( "комбинации нет, скорей всего будет ошибка или зависон игры")
					// НУЖНА КОМБИНАЦИЯ!!!!!!!!!!!!!!!!!!!
				}else if ( comboArr[2] == "diamonds" ){ // уменьшение восстановление маны
					castCombo.value = (player.stats.AGI*costsArr[0]/100 + costsArr[1]*costsArr[2]/100)/10;
					castCombo.stat = "MR";
					castCombo.to = "enemy";
					castCombo.effect = "SU";
					castCombo.info = "уменьшение восстановление маны";
					
				}else if ( comboArr[2] == "cross" ){ // уменьшение брони
					castCombo.value = player.stats.AGI*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "DEF";
					castCombo.to = "enemy";
					castCombo.effect = "SU";
					castCombo.info = "уменьшение брони";
					
				}else{ // уменьшение силы лечения
					castCombo.value = (player.stats.AGI*costsArr[0]/100 + costsArr[1]*costsArr[2]/100)/10;
					castCombo.stat = "HR";
					castCombo.to = "enemy";
					castCombo.effect = "SU";
					castCombo.info = "уменьшение силы лечения";
				};
				
			}else{
				if ( comboArr[2] == "spades" ){ // уменьшение уворота
					castCombo.value = player.stats.AGI*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "DDG";
					castCombo.to = "enemy";
					castCombo.effect = "SU";
					castCombo.info = "уменьшение уворота";
					
				}else if ( comboArr[2] == "diamonds" ){ //уменьшение блок рейта
					castCombo.value = player.stats.AGI*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "BR";
					castCombo.to = "enemy";
					castCombo.effect = "SU";
					castCombo.info = "уменьшение блок рейта";
					
				}else if ( comboArr[2] == "cross" ){
					alert( "комбинации нет, скорей всего будет ошибка или зависон игры")
					 // НУЖНА КОМБИНАЦИЯ!!!!!!!!!!!!!!!!!!!
				}else{ // уменьшение ХП
					castCombo.value = player.stats.AGI*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "HP";
					castCombo.to = "enemy";
					castCombo.effect = "SU";
					castCombo.info = "уменьшение жизней";
				};
			};
		}else if ( comboArr[0] == "cross" ){
			if ( comboArr[1] == "spades" ){
				if ( comboArr[2] == "spades" ){ // восстановление урона
					castCombo.value = player.stats.END*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "ATK";
					castCombo.to = "self";
					castCombo.effect = "RE";
					castCombo.info = "восстановление урона";
					
				}else if ( comboArr[2] == "diamonds" ){ // Восстановление маны
					castCombo.value = player.stats.END*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "MP";
					castCombo.to = "self";
					castCombo.effect = "RE";
					castCombo.info = "восстановление маны";
					
				}else if ( comboArr[2] == "cross" ){ // восстановление пробивания 
					castCombo.value = (player.stats.END*costsArr[0]/100 + costsArr[1]*costsArr[2]/100)/10; 
					castCombo.stat = "AP";
					castCombo.to = "self";
					castCombo.effect = "RE";
					castCombo.info = "восстановление бронебойности";
					
				}else{ // восстановление вампиризма
					castCombo.value = (player.stats.END*costsArr[0]/100 + costsArr[1]*costsArr[2]/100)/10;
					castCombo.stat = "LL";
					castCombo.to = "self";
					castCombo.effect = "RE";
					castCombo.info = "восстановление вампиризма";
				};
			}else if( comboArr[1] == "diamonds" ){
				if ( comboArr[2] == "spades" ){ // восстанвление силы
					castCombo.value = player.stats.END*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "STR";
					castCombo.to = "self";
					castCombo.effect = "RE";
					castCombo.info = "восстановление силы";
					
				}else if ( comboArr[2] == "diamonds" ){ //восстановление интеллекта
					castCombo.value = player.stats.END*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "INT";
					castCombo.to = "self"; 
					castCombo.effect = "RE";
					castCombo.info = "восстановление интеллекта";
					
				}else if ( comboArr[2] == "cross" ){ //восстановление ловкости
					castCombo.value = player.stats.END*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "AGI";
					castCombo.to = "self"; 
					castCombo.effect = "RE";
					castCombo.info = "восстановление ловкости";
					
				}else{ // восстановление выносливости
					castCombo.value = player.stats.END*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "END";
					castCombo.to = "self";
					castCombo.effect = "RE";
					castCombo.info = "восстановление выносливости";
				};
				
			}else if( comboArr[1] == "cross" ){
				if ( comboArr[2] == "spades" ){ 
				alert( "комбинации нет, скорей всего будет ошибка или зависон игры")
					// НУЖНА КОМБИНАЦИЯ!!!!!!!!!!!!!!!!!!!
				}else if ( comboArr[2] == "diamonds" ){ // восстановление восстановления маны
					castCombo.value = (player.stats.END*costsArr[0]/100 + costsArr[1]*costsArr[2]/100)/10;
					castCombo.stat = "MR";
					castCombo.to = "self";
					castCombo.effect = "RE";
					castCombo.info = "восстановление восстановления маны";
					
				}else if ( comboArr[2] == "cross" ){// восстановление брони 
					castCombo.value = player.stats.END*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "DEF";
					castCombo.to = "self";
					castCombo.effect = "RE";
					castCombo.info = "восстановление брони";
					
				}else{ //восстановление силы лечения
					castCombo.value = (player.stats.END*costsArr[0]/100 + costsArr[1]*costsArr[2]/100)/10;
					castCombo.stat = "HR";
					castCombo.to = "self";
					castCombo.effect = "RE";
					castCombo.info = "восстановление силы лечения";
				};
				
			}else{
				if ( comboArr[2] == "spades" ){ // восстановление уворота
					castCombo.value = player.stats.END*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "DDG";
					castCombo.to = "self";
					castCombo.effect = "RE";
					castCombo.info = "восстановление уворота";
					
				}else if ( comboArr[2] == "diamonds" ){ // восстановление блок рейта
					castCombo.value = player.stats.END*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "BR";
					castCombo.to = "self";
					castCombo.effect = "RE";
					castCombo.info = "восстановление блок рейта";
					
				}else if ( comboArr[2] == "cross" ){
					alert( "комбинации нет, скорей всего будет ошибка или зависон игры")
					// НУЖНА КОМБИНАЦИЯ!!!!!!!!!!!!!!!!!!!
				}else{ // восстановление ХП
					castCombo.value = player.stats.END*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;
					castCombo.stat = "HP";
					castCombo.to = "self";
					castCombo.effect = "RE";
					castCombo.info = "восстановление жизней";
				};
			};	
		}else{
			if ( comboArr[1] == "spades" ){
				if ( comboArr[2] == "spades" ){ // увеличение урона
					castCombo.value = player.stats.INT*costsArr[0]/100 + costsArr[1]*costsArr[2]/100; 
					castCombo.stat = "ATK";
					castCombo.to = "self";
					castCombo.effect = "ADD";
					castCombo.info = "увеличение урона";
					
				}else if ( comboArr[2] == "diamonds" ){// увеличение маны
					castCombo.value = player.stats.INT*costsArr[0]/100 + costsArr[1]*costsArr[2]/100; 
					castCombo.stat = "MP";
					castCombo.to = "self";
					castCombo.effect = "ADD";
					castCombo.info = "увеличение маны";					
					 
				}else if ( comboArr[2] == "cross" ){ //увеличение пробивания
					castCombo.value = (player.stats.INT*costsArr[0]/100 + costsArr[1]*costsArr[2]/100)/10; 
					castCombo.stat = "AP";
					castCombo.to = "self";
					castCombo.effect = "ADD";
					castCombo.info = "увеличение пробивания";						
					 
				}else{ // увеличение вампиризма
					castCombo.value = (player.stats.INT*costsArr[0]/100 + costsArr[1]*costsArr[2]/100)/10; 
					castCombo.stat = "LL";
					castCombo.to = "self";
					castCombo.effect = "ADD";
					castCombo.info = "увеличение вампиризма";	
					
				};
			}else if( comboArr[1] == "diamonds" ){
				if ( comboArr[2] == "spades" ){ // увеличение силы
					castCombo.value = player.stats.INT*costsArr[0]/100 + costsArr[1]*costsArr[2]/100; 
					castCombo.stat = "STR";
					castCombo.to = "self";
					castCombo.effect = "ADD";
					castCombo.info = "увеличение силы";					
					 
				}else if ( comboArr[2] == "diamonds" ){ // увеличение интеллекта
					castCombo.value = player.stats.INT*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;  
					castCombo.stat = "INT";
					castCombo.to = "self";
					castCombo.effect = "ADD"; 
					castCombo.info = "увеличение интеллекта";
					 
				}else if ( comboArr[2] == "cross" ){ // увеличение ловкости
					castCombo.value = player.stats.INT*costsArr[0]/100 + costsArr[1]*costsArr[2]/100; 
					castCombo.stat = "AGI";
					castCombo.to = "self";
					castCombo.effect = "ADD";
					castCombo.info = "увеличение ловкости";
					 
				}else{ // увеличение выносливости
					castCombo.value = player.stats.INT*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;  
					castCombo.stat = "END";
					castCombo.to = "self";
					castCombo.effect = "ADD";
					castCombo.info = "увеличение выносливости";					
					
				};
			}else if( comboArr[1] == "cross" ){
				if ( comboArr[2] == "spades" ){
					alert( "комбинации нет, скорей всего будет ошибка или зависон игры")
					// НУЖНА КОМБИНАЦИЯ!!!!!!!!!!!!!!!!!!!
				}else if ( comboArr[2] == "diamonds" ){ // увеличение восстановления маны
					castCombo.value = (player.stats.INT*costsArr[0]/100 + costsArr[1]*costsArr[2]/100)/10; 
					castCombo.stat = "MR";
					castCombo.to = "self";
					castCombo.effect = "ADD";
					castCombo.info = "увеличение восстановления маны";						
					
				}else if ( comboArr[2] == "cross" ){ // увеличение брони
					castCombo.value = player.stats.INT*costsArr[0]/100 + costsArr[1]*costsArr[2]/100; 
					castCombo.stat = "DEF";
					castCombo.to = "self";
					castCombo.effect = "ADD"; 
					castCombo.info = "увеличение брони";
					
				}else{ // увеличение силы лечения
					castCombo.value = (player.stats.INT*costsArr[0]/100 + costsArr[1]*costsArr[2]/100)/10;  
					castCombo.stat = "HR";
					castCombo.to = "self";
					castCombo.effect = "ADD"; 
					castCombo.info = "увеличение силы лечения";
				};
				
			}else{
				if ( comboArr[2] == "spades" ){ // увеличение уворота
					castCombo.value = player.stats.INT*costsArr[0]/100 + costsArr[1]*costsArr[2]/100; 
					castCombo.stat = "DDG";
					castCombo.to = "self";
					castCombo.effect = "ADD"; 
					castCombo.info = "увеличение уворота";
					
				}else if ( comboArr[2] == "diamonds" ){// увеличение блок рейта
					castCombo.value = player.stats.INT*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;  
					castCombo.stat = "BR";
					castCombo.to = "self";
					castCombo.effect = "ADD"; 
					castCombo.info = "увеличение блок рейта";
					
				}else if ( comboArr[2] == "cross" ){
					// НУЖНА КОМБИНАЦИЯ!!!!!!!!!!!!!!!!!!!
					alert( "комбинации нет, скорей всего будет ошибка или зависон игры")
				}else{
					castCombo.value = player.stats.INT*costsArr[0]/100 + costsArr[1]*costsArr[2]/100;  
					castCombo.stat = "HP";
					castCombo.to = "self";
					castCombo.effect = "ADD";
					castCombo.info = "увеличение жизней";
				};
			};	
		}
		
		return castCombo;
		
	},
	
	calculateDamage: function (player){ // функция подсчета дамага, пока без мастей и комбо
		if ( player.battleDeck.length >= 3){
			var cardN1 = player.battleDeck[0]; //1 карта от плеера на полебоя
			var cardN2 = player.battleDeck[1]; //2 карта от плеера на полебоя
			var cardN3 = player.battleDeck[2]; //3 карта от плеера на полебоя
			var costsArr = [cardsDeck.costs[cardN1[1]], cardsDeck.costs[cardN2[1]], cardsDeck.costs[cardN3[1]]]; // делаем массив из достоинств, для последующего сложения
			var comboArr = [cardN1[0], cardN2[0], cardN3[0]]; // делаем массив из мастей, для последующей проверки комбинации
			// складываем достоинства по мастям.
			for (var i = 3; i < player.battleDeck.length; i++){  
				if ( cardN1[0] == player.battleDeck[i][0] ){
					costsArr[0] += cardsDeck.costs[player.battleDeck[i][1]];
					i++;
				}else if( cardN2[0] == player.battleDeck[i][0] ){
					costsArr[1] += cardsDeck.costs[player.battleDeck[i][1]];
					i++;
				}else if( cardN3[0] == player.battleDeck[i][0] ){
					costsArr[2] += cardsDeck.costs[player.battleDeck[i][1]];
					i++;
				}else{
						i++;
				};
			};
			player.damage = this.doCombo(comboArr, costsArr, player); // передаем управление функции подсчета.
			return;
			
		}else{
			return; 
		}
	},
	
	doDamage: function(player1, player2){
		
		if ( player1.damage.to == "self" ){
			if (player1.damage.effect == "RE"){
				if( player1.damage.stat == "HP"){
					var multiplier = player1.stats.HR;
				}else if( player1.damage.stat == "MR" ){
					var multiplier = player1.stats.HR;
				}else{
					var multiplier = 1;
				}
				player1.stats[player1.damage.stat] += player1.damage.value*multiplier; 
				if ( player1.stats[player1.damage.stat] > player1.getStats(player1.damage.stat) ){
					player1.stats[player1.damage.stat] = player1.getStats(player1.damage.stat);
					return;
				}else{
				}
			}else{
				player1.stats[player1.damage.stat] += player1.damage.value;
				return;
			};
			
		}else{
		}

		if( player1.damage.to == "enemy"){
			if (player1.damage.effect == "SU"){
				var dmg = player2.stats.DEF - player1.damage.value;
				if (dmg > 0){
					player2.stats[player1.damage.stat] -= dmg;
					if (player2.stats[player1.damage.stat] < 0) {
						player2.stats[player1.damage.stat] = 0;
						return;
					};
				};
			}else if( player1.damage.effect == "SU" && player1.damage.effect2 == "RE"){
				var dmg = player2.stats.DEF - player1.damage.value;
				if( dmg > 0 ){
					player2.stats[player1.damage.stat] -= dmg;
					player1.stats[player1.damage.stat] += player1.damage.value2;
						if (player2.stats[player1.damage.stat] < 0) {
							player2.stats[player1.damage.stat] = 0;
						}else{};
						if (player1.stats[player1.damage.stat] > player1.getStats(player1.damage.stat)){
							player1.stats[player1.damage.stat] = player1.getStats(player1.damage.stat);
						}else{};
				return;
				};
			}else if(player1.damage.effect == "SU" && player1.damage.effect2 == "AP") {
				var dmg = (player2.stats.DEF - player1.damage.value2) - player1.damage.value;
				if (dmg > 0 ){
					player2.stats[player1.damage.stat] -= dmg;
						if (player2.stats[player1.damage.stat] < 0) {
							player2.stats[player1.damage.stat] = 0;
						}else{};
				return;
				};
			};
		}else{
		}
		
		if( player1.damage.to == "enemy" ){
			if (player1.damage.effect == "AP"){
				var dmg = player1.damage.value - (player2.stats.DEF - player1.damage.value2*player1.stats.AP);
					if( dmg > 0 ){
						player2.stats[player1.damage.stat] -= dmg;
						return;
				}else{
				}			
			}else{
				var dmg = player1.damage.value - player2.stats.DEF;
				if( dmg > 0 ){
					player2.stats[player1.damage.stat] -= dmg;
					player1.stats[player1.damage.stat] += (player1.damage.value*player1.damage.value2/100)*player1.stats.LL;
					if (player1.stats[player1.damage.stat] > player1.getStats(player1.damage.stat)){
						player1.stats[player1.damage.stat] = player1.getStats(player1.damage.stat);
						return;
					}else{
					}
				}else{
				}			
			}
		}else{};
		
		if( player1.damage.to == "enemy" ){
			if (player1.damage.effect == "AP" && player1.damage.effect2 == "RE"){
				var dmg = player1.damage.value - (player2.stats.DEF - player1.damage.value2*player1.stats.AP);
					if( dmg > 0 ){
						player2.stats[player1.damage.stat] -= dmg;
						player1.stats[player1.damage.stat] += (player1.damage.value*player1.damage.value3/100)*player1.stats.LL;
						if (player1.stats[player1.damage.stat] > player1.getStats(player1.damage.stat)){
							player1.stats[player1.damage.stat] = player1.getStats(player1.damage.stat);
							return;
						}else{
						}
					}else{
					}			
			}else{
				var dmg = player1.damage.value - player2.stats.DEF;
					if( dmg > 0 ){
						player2.stats[player1.damage.stat] -= dmg;
						return;
			}else{};
			}
		}else{
			
		};

	},
	
	battleStart: function (){	 // начало Игры.
		var bgSelf = this;
		this.round = 0;
		this.historyDeck = []; // определяем деку истории боя.
		
		function rndBoolean(){ // функция определения первого хода.
			var num = Math.random();
			if (Math.round(num)){
				return bgSelf.player;
			}else{
				return bgSelf.enemy;
			}
		};
		
		var firstPlayer = rndBoolean(); // выбираем кто ходит первый.
		setTimeout(function(){ bgSelf.roundStart(firstPlayer)}, 1000); // передаем управлениераундами.
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
		setTimeout( function(){ bgSelf.turnStart(player) } ,1000);
	},
	
	roundEnd: function(player, nextPlayer){
		this.round++;
		var bgSelf = this;
		//$("top-battledeck").unbind('mouseenter mouseleave');
		//$("bot-battledeck").unbind('mouseenter mouseleave');
		// проверяем, положил ли игрок карты в боевую деку или нет.
		if (player.battleDeck.length == 0){ 
			if (nextPlayer.battleDeck.length == 0){
				// ничего не делаем, если оба не положили.
			}else{
				this.calculateDamage(nextPlayer);
				this.doDamage(nextPlayer, player);
				if (player.stats.HP <= 0){
						doRefreshUiStats();
						this.battleEnd(player);
						return;
				}else{};
			}
		}else{
			if (nextPlayer.battleDeck.length == 0){
				this.calculateDamage(player);
				this.doDamage(player, nextPlayer);
				if (nextPlayer.stats.HP <= 0){
						doRefreshUiStats();
						this.battleEnd(nextPlayer);
						return;
					}else{};
			}else{
				this.calculateDamage(nextPlayer);
				this.calculateDamage(player);
				if (player.battleDeck[0][0] == "spades"){
					this.doDamage(nextPlayer, player);
					if (player.stats.HP <= 0){
						doRefreshUiStats();
						this.battleEnd(player);
						return;
					}else{};
				}else{
					this.doDamage(player, nextPlayer);
					if (nextPlayer.stats.HP <= 0){
						doRefreshUiStats();
						this.battleEnd(nextPlayer);
						return;
					}else{};
				};
			};
		};
		
		// анимация убирания карт из боевой деки
		$("ul#top-battledeck li").css( "position", "relative").animate({left: "-500px", opacity: "0"}, 800, function(){
			$(this).remove();
			});
		$("ul#bot-battledeck li").css( "position", "relative").animate({left: "-500px", opacity: "0"}, 800, function(){
			$(this).remove();
			});
		$( ".overlay-top-combo" ).empty();
		$( ".overlay-bot-combo" ).empty();
		// заполняю визуализированные статы игрока и противника
		function doRefreshUiStats(){
			$("#bpb-hp span").css("width", bgSelf.player.stats.HP/bgSelf.player.getStats("HP")*100 + "%" );
			$("#bpb-mp span").css("width", bgSelf.player.stats.MP/bgSelf.player.getStats("MP")*100 + "%" );
			$("#bpb-hp span").text(Math.round(bgSelf.player.stats.HP));
			$("#bpb-mp span").text(Math.round(bgSelf.player.stats.MP));
			$("#bottom-atk").text(Math.round(bgSelf.player.stats.ATK));
			$("#bottom-def").text(Math.round(bgSelf.player.stats.DEF));
		
			$("#tpb-hp span").css("width", bgSelf.enemy.stats.HP/bgSelf.enemy.getStats("HP")*100 + "%" );
			$("#tpb-mp span").css("width", bgSelf.enemy.stats.MP/bgSelf.enemy.getStats("MP")*100 + "%" );
			$("#tpb-hp span").text(Math.round(bgSelf.enemy.stats.HP));
			$("#tpb-mp span").text(Math.round(bgSelf.enemy.stats.MP));
			$("#top-atk").text(Math.round(bgSelf.enemy.stats.ATK));
			$("#top-def").text(Math.round(bgSelf.enemy.stats.DEF));
		};
		// чистим боевую деку от прошлых значений.
		player.battleDeck.length = 0; 
		nextPlayer.battleDeck.length = 0; 
		doRefreshUiStats();
		
		if (player.stats.HP <= 0){ // проверка на смерть игрока
			this.battleEnd(player);
		}else{
			if (nextPlayer.stats.HP <= 0){
				this.battleEnd(nextPlayer);
			}else{
				this.roundStart(player); // - а теперь внимание. Почему плеер? ведь он был последним ходящим. Хочу сделать что бы они менялись, Первый раунд ходит первым 1, а во второй раунд ходит первым 2
			}
		}
	},
	
	turnStart: function (player){ //начало хода для игрока
		var bgSelf = this;
		this.turnQueue = player;
		if (player == this.player){ // проверяем кто сейчас ходит  и выводим соответствующую надпись.
			$('#overlay2').css('display', 'block');
			$('#overlay2 #player_turn').text("Ваш ход").animate({opacity: 1}, 2000, function(){ $('#overlay2').css("display", "none"), $('#overlay2 #player_turn').css("opacity", "0.5") });
			$("#turn").prop('disabled', false);


		}else{
			$('#overlay2').css('display', 'block');
			$('#overlay2 #player_turn').text("Ход противника").animate({opacity: 1}, 2000, function(){ $('#overlay2').css("display", "none"), $('#overlay2 #player_turn').css("opacity", "0.5") });
			$("#turn").prop('disabled', true);

		}

		if (this.round == 0){ this.giveCard(player, this.cards); }else{ this.giveCard(player, this.cardsEveryTurn); };// раздаем карты, помеченные как за каждый новый ход.	

		var timer = this.timer; // биндим количество секунд на ход.
		this.runTimer(timer , player); // запускаем таймера хода.
			
		if (player == this.enemy){ // проверяем, является ли текущий игрок ботом
			setTimeout(function(){bgSelf.runAi()}, 1500); // если да - запускаем логику ИИ.
		}
	},
 
	turnEnd: function (player){ // заканчиваем ходигрока
		clearInterval(this.timerId); // чистим таймер, если вдруг конец хода был вызван вручную.
		$("#time-left").text(0); // показываем, что текущее время хода 0.
		var bgSelf = this;
		if (player.id == "player"){ // маунтим следующего игрока.
			var nextPlayer = this.enemy; // если да, то выбираем следущего игрока как противник ( бот )
			
		}else{
			var nextPlayer = this.player; // если нет - то выбираем игрока.
		}
		this.turnQueue = nextPlayer;
		// функция взята из мувКартТубатлле, не стал переделывать переменные
		if ( player.battleDeck.length < 3){ // возвращаем карты в деку, если игрок выложил 2 карты или 1 карту вместо 3-х
			for ( var i = 0; i < player.battleDeck.length; i++ ){
				player.deck.push(player.battleDeck[i]);
				var cardId = "." + player.battleDeck[i].join("") + "#" + player.id;
					if (player.id == "enemy"){
						var cardOffset = $(cardId).offset();
						var cardToBattle = $(".invisible");
			
					}else{
						var cardOffset = $(cardId).offset();
						var cardToBattle = $(".connectedSortable");
					}
					var clone = $(cardId).clone();
					clone.appendTo($(cardToBattle)); 
					var cloneOffset = clone.offset();
					clone.remove();	

					$(cardId)
						.appendTo("body")
						.css({ "position" : "absolute", "top" : (cardOffset.top - 5), "left" : (cardOffset.left - 5) })
						.animate({top: cloneOffset.top, left: cloneOffset.left}, 400, function(){
						$(cardId).remove();
						clone.appendTo($(cardToBattle));
						});
			}
			player.battleDeck.length = 0; // после того как вернули карты, чистим боевую деку.
		}else{
		}
		
		if (player == this.enemy){
			if ( player.battleDeck.length > 2){
			var combo = this.findCombo(player);
			$( ".overlay-top-combo" ).text(combo.info + " на " + combo.value);
			};
		};
		
		if (this.turnCounter == 1){ // проверяем каждый ли сходил по 1 разу?
			this.roundEnd(player, nextPlayer);
		}else{
			this.turnCounter++;
		setTimeout(function(){bgSelf.turnStart(nextPlayer)}, 2000); 	
		}
		
	},
 
	generateCard: function(){ // генерация значений карты.
		var a = Math.floor(Math.random() * cardsDeck.numbers.length);
		var b = Math.floor(Math.random() * cardsDeck.types.length);
		return [cardsDeck.types[b], cardsDeck.numbers[a]];
	},
 
	giveCard: function (player, cards) { //раздача карт игроку.
		var bgSelf = this;
		var num = 0;
		var cardTimer = setInterval(function(){ if( num < cards ){ num++; bgSelf.addCard(player); }else{ clearInterval(cardTimer);} }, 300);

	},
	
	addCard: function(player) { //даем карту игроку. // переделать функцию добавления карт, что бы можно было запускать с таймером.
		var bgSelf = this; // маунт себя для функции движения карты в игровую деку.
		var card = this.generateCard(); // генерируем карту.
		
		function searchInArray(value, arr){
			var counter = 0
			for (var i = 0; i < arr.length; i++) {
				if (arr[i][0] == value[0] && arr[i][1] == value[1]){
					counter++
				}else{
				}
			}
			if (counter == 0){return false;}else{return true;};
		};
		
		for (var i = 0; i < 1;){ // делаем проверку, на то, есть ли такая карта у игрока на руках или нет. во избежании повторов и не правильной работы дальнейших функций (!!!)
			if ( searchInArray(card, player.deck) ){
				card = this.generateCard();
			}else{
				player.deck.push(card);
				i = 1;
			}
		};
		
		var uiCard = "<li class='card " + card.join("") + "' id='" + player.id + "'></li>";
		var fromCardOffset = $("div#full_deck").offset();
		var cloneSuit = $("div#full_deck").clone();
		
		if (player.id == "player"){ // если плеер - делаем *анимацию* и движение карт в его руки.
			cloneSuit.appendTo("body").css({"position": "absolute", "top": fromCardOffset.top, "left": fromCardOffset.left}).animate({top: "660px", left: "560px"}, 300, function(){ $(this).remove()});
			$( uiCard ).appendTo($("ul.connectedSortable")).click( function(){
				bgSelf.moveCardToBattle(player, card);
			});

		}else{
			cloneSuit.appendTo("body").css({"position": "absolute", "top": fromCardOffset.top, "left": fromCardOffset.left}).animate({top: ($("ul.invisible").offset().top - 150), left: ($("ul.invisible").offset().left + 50)}, 300, function(){ $(this).remove()});
			$( uiCard ).appendTo($("ul.invisible"));
			// делаем карту рубашкой вверх, и кладем ее ко врагу ( боту ) в невидимую деку.
			}
	},
	
	moveCardToBattle: function(player, card) { // функция описывающее само перемещение карты в боевую деку.
		var bgSelf = this;
		var cardId = "." + card.join("") + "#" + player.id;
		function checkCard(player, card){ // проверка, можно ли положить карту, или нет.
			if (bgSelf.turnQueue == player){
				if (player.battleDeck.length < 3){
					return true;
				}else{
					if (player.battleDeck[0][0] == card[0] || player.battleDeck[1][0] == card[0] || player.battleDeck[2][0] == card[0]){
						return true;
					}else{
						return false;
					}
				}
			}else{return false};
		};
		if (checkCard(player, card)){
			if (player.id == "enemy"){
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
				.animate({top: cloneOffset.top, left: cloneOffset.left}, 300, function(){
					$(cardId).remove();
					clone.appendTo($(cardToBattle));
				});
			if (player == this.player){
				clone.click(function(){ bgSelf.moveCardToDeck(card);})
			};
			player.battleDeck.push(card); // пушим боевую деку игрока картой.
			var cardToDelete = player.deck.indexOf(card);
			player.deck.splice(cardToDelete, 1); //обязательное удаление карты из руки игрока. (!!!) - то место, когда задвоенные карты делают свою гадкую работу. (!!!)
		
		}else{
			$(cardId).effect("highlight", {color: "red"}, 300);	
		}
		if(this.player.battleDeck.length > 2){
			if( this.player == this.turnQueue){
				var combo = this.findCombo(player);
				$( ".overlay-bot-combo" ).text(combo.info + " на " + combo.value);
			};
		};
	},
	
	moveCardToDeck: function(card){
		var cardId = "." + card.join("") + "#" + this.player.id;
		var bgSelf = this;
		if( this.turnQueue == this.player){
			var cardOffset = $(cardId).offset();
				var clone = $(cardId).clone();
				clone.appendTo($(".connectedSortable"));
				var cloneOffset = clone.offset();
				clone.remove();	
				$(cardId)
					.appendTo("body")
					.css({ "position" : "absolute", "top" : (cardOffset.top - 5), "left" : (cardOffset.left - 5) })
					.animate({top: cloneOffset.top, left: cloneOffset.left}, 400, function(){
						$(cardId).remove();
						clone.appendTo($(".connectedSortable"));
						clone.click(function(){ bgSelf.moveCardToBattle(bgSelf.player, card);})
					});
			this.player.deck.push(card); // возвращаем карту обратно.
			var cardToDelete = this.player.battleDeck.indexOf(card);
			this.player.battleDeck.splice(cardToDelete, 1);
		$("bot-battledeck").unbind('mouseenter mouseleave');
		}else{ $(cardId).effect("highlight", {color: "red"}, 300);	}
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
		// функция атаки.
		function aiAttack(){
			var attackArr = [];
			var firstCard = searchLear("spades"); 
			var secondCard = searchLear("cross");
			var thirdCard = searchLear("diamonds");
			var fourthCard = searchLear("hearts");
			if (firstCard.length > 2){
				attackArr.push(firstCard[0]);
				attackArr.push(firstCard[1]);
				attackArr.push(firstCard[2]);
			}else if (firstCard.length == 2){
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
			if ( arr.length > 0){
				bgSelf.moveCardToBattle(bgSelf.enemy, arr[0]);
				arr.splice(0, 1);
			
			}else{
				clearInterval(botTimer);
				bgSelf.turnEnd(bgSelf.enemy);
			}
		}
		if (this.enemy.deck.join(",").indexOf("spades") == -1){ // проверка, можем ли бот атаковать?
			return this.turnEnd(this.enemy);
		}else{
			var attack = aiAttack();
			var botTimer = setInterval(function(){ aiPlay(attack)}, 1000);
		};
	
		function searchLear(lear){ // функиця поиска карты по масти
			var tempArr = [];
			for (var i = 0; i < bgSelf.enemy.deck.length; i++){
				if( bgSelf.enemy.deck[i][0] == lear ){
					tempArr.push(bgSelf.enemy.deck[i]);
				}else{
				}
			};
			tempArr.sort(function (a, b){ return b[1] - a[1]; }); // сортируем, что бы большим значением были вначале
			return tempArr;
		};
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
	

		function chooseAvatar(player){
			if (player.race == "human"){
				return "img/human.jpg";
			}else if (player.race == "orc"){
				return "img/orc.jpg";
			}else if (player.race == "troll"){
				return "img/troll.jpg";
			}else if (player.race == "werewolf"){
				return "img/werewolf.png";
			}else if (player.race == "dwarf"){
				return "img/dwarf.jpg";
			}else if (player.race == "gnome"){
				return "img/gnome.jpg";
			}else if (player.race == "elf"){
				return "img/elf.jpg";
			}else if (player.race == "goblin"){
				return "img/goblin.jpg";
			}else{
				return "img/vampire.jpg";
			}
		};
		
	
		this.player = new Player(name, race, 0, 0);
		this.player.stats();
		this.player.fillStats(this.player.lvl);
		this.player.id = "player"
		this.player.deck = []; // определяем массив карт для игрока
		this.player.battleDeck = [];
		$("div#bottom-playername").html(this.player.name);
		$("#bpb-hp span").css("width", "100%");
		$("#bpb-hp span").text(this.player.stats.HP);
		$("#bpb-mp span").css("width", "100%");
		$("#bpb-mp span").text(this.player.stats.MP);		
		$("#bottom-atk").text(this.player.stats.ATK);
		$("#bottom-def").text(this.player.stats.DEF);
		$("#bottomavatar img").attr("src", chooseAvatar(this.player));
		$("#bottom-lvl").text(this.player.level);
	
		// сгенерирую постоянного бота
		var randomRace = ["human", "elf", "orc", "troll", "werewolf", "dwarf", "goblin", "gnome", "vampire"][Math.round(Math.random()*8)];
		this.enemy = new Player("Robot", randomRace, 0, Math.round(Math.random()*10));

		this.enemy.stats();
		this.enemy.fillStats();
		this.enemy.id = "enemy"
		this.enemy.deck = []; // определяем массив карт дял противника ( бота )
		this.enemy.battleDeck = [];
		$("div#top-playername").html(this.enemy.name);
		$("#tpb-hp span").css("width", "100%");
		$("#tpb-hp span").text(this.enemy.stats.HP);
		$("#tpb-mp span").css("width", "100%");
		$("#tpb-mp span").text(this.enemy.stats.MP);
		$("#top-atk").text(this.enemy.stats.ATK);
		$("#top-def").text(this.enemy.stats.DEF);
		$("#topavatar img").attr("src", chooseAvatar(this.enemy));
		$("#top-lvl").text(this.enemy.level);
		
		// подсказка по наведению на аватарку игрока.
		var pinfo = "<div>" + this.player.name + "</br>Уровень: " + this.player.level + "</br> Раса: " + this.player.race +"</br> Жизни: " + this.player.stats.HP + "</br> Дух: " + this.player.stats.MP + "</br> Уворот: " + this.player.stats.DDG + "%</br> Шанс на блок: " + this.player.stats.BR + "%</br></div>";
		var info2 = $(pinfo);
		var einfo = "<div>" + this.enemy.name + "</br>Уровень: " + this.enemy.level + "</br>Раса: " + this.enemy.race +"</br>Жизни: " + this.enemy.stats.HP + "</br>Дух: " + this.enemy.stats.MP + "</br> Уворот: " + this.enemy.stats.DDG + "%</br> Шанс на блок: " + this.enemy.stats.BR + "%</br></div>";
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
		bgSelf.battleground.battleStart();
	
	},
	
	endBattle: function(){
		// по идее должна будет запускаться, как только игроку выйдет сообщение о том, что он победил или проиграл.
		// дальше, экспа, лут, и т.п.
	}
	
};

$(document).ready(function() {
	
	$("button.playAgain").click(function(){window.location.reload("true")});
	
	$( "#bpb-hp" ).hover(
		function() {
			$( this ).append("<h1 class='tooltip'>" + Math.round(World.player.stats.HP) + "/" + Math.round(World.player.getStats('HP')) + "</h1>");
		},
		function() {
			$( this ).find("h1.tooltip").remove();
		}
	);
	$( "#bpb-mp" ).hover(
		function() {
			$( this ).append("<h1 class='tooltip'>" + Math.round(World.player.stats.MP) + "/" + Math.round(World.player.getStats('MP')) + "</h1>");
		},
		function() {
			$( this ).find("h1.tooltip").remove();
		}
	);
	$( "#tpb-hp" ).hover(
		function() {
			$( this ).append("<h1 class='tooltip'>" + Math.round(World.enemy.stats.HP) + "/" + Math.round(World.enemy.getStats('HP')) + "</h1>");
		},
		function() {
			$( this ).find("h1.tooltip").remove();
		}
	);
	$( "#tpb-mp" ).hover(
		function() {
			$( this ).append("<h1 class='tooltip'>" + Math.round(World.enemy.stats.MP) + "/" + Math.round(World.enemy.getStats('MP')) + "</h1>");
		},
		function() {
			$( this ).find("h1.tooltip").remove();
		}
	);
	$( "#bot-battledeck" ).append("<div class='overlay-bot-combo'></div>");
	$( "#top-battledeck" ).append("<div class='overlay-top-combo'></div>");
	$( "#bot-battledeck" ).hover(
		function() {
			$( ".overlay-bot-combo" ).show();
		},
		function() {
			$( ".overlay-bot-combo" ).hide();
		}
	);
	$( "#top-battledeck" ).hover(
		function() {
			$( ".overlay-top-combo" ).show();
		},
		function() {
			$( ".overlay-top-combo" ).hide();
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

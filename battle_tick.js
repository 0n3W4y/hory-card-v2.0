var Stats = $.trait({
	meta_onInit : function(data){
		if (data.stats){
			console.log('trait stats already exist');
		}else{
			data.stats = { 
				"STR":null,
				"AGI":null,
				"END":null,
				"INT":null,
				"ATK":null,
				"DEF":null,
				"BR":null,
				"DDG":null,
				"HP":null,
				"MP":null,
				"AP":null,
				"LL":null,
				"HR":null,
				"MR":null
			};
			console.log('trait Stats activated');
			return;
		}
		return;
	},
	getStats : function(stat){
		return this.stats[stat];
	},
	setStats : function(stat, value){
		if (this.stats[stat]){
			console.log(stat + " value: " + this.stats[stat] + " changed to " + value);
			this.stats[stat] = value;
		}else{
			console.log(stat + " doesn't exist");
			return;
		};
	},
	calculateStats: function(x){
		var curRace = Game.races[this.race];
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
	}
});
var AiLogic = $.trait({
	meta_onInit: function(data){
		if(data.ailogic){
			conlose.log("Ai already added");
		}else{
			data.ailogic = {
			aiChoice: null,
			playStep: 0,
		
			findAllCards: function(){ // возвращаем массив карт из деки.
				var spadesCard = this.searchLear("spades"); 
				var crossCard = this.searchLear("cross");
				var diamondsCard = this.searchLear("diamonds");
				var heartsCard = this.searchLear("hearts");
				return [spadesCard, crossCard, diamondsCard, heartsCard];
			},
		
			aiAttack: function(priority){ // функция генерации массива карт дял выкладки в боевую деку, Это атака.
				var tempArr = this.findAllCards();
				var cardSpades = tempArr[0];
				var cardCross = tempArr[1];
				var cardDiamonds = tempArr[2];
				var cardHearts = tempArr[3];
				if ( priority == "AP" ){ //ArmorPiercing
					if( cardSpades.length > 1 && cardCross.length > 0){ //spades+spades+cross
						if (cardSpades[1] > cardCross[0]){ // првоеряем, какая комбинация лучше, урон_х2 или бронебой_х2
							return [cardSpades[0], cardSpades[1], cardCross[0]];
						}else{
							return [cardSpades[0], cardCross[0], cardSpades[1]];
						};	
					}else if( cardSpades.length == 1 && cardCross.length > 1){ //spades+cross+cross
						return [cardSpades[0], cardCross[0], cardCross[1]];
					}else if( cardSpades.length == 1 && cardCross.length == 1){ //spades+cross+x ->
						if (cardDiamonds.length > 0){
							return [cardSpades[0], cardCross[0], cardDiamonds[0]];
						}else{
							return [cardSpades[0], cardHearts[0], cardCross[0]];
						};
					}else{
						return false;
					};
				}else if( priority == "LL" ){ // LifeLeech 
					if(Game.enemy.stats.HP > Game.enemy.getStats("HP")/2){ 
						if( cardSpades.length > 1 && cardHearts.length > 0){ //spades+spades+hearts
							return [cardSpades[0], cardSpades[1], cardHearts[0]]; 
					}else if( cardSpades.length > 0 && cardHearts.length > 0 && cardCross.length > 0 ){ //spades+cross+hearts
							return [cardSpades[0], cardCross[0], cardHearts[0]];
						}else if( cardSpades.length > 0 && cardHearts.length > 1){ //spades+hearts+hearts
							return [cardSpades[0], cardHearts[0], cardHearts[1]];
						}else{ return false;};
					}else{
						if( cardSpades.length > 0 && cardHearts.length > 1){ //spades+hearts+hearts
							return [cardSpades[0], cardHearts[0], cardHearts[1]];
						}else if( cardSpades.length > 1 && cardHearts.length > 0 ){ //spades+hearts+spades
							return [cardSpades[0], cardHearts[0], cardSpades[1]];
						}else if( cardSpades.length > 0 && cardHearts.length > 0 && cardCross.length > 0){ //spades+cross+hearts
							return [cardSpades[0], cardCross[0], cardHearts[0]];
						}else{ return false;};
					};			
				}else if(priority == "MA"){ // ManaAttack;
					if( cardSpades.length > 0 && cardDiamonds.length > 0 && cardHearts.length > 0 ){ //spades+diamonds+hearts
						return [cardSpades[0], cardDiamonds[0], cardHearts[0]];
					}else if( cardSpades.length > 0 && cardDiamonds.length > 0 && cardCross.length > 0 ){ //spades+diamonds+cross
						return [cardSpades[0], cardDiamonds[0], cardCross[0]];
					}else if( cardSpades.length > 0 && cardDiamonds.length > 1 ){ //spades+diamonds+diamonds
						return [cardSpades[0], cardDiamonds[0], cardDiamonds[1]];
					}else if(  cardSpades.length > 1 && cardDiamonds.length > 0 ){ //spades+diamonds+spades
						return [cardSpades[0], cardDiamonds[0], cardSpades[1]];
					}else{ return false;};
				}else{ // linearAttack;
					if ( cardSpades.length > 2 ){
						return [cardSpades[0], cardSpades[1], cardSpades[2]];
					}else if( cardSpades.length > 1 ){
						var thirdCard = cardCross[0] || cardDiamonds[0] || cardHearts[0];
						return [cardSpades[0], cardSpades[1], thirdCard];
					}else if( cardSpades.length == 1 ){
						var secondCard = cardCross[0] || cardDiamonds[0] || cardHearts[0];
						var thirdCard = cardCross[1] || cardDiamonds[1] || cardHearts[1];
						return [cardSpades[0], secondCard, thirdCard];
					}else{ return false;};
				};
			},
		
			aiDefense: function(priority, variant){//функция генерации массива карт дял выкладки. Это бафы, дебафы и восстановление.
				var tempArr = this.findAllCards();
				var cardSpades = tempArr[0];
				var cardCross = tempArr[1];
				var cardDiamonds = tempArr[2];
				var cardHearts = tempArr[3];
			
				if ( variant == "SU" ){
					var variantCard = cardDiamonds;
						if (variantCard[0]){
						var firstCard = variantCard[0];
						cardDiamonds.slice(0, 1);
					}else{ return false;};
				}else if( variant == "RE" ){
					var variantCard = cardCross;
					if (variantCard[0]){
						var firstCard = variantCard[0];
						cardCross.slice(0, 1);
					}else{ return false;};
				}else{
					var variantCard = cardHearts;
					if (variantCard[0]){
						var firstCard = variantCard[0];
						cardHearts.slice(0, 1);
					}else{ return false;};
				};
			
				if ( priority == "ATK"){
					if ( cardSpades.length > 1){
						return [firstCard, cardSpades[0], cardSpades[1]];
					}else{
						return false;
					};
				}else if( priority == "MP"){
					if ( cardDiamonds.length > 0 && cardSpades.length > 0 ){
						return [firstCard, cardSpades[0], cardDiamonds[0]];
					}else{
						return false;
					};
				}else if( priority == "AP" ){
					if ( cardCross.length > 0 && cardSpades.length > 0 ){
						return [firstCard, cardSpades[0], cardCross[0]];
					}else{
						return false;
					};
				}else if( priority == "LL" ){
					if ( cardHearts.length > 0 && cardSpades.length > 0 ){
						return [firstCard, cardSpades[0], cardHearts[0]];
					}else{
						return false;
					};
				}else if( priority == "STR"){
					if ( cardDiamonds.length > 0 && cardSpades.length > 0 ){
						return [firstCard, cardDiamonds[0], cardSpades[0]];
					}else{
						return false;
					};
				}else if( priority == "INT" ){
					if ( cardDiamonds.length > 2 ){
						return [firstCard, cardDiamonds[0], cardDiamonds[1]];
					}else{
						return false;
					};
				}else if( priority == "AGI" ){
					if ( cardDiamonds.length > 0 && cardCross.length > 0 ){
						return [firstCard, cardDiamonds[0], cardCross[0]];
					}else{
						return false;
					};
				}else if( priority == "END" ){
					if ( cardDiamonds.length > 0 && cardHearts.length > 0 ){
						return [firstCard, cardDiamonds[0], cardHearts[0]];
					}else{
						return false;
					};
				}else if( priority == "MR" ){
					if ( cardDiamonds.length > 0 && cardCross.length > 0 ){
						return [firstCard, cardCross[0], cardDiamonds[0]];
					}else{
						return false;
					};
				}else if( priority == "DEF" ){
					if ( cardCross.length > 1 ){
						return [firstCard, cardCross[0], cardCross[1]];
					}else{
						return false;
					};
				}else if( priority == "HR" ){
					if ( cardCross.length > 0 && cardHearts.length > 0 ){
						return [firstCard, cardCross[0], cardHearts[0]];
					}else{
						return false;
					};
				}else if( priority == "DDG" ){
					if ( cardspades.length > 0 && cardHearts.length > 0 ){
						return [firstCard, cardHearts[0], cardSpades[0]];
					}else{
						return false;
					};
				}else if( priority == "BR" ){
					if ( cardDiamonds.length > 0 && cardHearts.length > 0 ){
						return [firstCard, cardHearts[0], cardDiamonds[0]];
					}else{
						return false;
					};
				}else if( priority == "HP" ){
					if ( cardHearts.length > 1 ){
						return [firstCard, cardHearts[0], cardHearts[1]];
					}else{
						return false;
					};
				}else{
					return false;
				};
			}, 
		
			analysis: function(play){ // функция анализа ситуации, грубая, но работает так, как я задумывал.
				var arrStats = [];
				for ( var index in Game.enemy.stats ){
					if( Game.enemy.getStats[index] < Game.enemy.calculateStats(index) ){
						arrStats.push(index);
					};
				};
				if (play == "attack"){

					var arrAtkAP = this.aiAttack("AP");
					var arrAtkLL = this.aiAttack("LL");
					var arrAtkMP = this.aiAttack("MP");
					var arrAtk = this.aiAttack("");
					var arrAttack = [arrAtkAP, arrAtkLL, arrAtkMP, arrAtk];	
					if ( arrAttack.length > 0 ){
						return [arrAtkAP, arrAtkLL, arrAtkMP, arrAtk];
					}else 
						return false;
				}else if( play == "recovery"){
					var arrRecovery = [];
					for (var i = 0; i < arrStats.length; i++){
						var number = aiDefense("RE", arrStats[i]);
						arrRecovery.push(number);
					};
					if ( arrRecovery.length > 0 ){
						return arrRecovery;
					}else 
						return false;
				}else if( play == "substract"){
					var arrSubstract = [];
					for (var i = 0; i < arrStats.length; i++){
						var number = aiDefense("SU", arrStats[i]);
						arrSubstract.push(number);
					};
					if ( arrSubstract.length > 0 ){
						return arrSubstract;
					}else 
						return false;
				}else{ // add
					var arrAdd = [];
					for (var i = 0; i < arrStats.length; i++){
						var number = aiDefense("ADD", arrStats[i]);
						arrAdd.push(number);
					};
					if ( arrAdd.length > 0 ){
						return arrAdd;
					}else 
						return false;
				};
	
			},
		
			collectingResults: function(){ // пытаюсь собрать все воедино, что бы уже отсюда выдавать в функции aiPlay готовый массив карт.
				var attackArr = this.analysis("attack");
				var attackAP = attackArr[0];
				var attackLL = attackArr[1];
				var attackMP = attackArr[2];
				var attackLinear = attackArr[3];
			
				var recoveryArr = this.analysis("recovery");
				var substractArr = this.analysis("substract");
				var addArr = this.analysis("add");
			
				var arrSelfStats = []; // собираю коллекцию статов, которые были уменьшены.
				for ( var index in Game.enemy.stats ){
					if( Game.enemy.getStats[index] < Game.enemy.calculateStats(index) ){
						arrSelfStats.push(index);
					};
				};
				arrSelfStats.sort(function(a,b){ return Game.enemy.stats.b - Game.enemy.stats.a }); // соритруем так, что бы стата, котора ябыла уменьшена больше всего, попала в начало массива.
			
				var arrEnemyStats = []; // собираю коллекцию статов, которые больше чем у бота.
				for ( var index in Game.player.stats ){
					if( Game.player.stats[index] > Game.enemy.stats[index] ){
						arrEnemyStats.push(index);
					};
				};
				arrEnemyStats.sort(function(a,b){ return Game.player.stats.b - Game.player.stats.a });  // сортируем, самое слиьное различие в первую очередь.
			
			//включаю логику:
			// 1. Попытка восстановить здоровье атакой, если нет - попытка восстановить здоровье с помщью бафа и восстановления.
			// 2. Если здорвье впорядке, мы пытаемся навязать атаку, любым способом.
			// 3. Если не получается атаковать, пытаемся восстановить себе статы, если такие есть
			// 4. Если со статами все впорядке, пытаемся уменьшить статы у  противника.
			// 5. Если ничего из перечисленного не получается, пропускаем ход.
				if ( (Game.enemy.stats.HP < Game.enemy.calculateStats("HP")/2) && attackLL  ){  //1; attackArr[1] == "LL" - lifeLeech
					var cardArr = aiAttack("LL")
					return cardArr;
				}else if( (Game.enemy.stats.HP < Game.enemy.calculateStats("HP")/2) && (recoveryArr || addArr) ) {
					if( recoveryArr[arrSelfStats.indexOf["HP"]] != false ){
						var cardArr = this.aiDefense("RE", "HP");
						return cardArr;
					}else if( addArr[arrSelfStats.indexOf["HP"]] != false ){
						var cardArr = this.aiDefense("ADD", "HP");
						return cardArr;
					}else{};
				}else{};
			
				if ( attackAP || attackLinear || attackLL ){ //2
					var tempNumber = attackAP || attackLinear || attackLL;
					return tempNumber;
				}else{};
			
				if ( arrSelfStats.length > 0 && (recoveryArr || addArr) ){ //3
					for (var i = 0; i < arrSelfStats.length; i++){
						if( recoveryArr[arrSelfStats.indexOf[i]] != false ){
							return recoveryArr[i];
							break;
						}else if( addArr[arrSelfStats.indexOf[i]] != false ){
							return addArr[i];
							break;
						}else{};
					};
				}else{};
			
				if( arrEnemyStats.length > 0 && substractArr ){ //4
					for (var i = 0; i < arrEnemyStats.length; i++){
						if( substractArr[arrSelfStats.indexOf[i]] != false ){
							return substractArr[i];
							break;
						}else{};
					};
				}else{};
			
				return false; //5

			},
		
			aiPlay: function(delta){ // работает с массивом карт, функция выкладки карт на боевую деку.
				if (this.aiChoice === null){
					this.aiChoice = this.collectingResults();
				}
				if (this.aiChoice.length > 0){
					if (this.playStep >= 1250){
						Game.battleground.moveCardToBattle(Game.enemy, this.aiChoice[0]);
						this.aiChoice.splice(0, 1);
						this.playStep = 0;
					}else{
						this.playStep += delta;
					}
				}else{
					this.aiChoice = null;
					Game.battleground.countdownEnded = true;
					Game.battleground.aiRunning = false;
				}

			},
		
			searchLear: function(lear){ // функиця поиска карты по масти
				var tempArr = [];
				for (var i = 0; i < Game.enemy.deck.length; i++){
					if( Game.enemy.deck[i][0] == lear ){
						tempArr.push(Game.enemy.deck[i]);
					}else{
					}
				};
				tempArr.sort(function (a, b){ return b[1] - a[1]; }); // сортируем, что бы большим значением были вначале
				return tempArr;
			},
		
		}
		}
		
	},
	
	generateBot: function(){
		var randomRace = ["human", "elf", "orc", "troll", "werewolf", "dwarf", "goblin", "gnome", "vampire"][Math.round(Math.random()*8)];
		Game.enemy = new Player("Robot", randomRace, 0, Math.round(Math.random()*10));
		Game.enemy.id = "enemy";
		Game.enemy.meta_onInit(Game.enemy);
		console.log("enemy(bot) is initialized");
	}
});

var Combos = $.trait({
	meta_onInit: function(data){},
			findCombo: function(player){
				var card1cost = player.battleDeck[0][1];
				var card2cost = player.battleDeck[1][1];
				var card3cost = player.battleDeck[2][1];
				var card1lear = player.battleDeck[0][0];
				var card2lear = player.battleDeck[1][0];
				var card3lear = player.battleDeck[2][0];

				for (var j = 3; j < player.battleDeck.length; j++){
					if( player.battleDeck[j][0] == card1lear){
						card1cost += player.battleDeck[j][1];
					}else if( player.battleDeck[j][0] == card2lear ){
						card2cost += player.battleDeck[j][1];
					}else{
						card3cost += player.battleDeck[j][1];
					}
				}
		
				var comboArrayCosts = [card1cost, card2cost, card3cost];
				var comboArrayLear = [card1lear, card2lear, card3lear];
				return this.doCombo( comboArrayLear, comboArrayCosts, player );
				},
	
			doCombo: function(comboArr, costsArr, player){
			//обратить внимание сюда - castCombo  - то, что мы возвращаем в переменую player.damage, для дальнейшего использования.
				var castCombo = {value:0, stat:null, to:null, value2:0, effect:null, value3:0, effect2:null, info:null, toString: function(){ return "value=" + this.value + "; stat=" + this.stat + "; to=" +this.to + "; value2=" + this.value2 + "; effect=" + this.effect + "; value3=" + this.value3 + "; effect2=" + this.effect2} }; // effect: AP(armorPiercing), RE(restore), ADD(add(++)), SU(substract)
				var card1cost = costsArr[0];
				var card2cost = costsArr[1];
				var card3cost = costsArr[2];
				var card1lear = comboArr[0];
				var card2lear = comboArr[1];
				var card3lear = comboArr[2];

				if ( card1lear == "spades" ){
					if ( card2lear == "spades" ){
						if ( card3lear == "spades" ){ // критический урон (х3)
							castCombo.value = player.stats.ATK+((card2cost+card3cost)*3)*card1cost/100;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.info = "Критический урон (х3)";
					
						}else if ( card3lear == "diamonds" ){ // критический урон (х2) с использованием маны 
							castCombo.value = player.stats.ATK +((card2cost)*2)+(player.stats.MP*card3cost/10)*card1cost/100;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.info = "критический урон (х2) с использованием маны";
					
						}else if ( card3lear == "cross" ){ // критический урон (х2) пробивающий броню 
							castCombo.value = player.stats.ATK+((card2cost)*2)*card1cost/100;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.value2 = card3cost*card1cost/100;
							castCombo.effect = "AP";
							castCombo.info = "критический урон (х2) пробивающий броню";
				
						}else{ // критчиеский урон (х2) с вампиризмом
							castCombo.value = player.stats.ATK+(card2cost*2)*card1cost/100;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.value2 = player.stats.ATK*card3cost/100;
							castCombo.effect = "RE";
							castCombo.info = "критчиеский урон (х2) с вампиризмом";
						};
				
					}else if( card2lear == "diamonds" ){
						if ( card3lear == "spades" ){ // урон (х2)  по мане  
							castCombo.value = player.stats.ATK+((card3cost*2)*card1cost/100)*card3cost/100;
							castCombo.stat = "MP";
							castCombo.effect = "SU";
							castCombo.to = "enemy";
							castCombo.info = "урон (х2)  по мане";
						
						}else if ( card3lear == "diamonds" ){ // Урон по мане с использованием маны 
							castCombo.value = player.stats.ATK+card2cost+(player.stats.MP*card3cost/10)*card1cost/100;
							castCombo.stat = "MP";
							castCombo.effect = "SU";
							castCombo.to = "enemy";
							castCombo.info = "урон по мане с использованием маны";
					
						}else if ( card3lear == "cross" ){ // урон по мане с пробиванием брони 
							castCombo.value = player.stats.ATK + card2cost*card1cost/100;
							castCombo.stat = "MP";
							castCombo.to = "enemy";
							castCombo.value2 = card3cost*card1cost/100;
							castCombo.effect2 = "AP";
							castCombo.effect = "SU";
							castCombo.info = "урон по мане с пробиванием брони";
				
						}else{ //урон по мане с вампиризмом overmana не может быть!
							castCombo.value = player.stats.ATK + card2cost*card1cost/100 ;
							castCombo.stat = "MP";
							castCombo.to = "enemy";
							castCombo.value2 = player.stats.ATK*card3cost*card1cost/100;
							castCombo.effect2 = "RE";
							castCombo.effect = "SU";
							castCombo.info = "урон по мане с вампиризмом";
						};
				
					}else if( card2lear == "cross" ){
						if ( card3lear == "spades" ){ // бронебойный (х2) урон
							castCombo.value =  player.stats.ATK + card3cost*card1cost/100; 
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.value2 = (card2cost*2)*card1cost/100;
							castCombo.effect = "AP";
							castCombo.info = "бронебойный (х2) урон";
					
						}else if ( card3lear == "diamonds" ){ // бронебойный (х2) урон с использованием маны
							castCombo.value = player.stats.ATK + (player.stats.MP*card3cost)*card1cost/100; 
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.value2 = (card2cost*2)*card1cost/100;
							castCombo.effect = "AP";
							castCombo.info = "бронебойный (х2) урон с использованием маны";
					
						}else if ( card3lear == "cross" ){ // бронебойный (х3) урон.
							castCombo.value = player.stats.ATK;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.value2 = (card2cost*3)*card1cost/100;
							castCombo.effect = "AP";
							castCombo.info = "бронебойный (х3) урон";
							
						}else{ //бронебойный (х2) урон с вампиризмом
							castCombo.value = player.stats.ATK;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.value2 = (card2cost*2)*card1cost/100;
							castCombo.effect = "AP";
							castCombo.value3 = player.stats.ATK*card3cost/100;
							castCombo.effect2 = "RE";
							castCombo.info = "бронебойный (х2) урон с вампиризмом";
						};
				
					}else{
						if ( card3lear == "spades" ){ //урон с вампиризмом
							castCombo.value = player.stats.ATK + card2cost*card1cost/100;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.info = "урон с вампиризмом";
							castcombo.value2 = player.stats.ATK*card3cost/100;
							castcombo.effect = "RE";
							
						}else if ( card3lear == "diamonds" ){ //урон с маной
							castCombo.value = player.stats.ATK + card2cost*card1cost/100 + (player.stats.MP + card3cost)*card1cost/100;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.info = "урон с маной";
					
						}else if ( card3lear == "cross" ){ // урон с пробиванием
							castCombo.value =  player.stats.ATK + card2cost*card1cost/100;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.value2 = card3cost*card1cost/100;
							castCombo.effect = "AP";
							castCombo.info = "урон с пробиванием";
					
						}else{ // урон с вампиризмом (х3)
							castCombo.value = player.stats.ATK
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.effect = "RE"
							castCombo.value2 = player.stats.ATK*(card1cost/25)*(card2cost+card3cost)*3/100;
							castCombo.info = "урон с вампиризмом (х3)";
						};
					};
				}else if ( card1lear == "diamonds" ){
					if ( card2lear == "spades" ){
						if ( card3lear == "spades" ){ // уменьшение урона
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "ATK";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "уменьшение урона";
					
						}else if ( card3lear == "diamonds" ){ //уменьшение базового значения маны
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "MP";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "уменьшение базового значения маны";
					
						}else if ( card3lear == "cross" ){ //уменьшение бронебойности
							castCombo.value = (player.stats.AGI*card1cost/40 + card2cost*card3cost/100)/10;
							castCombo.stat = "AP";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "уменьшение бронебойности";
					
						}else{ //уменьшение вампиризма
							castCombo.value = (player.stats.AGI*card1cost/40 + card2cost*card3cost/100)/10;
							castCombo.stat = "LL";
							castCOmbo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "уменьшение вампиризма";					
						};
				
					}else if( card2lear == "diamonds" ){
						if ( card3lear == "spades" ){ //уменьшение силы
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "STR";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "уменьшение силы";
					
						}else if ( card3lear == "diamonds" ){ //уменьшение интеллекта
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "INT";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "уменьшение интеллекта";
					
						}else if ( card3lear == "cross" ){ //уменьшение ловкости
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "AGI";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "уменьшение ловкости";
					
						}else{ // уменьшение выносливости
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "END";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "уменьшение выносливости";
						};
				
					}else if( card2lear == "cross" ){
						if ( card3lear == "spades" ){
							alert( "комбинации нет, скорей всего будет ошибка или зависон игры")
					// НУЖНА КОМБИНАЦИЯ!!!!!!!!!!!!!!!!!!!
						}else if ( card3lear == "diamonds" ){ // уменьшение восстановление маны
							castCombo.value = (player.stats.AGI*card1cost/40 + card2cost*card3cost/100)/10;
							castCombo.stat = "MR";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "уменьшение восстановление маны";
							
						}else if ( card3lear == "cross" ){ // уменьшение брони
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "DEF";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "уменьшение брони";
						
						}else{ // уменьшение силы лечения
							castCombo.value = (player.stats.AGI*card1cost/40 + card2cost*card3cost/100)/10;
							castCombo.stat = "HR";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "уменьшение силы лечения";
						};
				
					}else{
						if ( card3lear == "spades" ){ // уменьшение уворота
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "DDG";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "уменьшение уворота";
					
						}else if ( card3lear == "diamonds" ){ //уменьшение блок рейта
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "BR";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "уменьшение блок рейта";
					
						}else if ( card3lear == "cross" ){
							alert( "комбинации нет, скорей всего будет ошибка или зависон игры")
							// НУЖНА КОМБИНАЦИЯ!!!!!!!!!!!!!!!!!!!
						}else{ // уменьшение ХП
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "уменьшение жизней";
						};
					};
				}else if ( card1lear == "cross" ){
					if ( card2lear == "spades" ){
						if ( card3lear == "spades" ){ // восстановление урона
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "ATK";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "восстановление урона";
						
						}else if ( card3lear == "diamonds" ){ // Восстановление маны
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "MP";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "восстановление маны";
					
						}else if ( card3lear == "cross" ){ // восстановление пробивания 
							castCombo.value = (player.stats.END*card1cost/40 + card2cost*card3cost/100)/10; 
							castCombo.stat = "AP";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "восстановление бронебойности";
					
						}else{ // восстановление вампиризма
							castCombo.value = (player.stats.END*card1cost/40 + card2cost*card3cost/100)/10;
							castCombo.stat = "LL";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "восстановление вампиризма";
						};
					}else if( card2lear == "diamonds" ){
						if ( card3lear == "spades" ){ // восстанвление силы
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "STR";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "восстановление силы";
					
						}else if ( card3lear == "diamonds" ){ //восстановление интеллекта
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "INT";
							castCombo.to = "self"; 
							castCombo.effect = "RE";
							castCombo.info = "восстановление интеллекта";
							
						}else if ( card3lear == "cross" ){ //восстановление ловкости
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "AGI";
							castCombo.to = "self"; 
							castCombo.effect = "RE";
							castCombo.info = "восстановление ловкости";
					
						}else{ // восстановление выносливости
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "END";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "восстановление выносливости";
						};
				
					}else if( card2lear == "cross" ){
						if ( card3lear == "spades" ){ 
						alert( "комбинации нет, скорей всего будет ошибка или зависон игры")
							// НУЖНА КОМБИНАЦИЯ!!!!!!!!!!!!!!!!!!!
						}else if ( card3lear == "diamonds" ){ // восстановление восстановления маны
							castCombo.value = (player.stats.END*card1cost/40 + card2cost*card3cost/100)/10;
							castCombo.stat = "MR";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "восстановление восстановления маны";
						
						}else if ( card3lear == "cross" ){// восстановление брони 
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "DEF";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "восстановление брони";
					
						}else{ //восстановление силы лечения
							castCombo.value = (player.stats.END*card1cost/40 + card2cost*card3cost/100)/10;
							castCombo.stat = "HR";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "восстановление силы лечения";
						};
				
					}else{
						if ( card3lear == "spades" ){ // восстановление уворота
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "DDG";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "восстановление уворота";
					
						}else if ( card3lear == "diamonds" ){ // восстановление блок рейта
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "BR";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "восстановление блок рейта";
					
						}else if ( card3lear == "cross" ){
							alert( "комбинации нет, скорей всего будет ошибка или зависон игры")
							// НУЖНА КОМБИНАЦИЯ!!!!!!!!!!!!!!!!!!!
						}else{ // восстановление ХП
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "HP";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "восстановление жизней";
						};
					};	
				}else{
					if ( card2lear == "spades" ){
						if ( card3lear == "spades" ){ // увеличение урона
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100; 
							castCombo.stat = "ATK";
							castCombo.to = "self";
							castCombo.effect = "ADD";
							castCombo.info = "увеличение урона";
					
						}else if ( card3lear == "diamonds" ){// увеличение маны
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100; 
							castCombo.stat = "MP";
							castCombo.to = "self";
							castCombo.effect = "ADD";
							castCombo.info = "увеличение маны";					
					 
						}else if ( card3lear == "cross" ){ //увеличение пробивания
							castCombo.value = (player.stats.INT*card1cost/40 + card2cost*card3cost/100)/10; 
							castCombo.stat = "AP";
							castCombo.to = "self";
							castCombo.effect = "ADD";
							castCombo.info = "увеличение пробивания";						
					 
						}else{ // увеличение вампиризма
							castCombo.value = (player.stats.INT*card1cost/40 + card2cost*card3cost/100)/10; 
							castCombo.stat = "LL";
							castCombo.to = "self";
							castCombo.effect = "ADD";
							castCombo.info = "увеличение вампиризма";	
					
						};
					}else if( card2lear == "diamonds" ){
						if ( card3lear == "spades" ){ // увеличение силы
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100; 
							castCombo.stat = "STR";
							castCombo.to = "self";
							castCombo.effect = "ADD";
							castCombo.info = "увеличение силы";					
					 
						}else if ( card3lear == "diamonds" ){ // увеличение интеллекта
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100;  
							castCombo.stat = "INT";
							castCombo.to = "self";
							castCombo.effect = "ADD"; 
							castCombo.info = "увеличение интеллекта";
					 
						}else if ( card3lear == "cross" ){ // увеличение ловкости
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100; 
							castCombo.stat = "AGI";
							castCombo.to = "self";
							castCombo.effect = "ADD";
							castCombo.info = "увеличение ловкости";
					 
						}else{ // увеличение выносливости
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100;  
							castCombo.stat = "END";
							castCombo.to = "self";
							castCombo.effect = "ADD";
							castCombo.info = "увеличение выносливости";					
							
						};
					}else if( card2lear == "cross" ){
						if ( card3lear == "spades" ){
							alert( "комбинации нет, скорей всего будет ошибка или зависон игры")
							// НУЖНА КОМБИНАЦИЯ!!!!!!!!!!!!!!!!!!!
						}else if ( card3lear == "diamonds" ){ // увеличение восстановления маны
							castCombo.value = (player.stats.INT*card1cost/40 + card2cost*card3cost/100)/10; 
							castCombo.stat = "MR";
							castCombo.to = "self";
							castCombo.effect = "ADD";
							castCombo.info = "увеличение восстановления маны";						
					
						}else if ( card3lear == "cross" ){ // увеличение брони
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100; 
							castCombo.stat = "DEF";
							castCombo.to = "self";
							castCombo.effect = "ADD"; 
							castCombo.info = "увеличение брони";
					
						}else{ // увеличение силы лечения
							castCombo.value = (player.stats.INT*card1cost/40 + card2cost*card3cost/100)/10;  
							castCombo.stat = "HR";
							castCombo.to = "self";
							castCombo.effect = "ADD"; 
							castCombo.info = "увеличение силы лечения";
						};
					
					}else{
						if ( card3lear == "spades" ){ // увеличение уворота
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100; 
							castCombo.stat = "DDG";
							castCombo.to = "self";
							castCombo.effect = "ADD"; 
							castCombo.info = "увеличение уворота";
					
						}else if ( card3lear == "diamonds" ){// увеличение блок рейта
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100;  
							castCombo.stat = "BR";
							castCombo.to = "self";
							castCombo.effect = "ADD"; 
							castCombo.info = "увеличение блок рейта";
					
						}else if ( card3lear == "cross" ){
							// НУЖНА КОМБИНАЦИЯ!!!!!!!!!!!!!!!!!!!
							alert( "комбинации нет, скорей всего будет ошибка или зависон игры")
						}else{
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100;  
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
					var costsArr = [Game.cards.costs[cardN1[1]], Game.cards.costs[cardN2[1]], Game.cards.costs[cardN3[1]]]; // делаем массив из достоинств, для последующего сложения
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
					console.log("Player=" + player.name + "; " + player.damage.toString());
					return;
			
				}else{
					player.damage = {};
					return; 
				}
			},
	
			doDamage: function(player1, player2){
		
				if ( player1.damage.to == "self" ){
					if (player1.damage.effect == "RE"){
						if( player1.damage.stat == "HP"){
							var multiplier = player1.stats.HR;
						}else if( player1.damage.stat == "MR" ){
							var multiplier = player1.stats.MR;
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
					if( player1.damage.effect == "SU" && player1.damage.effect2 == "RE"){
						var dmg = player1.damage.value - player2.stats.DEF;
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
						var dmg = player1.damage.value - (player2.stats.DEF - player1.damage.value2*player1.stats.AP);
						if (dmg > 0 ){
							player2.stats[player1.damage.stat] -= dmg;
								if (player2.stats[player1.damage.stat] < 0) {
									player2.stats[player1.damage.stat] = 0;
								}else{};
						return;
						};
					}else if (player1.damage.effect == "SU"){
						var dmg = player1.damage.value - player2.stats.DEF;
						if (dmg > 0){
							player2.stats[player1.damage.stat] -= dmg;
							if (player2.stats[player1.damage.stat] < 0) {
								player2.stats[player1.damage.stat] = 0;
								return;
							};
						};
					}else if (player1.damage.effect == "RE"){
						var dmg = player1.damage.value - player2.stats.DEF;
						if( dmg > 0 ){
							player2.stats[player1.damage.stat] -= dmg;
							player1.stats[player1.damage.stat] += player1.damage.value2;
							if (player1.stats[player1.damage.stat] > player1.getStats[player1.damage.stat]){
								player1.stats[player1.damage.stat] = player1.getStats[player1.damage.stat];
								return;
							}else{};
						}else{};
					}else{};
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
								}else{};
							}else{};	
					}else if (player1.damage.effect == "AP"){
						var dmg = player1.damage.value - (player2.stats.DEF - player1.damage.value2*player1.stats.AP);
							if( dmg > 0 ){
								player2.stats[player1.damage.stat] -= dmg;
								return;
							}else{};	
					}else{
						var dmg = player1.damage.value - player2.stats.DEF;
							if( dmg > 0 ){
								player2.stats[player1.damage.stat] -= dmg;
								return;
							}else{};
					};
				};

			}
})

var Player = $.klass({
	init: function(name, race, experience, lvl){
		this.name = name;
		this.race = race;
		this.experience = experience;
		this.level = lvl;
		this.deck = null;
		this.battleDeck = null;
		this.id = null;
		this.damage = null;
	},
	
	meta_onInit: function(data){
		var allTraits = this.constructor._klass.traits;
			for (var i = 0; i < allTraits.length; i++){
				allTraits[i].functions.meta_onInit(data);
			}
		this.fillStats();
		return;
	},
	
	
	fillStats : function(){
		if (this.stats){
			for(var index in this.stats) { 
				this.stats[index] = this.calculateStats(index);
			};
			console.log("stats are filled");
			return;
		}else{
			console.log("stats are not available");
			return;
		}
	},

	initDecks: function(){
		this.deck = [];
		this.battleDeck = [];
	},
	
	_traits: [Stats]
});

var Battleground = $.klass({
	init: function (name, timer, cards, cardsEveryTurn){
	this.name = name;
	this.timer = timer;
	this.cards = cards;
	this.cardsEveryTurn = cardsEveryTurn;
	this.round = null;
	this.battleWin = null;
	this.roundStarted = false;
	this.roundEnded = false;
	this.turnCounter = null;
	this.firstPlayerTurn = null;
	this.currentPlayerTurn = null;
	this.timeLeft = null;
	this.countdownRun = false;
	this.countdownRunning = false;
	this.countdownStep = 0;
	this.countdownEnded = false;
	this.turnStarted = false;
	this.turnRunning = false;
	this.turnEnded = false;
	this.needCards = false;
	this.aiRunning = false;
	this.battleEnded = false;
	this.giveCardStep = 0;
	this.cardsLeft = undefined;
	},
	
	battleStart: function (){	 // начало Игры.
		this.firstPlayerTurn = (Math.round(Math.random())) ? Game.player : Game.enemy;
		this.currentPlayerTurn = this.firstPlayerTurn;
		this.round = 0;
		Game.player.initDecks();
		Game.enemy.initDecks();
		console.log("battlestart is complete, first turn = " + this.firstPlayerTurn.id);
		return;
	},
 
	battleEnd: function(){ // конец игры ( вывод сообщений подсчет очков, статистика )
		if (this.battleWin == "player"){
			alert ( " ВЫ одержали ПОБЕДУ! " );
			
		}else{
			alert ( " ВЫ потерпели ПОРАЖЕНИЕ " );
		}
		Game.stop();
	},
	
	roundStart: function() {
		this.round++;
		this.turnCounter = 0;
		this.needCards = true;
		this.turnStarted = false;
		this.cardsLeft = (this.round - 1) ? this.cardsEveryTurn : this.cards;
		console.log("Round started. Current round is " + this.round);
		return;
	},
	
	roundEnd: function(){
		$( ".overlay-top-combo" ).empty();
		$( ".overlay-bot-combo" ).empty();
		var nextPlayer = (this.currentPlayerTurn.id == "player") ? Game.enemy : Game.player;
		// проверяем, положил ли игрок карты в боевую деку или нет.
		this.calculateDamage(this.currentPlayerTurn);
		this.calculateDamage(nextPlayer);
		if (this.currentPlayerTurn.battleDeck[0] && nextPlayer.battleDeck[0]){
			if (nextPlayer.battleDeck[0][0] == "spades"){
				this.doDamage(this.currentPlayerTurn, nextPlayer);
				this.doDamage(nextPlayer, this.currentPlayerTurn);
			}else{
				this.doDamage(nextPlayer, this.currentPlayerTurn);
				this.doDamage(this.currentPlayerTurn, nextPlayer);
			}
		}else if (this.currentPlayerTurn.battleDeck[0]){
			this.doDamage(this.currentPlayerTurn, nextPlayer);
		}else if (nextPlayer.battleDeck[0]){
			this.doDamage(nextPlayer, this.currentPlayerTurn);
		}
		// заполняю визуализированные статы игрока и противника
		function doRefreshUiStats(){
			var playerHpRatio = Game.player.stats.HP/Game.player.calculateStats("HP");
			var percentHP = (playerHpRatio => 1) ? "100%" : playerHpRatio*100 + "%";
			$("#bpb-hp span").css("width", percentHP);
			var playerMpRatio = Game.player.stats.MP/Game.player.calculateStats("MP");
			var percentMP = (playerMpRatio => 1) ? "100%" : playerMpRatio*100 + "%";
			$("#bpb-mp span").css("width", percentMP);
			$("#bpb-hp span").text(Math.round(Game.player.stats.HP));
			$("#bpb-mp span").text(Math.round(Game.player.stats.MP));
			$("#bottom-atk").text(Math.round(Game.player.stats.ATK));
			$("#bottom-def").text(Math.round(Game.player.stats.DEF));

			var enemyHpRatio = Game.enemy.stats.HP/Game.enemy.calculateStats("HP");
			var percentHP = (enemyHpRatio => 1) ? "100%" : enemyHpRatio*100 + "%";
			$("#tpb-hp span").css("width", percentHP);
			var enemyMpRatio = Game.enemy.stats.MP/Game.enemy.calculateStats("MP");
			var percentHP = (enemyMpRatio => 1) ? "100%" : enemyMpRatio*100 + "%";
			$("#tpb-mp span").css("width", percentMP);
			$("#tpb-hp span").text(Math.round(Game.enemy.stats.HP));
			$("#tpb-mp span").text(Math.round(Game.enemy.stats.MP));
			$("#top-atk").text(Math.round(Game.enemy.stats.ATK));
			$("#top-def").text(Math.round(Game.enemy.stats.DEF));
		};
		// чистим боевую деку от прошлых значений.
		$("ul#top-battledeck li").remove();
		$("ul#bot-battledeck li").remove();
		this.currentPlayerTurn.battleDeck.length = 0; 
		nextPlayer.battleDeck.length = 0; 
		doRefreshUiStats();
		if (this.currentPlayerTurn.stats.HP <= 0){
			this.battleEnded = true;
			this.battleWin = nextPlayer.id
		}else if (nextPlayer.stats.HP <= 0){
			this.battleEnded = true;
			this.battleWin = this.currentPlayerTurn.id
		}else{
			this.roundStarted = false;
		}
		console.log("Round " + this.round + " ended");
		return;
	},
	
	turnStart: function (){ //начало хода для игрока
		this.timeLeft = this.timer;
		this.countdownRun = true;

		if (this.currentPlayerTurn.id == Game.enemy.id){ // проверяем, является ли текущий игрок ботом
			this.aiRunning = true;
			$("#turn").prop('disabled', true);
			$("ul.connectedSortable li").prop('disabled', true);

		}else{
			$("#turn").prop('disabled', false);
			$("ul.connectedSortable li").prop('disabled', false);
		}
		this.turnRunning = true;
		console.log("Turn started");
		return;
	},
 
	turnEnd: function (){ // заканчиваем ход
		this.turnRunning = false;
		this.countdownRun = false;
		// функция взята из мувКартТубатлле, не стал переделывать переменные
		if ( this.currentPlayerTurn.battleDeck.length < 3){ // возвращаем карты в деку, если игрок выложил 2 карты или 1 карту вместо 3-х
			for ( var i = 0; i < this.currentPlayerTurn.battleDeck.length; i++ ){
				this.currentPlayerTurn.deck.push(this.currentPlayerTurn.battleDeck[i]);
				var cardId = "." + this.currentPlayerTurn.battleDeck[i].join("") + "#" + this.currentPlayerTurn.id;
				var cardToBattle = (this.currentPlayerTurn.id == "enemy") ? $(".invisible") : $(".connectedSortable");
				$(cardId).appendTo(cardToBattle); 
			}
			this.currentPlayerTurn.battleDeck.length = 0; // после того как вернули карты, чистим боевую деку.
		}

		this.currentPlayerTurn = (this.currentPlayerTurn.id == Game.player.id) ? Game.enemy :  Game.player;
		if (this.turnCounter == 1){ // проверяем каждый ли сходил по 1 разу?
			this.roundEnded = true;
		}else{
			this.turnCounter++;
			this.turnStarted = false;	
		}
		console.log("turn ended");
		return;
	},
 
	generateCard: function(){ // генерация значений карты.
		var a = Math.floor(Math.random() * Game.cards.numbers.length);
		var b = Math.floor(Math.random() * Game.cards.types.length);
		return [Game.cards.types[b], Game.cards.numbers[a]];
	},
 
	giveCard: function (delta) { //раздача карт игроку.
		if (this.cardsLeft > 0){
			if (this.giveCardStep >= 1200){
				this.addCard(Game.player);
				this.addCard(Game.enemy);
				this.cardsLeft--;
				this.giveCardStep = 0;
			}else{
				this.giveCardStep += delta;
			}
		}else{
			this.needCards = false;
			console.log("All cards put into deck");
		}
	},
	
	addCard: function(player) { //даем карту игроку. // переделать функцию добавления карт, что бы можно было запускать с таймером.
		var card = this.generateCard(); // генерируем карту.

		function searchInArray(value, arr){
			var counter = 0
			for (var i = 0; i < arr.length; i++) {
				if (arr[i][0] == value[0] && arr[i][1] == value[1]){
					counter++
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
		
		if (player.id == "player"){ // если плеер - делаем *анимацию* и движение карт в его руки.
			$( uiCard ).appendTo($("ul.connectedSortable")).click( function(){
				Game.battleground.moveCardToBattle.apply(this, [player, card]);
			});
		}else{
			$( uiCard ).appendTo($("ul.invisible"));
		}
	},
	
	moveCardToBattle: function(player, card) { // функция описывающее само перемещение карты в боевую деку.
		var cardId = "." + card.join("") + "#" + player.id;
		function checkCard(player, card){ // проверка, можно ли положить карту, или нет.
			if (!Game.paused && Game.running && Game.battleground.currentPlayerTurn.id == player.id && Game.battleground.turnRunning){
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
			var cardToBattle = (player.id == "enemy") ? "ul#top-battledeck" : "ul#bot-battledeck";
			var comboOverlay = (player.id == "enemy") ? ".overlay-top-combo" : ".overlay-bot-combo";
			$(cardId).appendTo($(cardToBattle));
			if (player.id == Game.player.id){
				$(cardId).unbind( "click" );
				$(cardId).click(function(){ Game.battleground.moveCardToDeck(player, card);});
			}
			player.battleDeck.push(card); // пушим боевую деку игрока картой.
			var cardToDelete = player.deck.indexOf(card);
			player.deck.splice(cardToDelete, 1); //обязательное удаление карты из руки игрока. (!!!) - то место, когда задвоенные карты делают свою гадкую работу. (!!!)
		
		}else{
			$(cardId).effect("highlight", {color: "red"}, 300);	
		}
		if (player.battleDeck.length > 2){
			var combo = Game.battleground.findCombo(player);
			$( comboOverlay ).text(combo.info + " на " + combo.value);
		}else{
			$( comboOverlay ).empty();
		}

	},
	
	moveCardToDeck: function(player, card){
		var cardId = "." + card.join("") + "#" + player.id;
		if (player.id == Game.battleground.currentPlayerTurn.id && Game.battleground.turnRunning){
			$(cardId).appendTo($(".connectedSortable"));
			$(cardId).unbind( "click" );
			$(cardId).click(function(){ Game.battleground.moveCardToBattle(player, card);});
			player.deck.push(card); // возвращаем карту обратно.
			var cardToDelete = player.battleDeck.indexOf(card);
			player.battleDeck.splice(cardToDelete, 1);
			$("bot-battledeck").unbind('mouseenter mouseleave');
		}else{
			$(cardId).effect("highlight", {color: "red"}, 300);	
		}

	},
	
	runCountdown: function(){ // сам таймер хода.
		if (this.timeLeft >= 0){
			$("#time-left").text(this.timeLeft--); // показываем количество оставшися секунд.
		}else{
			this.countdownEnded = true;
			this.countdownRun = false;
		}
	},
	
	meta_onInit: function(data){
		var allTraits = this.constructor._klass.traits;
			for (var i = 0; i < allTraits.length; i++){
				allTraits[i].functions.meta_onInit(data);
			}
		return;
	},
	
	_traits: [AiLogic, Combos]
});

var Game = {
	
	battleground: null,
	player: null,
	enemy: null,
	fps: 60,
	tickStep: 1000/60,
	run: false,
	running: false,
	paused: false,
	startTime: undefined,
	lastTick: undefined,
	pausedTime: undefined,
	unpausedTime: undefined,
	animationVelocity: 1,
	
	start: function(){
		if (!this.run){
			this.run = true;
			this.startTime = this.now();
			this.lastTick = this.startTime;
			window.loopId = setInterval(this.tick.bind(this), 0);
		}
		
	},
	
	stop: function(){
		clearInterval(loopId);
		this.run = false;
	},
	
	pause: function(){
		this.paused = true;
		this.pausedTime = this.now();
	},
	
	unpause: function(){
		this.paused = false;
		this.unpausedTime = this.now();
	},
	
	now: function(){
		return $.now();
	},
	
	update: function(delta){
		if (this.battleground.battleEnded){
			this.battleground.battleEnd();
			this.battleground.battleEnded = true;
			return;
		}
		if (!this.running){
			this.battleground.battleStart();
			this.running = true;
			return;
		}
		if (!this.battleground.roundStarted){
			this.battleground.roundStart();
			this.battleground.roundStarted = true;
			return;
		}
		if (this.battleground.needCards){
			this.battleground.giveCard(delta);
			return;
		}
		if (!this.battleground.turnStarted){
			this.battleground.turnStart();
			this.battleground.turnStarted = true;
			return;
		}
		if (this.battleground.countdownRun){
			this.battleground.countdownStep += delta;
			if (this.battleground.countdownStep >= 1000){
				this.battleground.runCountdown();
				this.battleground.countdownStep = 0;
			}
		}
		if (this.battleground.aiRunning){
			// блокируем всю активность для игрока, пока ИИ ходит.
			this.battleground.ailogic.aiPlay(delta);
		}
		if (this.battleground.roundEnded){
			this.battleground.roundEnd();
			this.battleground.roundEnded = false;
			return;
		}
		if (this.battleground.countdownEnded){
			this.battleground.turnEnd()
			this.battleground.countdownEnded = false;
			return;
		}
	},
	
	draw: function(){

	},
	
	tick: function(){
		if (this.paused){
			return;
		}
		var time = this.now();
		var delta = time - this.lastTick;
		if (delta >= this.tickStep){
			this.update(delta);
			this.lastTick = time;

		}
		
		this.draw();
	},

	initialize: function(){

		//собираю информацию из данных от пользователя.
		var name = document.forms.preStart.elements.nickname.value;
		var cards = +document.forms.preStart.elements.cards.value;
		var timer = +document.forms.preStart.elements.timeturn.value;
		var cardsEveryTurn = +document.forms.preStart.elements.cardeveryturn.value;
		for (var i = 0;i < document.forms.preStart.elements.race.length; i++){
			if (document.forms.preStart.elements.race[i].selected == true){
				var race = document.forms.preStart.elements.race[i].value;
			}
		}
		var lvl = 0; // временно
		var exp = 0; // временно
		//генерирую полебоя.
		this.battleground = new Battleground("Hells gate", timer, cards, cardsEveryTurn);
		this.battleground.meta_onInit(this.battleground);
		console.log("Battleground initialized");
		//генерирую игрока.
		this.player = new Player(name, race, exp, lvl);
		this.player.meta_onInit(this.player);
		this.player.id = "player";
		console.log("player is initialized");
		//сгенерирую бота.
		console.log("bot start initializing");
		this.battleground.generateBot();
		//добавлю статы на UI
		this.initiBattleUi();
		//закрою модальное окно.
		$('#overlay').css('display', 'none');
		
		console.log("the game is initialized");
		//даем гейм старт.
		this.start();
	},

	
	cards : {
		numbers : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
		types : [ "spades", "cross", "hearts", "diamonds" ],
		costs : {1: 14, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 11: 11, 12: 12, 13: 13}
	},

	races : {
		human: {STR:5, END:5, AGI:5, INT:5, ATK:5, DEF:5, BR:0, DDG:2, HP:50, MP:50, AP:1, LL:1, HR:1, MR:1, 
			lvlup: {STR:1, END:1, AGI:1, INT:1, ATK:0, DEF:0.25, BR:0, DDG:0, HP:2, MP:2, AP:0, LL:0, HR:0, MR:0},
			avatar:"img/human.jpg"
		},
		
		elf: {STR:4, END:4, AGI:6, INT:6, ATK:4, DEF:4, BR:0, DDG:2, HP:40, MP:60, AP:1, LL:1, HR:1, MR:1, 
			lvlup: {STR:0.75, END:1.25, AGI:1, INT:1, ATK:0, DEF:0.25, BR:0, DDG:0.25, HP:1.75, MP:2.25, AP:0, LL:0, HR:0, MR:0},
			avatar:"img/elf.jpg"
		},
		
		troll: {STR:10, END:10, AGI:1, INT:1, ATK:5, DEF:1, BR:0, DDG:0, HP:90, MP:20, AP:1, LL:1, HR:2, MR:1,
			lvlup: {STR:2, END:2, AGI:0.25, INT:0.25, ATK:0, DEF:0, BR:0, DDG:0, HP:3, MP:0.5, AP:0, LL:0, HR:0, MR:0},
			avatar:"img/troll.jpg"
		},
		
		orc: {STR:9, END:7, AGI:2, INT:2, ATK:6, DEF:3, BR:0, DDG:3, HP:80, MP:20, AP:1, LL:1, HR:1, MR:1,
			lvlup: {STR:1.75, END:1.75, AGI:0.25, INT:0.25, ATK:0, DEF:0.25, BR:0, DDG:0, HP:2.5, MP:0.5, AP:0, LL:0, HR:0, MR:0},
			avatar:"img/orc.jpg"
		},
		
		werewolf: {STR:7, END:7, AGI:4, INT:2, ATK:6, DEF:2, BR:0, DDG:4, HP:70, MP:30, AP:2, LL:1, HR:1, MR:1,
			lvlup: {STR:1.75, END:1.5, AGI:0.5, INT:0.5, ATK:0, DEF:0.25, BR:0, DDG:0, HP:2.5, MP:0.5, AP:0, LL:0, HR:0, MR:0},
			avatar:"img/werewolf.jpg"
		},
		
		dwarf: {STR:9, END:7, AGI:3, INT:1, ATK:6, DEF:6, BR:0, DDG:0, HP:80, MP:20, AP:1, LL:1, HR:1, MR:1, 
			lvlup: {STR:1.5, END:1.5, AGI:0.75, INT:0.25, ATK:0, DEF:0.25, BR:0, DDG:0, HP:2.75, MP:0.75, AP:0, LL:0, HR:0, MR:0},
			avatar:"img/dwarf.jpg"
		},
		
		goblin: {STR:6, END:4, AGI:6, INT:4, ATK:4, DEF:2, BR:0, DDG:0, HP:60, MP:40, AP:1, LL:1, HR:1, MR:1, 
			lvlup: {STR:1, END:0.75, AGI:1.25, INT:0.75, ATK:0, DEF:0.25, BR:0, DDG:0, HP:1.75, MP:2, AP:0, LL:0, HR:0, MR:0},
			avatar:"img/goblin.jpg"
		},
		
		gnome: {STR:3, END:3, AGI:7, INT:8, ATK:4, DEF:2, BR:0, DDG:0, HP:30, MP:70, AP:1, LL:1, HR:1, MR:2,
			lvlup: {STR:0.75, END:0.75, AGI:1.25, INT:1.5, ATK:0, DEF:0.25, BR:0, DDG:0, HP:1.5, MP:2.5, AP:0, LL:0, HR:0, MR:0},
			avatar:"img/gnome.jpg"
		},
		
		vampire: {STR:6, END:6, AGI:4, INT:4, ATK:5, DEF:3, BR:0, DDG:0, HP:50, MP:50, AP:1, LL:2, HR:1, MR:1, 
			lvlup: {STR:0.75, END:1, AGI:1, INT:1.25, ATK:0, DEF:0.25, BR:0, DDG:0, HP:1.5, MP:1.75, AP:0, LL:0, HR:0, MR:0},
			avatar:"img/vampire.jpg"
		}
	},

	getRandomFromArr : function(arr){
		return Math.floor(Math.random() * arr.length);
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
	
		if ( !this.isNumeric(cards) || cards <= 3 || cards >= 52){
			alert( cards + '- не верно, 3 < число карт < 52 ');
			return false;
		}
	
		if ( (!this.isNumeric(timer)) || timer <= 15 || timer >= 60){
			alert( timer + '- не верно, 15 < вермя на ход <= 60');
			return false;
		}
		
		if ( cardsEveryTurn > 4 || cardsEveryTurn <= 0 || (!(this.isNumeric(cardsEveryTurn))) ){
			alert( cardsEveryTurn + " - не верно, 1 <= число карт за ход < 5" );
			return false;
		}

		// передаем управление функции начинающий бой.
		return this.initialize(); 
	},

	initiBattleUi: function(){ // внешние эффекты в виде заполненых баров с хп, аватары и т.п.
		var tool;

		$("div#bottom-playername").html(this.player.name);
		$("#bpb-hp span").css("width", "100%");
		$("#bpb-hp span").text(this.player.stats.HP);
		$("#bpb-mp span").css("width", "100%");
		$("#bpb-mp span").text(this.player.stats.MP);		
		$("#bottom-atk").text(this.player.stats.ATK);
		$("#bottom-def").text(this.player.stats.DEF);
		$("#bottomavatar img").attr("src", this.races[this.player.race].avatar);
		$("#bottom-lvl").text(this.player.level);
		//бот
		$("div#top-playername").html(this.enemy.name);
		$("#tpb-hp span").css("width", "100%");
		$("#tpb-hp span").text(this.enemy.stats.HP);
		$("#tpb-mp span").css("width", "100%");
		$("#tpb-mp span").text(this.enemy.stats.MP);
		$("#top-atk").text(this.enemy.stats.ATK);
		$("#top-def").text(this.enemy.stats.DEF);
		$("#topavatar img").attr("src", this.races[this.enemy.race].avatar);
		$("#top-lvl").text(this.enemy.level);

		btool = $("#topavatar");
		ptool = $("#bottomavatar");

		var pinfo = $("<div>" + this.player.name + "</br>Уровень: " + this.player.level + "</br> Раса: " + this.player.race +"</br> Жизни: " + this.player.getStats("HP") + "/" + this.player.calculateStats("HP") + "</br> Дух: " + this.player.getStats("MP") + "/" + this.player.calculateStats("MP") + "</br> Уворот: " + this.player.stats.DDG + "%</br> Шанс на блок: " + this.player.stats.BR + "%</br></div>");
		var binfo = $("<div>" + this.enemy.name + "</br>Уровень: " + this.enemy.level + "</br> Раса: " + this.enemy.race +"</br> Жизни: " + this.enemy.stats.HP + "</br> Дух: " + this.enemy.stats.MP + "</br> Уворот: " + this.enemy.stats.DDG + "%</br> Шанс на блок: " + this.enemy.stats.BR + "%</br></div>");
		this.appendTooltip(ptool, pinfo);
		this.appendTooltip(btool, binfo);
	},
	
	isNumeric: function(n) { // проверка на число
		return !isNaN(parseFloat(n)) && isFinite(n);
	},

	appendTooltip: function(par, elem){
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
	}
};


$(document).ready(function() {
/*	
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
*/
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

	// запуск самого модального окошка, и маунт кнопок в нем.
	setTimeout(function(){
		$('#overlay').css('display', 'block');
		$("input.close").attr("onclick", "Game.closeModalWindow()");
		$("input.startBattle").attr("onclick", "Game.checkStartForm()"); 
		$("input#turn").attr("onclick", "Game.battleground.turnEnd(Game.player)");
		$("input.playAgain").attr("onclick", "Game.closeModalWindow()");
		$("input.stopGame").attr("onclick", "Game.stop()");
	}, 1000);
	

});


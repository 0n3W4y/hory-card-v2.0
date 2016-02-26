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
			console.log('trait stats activated');
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
	}
});
var AiLogic = $.trait({
	meta_onInit: function(data){
		if(data.runAi){
			conlose.log("Ai already added");
		}else{
			data.runAi = function(){ 
			var bgSelf = this;
		
			function findAllCards(){ // ���������� ������ ���� �� ����.
				var spadesCard = searchLear("spades"); 
				var crossCard = searchLear("cross");
				var diamondsCard = searchLear("diamonds");
				var heartsCard = searchLear("hearts");
				return [spadesCard, crossCard, diamondsCard, heartsCard];
			};
		
			function aiAttack(priority){ // ������� ��������� ������� ���� ��� �������� � ������ ����, ��� �����.
				var tempArr = findAllCards();
				var cardSpades = tempArr[0];
				var cardCross = tempArr[1];
				var cardDiamonds = tempArr[2];
				var cardHearts = tempArr[3];
				if ( priority == "AP" ){ //ArmorPiercing
					if( cardSpades.length > 1 && cardCross.length > 0){ //spades+spades+cross
						if (cardSpades[1] > cardCross[0]){ // ���������, ����� ���������� �����, ����_�2 ��� ��������_�2
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
					if(bgSelf.enemy.stats.HP > bgSelf.enemy.getStats("HP")/2){ 
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
			};
		
			function aiDefense(priority, variant){//������� ��������� ������� ���� ��� ��������. ��� ����, ������ � ��������������.
				var tempArr = findAllCards();
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
			}; 
		
			function analysis(play){ // ������� ������� ��������, ������, �� �������� ���, ��� � ���������.
				var arrStats = [];
				for ( var index in bgSelf.enemy.stats ){
					if( bgSelf.enemy.stats[index] < bgSelf.enemy.getStats(index) ){
						arrStats.push(index);
					};
				};
				if (play == "attack"){

					var arrAtkAP = aiAttack("AP");
					var arrAtkLL = aiAttack("LL");
					var arrAtkMP = aiAttack("MP");
					var arrAtk = aiAttack("");
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
	
			};
		
			function collectingResults (){ // ������� ������� ��� �������, ��� �� ��� ������ �������� � ������� aiPlay ������� ������ ����.
				var attackArr = analysis("attack");
				var attackAP = attackArr[0];
				var attackLL = attackArr[1];
				var attackMP = attackArr[2];
				var attackLinear = attackArr[3];
			
				var recoveryArr = analysis("recovery");
				var substractArr = analysis("substract");
				var addArr = analysis("add");
			
				var arrSelfStats = []; // ������� ��������� ������, ������� ���� ���������.
				for ( var index in bgSelf.enemy.stats ){
					if( bgSelf.enemy.stats[index] < bgSelf.enemy.getStats(index) ){
						arrSelfStats.push(index);
					};
				};
				arrSelfStats.sort(function(a,b){ return bgSelf.enemy.stats.b - bgSelf.enemy.stats.a }); // ��������� ���, ��� �� �����, ������ ����� ��������� ������ �����, ������ � ������ �������.
			
				var arrEnemyStats = []; // ������� ��������� ������, ������� ������ ��� � ����.
				for ( var index in bgSelf.player.stats ){
					if( bgSelf.player.stats[index] > bgSelf.enemy.stats[index] ){
						arrEnemyStats.push(index);
					};
				};
				arrEnemyStats.sort(function(a,b){ return bgSelf.player.stats.b - bgSelf.player.stats.a });  // ���������, ����� ������� �������� � ������ �������.
			
			//������� ������:
			// 1. ������� ������������ �������� ������, ���� ��� - ������� ������������ �������� � ������ ���� � ��������������.
			// 2. ���� ������� ��������, �� �������� �������� �����, ����� ��������.
			// 3. ���� �� ���������� ���������, �������� ������������ ���� �����, ���� ����� ����
			// 4. ���� �� ������� ��� ��������, �������� ��������� ����� �  ����������.
			// 5. ���� ������ �� �������������� �� ����������, ���������� ���.
				if ( (bgSelf.enemy.stats.HP < bgSelf.enemy.getStats("HP")/2) && attackLL  ){  //1; attackArr[1] == "LL" - lifeLeech
					var cardArr = aiAttack("LL")
					return cardArr;
				}else if( (bgSelf.enemy.stats.HP < bgSelf.enemy.getStats("HP")/2) && (recoveryArr || addArr) ) {
					if( recoveryArr[arrSelfStats.indexOf["HP"]] != false ){
						var cardArr = aiDefense("RE", "HP");
						return cardArr;
					}else if( addArr[arrSelfStats.indexOf["HP"]] != false ){
						var cardArr = aiDefense("ADD", "HP");
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

			};
		
			function aiPlay(arr){ // �������� � �������� ����, ������� �������� ���� �� ������ ����.
				if ( arr.length > 0){
					bgSelf.moveCardToBattle(bgSelf.enemy, arr[0]);
					arr.splice(0, 1);
			
				}else{
					clearInterval(botTimer);
					bgSelf.turnEnd(bgSelf.enemy);
				}
			};
		
			function searchLear(lear){ // ������� ������ ����� �� �����
				var tempArr = [];
				for (var i = 0; i < bgSelf.enemy.deck.length; i++){
					if( bgSelf.enemy.deck[i][0] == lear ){
						tempArr.push(bgSelf.enemy.deck[i]);
					}else{
					}
				};
				tempArr.sort(function (a, b){ return b[1] - a[1]; }); // ���������, ��� �� ������� ��������� ���� �������
				return tempArr;
			};
		
			var botChoise = collectingResults();
		
			// ��������, ����� �� ��� ������� ���?
			if( botChoise == false ){
				return this.turnEnd(this.enemy);
			}else{
				var botTimer = setInterval(function(){ aiPlay(botChoise)}, 2000);
				return;
			};
				console.log("Ai activated");
			}
		}
		
	},
	
	generateBot: function(){
		var randomRace = ["human", "elf", "orc", "troll", "werewolf", "dwarf", "goblin", "gnome", "vampire"][Math.round(Math.random()*8)];
		Game.enemy = new Player("Robot", randomRace, 0, Math.round(Math.random()*10));
		Game.enemy.id = "enemy";
		console.log("enemy(bot) is initialized");
	}
});

var Combos = $.trait({
	meta_onInit: function(data){
		if (data.combo){
			console.log("combos already exist");
		}else{
			data.combo = {
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
			//�������� �������� ���� - castCombo  - ��, ��� �� ���������� � ��������� player.damage, ��� ����������� �������������.
				var castCombo = {value:0, stat:null, to:null, value2:0, effect:null, value3:0, effect2:null, info:null, toString: function(){ return "value=" + this.value + "; stat=" + this.stat + "; to=" +this.to + "; value2=" + this.value2 + "; effect=" + this.effect + "; value3=" + this.value3 + "; effect2=" + this.effect2} }; // effect: AP(armorPiercing), RE(restore), ADD(add(++)), SU(substract)
				var card1cost = costsArr[0];
				var card2cost = costsArr[1];
				var card3cost = costsArr[2];
				var card1lear = comboArr[0];
				var card2lear = comboArr[1];
				var card3lear = comboArr[2];

				if ( card1lear == "spades" ){
					if ( card2lear == "spades" ){
						if ( card3lear == "spades" ){ // ����������� ���� (�3)
							castCombo.value = player.stats.ATK+((card2cost+card3cost)*3)*card1cost/100;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.info = "����������� ���� (�3)";
					
						}else if ( card3lear == "diamonds" ){ // ����������� ���� (�2) � �������������� ���� 
							castCombo.value = player.stats.ATK +((card2cost)*2)+(player.stats.MP*card3cost/10)*card1cost/100;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.info = "����������� ���� (�2) � �������������� ����";
					
						}else if ( card3lear == "cross" ){ // ����������� ���� (�2) ����������� ����� 
							castCombo.value = player.stats.ATK+((card2cost)*2)*card1cost/100;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.value2 = card3cost*card1cost/100;
							castCombo.effect = "AP";
							castCombo.info = "����������� ���� (�2) ����������� �����";
				
						}else{ // ����������� ���� (�2) � �����������
							castCombo.value = player.stats.ATK+(card2cost*2)*card1cost/100;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.value2 = player.stats.ATK*card3cost/100;
							castCombo.effect = "RE";
							castCombo.info = "����������� ���� (�2) � �����������";
						};
				
					}else if( card2lear == "diamonds" ){
						if ( card3lear == "spades" ){ // ���� (�2)  �� ����  
							castCombo.value = player.stats.ATK+((card3cost*2)*card1cost/100)*card3cost/100;
							castCombo.stat = "MP";
							castCombo.effect = "SU";
							castCombo.to = "enemy";
							castCombo.info = "���� (�2)  �� ����";
						
						}else if ( card3lear == "diamonds" ){ // ���� �� ���� � �������������� ���� 
							castCombo.value = player.stats.ATK+card2cost+(player.stats.MP*card3cost/10)*card1cost/100;
							castCombo.stat = "MP";
							castCombo.effect = "SU";
							castCombo.to = "enemy";
							castCombo.info = "���� �� ���� � �������������� ����";
					
						}else if ( card3lear == "cross" ){ // ���� �� ���� � ����������� ����� 
							castCombo.value = player.stats.ATK + card2cost*card1cost/100;
							castCombo.stat = "MP";
							castCombo.to = "enemy";
							castCombo.value2 = card3cost*card1cost/100;
							castCombo.effect2 = "AP";
							castCombo.effect = "SU";
							castCombo.info = "���� �� ���� � ����������� �����";
				
						}else{ //���� �� ���� � ����������� overmana �� ����� ����!
							castCombo.value = player.stats.ATK + card2cost*card1cost/100 ;
							castCombo.stat = "MP";
							castCombo.to = "enemy";
							castCombo.value2 = player.stats.ATK*card3cost*card1cost/100;
							castCombo.effect2 = "RE";
							castCombo.effect = "SU";
							castCombo.info = "���� �� ���� � �����������";
						};
				
					}else if( card2lear == "cross" ){
						if ( card3lear == "spades" ){ // ����������� (�2) ����
							castCombo.value =  player.stats.ATK + card3cost*card1cost/100; 
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.value2 = (card2cost*2)*card1cost/100;
							castCombo.effect = "AP";
							castCombo.info = "����������� (�2) ����";
					
						}else if ( card3lear == "diamonds" ){ // ����������� (�2) ���� � �������������� ����
							castCombo.value = player.stats.ATK + (player.stats.MP*card3cost)*card1cost/100; 
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.value2 = (card2cost*2)*card1cost/100;
							castCombo.effect = "AP";
							castCombo.info = "����������� (�2) ���� � �������������� ����";
					
						}else if ( card3lear == "cross" ){ // ����������� (�3) ����.
							castCombo.value = player.stats.ATK;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.value2 = (card2cost*3)*card1cost/100;
							castCombo.effect = "AP";
							castCombo.info = "����������� (�3) ����";
							
						}else{ //����������� (�2) ���� � �����������
							castCombo.value = player.stats.ATK;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.value2 = (card2cost*2)*card1cost/100;
							castCombo.effect = "AP";
							castCombo.value3 = player.stats.ATK*card3cost/100;
							castCombo.effect2 = "RE";
							castCombo.info = "����������� (�2) ���� � �����������";
						};
				
					}else{
						if ( card3lear == "spades" ){ //���� � �����������
							castCombo.value = player.stats.ATK + card2cost*card1cost/100;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.info = "���� � �����������";
							cast.combo.value2 = player.stats.ATK*card3cost/100;
							cast.combo.effect = "RE";
							
						}else if ( card3lear == "diamonds" ){ //���� � �����
							castCombo.value = player.stats.ATK + card2cost*card1cost/100 + (player.stats.MP + card3cost)*card1cost/100;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.info = "���� � �����";
					
						}else if ( card3lear == "cross" ){ // ���� � �����������
							castCombo.value =  player.stats.ATK + card2cost*card1cost/100;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.value2 = card3cost*card1cost/100;
							castCombo.effect = "AP";
							castCombo.info = "���� � �����������";
					
						}else{ // ���� � ����������� (�3)
							castCombo.value = player.stats.ATK
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.effect = "RE"
							castCombo.value2 = player.stats.ATK*(card1cost/25)*(card2cost+card3cost)*3/100;
							castCombo.info = "���� � ����������� (�3)";
						};
					};
				}else if ( card1lear == "diamonds" ){
					if ( card2lear == "spades" ){
						if ( card3lear == "spades" ){ // ���������� �����
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "ATK";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "���������� �����";
					
						}else if ( card3lear == "diamonds" ){ //���������� �������� �������� ����
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "MP";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "���������� �������� �������� ����";
					
						}else if ( card3lear == "cross" ){ //���������� �������������
							castCombo.value = (player.stats.AGI*card1cost/40 + card2cost*card3cost/100)/10;
							castCombo.stat = "AP";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "���������� �������������";
					
						}else{ //���������� ����������
							castCombo.value = (player.stats.AGI*card1cost/40 + card2cost*card3cost/100)/10;
							castCombo.stat = "LL";
							castCOmbo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "���������� ����������";					
						};
				
					}else if( card2lear == "diamonds" ){
						if ( card3lear == "spades" ){ //���������� ����
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "STR";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "���������� ����";
					
						}else if ( card3lear == "diamonds" ){ //���������� ����������
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "INT";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "���������� ����������";
					
						}else if ( card3lear == "cross" ){ //���������� ��������
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "AGI";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "���������� ��������";
					
						}else{ // ���������� ������������
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "END";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "���������� ������������";
						};
				
					}else if( card2lear == "cross" ){
						if ( card3lear == "spades" ){
							alert( "���������� ���, ������ ����� ����� ������ ��� ������� ����")
					// ����� ����������!!!!!!!!!!!!!!!!!!!
						}else if ( card3lear == "diamonds" ){ // ���������� �������������� ����
							castCombo.value = (player.stats.AGI*card1cost/40 + card2cost*card3cost/100)/10;
							castCombo.stat = "MR";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "���������� �������������� ����";
							
						}else if ( card3lear == "cross" ){ // ���������� �����
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "DEF";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "���������� �����";
						
						}else{ // ���������� ���� �������
							castCombo.value = (player.stats.AGI*card1cost/40 + card2cost*card3cost/100)/10;
							castCombo.stat = "HR";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "���������� ���� �������";
						};
				
					}else{
						if ( card3lear == "spades" ){ // ���������� �������
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "DDG";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "���������� �������";
					
						}else if ( card3lear == "diamonds" ){ //���������� ���� �����
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "BR";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "���������� ���� �����";
					
						}else if ( card3lear == "cross" ){
							alert( "���������� ���, ������ ����� ����� ������ ��� ������� ����")
							// ����� ����������!!!!!!!!!!!!!!!!!!!
						}else{ // ���������� ��
							castCombo.value = player.stats.AGI*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "HP";
							castCombo.to = "enemy";
							castCombo.effect = "SU";
							castCombo.info = "���������� ������";
						};
					};
				}else if ( card1lear == "cross" ){
					if ( card2lear == "spades" ){
						if ( card3lear == "spades" ){ // �������������� �����
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "ATK";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "�������������� �����";
						
						}else if ( card3lear == "diamonds" ){ // �������������� ����
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "MP";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "�������������� ����";
					
						}else if ( card3lear == "cross" ){ // �������������� ���������� 
							castCombo.value = (player.stats.END*card1cost/40 + card2cost*card3cost/100)/10; 
							castCombo.stat = "AP";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "�������������� �������������";
					
						}else{ // �������������� ����������
							castCombo.value = (player.stats.END*card1cost/40 + card2cost*card3cost/100)/10;
							castCombo.stat = "LL";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "�������������� ����������";
						};
					}else if( card2lear == "diamonds" ){
						if ( card3lear == "spades" ){ // ������������� ����
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "STR";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "�������������� ����";
					
						}else if ( card3lear == "diamonds" ){ //�������������� ����������
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "INT";
							castCombo.to = "self"; 
							castCombo.effect = "RE";
							castCombo.info = "�������������� ����������";
							
						}else if ( card3lear == "cross" ){ //�������������� ��������
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "AGI";
							castCombo.to = "self"; 
							castCombo.effect = "RE";
							castCombo.info = "�������������� ��������";
					
						}else{ // �������������� ������������
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "END";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "�������������� ������������";
						};
				
					}else if( card2lear == "cross" ){
						if ( card3lear == "spades" ){ 
						alert( "���������� ���, ������ ����� ����� ������ ��� ������� ����")
							// ����� ����������!!!!!!!!!!!!!!!!!!!
						}else if ( card3lear == "diamonds" ){ // �������������� �������������� ����
							castCombo.value = (player.stats.END*card1cost/40 + card2cost*card3cost/100)/10;
							castCombo.stat = "MR";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "�������������� �������������� ����";
						
						}else if ( card3lear == "cross" ){// �������������� ����� 
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "DEF";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "�������������� �����";
					
						}else{ //�������������� ���� �������
							castCombo.value = (player.stats.END*card1cost/40 + card2cost*card3cost/100)/10;
							castCombo.stat = "HR";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "�������������� ���� �������";
						};
				
					}else{
						if ( card3lear == "spades" ){ // �������������� �������
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "DDG";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "�������������� �������";
					
						}else if ( card3lear == "diamonds" ){ // �������������� ���� �����
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "BR";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "�������������� ���� �����";
					
						}else if ( card3lear == "cross" ){
							alert( "���������� ���, ������ ����� ����� ������ ��� ������� ����")
							// ����� ����������!!!!!!!!!!!!!!!!!!!
						}else{ // �������������� ��
							castCombo.value = player.stats.END*card1cost/40 + card2cost*card3cost/100;
							castCombo.stat = "HP";
							castCombo.to = "self";
							castCombo.effect = "RE";
							castCombo.info = "�������������� ������";
						};
					};	
				}else{
					if ( card2lear == "spades" ){
						if ( card3lear == "spades" ){ // ���������� �����
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100; 
							castCombo.stat = "ATK";
							castCombo.to = "self";
							castCombo.effect = "ADD";
							castCombo.info = "���������� �����";
					
						}else if ( card3lear == "diamonds" ){// ���������� ����
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100; 
							castCombo.stat = "MP";
							castCombo.to = "self";
							castCombo.effect = "ADD";
							castCombo.info = "���������� ����";					
					 
						}else if ( card3lear == "cross" ){ //���������� ����������
							castCombo.value = (player.stats.INT*card1cost/40 + card2cost*card3cost/100)/10; 
							castCombo.stat = "AP";
							castCombo.to = "self";
							castCombo.effect = "ADD";
							castCombo.info = "���������� ����������";						
					 
						}else{ // ���������� ����������
							castCombo.value = (player.stats.INT*card1cost/40 + card2cost*card3cost/100)/10; 
							castCombo.stat = "LL";
							castCombo.to = "self";
							castCombo.effect = "ADD";
							castCombo.info = "���������� ����������";	
					
						};
					}else if( card2lear == "diamonds" ){
						if ( card3lear == "spades" ){ // ���������� ����
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100; 
							castCombo.stat = "STR";
							castCombo.to = "self";
							castCombo.effect = "ADD";
							castCombo.info = "���������� ����";					
					 
						}else if ( card3lear == "diamonds" ){ // ���������� ����������
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100;  
							castCombo.stat = "INT";
							castCombo.to = "self";
							castCombo.effect = "ADD"; 
							castCombo.info = "���������� ����������";
					 
						}else if ( card3lear == "cross" ){ // ���������� ��������
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100; 
							castCombo.stat = "AGI";
							castCombo.to = "self";
							castCombo.effect = "ADD";
							castCombo.info = "���������� ��������";
					 
						}else{ // ���������� ������������
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100;  
							castCombo.stat = "END";
							castCombo.to = "self";
							castCombo.effect = "ADD";
							castCombo.info = "���������� ������������";					
							
						};
					}else if( card2lear == "cross" ){
						if ( card3lear == "spades" ){
							alert( "���������� ���, ������ ����� ����� ������ ��� ������� ����")
							// ����� ����������!!!!!!!!!!!!!!!!!!!
						}else if ( card3lear == "diamonds" ){ // ���������� �������������� ����
							castCombo.value = (player.stats.INT*card1cost/40 + card2cost*card3cost/100)/10; 
							castCombo.stat = "MR";
							castCombo.to = "self";
							castCombo.effect = "ADD";
							castCombo.info = "���������� �������������� ����";						
					
						}else if ( card3lear == "cross" ){ // ���������� �����
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100; 
							castCombo.stat = "DEF";
							castCombo.to = "self";
							castCombo.effect = "ADD"; 
							castCombo.info = "���������� �����";
					
						}else{ // ���������� ���� �������
							castCombo.value = (player.stats.INT*card1cost/40 + card2cost*card3cost/100)/10;  
							castCombo.stat = "HR";
							castCombo.to = "self";
							castCombo.effect = "ADD"; 
							castCombo.info = "���������� ���� �������";
						};
					
					}else{
						if ( card3lear == "spades" ){ // ���������� �������
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100; 
							castCombo.stat = "DDG";
							castCombo.to = "self";
							castCombo.effect = "ADD"; 
							castCombo.info = "���������� �������";
					
						}else if ( card3lear == "diamonds" ){// ���������� ���� �����
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100;  
							castCombo.stat = "BR";
							castCombo.to = "self";
							castCombo.effect = "ADD"; 
							castCombo.info = "���������� ���� �����";
					
						}else if ( card3lear == "cross" ){
							// ����� ����������!!!!!!!!!!!!!!!!!!!
							alert( "���������� ���, ������ ����� ����� ������ ��� ������� ����")
						}else{
							castCombo.value = player.stats.INT*card1cost/40 + card2cost*card3cost/100;  
							castCombo.stat = "HP";
							castCombo.to = "self";
							castCombo.effect = "ADD";
							castCombo.info = "���������� ������";
						};
					};	
				}
		
				return castCombo;
		
			},
			
			calculateDamage: function (player){ // ������� �������� ������, ���� ��� ������ � �����
				if ( player.battleDeck.length >= 3){
					var cardN1 = player.battleDeck[0]; //1 ����� �� ������ �� �������
					var cardN2 = player.battleDeck[1]; //2 ����� �� ������ �� �������
					var cardN3 = player.battleDeck[2]; //3 ����� �� ������ �� �������
					var costsArr = [cardsDeck.costs[cardN1[1]], cardsDeck.costs[cardN2[1]], cardsDeck.costs[cardN3[1]]]; // ������ ������ �� ����������, ��� ������������ ��������
					var comboArr = [cardN1[0], cardN2[0], cardN3[0]]; // ������ ������ �� ������, ��� ����������� �������� ����������
					// ���������� ����������� �� ������.
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
					player.damage = this.doCombo(comboArr, costsArr, player); // �������� ���������� ������� ��������.
					console.log("Player=" + player.name + "; " + player.damage.toString());
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

			},
			}
		}
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
		return;
	},
	
	getStats : function(x){
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
	},
	
	fillStats : function(){
		if (this.stats){
			for(var index in this.stats) { 
				this.stats[index] = this.getStats(index);
			};
			console.log("stats are filled");
			return;
		}else{
			console.log("stats are not available");
			return;
		}
	},
	
	_traits: [Stats]
});

var Battleground = $.klass({
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
	
	battleStart: function (){	 // ������ ����.
		var bgSelf = this;
		this.round = 0;
		this.historyDeck = []; // ���������� ���� ������� ���.
		
		function rndBoolean(){ // ������� ����������� ������� ����.
			var num = Math.random();
			if (Math.round(num)){
				return bgSelf.player;
			}else{
				return bgSelf.enemy;
			}
		};
		
		var firstPlayer = rndBoolean(); // �������� ��� ����� ������.
		setTimeout(function(){ bgSelf.roundStart(firstPlayer)}, 1000); // �������� ������������������.
	},
 
	battleEnd: function(player){ // ����� ���� ( ����� ��������� ������� �����, ���������� )
		if (this.player == player){
			alert ( " �� ��������� �������� " );
			
		}else{
			alert ( " �� �������� �������� " );
		}
	},
	
	roundStart: function(player) {
		this.turnCounter = 0; // �������� �������.
		var currentRound = "ROUND " + (this.round + 1); // ������ �� 1 , ��� ��� ������ ������ ���� ���������� � 0
		$('#overlay2').css('display', 'block');
		$('#overlay2 #player_turn').text(currentRound).animate({opacity: 1}, 1000, function(){ $('#overlay2').css("display", "none"), $('#overlay2 #player_turn').css("opacity", "0.5") });
		var bgSelf = this;
					// ������� ��������� ��� ����������
		$( ".overlay-top-combo" ).empty(); 
		$( ".overlay-bot-combo" ).empty();
		
		setTimeout( function(){ bgSelf.turnStart(player) } ,1000);
	},
	
	roundEnd: function(player, nextPlayer){
		this.round++;
		var bgSelf = this;
		// ���������, ������� �� ����� ����� � ������ ���� ��� ���.
		if (player.battleDeck.length == 0){ 
			if (nextPlayer.battleDeck.length == 0){
				// ������ �� ������, ���� ��� �� ��������.
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
					}else{
						this.doDamage(player, nextPlayer);
						if (nextPlayer.stats.HP <= 0){
							doRefreshUiStats();
							this.battleEnd(nextPlayer);
							return;
						}else{};
					};
				}else{
					this.doDamage(player, nextPlayer);
					if (nextPlayer.stats.HP <= 0){
						doRefreshUiStats();
						this.battleEnd(nextPlayer);
						return;
					}else{
						this.doDamage(nextPlayer, player);
						if (player.stats.HP <= 0){
							doRefreshUiStats();
							this.battleEnd(player);
							return;
						}else{};
					};
				};
			};
		};
		
		// �������� �������� ���� �� ������ ����
		$("ul#top-battledeck li").css( "position", "relative").animate({left: "-500px", opacity: "0"}, 800, function(){
			$(this).remove();
			});
		$("ul#bot-battledeck li").css( "position", "relative").animate({left: "-500px", opacity: "0"}, 800, function(){
			$(this).remove();
			});

		// �������� ����������������� ����� ������ � ����������
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
		// ������ ������ ���� �� ������� ��������.
		player.battleDeck.length = 0; 
		nextPlayer.battleDeck.length = 0; 
		doRefreshUiStats();
		
		if (player.stats.HP <= 0){ // �������� �� ������ ������
			this.battleEnd(player);
		}else{
			if (nextPlayer.stats.HP <= 0){
				this.battleEnd(nextPlayer);
			}else{
				this.roundStart(player); // - � ������ ��������. ������ �����? ���� �� ��� ��������� �������. ���� ������� ��� �� ��� ��������, ������ ����� ����� ������ 1, � �� ������ ����� ����� ������ 2
			}
		}
	},
	
	turnStart: function (player){ //������ ���� ��� ������
		var bgSelf = this;
		this.turnQueue = player;
		if (player == this.player){ // ��������� ��� ������ �����  � ������� ��������������� �������.
			$('#overlay2').css('display', 'block');
			$('#overlay2 #player_turn').text("��� ���").animate({opacity: 1}, 2000, function(){ $('#overlay2').css("display", "none"), $('#overlay2 #player_turn').css("opacity", "0.5") });
			$("#turn").prop('disabled', false);


		}else{
			$('#overlay2').css('display', 'block');
			$('#overlay2 #player_turn').text("��� ����������").animate({opacity: 1}, 2000, function(){ $('#overlay2').css("display", "none"), $('#overlay2 #player_turn').css("opacity", "0.5") });
			$("#turn").prop('disabled', true);

		}

		if (this.round == 0){ this.giveCard(player, this.cards); }else{ this.giveCard(player, this.cardsEveryTurn); };// ������� �����, ���������� ��� �� ������ ����� ���.	

		var timer = this.timer; // ������ ���������� ������ �� ���.
		this.runTimer(timer , player); // ��������� ������� ����.
			
		if (player == this.enemy){ // ���������, �������� �� ������� ����� �����
			setTimeout(function(){bgSelf.runAi()}, 1500); // ���� �� - ��������� ������ ��.
		}
	},
 
	turnEnd: function (player){ // ����������� ���������
		clearInterval(this.timerId); // ������ ������, ���� ����� ����� ���� ��� ������ �������.
		$("#time-left").text(0); // ����������, ��� ������� ����� ���� 0.
		var bgSelf = this;
		if (player == this.enemy){
			if ( player.battleDeck.length > 2){
			var combo = this.findCombo(player);
			$( ".overlay-top-combo" ).text(combo.info + " �� " + combo.value);
			};
		};
		
		if (player.id == "player"){ // ������� ���������� ������.
			var nextPlayer = this.enemy; // ���� ��, �� �������� ��������� ������ ��� ��������� ( ��� )
			
		}else{
			var nextPlayer = this.player; // ���� ��� - �� �������� ������.
		}
		this.turnQueue = nextPlayer;
		// ������� ����� �� ���������������, �� ���� ������������ ����������
		if ( player.battleDeck.length < 3){ // ���������� ����� � ����, ���� ����� ������� 2 ����� ��� 1 ����� ������ 3-�
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
			player.battleDeck.length = 0; // ����� ���� ��� ������� �����, ������ ������ ����.
		}else{};
		
		if (this.turnCounter == 1){ // ��������� ������ �� ������ �� 1 ����?
			this.roundEnd(player, nextPlayer);
		}else{
			this.turnCounter++;
		setTimeout(function(){bgSelf.turnStart(nextPlayer)}, 2000); 	
		}
		
	},
 
	generateCard: function(){ // ��������� �������� �����.
		var a = Math.floor(Math.random() * cardsDeck.numbers.length);
		var b = Math.floor(Math.random() * cardsDeck.types.length);
		return [cardsDeck.types[b], cardsDeck.numbers[a]];
	},
 
	giveCard: function (player, cards) { //������� ���� ������.
		var bgSelf = this;
		var num = 0;
		var cardTimer = setInterval(function(){ if( num < cards ){ num++; bgSelf.addCard(player); }else{ clearInterval(cardTimer);} }, 300);

	},
	
	addCard: function(player) { //���� ����� ������. // ���������� ������� ���������� ����, ��� �� ����� ���� ��������� � ��������.
		var bgSelf = this; // ����� ���� ��� ������� �������� ����� � ������� ����.
		var card = this.generateCard(); // ���������� �����.
		
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
		
		for (var i = 0; i < 1;){ // ������ ��������, �� ��, ���� �� ����� ����� � ������ �� ����� ��� ���. �� ��������� �������� � �� ���������� ������ ���������� ������� (!!!)
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
		
		if (player.id == "player"){ // ���� ����� - ������ *��������* � �������� ���� � ��� ����.
			cloneSuit.appendTo("body").css({"position": "absolute", "top": fromCardOffset.top, "left": fromCardOffset.left}).animate({top: "660px", left: "560px"}, 300, function(){ $(this).remove()});
			$( uiCard ).appendTo($("ul.connectedSortable")).click( function(){
				bgSelf.moveCardToBattle(player, card);
			});

		}else{
			cloneSuit.appendTo("body").css({"position": "absolute", "top": fromCardOffset.top, "left": fromCardOffset.left}).animate({top: ($("ul.invisible").offset().top - 150), left: ($("ul.invisible").offset().left + 50)}, 300, function(){ $(this).remove()});
			$( uiCard ).appendTo($("ul.invisible"));
			// ������ ����� �������� �����, � ������ �� �� ����� ( ���� ) � ��������� ����.
			}
	},
	
	moveCardToBattle: function(player, card) { // ������� ����������� ���� ����������� ����� � ������ ����.
		var bgSelf = this;
		var cardId = "." + card.join("") + "#" + player.id;
		function checkCard(player, card){ // ��������, ����� �� �������� �����, ��� ���.
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
			player.battleDeck.push(card); // ����� ������ ���� ������ ������.
			var cardToDelete = player.deck.indexOf(card);
			player.deck.splice(cardToDelete, 1); //������������ �������� ����� �� ���� ������. (!!!) - �� �����, ����� ���������� ����� ������ ���� ������ ������. (!!!)
		
		}else{
			$(cardId).effect("highlight", {color: "red"}, 300);	
		}
		if(this.player.battleDeck.length > 2){
			if( this.player == this.turnQueue){
				var combo = this.findCombo(player);
				$( ".overlay-bot-combo" ).text(combo.info + " �� " + combo.value);
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
			this.player.deck.push(card); // ���������� ����� �������.
			var cardToDelete = this.player.battleDeck.indexOf(card);
			this.player.battleDeck.splice(cardToDelete, 1);
		$("bot-battledeck").unbind('mouseenter mouseleave');
		}else{ $(cardId).effect("highlight", {color: "red"}, 300);	}
	},
	
	runTimer: function(timer, player){ // ��� ������ ����.
		var bgSelf = this;
		var i = timer;
		this.timerId = setInterval(function(){ // ������� ��� � ������������ ������, ��� �� ����� ���� ������� ��� ��������� � ������.
			if (i >= 0){
			$("#time-left").text(i--); // ���������� ���������� ��������� ������, �� ����� ���� �� 1 ������ ���� :)
			
			}else{
			clearInterval(bgSelf.timerId); // ������ ������, ��� ������ ������� ����������.
			bgSelf.turnEnd(player); // ����������� ��� ������ ( ������ ����� �� ����� ������� ).
			}
		}, 1000);
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
	loopId: undefined,
	startTime: undefined,
	lastTick: undefined,
	pausedTime: undefined,
	unpausedTime: undefined,
	
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
	
	update: function(){

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
			this.update();
			this.lastTick = time;
		}
		
		this.draw();
	},

	initialize: function(){
		//��������� �������.
		this.battleground = new Battleground();
		this.battleground.meta_onInit(battleground);
		//������� ���������� �� ������ �� ������������.
		var name = document.forms.preStart.elements.nickname.value;
		var cards = +document.forms.preStart.elements.cards.value;
		var timer = +document.forms.preStart.elements.timeturn.value;
		var cardsEveryTurn = +document.forms.preStart.elements.cardeveryturn.value;
		for (var i = 0;i < document.forms.preStart.elements.race.length; i++){
			if (document.forms.preStart.elements.race[i].selected == true){
				var race = document.forms.preStart.elements.race[i].value;
			}
		}
		var lvl = 0; // ��������
		var exp = 0; // ��������
		
		this.player = new Player(name, race, exp, lvl);
		this.player.meta_onInit(this.player);
		this.player.id = "player";
		console.log("player is initialized");
		//���������� ����.
		this.battleground.generateBot();
		//������ ��������� ����.
		$('#overlay').css('display', 'none');
		
		console.log("the game is initialized");
		//���� ���� �����.
		this.start();
	},

	update: function(){
		
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

	closeModalWindow: function(){ // ��������� ���� � ���������� ������� ����.
		$('#overlay').css('display', 'none')
		if (confirm( "��� �� ��������� ����, �������� ��� ������ ����, � ������� ������ ����. \n �������� ����" )){
			window.location.reload("true");
		}
	},
	
	checkStartForm: function(){ // �������� �����, ������� ��� �������� ����� ( ����� ).
		var name = document.forms.preStart.elements.nickname.value; // ��� ������
		var cards = Math.round(+document.forms.preStart.elements.cards.value); // ���������� ���� � ������ ����
		var timer = Math.round(+document.forms.preStart.elements.timeturn.value); // ������� ������ �� ���.
		var cardsEveryTurn = +document.forms.preStart.elements.cardeveryturn.value; // ���������� ���� ������ ����������� ���.
			// ������� �������� � �������.
		if (name.length > 15){
			alert( '${name} +  ������� ������� ���, �������� ��� ������!' );
			return false;
			
		}else if(name.length < 1){
			alert( '������� �������� ��� ');
			return false;
		}
	
		if ( !this.isNumeric(cards) || cards <= 3 || cards >= 52){
			alert( cards + '- �� �����, 3< ����� ���� < 52 ');
			return false;
		}
	
		if ( (!this.isNumeric(timer)) || timer <= 15 || timer >= 60){
			alert( timer + '- �� �����, 15< ����� �� ��� <= 60');
			return false;
		}
		
		if ( cardsEveryTurn > 4 || cardsEveryTurn <= 0 || (!(this.isNumeric(cardsEveryTurn))) ){
			alert( cardsEveryTurn + " - �� �����, 1 <= ����� ���� �� ��� < 5" );
			return false;
		}

		// �������� ���������� ������� ���������� ���.
		return Game.initialize(); 
	},
	
	isNumeric: function(n) { // �������� �� �����
		return !isNaN(parseFloat(n)) && isFinite(n);
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

*/
	// ������ ������ ���������� ������, � ����� ������ � ���.
	setTimeout(function(){
		$('#overlay').css('display', 'block');
		$("input.close").attr("onclick", "Game.closeModalWindow()");
		$("input.startBattle").attr("onclick", "Game.checkStartForm()"); 
		$("input#turn").attr("onclick", "Game.battleground.turnEnd(Game.player)");
		$("input.playAgain").attr("onclick", "Game.closeModalWindow()");
		$("input.stopGame").attr("onclick", "Game.stop()");
	}, 1000);
	

});


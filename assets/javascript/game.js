
var game = {



		//create a character object
		//properties:
		//name
		//imagePath
		//`Health Points`, `Attack Power` and `Counter Attack Power`.
		makeCharacter: function(name, imagePath, HP, AP, CAP){
		this.name=name;
		this.imagePath=imagePath;
		this.HP = HP;
		this.AP = AP;
		this.CAP = CAP;
		},

		//takes a character and makes a tile
		//accepts character object and its index in the array
		//accepts strings for styles
		makeTile: function(index, character, borderColor, bgColor, textColor){
			//make a div in the bootstrap thumbnail class
			var tile = $("<div>");
			tile.addClass("thumbnail col-xs-4 col-sm-4 col-md-3");
			tile.css("border-width", "5px");
			tile.css("border-color", borderColor);
			tile.css("font-weight", "bold");
			tile.css("background-color", bgColor);
			tile.css("color", textColor);
			tile.css("margin-bottom", "20px");
			//add name child to thumbnail div
			var name = $("<p>");
			name.addClass("text-center");
			name.text(character.name);

			//add image child to thumbnail div
			var image = $("<img>");
			image.css("height", "100px");
			image.css("width", "100px");
			image.attr("src", character.imagePath);

			//add HP
			var HP = $("<p>");
			HP.addClass("text-center");
			HP.text(character.HP);

			//define click function
			//TODO: Move out of this funciton..
			//user only should click a  tile when it's
			//in the choose player section, or enemies section..
			tile.on("click", function(){

				//scroll page down so relevant information is visible
				$('html, body').animate({scrollTop: '+=250px'}, 800);

				//if choosing a player...
				if($(this).parents('#choosePlayerSection').length > 0) {

					//retrieve player index
					playerIndex = $(this).attr("data-charIndex");

					//empty the choose player section
					choosePlayers.hide(40);

					//update your player and enemies sections
					enemies.splice(playerIndex,1);
					enemies.show(400);
				
					for(var i = 0; i < yourPlayers.length; i++){
						var reset=false;
						if(yourPlayers[i].getAttribute("data-charIndex")!=playerIndex){

							yourPlayers.splice(i, 1);
							
							reset=true;
						}
						if(reset){
								i=-1;

						}
					}
					resetHeadings();
					enemies.show(400);
					yourPlayers.show(400);	
				}
	
				else if($(this).parents('#enemiesAvailableSection').length > 0) {
					if(!isDefender){
						$("#attackButton").prop("disabled", false);
						enemies.hide();
						//defenders.hide(400);
						$("#infoSection").hide(400);
						$("#infoSection").empty();
						isDefender=true;
						defenderIndex = $(this).attr("data-charIndex");
						for(var i = 0; i < enemies.length; i++){
							if(enemies[i].getAttribute("data-charIndex")==defenderIndex){	
								enemies.hide(400);
								enemies.splice(i,1);
							}		
						}

						//Update UI
						$("#defenderSection").empty();
						resetHeadings();
						$("#defenderSection").append(game.makeTile(defenderIndex, characters[defenderIndex], "green", "black", "white"));
						//defenders.show(400);
				
						enemies.show();
					}
					else{
						resetHeadings();
						alert("You can only attack one enemy at a time.");
					}
					//Update UI
					$("#enemiesAvailableSection").append(enemies);
				}
			});

			//make the tile
			tile.append(name);
			tile.append(image);
			tile.append(HP);

			//give data attribute of index in character array
			tile.attr("data-charIndex", index);

			return tile;



		},



		
		


};


var characters; 
var playerIndex=0;
var defenderIndex=0;
var isDefender=false;
var numAttacks=1;
var gameOver=false;
var defenderHeading=$("<h2>");
defenderHeading.text("Defender Section");
defenderHeading.addClass("text-center");
var fightHeading=$("<h2>");
fightHeading.text("Fight Section");
fightHeading.addClass("text-center");
var yourPlayerHeading=$("<h2>");
yourPlayerHeading.text("Your Player Section");
yourPlayerHeading.addClass("text-center");
var enemiesHeading=$("<h2>");
enemiesHeading.text("Enemies Available To Attack");
enemiesHeading.addClass("text-center");
var chooseHeading=$("<h2>");
chooseHeading.text("Choose Player Section");
chooseHeading.addClass("text-center");

var resetHeadings=function(){
	
$("#defenderSection").prepend(defenderHeading);
$("#fightSection").prepend(fightHeading);
$("#yourPlayerSection").prepend(yourPlayerHeading);
$("#enemiesAvailableSection").prepend(enemiesHeading);
$("#choosePlayerSection").prepend(chooseHeading);
}

var startGame = function(){
	$("#attackButton").prop("disabled", true);
	$('html, body').animate({scrollTop: '-=2500px'}, 800);
	gameOver=false;
	$("#choosePlayerSection").empty();
	$("#yourPlayerSection").empty();
	$("#enemiesAvailableSection").empty();
	$("#defenderSection").empty();
	$("#infoSection").empty();
	//$("#defenderSection").append(defenderHeading);

	characters = [new game.makeCharacter("Yoda", "assets/images/yoda.png", 139,11, 20),new game.makeCharacter("Obi-Wan Kenobi", "assets/images/owk.jpg", 132, 8, 10),new game.makeCharacter("Luke Skywalker", "assets/images/luke.jpg", 110, 9, 5),new game.makeCharacter("Darth Maul", "assets/images/dm.jpg", 171,2, 25)];
	
	playerIndex=0;
	defenderIndex=0;
	isDefender=false;
	numAttacks=1;

	//create dom elements for each section
	$.each(characters, function(index, value){$("#choosePlayerSection").append(game.makeTile(index, value, "green", "white", "black"))});
	$.each(characters, function(index, value){$("#yourPlayerSection").append(game.makeTile(index, value,"green", "white", "black"))});
	$.each(characters, function(index, value){$("#enemiesAvailableSection").append(game.makeTile(index, value,"black", "red", "black"))});
	$.each(characters, function(index, value){$("#defenderSection").append(game.makeTile(index, value,"green", "black", "white"))});

 	yourPlayers = $("#yourPlayerSection").children();
	enemies = $("#enemiesAvailableSection").children();
	defenders = $("#defenderSection").children();
 	choosePlayers = $("#choosePlayerSection").children();
	yourPlayers.hide(400);
	enemies.hide(40);
	defenders.hide(400);
	resetHeadings();

			
}

startGame();

$("#attackButton").on("click", function(){
	//if an attack is possible..
	if(!gameOver){

		$("#infoSection").hide(40);
		$("#infoSection").empty();
		if(isDefender){
			var defender = characters[defenderIndex];
			var player = characters[playerIndex];
			//user attacks defender
			var att=player.AP*numAttacks;
			defender.HP-=att;
			numAttacks++;
			$("#defenderSection").empty();
			$("#defenderSection").append(defenderHeading);
			$("#defenderSection").append(game.makeTile(defenderIndex, defender, "green", "black", "white"));

			//check if enemy lost
			if(defender.HP<=0){
				if(enemies.length==0){
					$("#attackButton").prop("disabled", true);
					$("#infoSection").hide();
					$("#infoSection").empty();
					var info=$("<h3>");
					info.text("You Win!");
					info.css("font-weight", "bolder");
					var restart=$("<button>");
					restart.addClass("btn btn-success");
					restart.text("Restart");
					restart.on("click", function(){
						startGame();
					});
					$("#infoSection").append(info);
					$("#infoSection").append(restart);

					resetHeadings();
					$("#infoSection").show(400);
					$("#restartButton").show(400);
					gameOver=true;
					
					//allow for resart
				}
				else{
					//numAttacks=1;
					$("#attackButton").prop("disabled", true);
					isDefender=false;
					defenders.hide(40);
					$("#defenderSection").empty();
					$("#infoSection").hide(40);
					$("#infoSection").empty();
					var info=$("<h3>");
					info.text("You have defeated " + defender.name+". You can choose to fight another enemy.");
					info.css("font-weight", "bolder");
					$("#infoSection").append(info);
					resetHeadings();
					$("#infoSection").show(400);
					
					
				}
			}
			else{

				//defender attacks defender
				player.HP -= defender.CAP;
				$("#yourPlayerSection").empty();
				$("#yourPlayerSection").append(game.makeTile(playerIndex, player, "green", "white", "black"));

				//check if player lsot
				if(player.HP<=0){
					$("#attackButton").prop("disabled", true);
					gameOver=true;
					$("#infoSection").hide(40);
					$("#infoSection").empty();
					var info=$("<h3>");
					info.text("Game Over! You Lose.");
					info.css("font-weight", "bolder")
					var restart=$("<button>");
					restart.addClass("btn btn-success");
					restart.text("Restart");
					restart.on("click", function(){
						startGame();
					});
					$("#infoSection").append(info);
					$("#infoSection").append(restart);
					resetHeadings();
					$("#infoSection").show(400);
					$("#restartButton").show(400);
				}
				else{
					var att = numAttacks*player.AP;
					att-=player.AP;
					$("#infoSection").hide(40);
					var info=$("<h3>");
					info.text("You attacked " + defender.name + " for " +att+" damage");
					info.css("font-weight", "bolder");
					var info2=$("<h3>");
					info2.css("font-weight", "bolder");
					info2.text(defender.name + " attacked you back for "+defender.CAP+" damage");
					$("#infoSection").empty();
					$("#infoSection").append(info);
					$("#infoSection").append(info2);
					resetHeadings();
					$("#infoSection").show(400);
				}
			}

		}
		else
			alert("No defender to attack.");



	}
});

var canvas;
var context;
var score;
var fps = 32;
var time;
var dalpha = 1 / 64;

var fruits = [];
var bugs = [];

var level;
var gameOn;
var pause;

var background_colour = "#66FF66";

window.onload = function(){
	if(localStorage.getItem('high-score') == null){
		localStorage.setItem('high-score', 0);
	}
	if(document.getElementById("start-button") != null){
		document.getElementById("start-button").onclick = startHandler;
		document.getElementById("level-one").checked = true;
		var high_score_text = "High Score : " + localStorage.getItem('high-score');
		document.getElementById("high-score-container").innerHTML = high_score_text;
	} else {
		level = sessionStorage.getItem('level');
		score = 0;
		canvas = document.getElementById("gameCanvas");
		canvas.addEventListener('click', function(event){
			clickEvent(event);
		}, false);
		document.getElementById("pauseButton").onclick = pauseHandler;
		
		context = canvas.getContext("2d");
		gameOn = true;
		pause = false;
		init();
	}
}

function checkCollision(){
	for(var j = 0; j < bugs.length; j++){
		var bug = bugs[j];
		for (var i = 0; i < bugs.length; i++){
			var target = bugs[i];
			if((bug.posX > target.posX - 10) &&(bug.posX < target.posX + 10)){
				if((bug.posY > target.posY - 30) &&(bug.posY < target.posY +310)){
					if(bug.colour == "#000000"){
						target.hault = true;
					} else if ((bug.colour == "#FF0000") && (target.colour != "#000000")){
						target.hault = true;
					} else {
						target.hault = true;
					}
				}
			}
		}
	}
}

function startHandler(){
	if(document.getElementById("level-two").checked == true){
		level = 2;
	} else {
		level = 1;
	}
	sessionStorage.setItem('level', level);
	document.location.href = "game.html";
}

function pauseHandler(){
	if(pause == false){
		pause = true;
		document.getElementById("pauseButton").innerHTML = "Play";
		pauseScreen();
	} else if(pause == true){
		resumeScreen();
	}
}

function resumeScreen(){
	context.fillStyle = background_colour;
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.fill();
	context.fillStyle = "#000000";
	context.font="50px Georg ia";
	context.fillText("Get Ready !",100,200);
	context.font="30px Georgia";
	var level_string = "Level : " + level;
	context.fillText(level_string,120,300);	context.font="20px Georgia";
	var timeLeft = 60 - time;
	var timeString = "Time : " + timeLeft;
	context.fillText(timeString,150,350);
	var scoreString = "Score : " + score;
	context.fillText(scoreString,150,400);
	setTimeout(resumeHandler, 3000);
}

function resumeHandler(){
	pause = false;
	timeKeeper();
    gameLoop();
    bugLoop();
    document.getElementById("pauseButton").innerHTML = "Pause";
}


function pauseScreen(){
	context.fillStyle = background_colour;
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.fill();
	context.fillStyle = "#000000";
	context.font="50px Georgia";
	context.fillText("Pause",120,200);
	context.font="30px Georgia";
	var level_string = "Level : " + level;
	context.fillText(level_string,120,300);
	context.font="20px Georgia";
	var timeLeft = 60 - time;
	var timeString = "Time : " + timeLeft;
	context.fillText(timeString,150,350);
	var scoreString = "Score : " + score;
	context.fillText(scoreString,150,400);
}

function gameOverScreen(){
	fruits = [];
	bugs = [];
	if(score > localStorage.getItem('high-score')){
		localStorage.setItem('high-score', score);
	}
	if(time >= 60){
		if(level == 1){
			startLevel2Screen();
		} else {
			gameFinished();
		}
	} else {
		setTimeout(gameFinished, 1000);
	}
}

function gameFinished(){
	context.fillStyle = background_colour;
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.fill();
	context.fillStyle = "#000000";
	context.font="50px Georgia";
	context.fillText("Game Over!",60,200);
	context.font="30px Georgia";
	context.fillText("Your Score " + score, 120, 300);
	// context.fillText("Difficulty : ",120,300);
	context.font="20px Georgia";
	context.fillText("Restart",150,350);
	context.fillText("Exit",150,400);
}

function startLevel2Screen(){
	context.fillStyle = background_colour;
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.fill();
	context.fillStyle = "#000000";
	context.font="50px Georgia";
	context.fillText("Level 2!", 120, 200);
	context.font="20px Georgia";
	context.fillText("Your Score " + score, 120, 300);
	setTimeout(startLevel2, 3000);
}

function startLevel2(){
	console.log("startLevel2");
	score = 0;
	level = 2;
	gameOn = true;
	init();	
}

function init(){
	console.log("init");
	time = 0;
	timeKeeper();
	initFruits();
    gameLoop();
    bugLoop();
}

function timeOver(){
	console.log("Game Over", score);
}

function timeKeeper(){
	time += 1;
	dispTime = 60 - time;
	document.getElementById("time-div").innerHTML = "Time : " + dispTime;
	if(time == 60){
		gameOn = false;
		gameOverScreen();
	} else if((gameOn) && (pause == false)){
		setTimeout(timeKeeper, 1000);
	}
}

function bugLoop(){	
	if((gameOn) && (pause == false)){
		newBug();
		var nextTime = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
		setTimeout(bugLoop, nextTime);
	}
}

function gameLoop(){	
	if((gameOn) && (pause == false)){
		updateBugPosition();
		checkEat();
		drawObjects();
		setTimeout(gameLoop, 1000 / fps);
	}
}

function clickEvent(event){
	if(gameOn == false){
		if((event.pageX > 150) && (event.pageX < 250)){
			if((event.pageY > 350) && (event.pageY < 380)){
				gameOn = true;
				init();
			} else if((event.pageY > 400) && (event.pageY < 430)){
				document.location.href = "a2.html";

			}
		}
	} else {
		if(pause == false){
			for(var i = 0; i < bugs.length; i++){
				bug = bugs[i];
				if((event.pageX > bug.posX - 30) && (event.pageX < bug.posX + 40)){
					if((event.pageY > bug.posY - 30) && (event.pageY < bug.posY + 70)){
						if(bug.dead == false) {
							score += bug.points;
							document.getElementById("score-div").innerHTML = "Score : " + score;
							bug.dx = 0;
							bug.dy = 0;
							bug.dead = true;
						}
					}
				}
			}
		}
	}	
}

function drawObjects(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = background_colour;
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.fill();
	for(var i = 0; i < fruits.length; i++){
		var fruit = fruits[i];
		if(fruit.eaten == false){
			context.beginPath();
			context.fillStyle = '#FF0000';
			context.arc(fruit.posX, fruit.posY, 10, 0, 2*Math.PI);
			context.stroke();
			context.fill();
			context.beginPath();
			context.fillStyle = '#000000';
			context.rect(fruit.posX - 4, fruit.posY - 13, 4, 6);
			context.stroke();
			context.fill();
		}
	}

	for(var i = 0; i < bugs.length; i++){
		context.save();
		var bug = bugs[i];
		if(bug.alpha > 0){
			context.translate(bug.posX, bug.posY)
			context.rotate(bug.rotation);
			context.beginPath();
			if(bug.alpha < 1){
				console.log(bug.alpha);
			}
			context.globalAlpha = bug.alpha;
			context.fillStyle = bug.colour;
			context.arc(-10, 0, 5, 0, 2*Math.PI);
			context.ellipse(5, 0, 14, 5, 0, 0, 360);
			context.arc(20, 0, 5, 0, 2*Math.PI);
			context.stroke();
			context.fill();
			context.restore();
			if(bug.dead == true) {
				bug.alpha -= dalpha;
			}
		} else {
			bugs.splice(i, 1);
		}
	}
}

function updateBugPosition(){
	for(var i = 0; i < bugs.length; i++){
		var bug = bugs[i];
		bug.posX += bug.dx;
		bug.posY += bug.dy;
	}
}

function checkEat(){
	if(fruits.length > 0){
		for(var i = 0; i < bugs.length; i++){
			if((bugs[i].posX > fruits[bugs[i].nearestFruit].posX -20) &&(bugs[i].posX < fruits[bugs[i].nearestFruit].posX + 40)){
				if((bugs[i].posY > fruits[bugs[i].nearestFruit].posY - 10) && (bugs[i].posY < fruits[bugs[i].nearestFruit].posY) + 40){
					// fruits.splice(bugs[i].nearestFruit, 1);
					fruits[bugs[i].nearestFruit].eaten = true;
					manageEat(bugs[i].nearestFruit);
				}
			}
			
		}
	}
}

function manageEat(eatenFruitIndex){
	for(var i = 0; i < bugs.length; i++){
		if(bugs[i].nearestFruit == eatenFruitIndex){
			reRoute(i);
		}
	}

	var fruitsLeft = false;
	for(var j = 0; j < fruits.length; j++){
		if(fruits[j].eaten == false){
			fruitsLeft = true;
		}
	}

	if(fruitsLeft == false){
		gameOn = false;
		gameOverScreen();
	}
}

function reRoute(i){
	bugs[i].nearestFruit = calculateNearestFruit(bugs[i].posX, bugs[i].posY);
	displacement = calculateBugDisplacement(bugs[i].nearestFruit, bugs[i].posX, bugs[i].posY, bugs[i].speed);
	bugs[i].dx = displacement.changeX;
	bugs[i].dy = displacement.changeY;
	bugs[i].rotation = displacement.rotation;
}




function initFruits(){
	console.log("ininit")
	for (var i = 0; i < 5; i++){
		x = Math.floor(Math.random() * (380 + 1)) + 10;					// less 20 to avoid image going out of canvas.
		y = Math.floor(Math.random() * (580 - 120 + 1)) + 120;
		fruits[i] = ({posX: x, posY: y, eaten : false});	
	}
}

function newBug(){
	x = Math.floor(Math.random() * (390 - 10 + 1)) + 10;
	y = 0;
	s = 0;
	c = 0;
	p = 0;
	nearFruit = 0;
	xchange = 0;
	ychange = 0;
	var randomColourIndex = gerenateRandomBugColour();
	switch(randomColourIndex){
		case 0 :
			if(level == 1){
				s = 150;
			} else {
				s = 200;
			}
			c = "#000000"
			p = 5;
			break;
		case 1 :
			if(level == 1){
				s = 75;
			} else {
				s = 100;
			}
			c = "#FF0000";
			p = 3;
			break;
		case 2 :
			if(level == 1){
				s = 60;
			} else {
				s = 80;
			}
			c = "#FF9900";
			// c = "rgb(204, 0, 0, ";
			p = 1;
			break;
	}
	nearFruit = calculateNearestFruit(x, y);
	var displacement = calculateBugDisplacement(nearFruit, x, y, s);
	xchange = displacement.changeX;
	ychange = displacement.changeY;
	bugs.push({posX : x, posY : y, speed : s, colour : c, points : p, nearestFruit : nearFruit, dx : xchange, dy : ychange, rotation : displacement.rotation, dead : false, alpha : 1.0, hault : false});
}

function gerenateRandomBugColour(){
	var possibilities = [0, 0, 0, 1, 1, 1, 2, 2, 2, 2];
	var randomIndex = Math.floor(Math.random() * 10);
	return possibilities[randomIndex];
}

function calculateNearestFruit(x, y){
	var nearestFruit = 0;
	var nearestDistance = 9000;
	for(var i = 0; i < fruits.length; i++){
		var fruit = fruits[i];
		if(fruit.eaten == false){
			var distance = Math.sqrt(Math.pow(fruit.posX - x, 2) + Math.pow(fruit.posY - y, 2));
			if(distance < nearestDistance){
				nearestDistance = distance;
				nearestFruit = i;
			}
		}
	}
	return nearestFruit;
}

function calculateBugDisplacement(nearestFruit, x, y, speed){
	fruit = fruits[nearestFruit];
	distance = Math.sqrt(Math.pow(fruit.posX - x, 2) + Math.pow(fruit.posY - y, 2));
	var multiplier = speed / distance;			
	var sepX;
	var sepY;
	sepX = fruit.posX - x;
	sepY = fruit.posY - y;
	var dx = multiplier * (sepX);
	var dy = multiplier * (sepY);
	var rotate = (Math.atan(sepY / sepX));
	return {changeX : dx / fps, changeY : dy / fps, rotation : rotate};
}
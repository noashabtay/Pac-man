var context;
var shape = new Object(); // pacman location
var board; // game matrix
var score; 
var start_time;
var time_elapsed;
var time_left;
var GameTimer;

var interval;
var interval2;
var interval3;

var food_remain; // כמה אוכל רוצים שיהיה בלוח צריך לשנות את זה לפי ההגדרות אחכ
var food5point;
var food15point;
var food25point;

var imageup=document.createElement("img");	
var imagedown=document.createElement("img");	
var imageright=document.createElement("img");	
var imageleft=document.createElement("img");
var imageMons1=document.createElement('img');
var imageMons2=document.createElement('img');
var imageMons3=document.createElement('img');
var imageMons4=document.createElement('img');
var imageWall=document.createElement('img');
var imageCandy=document.createElement('img');
var imageClock=document.createElement('img');
var imageExtraLive=document.createElement('img');
var imageMovingP=document.createElement('img');


var divToShow = "Welcome";
var Monsters = [new Object() , new Object() , new Object() , new Object(),new Object()]
var LastMoves = [0,0,0,0,0]
var Lives = 5;
var keyCodeUp= "";
var keyCodeDown= "";
var keyCodeRight= "";
var keyCodeLeft= "";
var numOfBalls;
var userName = "";
var movingPriceExist= true;
var timeForMonsters = 600;
var gameProperties = [];
//0:up,1:upCode,2:down,3:downCode:,4:right,5:rightCode,6:left,7:leftCode
//8:numBalls,9:color5P,10:color15P,11:color25P,12:time,13:monsters
var Features = [new Object() , new Object() , new Object() , new Object() ,  new Object()]
//0:Clock ; 1:Candy1 ; 2:Candy2 ; 3:Candy3 ; 4:ExtraLive
var userInfo = [];

function ShowDiv(show) {
	var allDives = document.getElementsByClassName('section');
	var allModals = document.getElementsByClassName('modal')
	var target = document.getElementById(show);
	if(show != 'GameScreen'){
		let x = document.getElementById("GameMusic");
		x.pause();
	}
	if(show != 'GameScreen' && document.getElementById('GameScreen').style.display == 'block'){
		clearIntervals();
	}
	for(var i = 0 ; i < allDives.length ; i++){
		allDives[i].style.display = 'none';
	}
	for(var i = 0 ; i < allModals.length ; i++){
		allModals[i].style.display = 'none';
	}
	target.style.display = 'block';
	if(show == "Welcome"){
		window.location.hash = '#Welcome';
	}
	if(show == "GameScreen"){
		window.location.hash = '#GameScreen';
		Start();
	}
	if(show === 'Properties'){
		ShowDivInProp('introProperties');
	}
}
/******************************************* start game ************************************************/
$(document).ready(function() {
	var info = "p" + ',' + "p" ;
	localStorage.setItem("p" , info);
	context = canvas.getContext("2d");
	context.width  = window.innerWidth*0.75;
	context.height = window.innerHeight;
	context.fillStyle = "blue";
	ShowDiv('Welcome')
	console.log(divToShow)
});
// Fill The Board With the Relevent Values for the game : 2.1 , 2.2 , 2.3 , 2.4 - The Possition of the Packman - Morti (left,right,up,down
//														  11 , 12 ,13 - Different color of Ball
//                                                        3 - monster
//                                                        4 - Walls
function Start() {
	Lives = 5;
	GameTimer = gameProperties[12];
	let x = document.getElementById("GameMusic");
	x.play();
	numOfBalls = parseInt(gameProperties[8]);
	score = 0;
	// startTimer = gameProperties[12];
	start_time = new Date();
	board = new Array(); // init game
	var monsIndex = 0;
	var cnt = 119; //  מאפשר לנו להגדיר אחוזים מסויימים בהמשך
	
	food_remain = numOfBalls; // כמה אוכל רוצים שיהיה בלוח צריך לשנות את זה לפי ההגדרות אחכ
	food5point= Math.floor(numOfBalls*0.6);
	food15point= Math.floor(numOfBalls*0.3);
	food25point= numOfBalls-food5point-food15point;
	movingPriceExist= true;

	var monst_remain = parseInt(gameProperties[13]); // צריך לשנות לפי ההגדרות למספר המפלצות שהמשתמש הכניס
	let fourM = false;
	if(monst_remain > 3){
		fourM = true;
	}
	/************* Put walls In Game Board************/
	for (var i = 0; i < 17; i++) {
		board[i] = new Array(); 
		enterWalls(i);
	}

	for (var i = 0; i < 17; i++) {
		// board[i] = new Array(); // יוצרים את המערך הדו מימדי 
		for (var j = 0; j < 8; j++) {
			if( board[i][j] == 4){
				continue;
			}
			/************* Put movingP In Game Board************/
			if( (!fourM && i==16 && j==7) || (fourM && i==15 && j==7) ){
				Monsters[4].i = i;
				Monsters[4].j = j;
				board[i][j] = 100 ;// movingPrice
				continue;
			}
			/************* Put Monster in Corners *************/
			if( (i==0 && j==0) ||
				(i==16 && j==0) ||
				(i==0 && j==7) ||
				(i==16 && j==7) ) {
				if (monst_remain > 0) {
					Monsters[monsIndex].i = i;
					Monsters[monsIndex].j = j;
					monst_remain--;
					monsIndex++;
					board[i][j] = 3;
					continue;
				}
			}
			let prob = Math.floor(Math.random() * 100 + 1);
			if( prob > 70 ){
				//************* Put food randomly *************/
				if (food_remain >0 ){
					if (food_remain > 0 && (board[i].length < j || board[i][j] == 0 || board[i][j] == null)){ 
						enterRandomFood(i,j);
						continue;
					}
				}
			}
			board[i][j] = 0;
			cnt--;
		}
	}

	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		enterRandomFood(emptyCell[0],emptyCell[1]);
	}
	food5point= Math.floor(numOfBalls*0.6);
	food15point= Math.floor(numOfBalls*0.3);
	food25point= numOfBalls-food5point-food15point;
	/************* Put Pacman randomly *************/
	var emptyCell = findRandomEmptyCell(board);
	shape.i = emptyCell[0];
	shape.j = emptyCell[1];
	board[shape.i][shape.j] = 2.1;


	for(let i = 0 ; i < Features.length ; i++){
		Features[i].i = 999;
		Features[i].j = 999;
		Features[i].eat = false;
	}
	keysDown = {}; // הגדרת מילון עם שני איבנט ליסנר
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 200);
	interval2 = setInterval(UpdateMonsters , timeForMonsters);
	interval3 = setInterval(updateCandy, 800);

}
function enterWalls(i){
	if ( i == 1 ){
		board[1][0] = 4; board[1][1] = 4; board[1][2] = 4; board[1][3] = 4;
	}else if ( i == 3 ){
		board[3][5] = 4; board[3][6] = 4; board[3][7] = 4;
	}
	else if ( i == 5 ){
		board[5][1] = 4; board[5][2] = 4; board[5][3] = 4; board[5][6] = 4; board[5][7] = 4;
	}else if( i == 9 ){
		board[9][4] = 4; board[9][3] = 4; board[9][2] = 4; board[9][5] = 4; board[9][6] = 4;
	}else if( i == 13 ){
		board[13][5] = 4; board[13][6] = 4; board[13][7] = 4; 
	}else if( i == 16 ){
		board[16][2] = 4; board[16][5] = 4;
		board[10][2] = 4; board[11][2] = 4; board[12][2] = 4; board[12][3] = 4; board[8][6] = 4;
		board[12][0] = 4; board[13][0] = 4; board[14][0] = 4; board[13][2] = 4;
		board[4][1] = 4; board[3][1] = 4; board[3][2] = 4;
	}
}
function enterRandomFood (i,j){
	let stop = false;
	while(!stop && food_remain > 0){
		let randomFood = Math.floor((Math.random() * 3) + 11); // random integer from 11 to 13
		if(randomFood == 11 && food5point > 0 ){
			food5point--;
			board[i][j] = randomFood;
			stop=true;
		}
		else if(randomFood == 12 && food15point > 0 ){
			food15point--;
			board[i][j] = randomFood;
			stop = true;
		}
		else if(randomFood == 13 && food25point > 0 ){
			food25point--;
			board[i][j] = randomFood;
			stop = true;
		}
	}
	if(stop)
		food_remain--;
	else{
		board[i][j] = 0;
	}

}
function isPacman(i,j){
	return board[i][j] == 2.1 || board[i][j] == 2.2 || board[i][j] == 2.3 || board[i][j] == 2.4 ;
}
function isMonster(i,j){
	return board[i][j] == 3 || board[i][j] == 14 || board[i][j] == 15 || board[i][j] == 16 || 
			board[i][j] == 203 || board[i][j] == 204 || board[i][j] == 205;
}
function isCandy(i,j){
	return board[i][j] == 100 || board[i][j] == 111 || board[i][j] == 112 || board[i][j] == 113 ;
}
function isFeatures(i,j){
	return board[i][j] == 200 || board[i][j] == 201 || board[i][j] == 202;
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 16 + 1);
	var j = Math.floor(Math.random() * 7 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 16 + 1);
		j = Math.floor(Math.random() * 7 + 1);
	}
	return [i, j];
}
//Funstion that Draw The Canvas by The Values in the Board - 2.1 , 2.2 , 2.3 , 2.4 - Packman Morty (Left , Right < Down , Up)
//														   - 3 , 14 , 15 , 16 ,103, 203 , 204 , 205 - Monsters - to save the cell value before the monster came to draw the previous value of the cell
//                                                         - 11 , 12 , 13  - Food - Different color of Ball
//                                                         - 4 - Walls
//														   - 100 - movingCandy
//                                                         - 200 , 201 , 202 - Clock Feature To get More time , Candy to get more score ,ExtraLive emoji
function Draw() {
	canvas.width = canvas.width; //clean board

	/************ Show Property Part ************/
	DrawCircleProp();
	getPropertiesVariables();
	getImages();
	imageup.onload=function(){
		context.drawImage(imageup,center.x,center.x,50,50);
	}
	var monsters = [imageMons1 , imageMons2 , imageMons3 , imageMons4];
	let ind = 0;
	let noBalls =true;
	/************* Show Game Part *************/
	for (var i = 0; i < 17; i++) {
		for (var j = 0; j < 8; j++) {
			var center = new Object();
			center.x = i * 60;
			center.y = j * 60;
			/************* Drow Pacman *************/
			if (board[i][j] == 2.1) {
				context.drawImage(imageup, center.x, center.y, 50, 50); //UP
			} else if (board[i][j] == 2.2) {
				context.drawImage(imagedown, center.x, center.y, 50, 50); //DOWN
			} else if (board[i][j] == 2.3) {
				context.drawImage(imageleft, center.x, center.y, 50, 50); //LEFT
			} else if (board[i][j] == 2.4) {
				context.drawImage(imageright, center.x, center.y, 50, 50); //RIGHT
				/*************Drow Monsters***************/
			} else if (ind <= 3 && (board[i][j] == 3 || board[i][j] == 203||
				 board[i][j] == 204|| board[i][j] == 205) ) {
				context.drawImage(monsters[ind], center.x, center.y, 50, 50); //Monst
				ind++;
			} else if( ind <= 3 && (board[i][j] == 14 ||board[i][j] == 15 || board[i][j] == 16)){
				context.drawImage(monsters[ind], center.x, center.y, 50, 50); //Monst
				ind++;
				noBalls=false;
			}
			else if (board[i][j] == 11) {
				noBalls=false;
				/************* Drow Food 5P *************/
				context.beginPath();
				context.arc(center.x + 15, center.y + 15, 20, 0, 2 * Math.PI); // circle
				context.fillStyle = gameProperties[9]; //color 5P
				context.fill();
			} else if (board[i][j] == 12) {
				noBalls=false;
				/************* Drow Food 15P *************/
				context.beginPath();
				context.arc(center.x + 15, center.y + 15, 20, 0, 2 * Math.PI); // circle
				context.fillStyle = gameProperties[10]; //color 15P
				context.fill();
			} else if (board[i][j] == 13) {
				noBalls=false;
				/************* Drow Food 25P *************/
				context.beginPath();
				context.arc(center.x + 15, center.y + 15, 20, 0, 2 * Math.PI); // circle
				context.fillStyle = gameProperties[11]; //color 25P
				context.fill();
			} else if ( board[i][j] == 100 || board[i][j] == 111 || board[i][j] == 112 || board[i][j] == 113){
				context.drawImage(imageMovingP, center.x, center.y, 50, 50); //moving candy
			}else if (board[i][j] == 4) {
				/************* Drow Wall *************/
				context.drawImage(imageWall, center.x, center.y, 50, 50); //Wall
			} else if (board[i][j] == 200) {
				/************* Drow Clock *************/
				context.drawImage(imageClock, center.x, center.y, 50, 50); //clock
			} else if (board[i][j] == 201) {
				/************* Drow Candy *************/
				context.drawImage(imageCandy, center.x, center.y, 50, 50); //candy
			} else if (board[i][j] == 202) {
				/************* Drow Extra Live *************/
				context.drawImage(imageExtraLive, center.x, center.y, 50, 50); //ExtraLive
			}
		}
	}
}
function getImages(){
	imageup.src="PacmanImages\\mortiU.png";
	imagedown.src="PacmanImages\\mortiD.png";
	imageright.src="PacmanImages\\mortiR.png";
	imageleft.src="PacmanImages\\mortiL.png";
	imageMons1.src="MonstersAndWall\\mons1.png";
	imageMons2.src="MonstersAndWall\\mons2.png";
	imageMons3.src="MonstersAndWall\\mons3.png";
	imageMons4.src="MonstersAndWall\\mons4.png";
	imageWall.src="MonstersAndWall\\potal.png";
	imageCandy.src='CandyandClock\\candy.png';
	imageClock.src='CandyandClock\\clock1.png';
	imageExtraLive.src='CandyandClock\\extraLive.png';
	imageMovingP.src='CandyandClock\\movingPrice.png'
}
/******************************************* during game ********************************************/
function GetKeyPressed() {
	if (keysDown[keyCodeUp]) {
		return 1;
	}
	if (keysDown[keyCodeDown]) {
		return 2;
	}
	if (keysDown[keyCodeLeft]) {
		return 3;
	}
	if (keysDown[keyCodeRight]) {
		return 4;
	}
}
function reorderBoard(){
	clearInterval(interval);
	clearInterval(interval2);
	clearInterval(interval3);
	let monsIndex = 0;
	var monst_remain = parseInt(gameProperties[13]);

	/************* Put Monster in Corners *************/
	for (var i = 0; i < 17; i++) {
		for (var j = 0; j < 8; j++) {
			if(isPacman(i,j)){
				board[i][j] = 0;
			}
			if(isMonster(i,j)){
				board[i][j] -= 3;
			} 
			if( (i==0 && j==0) ||
				(i==16 && j==0) ||
				(i==0 && j==7) ||
				(i==16 && j==7) ) {
				if (monst_remain > 0) {
					Monsters[monsIndex].i = i;
					Monsters[monsIndex].j = j;
					monst_remain--;
					monsIndex++;
					board[i][j] = 3;
				}
			}
		}
	}
	/************* Put Pacman randomly *************/
	var emptyCell = findRandomEmptyCell(board);
	shape.i = emptyCell[0];
	shape.j = emptyCell[1];
	board[shape.i][shape.j] = 2.1;

	interval = setInterval(UpdatePosition, 200);
	interval2 = setInterval(UpdateMonsters , timeForMonsters);
	if(movingPriceExist)
		interval3 = setInterval(updateCandy, 800);
}
function updateCandy(){
	if(movingPriceExist){
		let p =Math.floor( Math.random() * 4 +1 );
		while(p == LastMoves[4]){
			p = Math.floor( Math.random() * 4 +1 );
		}
		if (p == 1) { //up
			if (Monsters[4].j > 0 && board[Monsters[4].i][Monsters[4].j - 1] != 4 && !isMonster(Monsters[4].i , Monsters[4].j - 1) && !isFeatures(Monsters[4].i , Monsters[4].j - 1)) {
				if(isPacman(Monsters[4].i , Monsters[4].j - 1)){
					score += 50;
					movingPriceExist = false;
					board[Monsters[4].i][Monsters[4].j] -= 100;
				}
				else{
					board[Monsters[4].i][Monsters[4].j] -= 100;
					LastMoves[4] = 2;
					Monsters[4].j--;
					board[Monsters[4].i][Monsters[4].j] += 100;
				}
			}
			else{
				LastMoves[4] = p;
			}
		}
		else if (p == 2) { //down
			if (Monsters[4].j < 7 && board[Monsters[4].i][Monsters[4].j + 1] != 4  && !isMonster(Monsters[4].i , Monsters[4].j + 1) && !isFeatures(Monsters[4].i , Monsters[4].j + 1)) {
				if(isPacman(Monsters[4].i , Monsters[4].j + 1)){
					score += 50;
					movingPriceExist = false;
					board[Monsters[4].i][Monsters[4].j] -= 100;
				}
				else{
					board[Monsters[4].i][Monsters[4].j] -= 100;
					LastMoves[4] = 1;
					Monsters[4].j++;
					board[Monsters[4].i][Monsters[4].j] += 100;
				}
			}
			else{
				LastMoves[4] = p;
			}
		}
		else if (p == 3) { //left
			if (Monsters[4].i > 0 && board[Monsters[4].i - 1][Monsters[4].j] != 4  && !isMonster(Monsters[4].i-1 , Monsters[4].j) && !isFeatures(Monsters[4].i-1 , Monsters[4].j)) {
				if(isPacman(Monsters[4].i-1 , Monsters[4].j)){
					score += 50;
					movingPriceExist = false;
					board[Monsters[4].i][Monsters[4].j] -= 100;
				}
				else{
					board[Monsters[4].i][Monsters[4].j] -= 100;
					LastMoves[4] = 4;
					Monsters[4].i--;
					board[Monsters[4].i][Monsters[4].j] += 100;
				}
			}
			else{
				LastMoves[4] = p;
			}
		}
		else if (p == 4) { //right
			if (Monsters[4].i < 16 && board[Monsters[4].i + 1][Monsters[4].j] != 4 && !isMonster(Monsters[4].i+1 , Monsters[4].j) && !isFeatures(Monsters[4].i+1 , Monsters[4].j)) {
				if(isPacman(Monsters[4].i+1 , Monsters[4].j)){
					score += 50;
					movingPriceExist = false;
					board[Monsters[4].i][Monsters[4].j] -= 100;
				}
				else{
					board[Monsters[4].i][Monsters[4].j] -= 100;
					LastMoves[4] = 3;
					Monsters[4].i++;
					board[Monsters[4].i][Monsters[4].j] += 100;
				}
			}
			else{
				LastMoves[4] = p;
			}
		}
	}
	Draw();
}
function UpdateMonsters() {
	/********************************************Draw Monsters*************************************************/
	let numOfMonsters = parseInt(gameProperties[13]);
	for(let k = 0 ; k < numOfMonsters ; k++){
		let p = Math.floor( Math.random() * 4 +1 );
		while(p == LastMoves[k]){
			p = Math.floor( Math.random() * 4 +1 );
		}
		if (p == 1) { //up
			if (Monsters[k].j > 0 && board[Monsters[k].i][Monsters[k].j - 1] != 4 && !isMonster(Monsters[k].i , Monsters[k].j - 1) && !isCandy(Monsters[k].i , Monsters[k].j - 1)) {
				if(isPacman(Monsters[k].i , Monsters[k].j - 1)){
					score -= 10;
					Lives--;
					reorderBoard();
					return;
				}
				else{
					board[Monsters[k].i][Monsters[k].j] -= 3;
					LastMoves[k] = 2;
					Monsters[k].j--;
					board[Monsters[k].i][Monsters[k].j] += 3;
				}
			}
			else{
				LastMoves[k] = p;
			}
		}
		else if (p == 2) { //down
			if (Monsters[k].j < 7 && board[Monsters[k].i][Monsters[k].j + 1] != 4 && !isMonster(Monsters[k].i , Monsters[k].j + 1) && !isCandy(Monsters[k].i , Monsters[k].j + 1)) {
				if(isPacman(Monsters[k].i , Monsters[k].j + 1)){
					score -= 10;
					Lives--;
					reorderBoard();
					return;
				}
				else{
					board[Monsters[k].i][Monsters[k].j] -= 3;
					LastMoves[k] = 1;
					Monsters[k].j++;
					board[Monsters[k].i][Monsters[k].j] += 3;
				}
			}
			else{
				LastMoves[k] = p;
			}
		}
		else if (p == 3) { //left
			if (Monsters[k].i > 0 && board[Monsters[k].i - 1][Monsters[k].j] != 4 && !isMonster(Monsters[k].i-1 , Monsters[k].j) && !isCandy(Monsters[k].i-1 , Monsters[k].j)) {
				if(isPacman(Monsters[k].i-1 , Monsters[k].j)){
					score -= 10;
					Lives--;
					reorderBoard();
					return;
				}
				else{
					board[Monsters[k].i][Monsters[k].j] -= 3;
					LastMoves[k] = 4;
					Monsters[k].i--;
					board[Monsters[k].i][Monsters[k].j] += 3;
				}
			}
			else{
				LastMoves[k] = p;
			}
		}
		else if (p == 4) { //right
			if (Monsters[k].i < 16 && board[Monsters[k].i + 1][Monsters[k].j] != 4 && !isMonster(Monsters[k].i+1 , Monsters[k].j) && !isCandy(Monsters[k].i+1 , Monsters[k].j)) {
				if(isPacman(Monsters[k].i+1 , Monsters[k].j)){
					score -= 10;
					Lives--;
					reorderBoard();
					return;
				}
				else{
					board[Monsters[k].i][Monsters[k].j] -= 3;
					LastMoves[k] = 3;
					Monsters[k].i++;
					board[Monsters[k].i][Monsters[k].j] += 3;
				}
			}
			else{
				LastMoves[k] = p;
			}
		}
	}
	Draw();
}
function UpdatePosition() {
	let pacManDirection = board[shape.i][shape.j];
	board[shape.i][shape.j] = 0; //clean pacman
	var x = GetKeyPressed(); //get pressed key
	if (x == 1) { //up
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			if(isMonster(shape.i , shape.j - 1)){
				score -= 10;
				Lives--;
				reorderBoard();
				return;
			}
			shape.j--;
			pacManDirection=2.1;
		}
	}
	if (x == 2) { //down
		if (shape.j < 7 && board[shape.i][shape.j + 1] != 4 ) {
			if(isMonster(shape.i , shape.j + 1)){
				score -= 10;
				Lives--;
				reorderBoard();
				return;
			}
			shape.j++;
			pacManDirection=2.2;
		}
	}
	if (x == 3) { //left
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			if(isMonster(shape.i-1 , shape.j)){
				score -= 10;
				Lives--;
				reorderBoard();
				return;
			}
			shape.i--;
			pacManDirection=2.3;
		}
	}
	if (x == 4) { //right
		if (shape.i < 16 && board[shape.i + 1][shape.j] != 4) {
			if(isMonster(shape.i+1 , shape.j)){
				score -= 10;
				Lives--;
				reorderBoard();
				return;
			}
			shape.i++;
			pacManDirection=2.4;
		}
	}

	for(let i = 0 ; i < Features.length ; i++){
		if(Features[i].i == shape.i && Features[i].j == shape.j){
			Features[i].eat = true;
		}
	}

	UpdateValuesAfterMove(GameTimer);
	DisplayFeatures(GameTimer)
	if(!(shape.i<0 || shape.j<0 || shape.i>16 ||shape.j>7)){
		board[shape.i][shape.j] = pacManDirection; // נרצה לצבוע מחדש את הקאנבס, גם אם הצלחתי להתקדם וגם אם לא
	}
	Draw();
}
function UpdateValuesAfterMove(timer){
	if (board[shape.i][shape.j] == 11) {
		score+=5; // אם זה אוכל תעלה את הניקוד
		numOfBalls--;
		food5point--;
	}
	else if (board[shape.i][shape.j] == 12) {
		score+=15; // אם זה אוכל תעלה את הניקוד
		numOfBalls--;
		food15point--;
	}
	else if (board[shape.i][shape.j] == 13) {
		score+=25; // אם זה אוכל תעלה את הניקוד
		numOfBalls--;
		food25point--;
	}
	if (board[shape.i][shape.j] == 200){
		//Eat clock
		GameTimer = GameTimer*2;
	}
	else if (board[shape.i][shape.j] == 201){
		//Eat Candy
		score += 100;
	}
	else if (board[shape.i][shape.j] == 202){
		//Eat Extra Live
		Lives ++;
	}else if(board[shape.i][shape.j] == 100){
		//Eat moving Candy
		score += 50;
		movingPriceExist = false;
		board[shape.i][shape.j] -= 100;
	}else if(board[shape.i][shape.j] == 111){
		//Eat moving Candy + 5 points Ball
		score += 55;
		movingPriceExist = false;
		board[shape.i][shape.j] -= 111;
		numOfBalls--;
		food5point--;
	}else if(board[shape.i][shape.j] == 112){
		//Eat moving Candy + 15 points Ball
		score += 65;
		movingPriceExist = false;
		board[shape.i][shape.j] -= 112;
		numOfBalls--;
		food15point--;
	}else if(board[shape.i][shape.j] == 113){
		//Eat moving Candy + 25 points Ball
		score += 75;
		movingPriceExist = false;
		board[shape.i][shape.j] -= 113;
		numOfBalls--;
		food25point--;
	}
	console.log(numOfBalls);
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000; // מעדכן את הזמן שעבר
	time_left = (Math.round( (GameTimer - time_elapsed) * 100) / 100).toFixed(2);
	if(time_elapsed >= GameTimer){
		clearIntervals();
		let sound = document.getElementById("GameMusic");
		sound.currentTime = 0;	
		return showRegModel('TimeOverDialog');
	}
	if(Lives == 0){
		clearIntervals();
		let sound = document.getElementById("GameMusic");
		sound.currentTime = 0;
		return showRegModel('gameOverDialog');
	}
	if(numOfBalls == 0){
		clearIntervals();
		let sound = document.getElementById("GameMusic");
		sound.currentTime = 0;
		return showRegModel('winnerDialog');
	}
}
function clearIntervals(){
	clearInterval(interval);
	clearInterval(interval2);
	clearInterval(interval3);
	let sound = document.getElementById("GameMusic");
	sound.pause();
}
function DisplayFeatures(timer){
	let quarterTime = Math.floor(timer/4);
	if( time_elapsed < quarterTime*4 && time_elapsed >= quarterTime * 3){ //ברבע האחרון של הזמן
		//Clock
		if(!Features[0].eat){
			if(Features[0].i == 999 && Features[0].j == 999){
				let emptyCell = findRandomEmptyCell(board);
				Features[0].i = emptyCell[0];
				Features[0].j = emptyCell[1];
			}
			board[Features[0].i][Features[0].j] = 200;
		}
	}
	if( time_elapsed <= quarterTime*3 && time_elapsed >= quarterTime){ //ברבע השני והשלישי של הזמן
		//Candy
		for(let k = 1 ; k < 4 ; k++){
			if(!Features[k].eat){
				if(Features[k].i == 999 && Features[k].j == 999){
					let emptyCell = findRandomEmptyCell(board);
					Features[k].i = emptyCell[0];
					Features[k].j = emptyCell[1];
				}
				board[Features[k].i][Features[k].j] = 201;
			}
		}
	}
	if( time_elapsed <= quarterTime*2 && time_elapsed >= quarterTime){ // ברבע השני של הזמן
		//Extrs Live
		if(!Features[4].eat){
			if(Features[4].i == 999 && Features[4].j == 999){
				let emptyCell = findRandomEmptyCell(board);
				Features[4].i = emptyCell[0];
				Features[4].j = emptyCell[1];
			}
			board[Features[4].i][Features[4].j] = 202;
		}
	}
}

/******************************************* game Prop ********************************************/
// Display balls Properties in the game Properties Display
function DrawCircleProp(){
	var canvas = document.getElementById('circle');
	if (canvas.getContext){
		var ctx = canvas.getContext('2d'); 
		var X = canvas.width*3/4;
		var Y = canvas.height/3;
		var R = 10;
		ctx.beginPath();
		ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
		ctx.strokeStyle = gameProperties[9];
		ctx.fillStyle = gameProperties[9];
  		ctx.fill();
		ctx.stroke();
		ctx.fillText("    5P",canvas.width*3/5,50);
		var X = canvas.width*2/4;
		var Y = canvas.height/3;
		var R = 10;
		ctx.beginPath();
		ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
		ctx.strokeStyle = gameProperties[10];
		ctx.fillStyle = gameProperties[10];
  		ctx.fill();
		ctx.stroke();
		ctx.fillText("  15P",canvas.width *2/5,50);

		var X = canvas.width/4;
		var Y = canvas.height/3;
		var R = 10;
		ctx.beginPath();
		ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
		ctx.strokeStyle = gameProperties[11];
		ctx.fillStyle = gameProperties[11];
  		ctx.fill();
		ctx.stroke();
		ctx.fillText("25P",canvas.width/5,50);
	}
}
function getPropertiesVariables(){
	lblScore.value = score;
	lblTime.value = time_left;
	lblLives.value = Lives;

	document.getElementById('lblButtonsU').value = "" + gameProperties[0];
	keyCodeUp = gameProperties[1];
	document.getElementById('lblButtonsD').value = "" + gameProperties[2];
	keyCodeDown = gameProperties[3];
	document.getElementById('lblButtonsR').value = "" + gameProperties[4];
	keyCodeRight = gameProperties[5];
	document.getElementById('lblButtonsL').value = "" + gameProperties[6];
	keyCodeLeft = gameProperties[7];

	document.getElementById('lblTimeT').value = "" + gameProperties[12];
	document.getElementById('lblBalls').value = "" + gameProperties[8];
	document.getElementById('lblMonsters').value = "" + gameProperties[13];

}


/******************************************* משימות ********************************************/
// אולי להוסיף את זה שמפלצת לא יכולה לעלות על מפלצת אחרת
// readme 






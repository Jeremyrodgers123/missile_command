$(document).ready(function(){
//***********CANVAS*******************	

	var CANVAS_WIDTH = 600;
	var CANVAS_HEIGHT = 600;
	var $canvas = $("#canvas")
	var $context = $canvas.get(0).getContext('2d')
	$context.fillStyle = "black";
	$context.fillRect( 0 ,0, CANVAS_WIDTH, CANVAS_HEIGHT); 

	game.initailize();

	$canvas.on('click', function(){
		game.bases[0].fire();
	});
//***********button*******************
	$('#playGameBtn').on('click', function(){
		game.bases[1].fire();
	});
//***********CANVAS CONTINUED*******************
	var FPS = 30;
	var xPos = 50;
	var yPos = 50;

	function draw(){
		$context.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
		
		for (var i = 0; i < game.bases.length; i++){
			//game.bases[i].setXPosition(i);
			game.bases[i].draw($context);
			for (var j = 0; j < game.bases[i].missiles.length; j++){
				game.bases[i].missiles[j].draw($context)
			};
		};

		for (var i = 0; i < game.enemies.length; i++){
			game.enemies[i].draw($context);
		}
	}
	function update(){
		xPos += 1;
		yPos += 1;
		for(var i = 0; i < game.enemies.length; i++){
			game.enemies[i].updatePosition();
		};
		for(var j = 0; j < game.bases.length; j++){
			var missiles = game.bases[j].missiles
			for(var k = 0; k < missiles.length; k++){
				missiles[k].updatePosition(game.bases[j]);			
			}
		}
	}

	setInterval(function(){
		update();
		draw();
	}, 1000/FPS);
});
//***********BASE*******************
var Base = function(){
	//this.img = console.log("cool image");
	this.currentPosition = [];//update with base's position
	this.missiles = [];
	this.xPos = 50;
	this.yPos = 550;
	this.width = 50;
	this.height = 50;
	this.color = "#00e50a"
} 
Base.prototype = {
	constructor: Base,
	missileCount : function(){
		var count = 0;
		var missiles = this.missiles;
		for (var i = 0; i < missiles.length; i++){
			if (missiles[i].isActive === false){
				count += 1;
			}
		}
		return count;
		
		
	},
	loadMissiles: function(numMissiles){
		for(var i = 0; i < numMissiles; i++){
			this.missiles.push(new Missile);
		}
	},
	fire: function(){
	  if (this.missileCount() >= 1){
	  	this.missiles[this.missiles.length - 1].isActive = true;
	  	console.log(this.missileCount());

	  } else{
	  	console.log("out");
	  }
	},
	setXPosition: function(i, length){
		//console.log(this)
		//object variable inserted to fix using apply to borrow method
		var object = this[i]
		var start = 25;
		var finish = 600 - (start * 3)
		var interval = 600 / length
		if (i === 0) {
			object.xPos = start;
			object.min = start;
			object.max = start + interval -100;

			//console.log("the xPos is... ")
			//console.log(this.xPos)

		//note: not correct for far edge
		}else if ( i > 0 && i < length) {
			var distance = i * interval;
			object.xPos = start + distance;
			object.min = object.xPos;
			object.max = object.xPos + interval -100;
			//console.log("the xPos is... ")
			//console.log(this.xPos)
		}else {
			object.xPos = finish;
			object.min = object.xPos;
			object.max = object.xPos + interval;
			//console.log("the xPos is... ")
			//console.log(this.xPos)
		}
		//console.log(this.xPos)
	},
	draw: function($context){
		$context.fillStyle = this.color;
		$context.fillRect(this.xPos , this.yPos, this.width, this.height)
	}
}
//***********Missile*******************
var Missile = function(){
	//this.img = console.log("cool misslile image");
	this.xPos = 80;
	this.yPos = 575;
	this.width = 5;
	this.height = 20;
	this.color = "#42f4c5"
	this.startPosition = 0; // fill with start position
	this.currentPosition = [];
	this.isCollision = false;
	this.isActive = false;
}

Missile.prototype = {
	constructor: Missile,
	draw: function($context){
		$context.fillStyle = this.color;
		$context.fillRect(this.xPos, this.yPos, this.width, this.height);
	},
	setXPos: function(base, length, i){
		var start = base.xPos + base.width + 5;
		var interval = 10
		if (i === 0) {
			this.xPos = start;
			this.startPosition = start
		//note: not correct for far edge
		}else if ( i > 0 && i < length) {
			var distance = i * interval;
			this.xPos = start + distance;
			this.startPosition = this.xPos;
			//console.log("the xPos is... ")
			//console.log(this.xPos)
		}else {
			this.xPos = finish;
			this.startPosition = this.xPos;
			//console.log("the xPos is... ")
			//console.log(this.xPos)
		}
		//console.log(this.xPos)
	},
	updatePosition: function(base){
		if (this.isActive && this.startPosition === this.xPos){
			var baseWidth = base.width / 2;
			this.xPos = baseWidth + base.xPos -2.5;
			this.yPos = base.yPos - this.height;
		};

		if (this.isActive){
			this.yPos = this.yPos - 5;
		}
	}
}
//***********City*******************
var City = function(){
	//this.img = console.log("put cool city image");
	this.isAlive = true;
}
//***********Enemy*******************
var Enemy = function(){
	//img
	this.bullets = [];
	this.xPos = 10;
	this.yPos = 10;
	this.width = 50;
	this.height = 50;
	this.color = "#f46672";
	this.direction ="right";
	this.max = 200;
	this.min = 0;

}
Enemy.prototype = {
	constructor: Enemy,
	loadBullets: function(numBullets){
		var n = numBullets;
		for(var i = 0; i < n; i++){
			var bullet = new Bullet
			this.bullets.push(bullet)
		}
	},
	fire: function(){
		console.log("insert fire function")
	},
	draw: function($context){
		$context.fillStyle = this.color;
		$context.fillRect(this.xPos,this.yPos, this.width, this.height)
	},
	updatePosition: function(){
		if (this.direction === "right"){
			this.xPos += 2
		}else if (this.direction ==="left"){
			this.xPos += -2 
		};

		if (this.xPos === this.max){
			this.direction = "left"
		};

		if (this.xPos === this.min){
			this.direction = "right"
		};

	},
	clamp: function(){

	}
}
//***********BULLET*******************
var Bullet = function(){
	//img
	this.isActive = false;
	this.currentPosition = [];
}

//***********GAME*******************
var game = {
	bases : [],
	cities : [],
	enemies: [],
	baseCount: 3,
	missleCount: 10,
	cityCount: 5,
	enemyCount: 3,
	initailize: function(){
	  //draw bases
	  game.baseCreator(game.baseCount, game.createBases);
	  game.createCities(game.cityCount);
	  game.createEnemies(game.enemyCount)
	  game.PositionSetter(game.setXPos,"base");
	  game.PositionSetter(game.setXPos,"enemies");
	  game.setMissleXPos();
	  game.bases[0].fire();
	},
	createBases : function(){
		var base = new Base();
		base.loadMissiles(game.missleCount);
		//console.log(base);
		//console.log(game.bases)
		return base	
	},
	createEnemies : function(numEnemies){
		var n = numEnemies
		for(var i = 0; i < n; i++){
			var enemy = new Enemy
			enemy.loadBullets(10);
			game.enemies.push(enemy);
		}
	},
	createCities :function(numCities){
		var n = numCities;
		for(var i = 0; i < n; i++){
			var city = new City
			game.cities.push(city)
		}
	},
	baseCreator: function(numBases, callback){
		var n = numBases;
		for(var i = 0; i < n; i++){
			var base = callback()
			game.bases.push(base);
		}
	},
	setXPos : function(array){	
		for (var i = 0; i < array.length; i++){
			var length = array.length
			game.bases[i].setXPosition.apply(array, [i, length]);
		}
	},
	setMissleXPos : function(){	
		var bases = game.bases
		for (var i = 0; i < bases.length; i++){
			var base = bases[i]
			var array = bases[i].missiles;
			var length = array.length;
			for (var j = 0; j < length; j++){
				array[j].setXPos(base, length, j)
			}
			//game.bases[i].setXPosition.apply(array, [i, length]);

		}
	},
	PositionSetter: function(callback, array){
		//choose array
		if (array === "base"){
			array = game.bases
		} else if (array === "enemies"){
			array = game.enemies
		};

		callback(array)
	},
	collisionDetection: function(){

	}
}


$(document).ready(function(){
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

	$('#playGameBtn').on('click', function(){
		game.bases[1].fire();
	});

	var FPS = 30;
	var xPos = 50;
	var yPos = 50;
	
	function draw(){
		$context.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
		game.bases[0].draw($context);
	}

	function update(){
		xPos += 1;
		yPos += 1;
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
	this.yPos = 50;
	this.width = 50;
	this.height = 50;
	this.color = "#00e50a"
} 
Base.prototype = {
	constructor: Base,
	missileCount : function(){
		var count = this.missiles.length;
		console.log(count);
	},
	loadMissiles: function(numMissiles){
		for(var i = 0; i < numMissiles; i++){
			this.missiles.push(new Missile);
		}
	},
	fire: function(){
	  if (this.missiles.length> 1){
	  	this.missiles.pop();
	  	this.missileCount();
	  	console.log("we still have missiles");
	  } else{
	  	console.log("out");
	  }
	},
	draw: function($context){
		$context.fillStyle = this.color;
		$context.fillRect(this.xPos, this.yPos, this.width, this.height)
	}
}
//***********Missile*******************
var Missile = function(){
	//this.img = console.log("cool misslile image");
	this.startPosition = []; // fill with start position
	this.currentPosition = [];
	this.isCollision = false;
	this.active = false;
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
	enemyCount: 1,
	initailize: function(){
	  //draw bases
	  game.baseCreator(game.baseCount, game.createBases);
	  game.createCities(game.cityCount);
	  game.createEnemies(game.enemyCount)
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

	}
}


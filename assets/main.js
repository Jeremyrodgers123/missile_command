$(document).ready(function(){
//***********CANVAS*******************	

	var CANVAS_WIDTH = 800;
	var CANVAS_HEIGHT = 600;
	var $canvas = $("#canvas")
	var $context = $canvas.get(0).getContext('2d')
	$context.fillStyle = "black";
	$context.fillRect( 0 ,0, CANVAS_WIDTH, CANVAS_HEIGHT); 

	game.initailize();

	$canvas.on('click', function(event){
		
		var offset = $(this).offset()
		//alert("offset left: "+ offset.left)
		var clickedX = event.pageX - offset.left;
		var clickedY = event.pageY - offset.top - 2;
		console.log("X");
		console.log(event)
		//alert("x: " + clickedX+ " y: "+ clickedY)
		// decide which base should fire
		var shootingBase = game.pickShooter(clickedX,clickedY,CANVAS_WIDTH,CANVAS_HEIGHT);
		console.log(shootingBase);
		shootingBase.fire(clickedX,clickedY);
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
		
		// loop through each base
		for (var i = 0; i < game.bases.length; i++){
			//game.bases[i].setXPosition(i);
			
			game.bases[i].draw($context);

			//loop through missiles
			for (var j = 0; j < game.bases[i].missiles.length; j++){
				game.bases[i].missiles[j].draw($context)
			};
		};
		//loop through and draw each enemy
		for (var i = 0; i < game.enemies.length; i++){
			
			game.enemies[i].draw($context);
			//game.enemies[i].checkCollision($context);
		}
	}
	function update(){
		xPos += 1;
		yPos += 1;
		//update enemy position
		for(var i = 0; i < game.enemies.length; i++){
			game.enemies[i].updatePosition();
			checkCollision(game.enemies, i, game.enemies[i], game.activeMissiles);
			
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
	this.isAlive = false;
	this.xPos = 50;
	this.yPos = 600 - 69;
	this.width = 50;
	this.height = 50;
	this.color = "#00e50a"
	this.baseImg = new Image();
	this.baseImg.src = 'assets/base.png';
	this.baseState = 0;
	this.baseImgX = 295;
	this.baseImgY = 154;
	this.baseImgWidth = 44;
	this.baseImgHeight = 69;

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
	fire: function(x,y){
	  var incactiveMissiles = this.missiles.filter(function(missile){
	  	return missile.isActive === false;
	  })

	  if (this.missileCount() >= 1){
	  	var missile = incactiveMissiles[incactiveMissiles.length - 1]
	  	missile.isActive = true;
	  	missile.targetX = x;
	  	missile.targetY = y;
	  	var baseLocation = this.xPos + this.width/2;
	  	missile.setRadian(missile.targetX,missile.targetY, baseLocation);
	  	//alert("x: " + missile.targetX+ " y: "+ missile.targetY)
	  	game.activeMissiles.push(missile)
	  	console.log(this.missileCount());
	  	console.log(game.activeMissiles)

	  } else{
	  	console.log("out");
	  };
	},
	setXPosition: function(i, length){
		//console.log(this)
		//object variable inserted to fix using apply to borrow method
		var object = this[i]
		var start = 25;
		var finish = 800 - (start * 3)
		var interval = 800 / length
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
		//$context.fillRect(this.xPos , this.yPos, this.width, this.height)
		$context.drawImage(this.baseImg,
											 this.baseImgX,this.baseImgY, this.baseImgWidth, this.baseImgHeight,
											 this.xPos, this.yPos, this.baseImgWidth, this.baseImgHeight)



	}
}
//***********Missile*******************
var Missile = function(){
	//this.img = console.log("cool misslile image");
	this.xPos = 80;
	this.yPos = 575;
	this.targetX = 0;
	this.targetY = 0;
	this.radian = 0;
	this.width = 10;
	this.height = 40;
	this.color = "#42f4c5"
	this.startPosition = 0; // fill with start position
	this.currentPosition = [];
	this.isCollision = false;
	this.isActive = false;
	this.blownUp = false;
	this.hide = false;

	this.missileImg = new Image();
	this.missileImg.src = "assets/Rocket.png";
	
	this.missileImgWidth = 79;
	this.missileImgHeight = 300;
	this.missileImgX = 110;
	this.missileImgY = 0;

	this.explosionImg = new Image();
	this.explosionImg.src = 'assets/explosion.png';
	this.explosionState = 0;
	this.explosionX = 0;
	this.explosionY = 0;
	this.explosionWidth = 0;
	this.explosionHeight = 0;

}

Missile.prototype = {
	constructor: Missile,
	draw: function($context){
		if (this.hide === true) {
			
			  return};

		if (this.isCollision === true){

		  this.setExplosionState()

		  $context.drawImage(this.explosionImg,
		  					 this.explosionX,this.explosionY,this.explosionWidth,this.explosionHeight,
		  					 this.xPos - 25,this.yPos - 50, this.explosionWidth,this.explosionHeight);
		  //this.explosionX,this.explosionY,this.explosionWidth,this.explosionHeight,
		  this.explosionState +=1

		  if (this.explosionState > 13){
		  	this.hide = true;
		  }

		}else {

			$context.drawImage(this.missileImg,
												 this.missileImgX, this.missileImgY, this.missileImgWidth, this.missileImgHeight,
												 this.xPos, this.yPos, this.width, this.height);
			
	/**	  
		  $context.fillStyle = this.color;
		  $context.fillRect(this.xPos, this.yPos, this.width, this.height);
**/
		}
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
		if (this.isCollision === true){return};

		if (this.isActive && this.startPosition === this.xPos){
			var baseWidth = base.width / 2;
			this.xPos = baseWidth + base.xPos - 10;
			this.yPos = base.yPos - this.height;

			
			
		};

		if (this.isActive){
			//figure out angles
			//alert("radians are: "+ this.radian);
			
			this.yPos = this.yPos - 5;
		}
	},

	setRadian: function(x,y,baseLocation){
		var adjacentSide = x - baseLocation;
		var oppositeSide = 600 - y;
 		var ratio = oppositeSide/adjacentSide;

 		var radians = Math.atan(ratio) * 180/Math.PI;
 		//alert("ratio" + ratio)
 		//alert("radians: " + radians)
 		this.radian = radians;
 		//alert("radians are: "+ this.radian);
	},


	setExplosionState : function(){

		switch (this.explosionState){
			case 0:
			  this.explosionX = 164 ;
				this.explosionY = 424 ;
				this.explosionWidth = 45 ;
				this.explosionHeight = 49;
			break;
			case 1:
			  this.explosionX = 37 ;
				this.explosionY = 424 ;
				this.explosionWidth = 45 ;
				this.explosionHeight = 49;
			break;
			case 2:
			  this.explosionX = 421 ;
				this.explosionY = 296 ;
				this.explosionWidth = 45 ;
				this.explosionHeight = 49;
			break;
			case 3:
			  this.explosionX = 292 ;
				this.explosionY = 294 ;
				this.explosionWidth = 48 ;
				this.explosionHeight = 52;
			break;
			case 4:
			  this.explosionX = 165 ;
				this.explosionY = 294 ;
				this.explosionWidth = 47 ;
				this.explosionHeight = 53;
			break;
			case 5:
			  this.explosionX = 24 ;
				this.explosionY = 273 ;
				this.explosionWidth = 79 ;
				this.explosionHeight = 88;
			break;
			case 6:
			  this.explosionX = 398 ;
				this.explosionY = 142 ;
				this.explosionWidth = 93 ;
				this.explosionHeight = 92;
			break;
			case 7:
			  this.explosionX = 269 ;
				this.explosionY = 141 ;
				this.explosionWidth = 95 ;
				this.explosionHeight = 97;
			break;
			case 8:
			  this.explosionX = 141 ;
				this.explosionY = 134 ;
				this.explosionWidth = 102 ;
				this.explosionHeight = 114;
			break;
			case 9:
			  this.explosionX = 11 ;
				this.explosionY = 133 ;
				this.explosionWidth = 106 ;
				this.explosionHeight = 115;
			break;
			case 10:
			  this.explosionX = 391 ;
				this.explosionY = 4 ;
				this.explosionWidth = 113 ;
				this.explosionHeight = 119;
			break;
			case 11:
			  this.explosionX = 263 ;
				this.explosionY = 1 ;
				this.explosionWidth = 108 ;
				this.explosionHeight = 121;
			break;
			case 12:
			  this.explosionX = 140 ;
				this.explosionY = 9 ;
				this.explosionWidth = 96 ;
				this.explosionHeight = 109;
			break;
			case 13:
			  this.explosionX = 30 ;
				this.explosionY = 19 ;
				this.explosionWidth = 66 ;
				this.explosionHeight = 76;
			break;
			case 14:
			  this.explosionX = 0 ;
				this.explosionY = 0 ;
				this.explosionWidth = 0 ;
				this.explosionHeight = 0;
			break;
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
	this.max = 800/3;
	this.min = 0;
	this.isAlive = true

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
		if (this.isAlive === false) {
			return;
		}

		$context.fillStyle = this.color;
		$context.fillRect(this.xPos,this.yPos, this.width, this.height)

		//this.checkCollision()
	},
	updatePosition: function(){
		if (this.direction === "right"){
			this.xPos += 2
		}else if (this.direction ==="left"){
			this.xPos += -2 
		};
		if (this.xPos >= this.max){
			this.direction = "left"
		};
		if (this.xPos <= this.min){
			this.direction = "right"
		};

	},
	checkCollision: function(){
		game.activeMissiles.forEach(function (missile){
			//this problems 
			var x = this.xPos;
			var y = this.yPos;
			var xMax = x + this.width;
			var yMax = y + this.height;

			if (missile.xPos >= x && missile.xPos <= xMax && missile.yPos >= y && missile.yPos <= yMax){
				console.log("boom!!!")
			};

		})
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
	activeMissiles: [],
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
	pickShooter: function(x,y,CANVAS_WIDTH,CANVAS_HEIGHT){
		var airCoverageDistance = CANVAS_WIDTH/ game.bases.length;
		console.log("Pick Shooter method")
		console.log(x)
		console.log(airCoverageDistance);

		var i = Math.floor(x/airCoverageDistance)

		if (i > game.bases.length - 1){
			i -= 1
		}

		return game.bases[i]


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
	collisionDetection: function(enemy, activeMissile){

		game.enemies.forEach(function(enemy){
			console.log(enemy)
		});

	}
}

var checkCollision = function(parentArray, index, object, missiles){
  
  for (var i = 0; i < missiles.length; i++){
  	var missile = missiles[i];

  	var missileX = missile.xPos + missile.width/2;
  	var missileY = missile.yPos + missile.height/2;
  	var objX = object.xPos 
  	var objY = object.yPos
  	var maxX = object.xPos + object.width
  	var maxY = object.yPos + object.height


  	if (object.isAlive === false){
  		return
  	}
  	if ( missileX >= objX && missileX <= maxX && missileY >= objY && missileY <= maxY){
  	  object.isAlive = false;
  	  missile.isCollision = true;


  	  
  	  explosion(object);
  	}
  }
  
}

var explosion = function(object){
//	console.log("boomb!"+ " " + object.constructor.name)
}


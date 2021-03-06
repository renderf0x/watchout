// start slingin' some d3 here.
/******************************************************/
/******************************************************/
// GAME SETUP

var UPKEY = false;
var LEFTKEY = false;
var RIGHTKEY = false;
var SPACEKEY = false;

d3.select('body').on('keydown', function() {
  if (d3.event.keyCode == 38) {
    UPKEY = true;
  }
  if (d3.event.keyCode == 37) {
    LEFTKEY = true;
  }
  if (d3.event.keyCode == 39) {
    RIGHTKEY = true;
  }
  if (d3.event.keyCode == 32) {
    SPACEKEY = true;
  }
})

d3.select('body').on('keyup', function() {
  if (d3.event.keyCode == 38) {
    UPKEY = false;
  }
  if (d3.event.keyCode == 37) {
    LEFTKEY = false;
  }
  if (d3.event.keyCode == 39) {
    RIGHTKEY = false;
  }
  if (d3.event.keyCode == 32) {
    SPACEKEY = false;
  }
})

var gameOptions = {
  height: 600,
  width: 900,
  nEnemies: 10,
  intervalTime: 2000
};

var gameStats = {
  score: 0,
  highScore: 0
};

var scale = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
  y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
};

var gameBoardContainer = d3.select('.gameboardContainer');
gameBoardContainer.style({'width': gameOptions.width + 'px', 'height': gameOptions.height + 'px'});

var svgContainer = gameBoardContainer
  .append('svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height);

svgContainer.classed('gameboard', true);

/******************************************************/
/******************************************************/
// ENEMIES STUFF

var createEnemies = function(){
  return _.range(0, gameOptions.nEnemies).map(function(index){
    return {
      enemy_id: index,
      minSize: 10,
      size: Math.max(10, Math.random() * 30),
      velocity: 0,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: 2 * Math.random() * -Math.PI
    }
  });
};

var renderEnemies = function() {
  svgContainer.selectAll('circle').data(enemies, function(d){return d.enemy_id})
    .enter()
    .append('circle')
    .attr('r', function(enemy){
      return enemy.size;
    })
    .attr('enemy_id', function(enemy) {
      return enemy.enemy_id;
    })
    .attr('cx', function(enemy) {
      return scale.x(enemy.x);
    }).attr('cy', function(enemy) {
      return scale.y(enemy.y);
    })
    .classed('enemy', true);
};


var moveEnemies = function() {

  enemies.forEach(function(enemy){
    // stored as a value from 1 to 100
    enemy.x = Math.random() * 100;
    enemy.y = Math.random() * 100;
  });

  svgContainer.selectAll('.enemy')
    .transition()
    .ease('linear')
    .duration(gameOptions.intervalTime)
    // these set the end points of the transition
    .attr('cx', function(d) {
      return scale.x(d.x);
    })
    .attr('cy', function(d) {
      return scale.y(d.y);
    })
    // .tween('custom', tweenWithCollisionDetection);
};

var rapAsteroids = function(enemy) {

  // var hitEdge = false;
  enemies.forEach(function(enemy){
    // stored as a value from 1 to 100
    enemy.velocity = 20 / enemy.size;
  });

  svgContainer.selectAll('.enemy').each(function(data){

    var enemy = d3.select(this);

    var moveForward = function(){
      data.x += (Math.cos(data.rotation) * data.velocity)/ 4;
      data.y += (Math.sin(data.rotation) * data.velocity)/ 4;
      //console.log('moving x:' + data.x + ' y:' + data.y);
    };

    if (data.y > 100) {
      data.y = 0;
    }
    if (data.y < 0) {
      data.y = 100;
    }
    if (data.x > 100) {
      data.x = 0;
    }
    if (data.x < 0) {
      data.x = 100;
    }

    // this.velocity += 0.1;
    // this.velocity = Math.min(this.velocity, this.maxVelocity);
    moveForward.call(this);
    enemy
     .attr('cx', function(enemy) {
      return scale.x(enemy.x);
    }).attr('cy', function(enemy) {
      return scale.y(enemy.y);
    })
    //console.log("i was called!");

  });

  //}

  // if (hitEdge) {
  //   enemy.transition()
  //     .ease('linear')
  //     .duration(gameOptions.intervalTime)
  //     .attr('cx', scale.x(enemy.x))
  //     .attr('cy', scale.y(enemy.y))
      //.tween('custom', tweenWithCollisionDetection);
  //}
}

/******************************************************/
/******************************************************/

var onCollision = function () {
  // console.log("Collision!!!!@@RUKFGOUYG");
  console.log('collided')
  checkHighScore();
  resetScore();
};

var checkCollision = function (enemy, callback) {
  //check here, then call onCollision
  var enemyXPos = parseFloat(enemy.attr('cx'));
  var enemyYPos = parseFloat(enemy.attr('cy'));
  // var playerXPos = parseFloat(player.playerNode.attr('cx'));
  // var playerYPos = parseFloat(player.playerNode.attr('cy'));
  var playerXPos = scale.x(player.x)
  var playerYPos = scale.y(player.y)
  // var radiusSum = parseFloat(enemy.attr('r')) + parseFloat(player.playerNode.attr('r'));
  var radiusSum = parseFloat(enemy.attr('r')) + parseFloat(player.size);

  // console.log(playerXPos, radiusSum)
  var xDiff = enemyXPos - playerXPos;
  var yDiff = enemyYPos - playerYPos;

  if (radiusSum > Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2))){
    // TODO: limit callback calls using a _.once-like var that resets using setTimeout
    // (or something like that)
    console.log('timer collider triggered this');
    callback();
  }
};

var checkAllCollisions = function () {
  svgContainer.selectAll('.enemy').each(function(){
    //check here, then call onCollision
    enemy = d3.select(this);
    //console.log(enemy.attr('cx'));
    //debugger;
    var enemyXPos = parseFloat(enemy.attr('cx'));
    var enemyYPos = parseFloat(enemy.attr('cy'));
    // var playerXPos = parseFloat(player.playerNode.attr('cx'));
    // var playerYPos = parseFloat(player.playerNode.attr('cy'));
    var playerXPos = scale.x(player.x)
    var playerYPos = scale.y(player.y)
    var radiusSum = parseFloat(enemy.attr('r')) + player.size;
    // var radiusSum = enemy.size + player.size;

    // console.log(playerXPos, radiusSum)
    var xDiff = enemyXPos - playerXPos;
    var yDiff = enemyYPos - playerYPos;

    //console.log('Jo mama: ' + radiusSum);

    if (radiusSum > Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2))){

      // console.log('timer collider triggered this');
      onCollision();
    }
  });
};

var tweenWithCollisionDetection = function (endData) {
  var enemy = d3.select(this);
  //when we change collision behavior we can replace onCollision with
  //something else
  return function(t){
    // TODO: THIS TRIGGERS MULTIPLE TIMES PER COLLISION
    checkCollision(enemy, onCollision);
  };
};

var incrementScore = function() {
  gameStats.score++;
  d3.select('.current').select('span').text(gameStats.score);
};

var checkHighScore = function() {
  if (gameStats.score > gameStats.highScore) {
    gameStats.highScore = gameStats.score;
    setHighScore();
  }
};

var setHighScore = function() {
  d3.select('.high').select('span').text(gameStats.highScore);
};

var resetScore = function() {
  d3.select('.current').select('span').text(0);
  gameStats.score = 0;
};

/******************************************************/
/******************************************************/

var Player = function () {

  // x and y are scaled from 1-100
  this.x = 50;
  this.y = 50;
  this.size = 20;
  this.velocity = 0;
  this.maxVelocity = 10;
  this.rotation = -Math.PI/2;

  this.createNode();
  // this.render();
  // this.setupDragging();
};

Player.prototype.createNode = function(){

  // this.path = "M" +
  //       (this.x+this.size*Math.cos(this.rotation))  + "," +
  //       (this.y+this.size*Math.sin(this.rotation)) + "L" +
  //       (this.x+this.size/1.5*Math.cos(this.rotation+2*Math.PI/3)) + "," +
  //       (this.y+this.size/1.5*Math.sin(this.rotation+2*Math.PI/3)) + "L" +
  //       (this.x+this.size/1.5*Math.cos(this.rotation+4*Math.PI/3))  + "," +
  //       (this.y+this.size/1.5*Math.sin(this.rotation+4*Math.PI/3)) + "L" +
  //       (this.x+this.size*Math.cos(this.rotation)) + "," +
  //       (this.y+this.size*Math.sin(this.rotation));

  // console.log(this.path);
  this.playerNode = svgContainer.selectAll('.player')
    .data([0])
    .enter()
    // .append('circle')
    // .attr('r', 10)
    .append('path')
    .attr("d", this.path)
    .classed('player', true)
    // .call(drag);
};

Player.prototype.render = function() {
  this.path = "M" +
        (scale.x(this.x)+this.size*Math.cos(this.rotation))  + "," +
        (scale.y(this.y)+this.size*Math.sin(this.rotation)) + "L" +
        (scale.x(this.x)+this.size/1.5*Math.cos(this.rotation+2*Math.PI/3)) + "," +
        (scale.y(this.y)+this.size/1.5*Math.sin(this.rotation+2*Math.PI/3)) + "L" +
        (scale.x(this.x)+this.size/1.5*Math.cos(this.rotation+4*Math.PI/3))  + "," +
        (scale.y(this.y)+this.size/1.5*Math.sin(this.rotation+4*Math.PI/3)) + "L" +
        (scale.x(this.x)+this.size*Math.cos(this.rotation)) + "," +
        (scale.y(this.y)+this.size*Math.sin(this.rotation));
  this.playerNode.attr('d', this.path);
};

Player.prototype.updateShip = function() {

  var moveForward = function() {
    this.x += (Math.cos(this.rotation) * this.velocity)/ 4;
    this.y += (Math.sin(this.rotation) * this.velocity)/ 4;
  }

  // WRAP AROUND CODE
  if (this.y > 100) {
    this.y = 0;
  }
  if (this.y < 0) {
    this.y = 100;
  }
  if (this.x > 100) {
    this.x = 0;
  }
  if (this.x < 0) {
    this.x = 100;
  }
  // END WRAP AROUND CODE

  // VELOCITY LOGIC
  if (UPKEY == true) {
    this.velocity += 0.1;
    this.velocity = Math.min(this.velocity, this.maxVelocity);
    moveForward.call(this);
  } else {
    this.velocity -= 0.05;
    this.velocity = Math.max(0, this.velocity);
    moveForward.call(this);
  }

  if (LEFTKEY == true) {
    this.rotation -= 0.1;
  }
  if (RIGHTKEY == true) {
    this.rotation += 0.1;
  }
  // debugger;
  this.render();
}

/******************************************************/
/***D3 Setup*******************************************/

// var drag = d3.behavior.drag()
//   .on('drag', function(){
//     player.playerNode
//       .attr('cx', function(){
//         return d3.event.x;
//       })
//       .attr('cy', function(){
//         return d3.event.y;
//       });
//   });

/******************************************************/
/******************************************************/

var enemies = createEnemies();
renderEnemies();

//moveEnemies();
var player = new Player();

//setInterval(moveEnemies, gameOptions.intervalTime);
setInterval(player.updateShip.bind(player), gameOptions.intervalTime / 100);
setInterval(incrementScore, gameOptions.intervalTime / 10);

d3.timer(checkAllCollisions);
d3.timer(rapAsteroids);





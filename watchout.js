// start slingin' some d3 here.

var gameOptions = {
  height: 600,
  width: 900,
  nEnemies: 30,
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

var createEnemies = function(){
  return _.range(0, gameOptions.nEnemies).map(function(index){
    return {
      enemy_id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }
  });
};

var renderEnemies = function() {
  svgContainer.selectAll('circle').data(enemies)
    .enter()
    .append('circle')
    .attr('r', 10)
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
  svgContainer.selectAll('.enemy')
    .transition()
    .duration(gameOptions.intervalTime)
    .attr('cx', function() {
      return scale.x(Math.random() * 100)
    })
    .attr('cy', function() {
      return scale.y(Math.random() * 100)
    })
    .tween('custom', tweenWithCollisionDetection);
};

var onCollision = function () {
  // console.log("Collision!!!!@@RUKFGOUYG");
  checkHighScore();
  resetScore();
};

var checkCollision = function (enemy, callback) {
  //check here, then call onCollision
  var enemyXPos = parseFloat(enemy.attr('cx'));
  var enemyYPos = parseFloat(enemy.attr('cy'));
  var playerXPos = parseFloat(player.playerNode.attr('cx'));
  var playerYPos = parseFloat(player.playerNode.attr('cy'));
  var radiusSum = parseFloat(enemy.attr('r')) + parseFloat(player.playerNode.attr('r'));

  var xDiff = enemyXPos - playerXPos;
  var yDiff = enemyYPos - playerYPos;

  if (radiusSum > Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2))){
    // TODO: limit callback calls using a _.once-like var that resets using setTimeout
    // (or something like that)
    callback();
  }

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
  this.createAndRenderPlayer();
  // this.setupDragging();
}

Player.prototype.createAndRenderPlayer = function(){
  this.playerNode = svgContainer.selectAll('.player')
    .data([0])
    .enter()
    .append('circle')
    .attr('r', 10)
    .attr('cx', scale.x(50))
    .attr('cy', scale.y(50))
    .classed('player', true)
    .call(drag);
};

/******************************************************/
/***D3 Setup*******************************************/

var drag = d3.behavior.drag()
  .on('drag', function(){
    player.playerNode
      .attr('cx', function(){
        return d3.event.x;
      })
      .attr('cy', function(){
        return d3.event.y;
      });
  });

/******************************************************/
/******************************************************/

var enemies = createEnemies();
renderEnemies();

moveEnemies();
setInterval(moveEnemies, gameOptions.intervalTime);
setInterval(incrementScore, gameOptions.intervalTime / 10);

var player = new Player();






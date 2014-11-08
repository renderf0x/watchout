// start slingin' some d3 here.

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  intervalTime: 5000
}

var scale = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
  y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
}

var svgContainer = d3.select('.gameboardContainer').append('svg')
  .attr('width', gameOptions.width).attr('height', gameOptions.height);

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
}

var moveEnemies = function() {
  svgContainer.selectAll('.enemy').transition()
    .duration(gameOptions.intervalTime)
    .attr('cx', function() {
      return scale.x(Math.random() * 100)
    })
    .attr('cy', function() {
      return scale.y(Math.random() * 100)
    });
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
    //return player
};

/******************************************************/
/***D3 Setup*******************************************/

var drag = d3.behavior.drag().on('drag', function(){
  player.playerNode.attr('cx', function(){
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

var player = new Player();






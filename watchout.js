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



d3.select('svg').append('circle').attr('r', 10).attr('cx', 50).attr('cy', 50);

var createEnemies = function(){
  return _.range(0, gameOptions.nEnemies).map(function(index){
    return {
      enemy_id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }
  });
};

var enemies = createEnemies();

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
  });

var moveEnemies = function() {
  svgContainer.selectAll('circle').transition()
    .duration(gameOptions.intervalTime)
    .attr('cx', scale.x(Math.random() * 100))
    .attr('cx', function() {
      return scale.x(Math.random() * 100)
    })
    .attr('cy', function() {
      return scale.y(Math.random() * 100)
    });
};

moveEnemies();
setInterval(moveEnemies, gameOptions.intervalTime);





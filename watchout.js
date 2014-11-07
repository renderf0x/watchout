// start slingin' some d3 here.

var gameOptions = {
  height: 450,
  width: 700
}

var svgContainer = d3.select('.gameboard').append('svg')
  .attr('width', gameOptions.width).attr('height', gameOptions.height);

(function () {
  'use strict';

  var gameOptions = {
    height: 750,
    width: 450,
    nEnemies: 30,
    padding: 20,
    interval: 2000
  };

  var gameStats = {
    score: 0,
    bestScore: 0
  };

  var axes = {
    x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
    y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
  };

  var gameBoard = d3.select('.container').append('svg:svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height)

  var GameElement = function(x, y){
    this.x = x;
    this.y = y;
  };

  var Enemy = function(x, y, id){
    this.id = id;
    GameElement.apply(this, arguments);
  };

  Enemy.prototype = Object.create(GameElement.prototype);
  Enemy.prototype.constructor = Enemy;

  var createEnemies = function() {
    return _.range(0, gameOptions.nEnemies).map(function(i) {
      var randomX = Math.random() * 100;
      var randomY = Math.random() * 100;
      return new Enemy(randomX, randomY, i);
    });
  };

  var render = function(enemy_data){
    var enemies = gameBoard.selectAll('circle.enemy')
    .data( enemy_data, function(d){ return d.id } );
    console.log(enemies);

    enemies.enter()
    .append('svg:circle')
    .attr('class', 'enemy')
    .attr('cx', function(enemy){ return axes.x(enemy.x);} )
    .attr('cy', function(enemy){ return axes.y(enemy.y);} )
    .attr('r', 10);

    enemies.exit()
    .remove();

    var tweenMagic = function(data) {
      var enemy = d3.select(this);

      var startPosition = {
        x: parseFloat(enemy.attr('cx')),
        y: parseFloat(enemy.attr('cy'))
      };

      var endPosition = {
        x: axes.x(data.x),
        y: axes.y(data.y)
      };

      return function(t) {
        // Increments frame position based on difference of x or y over time
        var enemyNextPos = {
          x: startPosition.x + (endPosition.x - startPosition.x)*t,
          y: startPosition.y + (endPosition.y - startPosition.y)*t
        }

        // Resets the positions of the enemy to the incremented position
        enemy.attr('cx', enemyNextPos.x)
        .attr('cy', enemyNextPos.y)
      }
    }

    enemies.transition()
    .duration(2000)
    .tween('custom',tweenMagic)
  };

  var t= .5;
  var last = 0;
  var gameTurn = function () {
    render(createEnemies());
    d3.timer(makeCallback(), gameOptions.interval);
    return true;
  };

  var makeCallback = function() {
    // note that we're returning a new callback function each time
    return gameTurn;
  };

  d3.timer(makeCallback(), gameOptions.interval);

})();

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

  // This converts px size to consistent axes
  var axes = {
    x: d3.scale.linear().domain([0,100]).range([0,gameOptions.width]),
    y: d3.scale.linear().domain([0,100]).range([0,gameOptions.height])
  };

  // Appends the SVG board to the container element where gameplay happens
  var gameBoard = d3.select('.container').append('svg:svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height)

  var GameElement = function(x, y){
    this.x = x;
    this.y = y;
  };

  //Player Construction
  var Player = function(x, y) {
    GameElement.apply(this, arguments);
    this.fill = '#ff6600';
    this.r = 8;
  }

  Player.prototype = Object.create(GameElement.prototype);
  Player.prototype.constructor = Player;

  Player.prototype.render = function () {
    return gameBoard.append('svg:circle')
      .attr('r', this.r)
      .attr('fill', this.fill)
      .attr('cx', function(){
        return axes.x(this.x);
      })
      .attr('cy', function(){
        return axes.y(this.y);
      });
  }

  //trying to append player to gameBoard
  var player = new Player(50, 50);
  var makePlayer = gameBoard.selectAll('circle.player')
    .data( player, function(d){ return d} );
    debugger;
  makePlayer.enter()
    .append('svg:circle')
    .attr('r', player.r)
    .attr('fill', player.fill)
    .attr('cx', function(){
      return axes.x(player.x);
    })
    .attr('cy', function(){
      return axes.y(player.y);
    });
  //end attempt

  //player.render();

  //Enemy Construction
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

  //
  var render = function(enemy_data){
    // Associates enemy data set with their svg elements
    var enemies = gameBoard.selectAll('circle.enemy')
    .data( enemy_data, function(d){ return d.id } );

    // Subselects enemies with no corresponding SVG elements
    // Associates class, location and size
    enemies.enter()
    .append('svg:circle')
    .attr('class', 'enemy')
    .attr('cx', function(enemy){ return axes.x(enemy.x);} )
    .attr('cy', function(enemy){ return axes.y(enemy.y);} )
    .attr('r', 10);

    // Subselect SVG elements without data and remove
    enemies.exit()
    .remove();

    // Handles frame by frame animation
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

    // Smoothly animates enemies to new positions using tweenMagic
    enemies.transition()
    .duration(gameOptions.interval)
    .tween('custom',tweenMagic);
  };

  // Begin Execution
  var gameTurn = function () {
    render(createEnemies());
    // Recalls gameTurn at intervals to change enemy position
    d3.timer(makeCallback(), gameOptions.interval);
    return true;
  };

  var makeCallback = function() {
    // note that we're returning a new callback function each time
    return gameTurn;
  };

  //Initiate!
  gameTurn();
})();

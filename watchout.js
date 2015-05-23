(function () {
'use strict';

  var gameOptions = {
    height: 750,
    width: 450,
    nEnemies: 30,
    padding: 20
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

//beginning of weirdness
    var enemy = d3.selectAll('.enemy')

    var enemyNextPos = {
      x: 50,
      y: 50
    }

    enemies.transition()
      .duration(2000)
      .tween('custom', enemy.attr('cx', enemyNextPos.x)
            .attr('cy', enemyNextPos.y))
  };

//end of weirdness
  var play = function () {
    console.log("turn started!")

  };


  var t= .5;
  var last = 0;
  var gameTurn = function () {
    render(createEnemies());
    d3.timer(makeCallback(), 2000);
    return true;
  };
  //gameTurn();
  // d3.timer(function(elapsed) {
  //   t = (t + (elapsed - last) / 1000) % 1;
  //   last = elapsed;
  //   gameTurn();
  // });

var interval = 2000;

var makeCallback = function() {

    // note that we're returning a new callback function each time
    // return function() {
    //     console.log('OH HAI!!');
    //     d3.timer(makeCallback(),interval);
    //     return true;
    // }
    return gameTurn;
};

d3.timer(makeCallback(),interval);

})();

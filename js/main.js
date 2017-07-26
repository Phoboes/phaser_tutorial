// Phaser tutorial, guided from here: https://gist.github.com/Phoboes/0a251d119fe0a40e5e4fac788921332e

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

// Compiles assets, used to set graphic resources etc.
var preload = function() {
  game.load.image( 'sky', '../assets/images/sky.png' );
  game.load.image( 'diamond', '../assets/images/diamond.png' );
  game.load.image( 'firstaid', '../assets/images/firstaid.png' );
  game.load.image( 'platform', '../assets/images/platform.png' );
  game.load.spritesheet( 'baddie', '../assets/sprites/baddie.png', 32, 32 );
  game.load.spritesheet( 'playerModel', '../assets/sprites/dude.png', 32, 48 );
}

// Variables that need to be in the global namespace, but haven't yet been defined.
var platforms, diamonds, scoreText, cursors;
var score = 0;

// Sets the initial game state -- placing people etc.
var create = function() {

  // We're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.sprite( 0, 0, 'sky' );

// ######################################
//                PLATFORMS

  // // Grouping similar assets together
  platforms = game.add.group();

  //  We will enable physics for any object that is created in this group
  platforms.enableBody = true;

  var ledge = platforms.create( 400, 400, 'platform' );
  //  This stops it from falling away when you jump on it or another object hits it.
  ledge.body.immovable = true;
  ledge = platforms.create( -150, 250, 'platform' );
  ledge.body.immovable = true;

  // Set the ground of the level. In this case, it's just a scaled up platform.
  var ground = platforms.create( 0, game.world.height - 64, 'platform' );
  ground.scale.setTo( 2, 2 );
  ground.body.immovable = true;

// ######################################
//                DIAMONDS

  // Add the diamonds to a unique group
  diamonds = game.add.group();
  // Enablebody tells phaser to care about the boundaries of the image. Important for things like collisions.
  diamonds.enableBody = true;

  //  Here we'll create 12 of them evenly spaced apart
  for ( var i = 1; i < 13; i++ ) {
    //  Create a diamond inside of the 'diamonds' group
    var diamond = diamonds.create( i * 60, 0, 'diamond' );

    //  Give the diamonds a vertical gravitational pull so they fall
    diamond.body.gravity.y = 1000;

    //  This just gives each diamond a slightly random bounce value
    diamond.body.bounce.y = 0.3 + Math.random() * 0.2;
  }

// ######################################
//                 PLAYER

  // The player and its settings
  player = game.add.sprite( 32, game.world.height - 150, 'playerModel' );

  //  We need to enable physics on the player
  game.physics.arcade.enable(player);

  //  Player physics properties. Give the little guy a slight bounce.
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;

  // Prevents the player from walking off the map.
  player.body.collideWorldBounds = true;

  //  Our two animations, walking left and right.
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

// ######################################

  // Renders text on the screen initially as "Score: 0"
  scoreText = game.add.text( 16, 16, 'score: 0', { fontSize: '32px', fill: '#000' } );

}; // END CREATE


// This needs to be defined *before* update calls it. It can be placed within the update function, however I don't like this function being redefined every time update runs.

var getDiamond = function( player, diamond ) {
  // Removes the star from the screen
  diamond.kill();
  //  Add and update the score
  score += 10;
  scoreText.text = 'Score: ' + score;
};


// Loops repeatedly -- in charge of animations etc.
var update = function() {


  var hitPlatform = game.physics.arcade.collide( player, platforms );
  game.physics.arcade.collide( diamonds, platforms );
  game.physics.arcade.overlap( player, diamonds, getDiamond, null, this );

  // Rather than needing event listeners, 
  cursors = game.input.keyboard.createCursorKeys();
  //  Reset the players velocity (movement)
  player.body.velocity.x = 0;

  if ( cursors.left.isDown ){
      //  Move to the left
      player.body.velocity.x = -150;
      player.animations.play( 'left' );
  } else if ( cursors.right.isDown ) {
      //  Move to the right
      player.body.velocity.x = 150;
      player.animations.play( 'right' );
  } else {
      //  Stand still
      player.animations.stop();
      player.frame = 4;
  }

  //  Allow the player to jump if they are touching the ground.
  if ( cursors.up.isDown && player.body.touching.down && hitPlatform ){
      player.body.velocity.y = -350;
  }
}; // END UPDATE

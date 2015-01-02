/** Global */
var GRID = {
    row: [0, 83, 166, 249, 332, 415],
    col: [0, 101, 202, 303, 404, 505]
}

var gemDisplayCounter = 1;

var gamePause = false,
    gameOver = false;

var PLAYER_START = {
    row: 5,
    col: 3
}

var SPRITE_WIDTH = 101,
    SPRITE_HEIGHT = 83,
    HEALTH_LEVEL = 6,
    ENEMY_COUNT = 5;

var playerSprites = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
];

var gemSprites = [
    'images/Gem Orange.png',
    'images/Gem Green.png',
    'images/Gem Blue.png'
];

var allEnemies = [],
    healthLevel = [];

/** Score Class */
var Score = function(x,y) {
    this.x = x;
    this.y = y;
    this.points = 0;
}

/**
 * Displays score
 */
Score.prototype.render = function() {
    var x = 390;
    ctx.clearRect(x, 0, 200, 50);
    ctx.font = "20px Verdana";
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + this.points, x, 40);
}

Score.prototype.reset = function() {
    this.points = 0;
}

/** Gem class */
var Gem = function(row,col) {
    this.sprite = gemSprites[Math.floor(Math.random() * 3)];
    this.scoreImpact = 1;
    this.row = row - 1;
    this.col = col - 1;
    this.x = GRID.col[this.col];
    this.y = GRID.row[this.row] - 26;
}

/**
 * updates Gem position
 */
Gem.prototype.update = function(dt) {
    gemDisplayCounter += gemDisplayCounter * dt;
    if (this.row === player.row && this.col === player.col) {
        score.points += this.scoreImpact;
        gemDisplayCounter = 90;
    }
    if (gemDisplayCounter > 80) {
        gemDisplayCounter = 1;
        this.sprite = gemSprites[Math.floor(Math.random() * 3)];
        this.row = (Math.floor(Math.random() * 3) + 1);
        this.col = (Math.floor(Math.random() * 4));
        this.x = GRID.col[this.col];
        this.y = GRID.row[this.row] - 26;
    }
}

/**
 * Displays Gem on screen
 */
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/** Enemy Class */
var Enemy = function(row,x,speed) {
    this.sprite = 'images/enemy-bug.png';
    this.row = row - 1;
    this.x = x;
    this.y = GRID.row[this.row] - 20;
    this.speed = speed;
}

/**
 * updates enemy position
 */
Enemy.prototype.update = function(dt) {
  if (this.x <= ctx.canvas.width) {
      this.x += dt * this.speed;
   } else {
       this.reset();
   }
   // check for player collision
   if (this.row  === player.row) {
        var cells = this.getLocation();
        for (var cell in cells) {
            if (player.col === cells[cell].col) {
                player.reset();
                health.update(false);
                break;
            }
        }
   }
}

/**
 * Draws enemy on screen
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/**
 *  Gets Enemy location
 */
Enemy.prototype.getLocation = function() {
    var cells = [];
     var enemyRightEdge = this.x + SPRITE_WIDTH;
    // locate the cell where the enemy left edge is located
    // if enemy is off the screen then do not run through the loop
    if (this.x < GRID.col[GRID.col.length - 1] && enemyRightEdge > 0) {
        for (var column = 1; column < GRID.col.length; column++) {
            if (this.x < GRID.col[column]) {
                var cell = {};
                cell.row = this.row;
                cell.col = column - 1;
                cells.push(cell);
                break;
            }
        }
        // locate the cell where the enemy right edge is located
        if (enemyRightEdge > GRID.col[0] && enemyRightEdge < GRID.col[GRID.col.length - 1]) {
            for (var column = 1; column < GRID.col.length; column++) {
                if (enemyRightEdge < GRID.col[column]) {
                    var cell = {};
                    cell.row = this.row;
                    cell.col = column - 1;
                    cells.push(cell);
                    break;
                }
            }
        }
    }

    return cells;
}

/**
 *  Reset the enemy locations
 */
Enemy.prototype.reset = function() {
    this.x = Math.floor((Math.random() * (- 500)) - SPRITE_WIDTH);
    this.row = (Math.floor((Math.random() * 3) + 2)) - 1;
    this.y = GRID.row[this.row] - 20;
}


/** Player Class */
var Player = function(row,col) {
    //Player characters
    this.sprite = playerSprites[Math.floor(Math.random() * 5)];
    this.row = row - 1;
    this.col = col - 1;
    this.x = GRID.col[this.col];
    this.y = GRID.row[this.row] - 13;
    this.score = 0;
    this.move = '';
}

/**
 * Resets the player's position coordinates
*/
Player.prototype.reset = function() {
    this.row = PLAYER_START.row - 1;
    this.col = PLAYER_START.col - 1;
    this.x = GRID.col[this.col];
    this.y = GRID.row[this.row] - 13;

}

/**
 * Updates the player location.
 */
Player.prototype.update = function() {
    var maxWidth = GRID.col[GRID.col.length - 1];
    var maxHeight = GRID.row[GRID.row.length - 1];
    switch(this.move) {
        case 'left':
            if (this.x >= SPRITE_WIDTH) {
                this.x -= SPRITE_WIDTH;
                this.col--;
            }
            break;
        case 'right':
            if (this.x + SPRITE_WIDTH < maxWidth) {
                this.x += SPRITE_WIDTH;
                this.col++;
            }
            break;
        case 'down':
            if (this.y + SPRITE_HEIGHT < maxHeight) {
                this.y += SPRITE_HEIGHT;
                this.row++;
            }
            break;
        case 'up':
            if (this.y >= SPRITE_HEIGHT - 13) {
                this.y -= SPRITE_HEIGHT;
                this.row--;
            }
            break;
        default:
            break;
    }
    this.move = '';

    // check if player fell in water
    if (player.row === 0) {
        health.update(false);
        player.reset();
    }
}

/**
 * Displays the player on the screen.
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/**
 * Handles pressed keyboard keys.
 */
Player.prototype.handleInput = function(key) {
    if(key === 'pauseToggle') {
        if (gamePause === true) {
            gamePause = false;
        } else {
            gamePause = true;
        }
    } else {
        this.move = key;
    }
}

/** Health class */
var Health = function(level) {
    this.sprite = 'images/Heart.png';
    this.level = level;
}

/**
 * Increase or decrease the player health level.
 */
Health.prototype.update = function(isUp){
    if (isUp) {
        thisLevel++;
    } else {
        if (this.level > 0) {
            this.level--;
         } else {
            gameOver = true;
        }
    }
}

/**
 * Displays the player health level.
 */
Health.prototype.render = function() {
    var x = 0;
    var y = 5;
    ctx.clearRect(x, y, 200, 40);
    for (var i = 0; i < this.level; i++) {
        ctx.drawImage(Resources.get(this.sprite), x, y, 32, 50);
        x += 30;
    }
}

// This instantiates the various objects

var player = new Player(PLAYER_START.row, PLAYER_START.col);
var health = new Health(HEALTH_LEVEL);
var gem = new Gem(3,2);
var score = new Score();
generateEnemies(ENEMY_COUNT);


/** Helper functions */
// This spawns a number of enemies in random locations on the screen
function generateEnemies(maxEnemies) {
    for (var i = 0; i < maxEnemies; i++) {
        var row = Math.floor((Math.random() * 3) + 2);
        var leftPoint = Math.floor((Math.random() * (- 500)) - SPRITE_WIDTH);
        var speed = Math.floor((Math.random() * 200) + 50);
        //generate new Enemy object with a starting row, point and a set speed)
        var enemy = new Enemy(row, leftPoint, speed);
        allEnemies.push(enemy);
    }
}

// This displays text on screen when the game is paused or over for example
function displayText(text) {
    ctx.font = "50px Verdana";
    ctx.fillStyle = 'white';
    ctx.fillText(text, 101, 300);
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'pauseToggle',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

// This disables scrolling.
document.addEventListener('keydown', function(e) {
  if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);


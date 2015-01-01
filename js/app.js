/** Global */
var GRID = {
    row: [0, 83, 166, 249, 332, 415],
    col: [0, 101, 202, 303, 404, 505]
}

var gamePause = false,
    gameRestart = false;

var PLAYER_START = {
    row: 5,
    col: 3
}

var SPRITE_WIDTH = 101,
    SPRITE_HEIGHT = 83;

var playerSprites = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
];

var allEnemies = [];

/** Enemy Class */
var Enemy = function(row,x,speed) {
    this.sprite = 'images/enemy-bug.png';
    this.row = row - 1;
    this.x = x;
    this.y = GRID.row[this.row] - 20;
    this.speed = speed;
}

/**
 * update enemy position
 */

Enemy.prototype.update = function(dt) {
  if (this.x <= ctx.canvas.width) {
      this.x += dt * this.speed;
   } else {
       this.x = Math.floor((Math.random() * (- 500)) - SPRITE_WIDTH);
       this.row = (Math.floor((Math.random() * 3) + 2)) - 1;
       this.y = GRID.row[this.row] - 20;
   }


   // check for player collision
   if (this.row  === player.row) {
         // console.log('cell: ' + cells[cell].row + ' ' + cells[cell].col);
         //    console.log('player: ' + player.row + ' ' + player.col);

        var cells = this.getLocation();
        for (var cell in cells) {
          //   console.log('cell: ' + cells[cell].row + ' ' + cells[cell].col);
            // console.log('player: ' + player.row + ' ' + player.col);
           // gamePause = true;

            if (player.col === cells[cell].col) {
                player.reset();
                break;
            }
        }
   }
}

/**
 * Draw enemy on screen
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/**
 *  Get Enemy location
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


/** Player Class */
var Player = function(row,col) {
    //Player characters
    this.sprite = playerSprites[Math.floor(Math.random() * 5)];
    this.row = row - 1;
    this.col = col - 1;
    this.x = GRID.col[this.col];
    this.y = GRID.row[this.row] - 13;
    this.move = '';
}

Player.prototype.reset = function() {
    this.row = PLAYER_START.row - 1;
    this.col = PLAYER_START.col - 1;
    this.x = GRID.col[this.col];
    this.y = GRID.row[this.row] - 13;
}

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
        player.reset();
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

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
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player(PLAYER_START.row, PLAYER_START.col);
generateEnemies(5);

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

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
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

// disable scrolling.
document.addEventListener('keydown', function(e) {
  if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);


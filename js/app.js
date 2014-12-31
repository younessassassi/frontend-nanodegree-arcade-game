/** Global */
var GRID = {
    row: [0, 83, 166, 249, 332, 415],
    col: [0, 101, 202, 303, 404, 505]
}

//var ENEMY_START_ROW = [2, 3, 2, 3, 4, 2, 4];

var PLAYER_START = {
    row: 5,
    col: 3
}

var SPRITE_WIDTH = 101;
var SPRITE_HEIGHT = 83;

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
    // locate the cell where the enemy left edge is located
    for (var column = 1; column < GRID.col.length; column++) {
        if (this.x < GRID.col[column]) {
            var cell = {};
            cell.row = this.row + 1;
            cell.col = column;
            cells.push(cell);
            break;
        }
    }

    // locate the cell where the enemy right edge is located
    var enemyRightEdge = this.x + SPRITE_WIDTH;
    if (enemyRightEdge > GRID.col[1] && enemyRightEdge < GRID.col[GRID.col.length - 1]) {
        for (var column = 2; column < GRID.col.length; column++) {
            if (enemyRightEdge < GRID.col[column]) {
                var cell = {};
                cell.row = this.row + 1;
                cell.col = column;
                cells.push(cell);
                break;
            }
        }
    }
    return cells;
}


/** Player Class */
var Player = function(row,col) {
    //Player characters
    this.sprite = 'images/char-boy.png';
    this.row = row;
    this.col = col;
    this.x = GRID.col[col - 1];
    this.y = GRID.row[row - 1] - 13;
    this.move = '';
    /*this.catGirl = 'images/char-boy.png';
    this.hornGirl = 'images/char-boy.png';
    this.pinkGirl = 'images/char-boy.png';
    this.princessGirl = 'images/char-boy.png';
    */
}

Player.prototype.reset = function() {
    this.row = PLAYER_START.row;
    this.col = PLAYER_START.col;
    this.x = GRID.col[this.col - 1];
    this.y = GRID.row[this.row - 1] - 13;
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
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(key) {
    this.move = key;
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player(PLAYER_START.row, PLAYER_START.col);
generateEnemies(6);

function generateEnemies(maxEnemies) {
    for (var i = 0; i < maxEnemies; i++) {
        var row = Math.floor((Math.random() * 3) + 2);
        var leftPoint = Math.floor((Math.random() * (- 500)) - SPRITE_WIDTH);
        var speed = Math.floor((Math.random() * 200) + 100);
        var enemy = new Enemy(row, leftPoint, speed);
        allEnemies.push(enemy);
    }
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// disable scrolling.
document.addEventListener('keydown', function(e) {
  if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
  }
}, false);


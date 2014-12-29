/** Global */
var GRID = {
    row: [0, 83, 166, 249, 332, 415],
    col: [0, 101, 202, 303, 404, 505]
}

var ENEMY_START_ROW = [3];


/** Enemy Class */
var Enemy = function(x,y,row,width) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.row = row;
    this.width = width;

}

/**
 * update enemy position
 */

Enemy.prototype.update = function(dt) {
  if (this.x <= ctx.canvas.width) {
      this.x += 101 * dt;
   } else {
       this.x = -101;
   }
}

/**
 * Draw enemy on screen
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Enemy.prototype.getLocation = function() {
    var cells = [];
    // locate the cell where the enemy left edge is located
    for (var column = 1; column < GRID.col.length; column++) {
        if (this.x < GRID.col[column]) {
            console.log('left edge column: '+ column +  ' content: ' + GRID.col[column]);
            var cell = {};
            cell.row = this.row + 1;
            cell.col = column;
            cells.push(cell);
            break;
        }
    }

    // locate the cell where the enemy right edge is located
    var enemyRightEdge = this.x + this.width;
    if (enemyRightEdge > GRID.col[1] && enemyRightEdge < GRID.col[GRID.col.length - 1]) {
        for (var column = 2; column < GRID.col.length; column++) {
            if (enemyRightEdge < GRID.col[column]) {
                console.log('right edge column: '+ column +  ' content: ' + GRID.col[column]);
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
var Player = function(x,y,col,row,width,height) {
    //Player characters
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.row = row;
    this.col = col;
    this.width = width;
    this.height = height;
    this.move = '';
    /*this.catGirl = 'images/char-boy.png';
    this.hornGirl = 'images/char-boy.png';
    this.pinkGirl = 'images/char-boy.png';
    this.princessGirl = 'images/char-boy.png';
    */
}

Player.prototype.update = function() {
    if (this.move.length > 0) {
        var maxWidth = GRID.col[GRID.col.length - 1];
        var maxHeight = GRID.row[GRID.row.length - 1];
        switch(this.move) {
            case 'left':
                if (this.x >= this.width) {
                    this.x -= this.width;
                    this.col--;
                }
                break;
            case 'right':
                if (this.x + this.width < maxWidth) {
                    this.x += this.width;
                    this.col++;
                }
                break;
            case 'down':
                if (this.y + this.height < maxHeight) {
                    this.y += this.height;
                    this.row++;
                }
                break;
            case 'up':
                if (this.y >= this.height - 13) {
                    this.y -= this.height;
                    this.row--;
                }
                break;
            default:
                break;
        }
        this.move = '';
    }
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
var allEnemies = [];
var player = new Player(GRID.col[2] , GRID.row[4] - 13, 3, 5, 101, 83);
for (var row in ENEMY_START_ROW) {
    var enemy = new Enemy(GRID.col[0] - 101, GRID.row[ENEMY_START_ROW[row]] - 20, ENEMY_START_ROW[row], 101);
    allEnemies.push(enemy);
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


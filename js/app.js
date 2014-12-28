/** Enemy Class */
var Enemy = function(x,y) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
}

/**
 * update enemy position
 */
Enemy.prototype.update = function(dt) {
    if (this.x <= ctx.canvas.width) {
        this.x += 100 * dt;
    } else {
        this.x = -100;
    }
}

/**
 * Draw enemy on screen
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


/** Player Class */
var Player = function(x,y) {
    //Player characters
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.move = '';
    /*this.catGirl = 'images/char-boy.png';
    this.hornGirl = 'images/char-boy.png';
    this.pinkGirl = 'images/char-boy.png';
    this.princessGirl = 'images/char-boy.png';
    */
}

Player.prototype.update = function() {
    if (this.move.length > 0) {
        switch(this.move) {
            case 'left':
                if (this.x > 99) {
                    this.x -= 100;
                }
                break;
            case 'right':
                if (this.x < 305) {
                    this.x += 100;
                }
                break;
            case 'down':
                if (this.y < 406) {
                    this.y += 84;
                }
                break;
            case 'up':
                if (this.y > 69) {
                    this.y -= 84;
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
var player = new Player(200, 325);
var enemy = new Enemy(-100, 225);
allEnemies.push(enemy);




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


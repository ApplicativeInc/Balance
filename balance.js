var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('ball', 'assets/191px-The-rusty-ball.png', 0, 0);
}

var player;
var cursors;
var score = 0;
var scoreText;
var highScore = 0;
var highScoreText;
var star;
var star_x;
var star_y;
var life = 2;
var lifeText;
var playButton;
var gameOverText;
var restartText;

function renderBackground() {
    game.stage.backgroundColor = '#FFFFFF';
    var graphics = game.add.graphics(0, 0);
    graphics.lineStyle(0);
    var inner = 600;
    var width = 10;
    var backgroundColor = 0x000000;
    var opacity = 0.06;
    for (var inner = 600; inner >= 0; inner -= 20) {
        graphics.beginFill(0x000000, opacity);
        graphics.drawCircle(400, 300, inner);
    }
}

function create() {
    renderBackground();
    cursors = game.input.keyboard.createCursorKeys();
    playButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    game.physics.startSystem(Phaser.Physics.ARCADE);

    platforms = game.add.group();
    platforms.enableBody = true;

    player = createPlayer();

    stars = game.add.group();
    stars.enableBody = true;
    createNewStar(stars);

    scoreText = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'});
    highScoreText = game.add.text(320, 16, 'High Score: 0', {fontSize: '32px', fill: '#000'});
    lifeText = game.add.text(680, 16, 'Life: ' + life, {fontSize: '32px', fill: '#000'});
}

function collectStar(player, star) {
    star.kill();
    setScore(score + 10 * Math.abs(player.body.velocity.getMagnitude()));
    createNewStar(stars);
}

function createNewStar(stars) {
    star_x = Math.random() * 600 + 100;
    star_y = Math.random() * 400 + 100;
    star = stars.create(star_x, star_y, 'star');
}

function createPlayer() {
    var player = game.add.sprite(400, 150, 'ball');
    player.scale.x = 0.2;
    player.scale.y = 0.2;
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.checkWorldBounds = true;
    player.events.onOutOfBounds.add(resetPlayer, this);
    return player;
}

function resetPlayer(player) {
    player.reset(400, 150);
    setLife(life - 1);
    if (life <= 1) {
        player.events.onOutOfBounds.removeAll(this);
        player.events.onOutOfBounds.add(gameOver, this);
    } else {
        player.reset(400, 150);
    }
}

function gameOver() {
    player.kill();
    setLife(0);
    gameOverText = game.add.text(300, 200, 'GAME OVER', {fontSize: '64px', fill: '#000'});
    restartText = game.add.text(220, 233, 'Press Space to Restart', {fontSize: '24px', fill: '#000'});
}

function setLife(n) {
    life = n;
    lifeText.text = 'Life: ' + life;
}

function setScore(n) {
    score = n;
    if (score > highScore) {
        highScore = score;
        highScoreText.text = 'High Score: ' + Math.floor(highScore);
    }
    scoreText.text = 'Score: ' + Math.floor(score);
}

function update() {
    if (life <= 0) {
        if (playButton.isDown) {
            setLife(3);
            setScore(0);
            player = createPlayer();
            game.world.remove(gameOverText);
            game.world.remove(restartText);
        }
    } else {
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.overlap(player, stars, collectStar, null, this);
        player.body.velocity.x *= 0.995;
        player.body.velocity.y *= 0.995;
        player.body.velocity.x += (400 - player.body.x) / 20;
        player.body.velocity.y += (300 - player.body.y) / 20;

        if (cursors.left.isDown) {
            player.body.velocity.x -= 20;
        } else if (cursors.right.isDown) {
            player.body.velocity.x += 20;
        } else if (cursors.up.isDown) {
            player.body.velocity.y -= 20;
        } else if (cursors.down.isDown) {
            player.body.velocity.y += 20;
        }
        star.body.x = star_x + (Math.random() - 0.5) * 2;
        star.body.y = star_y + (Math.random() - 0.5) * 2;
    }
}

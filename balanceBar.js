var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('pad', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

var pad;
var player;
var cursors;
var score = 0;
var scoreText;
var star;
var star_x;
var star_y;
var life = 2;
var lifeText;
var playButton;

function create() {
    cursors = game.input.keyboard.createCursorKeys();
    playButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    game.add.sprite(0, 0, 'sky');

    game.physics.startSystem(Phaser.Physics.ARCADE);

    platforms = game.add.group();
    platforms.enableBody = true;
    pad = platforms.create(200, game.world.height - 64, 'pad');
    pad.body.immovable = true;

    player = createPlayer();

    stars = game.add.group();
    stars.enableBody = true;
    createNewStar(stars);

    scoreText = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'});
    lifeText = game.add.text(680, 16, 'Life: ' + life, {fontSize: '32px', fill: '#000'});
}

function collectStar(player, star) {
    star.kill();
    setScore(score + 10 * Math.abs(player.body.velocity.x));
    createNewStar(stars);
}

function createNewStar(stars) {
    star_x = Math.random() * (pad.body.width - 40) + 220;
    star_y = game.world.height - 100;
    star = stars.create(star_x, star_y, 'star');
    star.body.gravity.y = 100;
}

function createPlayer() {
    var player = game.add.sprite(400, 150, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.gravity.y = 600;
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
    game.add.text(300, 200, 'GAME OVER', {fontSize: '64px', fill: '#000'});
    game.add.text(220, 233, 'Press Space to Restart', {fontSize: '24px', fill: '#000'});
}

function setLife(n) {
    life = n;
    lifeText.text = 'Life: ' + life;
}

function setScore(n) {
    score = n;
    scoreText.text = 'Score: ' + score;
}

function update() {
    if (life <= 0) {
        if (playButton.isDown) {
            setLife(3);
            setScore(0);
            createPlayer();
        }
    } else {
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.overlap(player, stars, collectStar, null, this);

        if (cursors.left.isDown) {
            player.body.velocity.x -= 20;
        } else if (cursors.right.isDown) {
            player.body.velocity.x += 20;
        }
        star.body.x = star_x + (Math.random() - 0.5) * 2;
        star.body.y = star_y + (Math.random() - 0.5) * 2;
    }
}

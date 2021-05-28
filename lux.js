// VARIABLES

let ui = {
    score: document.getElementById ('score'),
    chances: document.getElementById ('chances'),
}

// useful last minute variables
let pause = document.getElementById ('pause');
let gameOver = document.getElementById ('gameOver');
let rPop = document.getElementById ('r');
let dPop = document.getElementById ('d');
let scorePop = document.getElementById ('gameOverScore');
let scorePopVal = 0;

let life = {
    DOM: document.getElementById ('life'),
    x: 0,
    y: 0,
    size: 20,
    setPosition: (x, y) => {
        life.DOM.style.left = (x - life.size/2) + "px"; life.x = x;
        life.DOM.style.top = (y - life.size/2) + "px"; life.y = y;
    }
}

// cursor div element
let cursor = {
    DOM: document.getElementById ('cursor'),
    x: 0,
    y: 0,
    angle: 0,
    setAngle: (angle) => {
        cursor.DOM.style.transform = "rotate(" + angle + "rad)"; cursor.angle = angle;
    },
    color: '',
    setPosition: (x, y) => {
        cursor.DOM.style.top = y + "px"; cursor.y = y;
        cursor.DOM.style.left = x + "px"; cursor.x = x;
    },
}

// player element with its states
let player = {
    DOM: document.getElementById ('player'),
    x: 0,
    y: 0,
    initialized: false,
    alive: true,
    color: '',
    shadow: document.getElementById ('player_core'),
    animation: '',
    shooting: false,
    angle: 0,
    speed: 0,
    aceleration: 0.1,
    moving: false,
    brakes: false,
    size: 0,
    percent: 100,
    score: 0,
    timing: 0,
    setAnimation: (animation) => {
        player.DOM.style.animation = animation; player.animation = animation;
    },
    setSize: (size) => {
        player.DOM.style.fontSize = size + "px"; player.size = size;
    },
    setColor: (color) => {
        player.DOM.style.color = color; player.color = color;
    },
    putShadow: () => {
        player.shadow.style.top = (player.y - 45/2) + 'px'; player.shadow.style.left = (player.x - 45/2) + 'px'; 
    },
    setShadowAngle: (angle) => {
        player.shadow.style.transform = "rotate(" + (angle + Math.PI/4) + "rad)";
    },
    setAngle: (angle) => {
        player.DOM.style.transform = "rotate(" + (angle + Math.PI/4) + "rad)"; player.angle = angle;
    },
    setPosition: (x, y) => {
        player.DOM.style.left = (x - player.size/2) + "px"; player.x = x;
        player.DOM.style.top = (y - player.size/2) + "px"; player.y = y;
    },
    move: (vec) => {
        let mod = (vec[0]**2 + vec[1]**2)**(0.5); let uni = [(vec[0]/mod),(vec[1]/mod)]; 
        if (inRad(mainScreen.x, mainScreen.y, player.x + uni[0]*player.speed, player.y - uni[1]*player.speed, 235)) {
            player.setPosition(player.x + uni[0]*player.speed, player.y - uni[1]*player.speed);
        }
    },
    initialize: (cenX, cenY) => {
        player.setSize(40);
        player.setPosition(cenX, cenY); 
        player.setColor("white");
        player.setAnimation ('playerShadows 1.5s linear infinite');
        scorePopVal = 0;
        player.initialized = true;
    }
}

// bullet element with its states
let bullet = {
    DOM: document.getElementById ('bullet'),
    x: 0,
    y: 0,
    size: 20,
    moving: false,
    speed: 0,
    color: '',
    shadowColor: '',
    timing: 0,
    angle: 0,
    setAngle: (angle) => {
        bullet.DOM.style.transform = "rotate(" + angle + "rad)"; bullet.angle = angle;
    },
    setColors: () => {
        if (bullet.moving == true) {
            bullet.DOM.style.textShadow = "0px 0px 10px white"; // REVISAR!!!!!!!!!
            bullet.DOM.style.color = 'white';
        } else {
            bullet.DOM.style.textShadow = "0px 0px 10px black";
            bullet.DOM.style.color = 'black';
        }
    },
    setPosition: (x, y) => {
        bullet.DOM.style.left = (x - bullet.size/2) + "px"; bullet.x = x;
        bullet.DOM.style.top = (y - bullet.size/2) + "px"; bullet.y = y;
    },
    move: (vec) => {
        let mod = (vec[0]**2 + vec[1]**2)**(0.5); let uni = [(vec[0]/mod),(vec[1]/mod)]; 
        bullet.setPosition(bullet.x + uni[0]*bullet.speed, bullet.y - uni[1]*bullet.speed);
    },
}

// enemies generator class
class Enemy {
    constructor () {
        this.DOM = '';
        this.initialized = false;
        this.alive = true;
        this.moving = false;
        this.color = 'black';
        this.animation = '';
        this.speed = 0;
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.size = 0;
    }
    setAngle (angle) {
        this.DOM.style.transform = "rotate(" + angle + "rad)"; this.angle = angle;
    }
    setSize (size) {
        this.DOM.style.fontSize = size + 'px'; this.size = size;
    }
    setColor (color) {
        this.DOM.style.color = color; this.color = color;
    }
    setPosition (x, y) {
        this.DOM.style.left = (x - this.size/2) + 'px'; this.x = x;
        this.DOM.style.top = (y - this.size/2) + 'px'; this.y = y;
    }
    setAnimation (animation) {
        this.DOM.style.animation = animation; this.animation = animation;
    }
    initialize (cenX,cenY, r) {
        let newEnemy = document.createElement('i');
        newEnemy.classList.add('fas'); newEnemy.classList.add('fa-greater-than'); newEnemy.classList.add('enemy');
        document.body.appendChild(newEnemy);
        this.DOM = newEnemy;
        this.setSize (25); this.setColor ('white');
        let factor = Math.floor((Math.random() * 100) + 1);
        let ang = (Math.PI*2*factor)/100; // rad
        this.setPosition (Math.cos (ang)*r + cenX, Math.sin (ang)*r + cenY);
        this.setAnimation ('playerShadows 0.5s linear infinite');
    }
    move (vec) {
        this.setAngle (-angTo (vec));
        let mod = (vec[0]**2 + vec[1]**2)**(0.5); let uni = [(vec[0]/mod),(vec[1]/mod)]; 
        this.setPosition(this.x + uni[0]*this.speed, this.y - uni[1]*this.speed);
    }
    checkState () {
        if (this.alive == true) {
            this.setSize (25); this.setColor ('white'); this.setAnimation ('playerShadows 0.5s linear infinite');
        } else {
            this.setSize (0); this.setColor ('black'); this.setAnimation (''); this.speed = 0;
        }
    }
}

// enemies speed to diff
let enemiesSpeed = 1.5;
let enemiesAcelerated = false; // to chack if speed was already rised

// sceene elelemt
let sceene = {
    start: false,
    score: 0,
    percent: 100,
    time: 0, // +1 each 1/50s
}

// screen element
let mainScreen = {
    x: window.innerWidth / 2, y: window.innerHeight / 2
}

// mouse element 
let mouse = {
    x: 0, y: 0
}

// last click position
let lastClick = {
    x: 0, y:0
}

// last direction
let lastD = [];

// enemies list
let enemies = [];

// FUNCTIONS ###################################################################################

// check if element is on given radio
let inRad = (cenX, cenY, x, y, r) => {
    return ((cenX - x)*(cenX - x) + (cenY - y)*(cenY - y) < r*r) ? true : false;
}

// get vector from a to b
let vecTo = (fromX, fromY, toX, toY) => {
    // dsnt need explanation
    return [toX - fromX, fromY - toY]; // a list <==
};

// get angle given vector
let angTo = (vector) => {
    if (vector [0] > 0 && vector [1] > 0) {
        // 1 quad + +
        return Math.atan(vector[1]/vector[0]);
    } else if (vector [0] < 0 && vector [1] > 0) {
        // 2 quad - +
        return Math.PI + Math.atan(vector[1]/vector[0]);
    } else if (vector [0] < 0 && vector [1] < 0) {
        // 3 quad - - 
        return Math.PI + Math.atan(vector[1]/vector[0]);
    } else {
        // 4 cuad + -
        return Math.PI*2 + Math.atan(vector[1]/vector[0]);
    }
}; // returns angles in radians

// check if must die 
let randDead = (chances) => {
    let rand = Math.floor((Math.random() * 100) + 1);
    return chances < rand ? true : false; // die / live
}

let lifeRestart = (r) => {
    let x;
    let y;
    while (true) {
        let xFac = Math.floor((Math.random() * 100) + 1);
        let yFac = Math.floor((Math.random() * 100) + 1);
        x = mainScreen.x - r + (xFac*2*r)/100;
        y = mainScreen.y - r + (yFac*2*r)/100;
        if (inRad(mainScreen.x, mainScreen.y, x, y, r)) {
            break;
        }
    }
    life.setPosition (x, y)
    if (sceene.start == true) {
        player.score++; player.percent = 100;
    }
}

// check difficulty
let diffCheck = (score) => {
    if (score % 20 == 0 && player.score != 0 && enemiesAcelerated == false) {
        enemiesSpeed += 0.25; enemiesAcelerated = true;
    } else if (score % 20 != 0 && player.score > 20) {
        enemiesAcelerated = false;
    }
}

// EVENTS ###################################################################################

// initialize game
document.addEventListener ('keyup', event => {
    // place player on centre and give it color
    mainScreen = {
        x: window.innerWidth / 2, y: window.innerHeight / 2
    }
    if (event.code === 'Space' && player.initialized == false && sceene.start == false) {
        sceene.start = true; // tells to the game that it can begin
        player.initialize (mainScreen.x, mainScreen.y);
    }
})

// restart game
document.addEventListener ('keyup', event => {
    // place player on centre and give it color
    mainScreen = {
        x: window.innerWidth / 2, y: window.innerHeight / 2
    }
    if (event.code === 'KeyR' && sceene.start == false) {
        sceene.start = true; // tells to the game that it can begin
        player.initialize (mainScreen.x, mainScreen.y); player.alive = true;
        player.score = 0; player.percent = 100; scorePopVal = 0;
        for (let j = 0; j < enemies.length; j++) {
            enemies[j].alive = false; enemies[j].checkState();
        }
        enemiesSpeed = 1.5;
    }
})

// pause game
document.addEventListener ('keyup', (event) => {
    if (event.code === 'KeyD') {
        if (sceene.start == true && player.alive == true) {
            sceene.start = false;
            console.log('set pause');
            dPop.style.display = 'flex';
            // set pasue interface
            pause.style.display = 'flex';
        } else if (sceene.start == false && player.alive == true) {
            sceene.start = true;
            console.log('quit pause');
            pause.style.display = 'none';
            dPop.style.display = 'none';
        } else if (player.alive == false) {
            // nothing should happen
            console.log('nothing');
        }
    }
})

// start moving player
document.addEventListener ('keydown', (event) => {
    if (event.code === 'KeyW' && sceene.start == true) {
        player.moving = true; player.brakes = false;
    }
})
// stop moving player
document.addEventListener ('keyup', (event) => {
    if (event.code === 'KeyW' && sceene.start == true) {
        player.brakes = true;
    }
})

// turn cursor when holding click
document.addEventListener ('mousedown', (event) => {
    cursor.setAngle (Math.PI/4);
})
document.addEventListener ('mouseup', (event) => {
    cursor.setAngle (0);
})

// move cursor div to mouse position and set player's angle
document.addEventListener ('mousemove', (event) => {
    // set center of screen
    mainScreen = {
        x: window.innerWidth / 2, y: window.innerHeight / 2
    }

    // get mouse position
    mouse.x = event.clientX; mouse.y = event.clientY;

    // set cursor position
    cursor.setPosition(mouse.x - 15, mouse.y - 15);

    // set player angle to cursor
    if (sceene.start == true) {
        let playerVec = vecTo (player.x, player.y, mouse.x, mouse.y); player.setAngle(-angTo (playerVec));
    }
})

// shoot a bullet each click
document.addEventListener ('click', (event) => {
    if (sceene.start == true) {
        // shooting activated
        bullet.setPosition(player.x, player.y); bullet.moving = true; bullet.speed = 25;
        lastClick = {x: cursor.x + 15, y: cursor.y + 15};
        // check if must die
        if (randDead(player.percent) == true) {
            sceene.start = false; player.alive = false; player.moving = false; player.speed = 0; enemiesSpeed = 1.5;
        }
        player.percent--;
    }
})

// main event admin
setInterval(() => {
    sceene.time++;
    // create enemies every second is gane strated
    if (sceene.time % 50 == 0 && sceene.start == true) { // one per second seems better...
        let newEnemy = new Enemy ();
        newEnemy.initialize (mainScreen.x, mainScreen.y, 275);
        enemies.push (newEnemy); //it wooooorks!!!!!!!!!!!!!!!!!
    }
    // move enemies
    if (sceene.start == true) {
        for (let i = 0; i < enemies.length; i++) { // for each enemy
            enemies[i].checkState();
            if (enemies[i].alive == true) {
                let eVec = vecTo (enemies[i].x, enemies[i].y, player.x, player. y);
                if (inRad(mainScreen.x, mainScreen.y, enemies[i].x, enemies[i].y, 235)) {
                    enemies[i].speed = enemiesSpeed;
                    enemies[i].move (eVec);
                } else {
                    enemies[i].speed = 0.5;
                    enemies[i].move (eVec);
                }
                // check for losing collition
                if (inRad (player.x, player.y, enemies[i].x, enemies[i].y, 10)) { // 15 to be generous
                    player.alive = false; 
                    sceene.start = false;
                    player.speed = 0;
                    player.moving = false;
                    enemiesSpeed = 1.5;
                }
                
            } else {
                enemies[i].setPosition (0, 0);
            }
            // check for bullet collition
            if (inRad(enemies[i].x, enemies[i].y, bullet.x, bullet.y, 20)) {
                // bullet sentences
                bullet.moving = false; bullet.setColors(); bullet.speed = 0; 
                bullet.setPosition(0, 0); 
                // enemy sentences
                enemies[i].alive = false; 
            }
        }
    }
    // move player when acelerating
    if (sceene.start == true && player.moving == true && player.brakes == false) {
        let pVec = vecTo (player.x, player.y, cursor.x, cursor.y);
        if (player.speed < 4) {
            player.speed += player.aceleration; 
        }
        player.move (pVec);
        lastD = pVec;
    }
    // keep moving till 0 when deacelerating
    if (sceene.start == true && player.brakes == true) {
        // DEBUG
        console.log ('deaceleration');
        if (player.speed > 0) {
            if (player.speed - player.aceleration <= 0) {
                player.speed = 0; // totally stoped
                player.brakes = false;
            }
            player.move (lastD); 
            player.speed -= player.aceleration/2.35;
            player.moving = false;
        }
    }
    // check for life restart
    if (inRad (player.x, player.y, life.x, life.y, 25)) {
        lifeRestart (225);
    }

    // move bullet
    let bVec = vecTo (player.x, player.y, lastClick.x, lastClick.y);
    bullet.setAngle (-angTo(bVec));
    bullet.setColors();
    if (bullet.moving == true) {
        bullet.move (bVec);
    }
    if (inRad(mainScreen.x, mainScreen.y, bullet.x, bullet.y, 275) == false) {
        bullet.moving = false; bullet.setColors(); bullet.speed = 0; 
        bullet.setPosition(0, 0);
    }

    // increase difficulty
    diffCheck (player.score);

    // set interface showing values
    ui.chances.innerText = player.percent;
    ui.score.innerText = player.score;
    scorePop.innerText = scorePopVal + ' pts';

    // set game over interface
    if (player.score != 0) {
        scorePopVal = player.score;
    }
    if (player.alive == true) {
        gameOver.style.display = 'none'; rPop.style.display = 'none'; scorePop.style.display = 'none'; 
    } else {
        gameOver.style.display = 'flex'; rPop.style.display = 'flex'; scorePop.style.display = 'flex'; 
    }
    // player.alive == true ? gameOver.style.display = 'none' : gameOver.style.display = 'flex';

},20) // 50 FPS, or every 20ms

(function () {
    const FPS = 100;
    const TAMX = 600;
    const TAMY = 800;

    const PROB_ENEMY_SHIP = 0.5;
    let game_running = false;
    let game_paused = false;

    let space, ship, score;
    let enemies = [];
    let meteors = [];
    let lives = [];

    function init() {
        space = new Space();
        ship = new Ship();
        score = new Score();

        let interval = window.setInterval(run, 100000);
    }

    //callback
    window.addEventListener('keydown', (e) => {
        if (game_running === false) {
            if (e.key === ' ') {
                interval = window.setInterval(run, 1000 / FPS);
                game_running = true;
                console.log("play");
                lives.push(new life());
                lives.push(new life());
                lives.push(new life());
            }
        }
        else {
            if (e.key === 'ArrowLeft') {
                ship.mudaDirecao(-1);
            }
            else if (e.key === 'ArrowRight') {
                ship.mudaDirecao(1);
            }
            else if ((e.key === 'p' || e.key === 'P') && game_paused === false) {
                console.log("pause");
                interval = clearInterval(interval);
                game_paused = true;
            }
            else if ((e.key === 'p' || e.key === 'P') && game_paused === true) {
                console.log("play");
                interval = window.setInterval(run, 1000 / FPS);
                game_paused = false;
            }

        }
    });

    class Space {
        constructor() {
            this.element = document.getElementById('space');
            this.element.style.width = `${TAMX}px`;
            this.element.style.height = `${TAMY}px`;
            this.element.style.backgroundPositionY = '0px';
        }
        move() {
            this.element.style.backgroundPositionY = `${parseInt(this.element.style.backgroundPositionY) + 1}px`;
        }

    }
    class Ship {
        constructor() {
            this.element = document.getElementById('ship');
            this.AssetsDirecoes = [
                "./assets/png/playerLeft.png",
                "./assets//png/player.png",
                "./assets//png/playerRight.png "
            ];
            this.direcao = 1;
            this.element.src = this.AssetsDirecoes[this.direcao];
            this.element.style.bottom = '20px';
            this.element.style.left = `${parseInt(TAMX / 2) - 50}px`;
        }
        mudaDirecao(giro) {
            if (this.direcao + giro >= 0 && this.direcao + giro <= 2) {
                this.direcao += giro;
                this.element.src = this.AssetsDirecoes[this.direcao];
            }
        }
        move() {
            if (this.direcao === 0) {
                this.element.style.left = `${parseInt(this.element.style.left) - 1}px`;
            } else if (this.direcao === 2) {
                this.element.style.left = `${parseInt(this.element.style.left) + 1}px`;
            }

        }
    }
    class life {
        constructor() {
            this.element = document.createElement("img");
            this.element.className = "life";
            this.element.src = "./assets/png/life.png";
            this.element.style.top = "0px";
            //this.element.style.left = `${Math.floor(Math.random() * TAMX)}px`;
            let lives = document.getElementById("lives");

            console.log(lives.innerText);
            lives.appendChild(this.element);
        }
    }
    class Score {
        constructor() {
            this.element = document.createElement("p");
            this.element.innerText = '0000';
            this.element.className = "score";
            this.element.style.top = "0px";
            let lives = document.getElementById("lives");
            lives.appendChild(this.element);
        }
    }
    class enemyShip {
        constructor() {
            this.element = document.createElement("img");
            this.element.className = "enemy-ship";
            this.element.src = "./assets/png/enemyShip.png";
            this.element.style.top = "0px";
            this.element.style.left = `${Math.floor(Math.random() * TAMX)}px`;
            space.element.appendChild(this.element);
        }
        move() {
            this.element.style.top = `${parseInt(this.element.style.top) + 1}px`;
        }
    }
    class enemyMeteor {
        constructor() {
            this.element = document.createElement("img");
            this.element.className = "enemy-meteor";
            this.element.src = "./assets/png/meteorSmall.png";
            this.element.style.top = "0px";
            this.element.style.left = `${Math.floor(Math.random() * TAMX)}px`;
            space.element.appendChild(this.element);
            this.element.style.position = "absolute";
        }
        move() {
            this.element.style.top = `${parseInt(this.element.style.top) + 1}px`;
        }
    }

    function run() {
        const random_enemy = Math.random() * 100;
        const random_meteor = Math.random() * 100;

        if (random_enemy < PROB_ENEMY_SHIP) {
            enemies.push(new enemyShip());
        }
        if (random_meteor < PROB_ENEMY_SHIP) {
            meteors.push(new enemyMeteor());
        }

        enemies.forEach((enemy) => {
            if (enemy.element.style.left === ship.element.style.left && enemy.element.style.top === ship.element.style.top) {
                console.log("colisao");
                lives.pop();
                if (lives.length === 0) {
                    console.log("game over");
                    interval = clearInterval(interval);
                    game_running = false;
                }
            }
        });

        //if enemy ship or meteor trespasses the max height of the screen, remove it from the array and from the DOM
        meteors.forEach((meteor) => {
            if (meteor.element.style.left === ship.element.style.left && meteor.element.style.top === ship.element.style.top) {
                console.log("colisao");
                lives.pop();
                if (lives.length === 0) {
                    console.log("game over");
                    interval = clearInterval(interval);
                    game_running = false;
                }
            }
        });



        console.log('FPS');

        //update score through FPS
        score.element.innerText = parseInt(score.element.innerText) + 1;

        space.move();
        ship.move();

        enemies.forEach((enemy) => {
            enemy.move();
        });
        enemies = enemies.filter((enemy) => {
            return parseInt(enemy.element.style.top) < TAMY;
        });

        meteors.forEach((meteor) => {
            meteor.move();
        });
        meteors = meteors.filter((meteor) => {
            return parseInt(meteor.element.style.top) < TAMY;
        }
        );



        //delete enemies that have passed the screen
        enemies = enemies.filter((enemy) => {
            return parseInt(enemy.element.style.top) < TAMY;
        }
        );

        //delete meteors that have passed the screen
        meteors = meteors.filter((meteor) => {
            return parseInt(meteor.element.style.top) < TAMY;
        }
        );

        //detect collision between ship and enemy
        enemies.forEach((enemy) => {
            if (enemy.element.style.left === ship.element.style.left && enemy.element.style.top === ship.element.style.top) {
                console.log("colisao");
                lives.pop();
                if (lives.length === 0) {
                    console.log("game over");
                    interval = clearInterval(interval);
                    game_running = false;
                }
            }
        }
        );
    };

    init();
})();
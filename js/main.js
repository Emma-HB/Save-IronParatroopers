//THE GAME AREA
const myGameArea = {
  
  canvas: document.createElement('canvas'),
  frames: 0, 

  start: function () {
    this.canvas.width = 1000;
    this.canvas.height = 600;
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateGameArea, 16); //60 FPS

    this.canvas.class =  document.querySelector('canvas').classList.add('game-area-canvas'); //
  },

	stop: function () {
    clearInterval(this.interval);
  },

	clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

//const W = myGameArea.canvas.width;
//const H = myGameArea.canvas.height;

// COMPONENTS
//Testing the Component class with rectangles before importing images
class Component {
  constructor(color,x ,y, width, height) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  //Draw component
  update() {
    const ctx = myGameArea.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  //To move the Wooden Raft
  moveLeft() {
    if (this.x > 0) this.x += -10;
  }

  moveRight() {
    if (this.x < (myGameArea.canvas.width - this.width)) this.x += 10;
  }
}

//The Wooden Raft
const woodenRaft = new Component('brown',((1000 / 2) - 75), 600 - 50, 150, 20); //(color, x: (W/2)- (this.width/2), y: H - 50, width, height)

//Bush reeds
const bushReedsLeft = new Component('greenyellow', 0, 600 - 175, 125, 175);
const bushReedsRight = new Component('greenyellow', 1000 - 125, 600 - 175, 125, 175);

//Random Crocodiles
/*const crocodile1 = new Component('green', 1000 / 5, 325, 75, 10);
const crocodile2 = new Component('green', 1000 - 300, 375, 100, 15);
const crocodile3 = new Component('green', 1000 / 3, 600- 50, 50, 50); //(x, y: 600 - heigth, width, heigth)

const crocodiles = [crocodile1, crocodile2, crocodile3]; //array objects

function random(arr) {
  var randomIndex = Math.trunc (Math.random() * crocodiles.length);
    return arr[randomIndex];
}
console.log(random(crocodiles)) //Component { color: 'green', x: 700, y: 375, width: 100, height: 15 }

if (frames % 150 === 0) {
  var crocodile = random(crocodiles);
}
console.log(crocodile) //undefined
*/

const crocodile1 = new Component('green', 1000 / 5, 325, 75, 10);
const crocodile2 = new Component('green', 1000 - 300, 375, 100, 15);
const crocodile3 = new Component('green', 1000 / 3, 600- 40, 50, 50); //(x, y: 600 - heigth, width, heigth)

const openMouthCroco = new Component('green', 1000 - 75, 600 - 100, 50, 100); //(x: this.x of Paratrooper, y: 600 - heigth, width, heigth)

//Paratroopers


//MOTIONS
//Moving the Wooden Raft
document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
    woodenRaft.moveLeft();
      break;
    case 'ArrowRight': 
    woodenRaft.moveRight();
      break;
  }
});

//Animation
function updateGameArea() {
  //
  //toutes les 20ms
  //
  myGameArea.clear(); //clear

  woodenRaft.update();//draw woodenRaft

  bushReedsLeft.update();
  bushReedsRight.update();

  crocodile1.update();
  crocodile2.update();
  crocodile3.update();

  //crocodile.update();

  //GameOver = if y(bottom of paratrooper) > y(top of woodenRaft) && !collision between paratrooper and woodenRaft
  openMouthCroco.update(); 
}

myGameArea.start();



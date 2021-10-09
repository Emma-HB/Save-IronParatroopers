let W = window.innerWidth;
let H = window.innerHeight;
let score = 0;

//THE GAME AREA
const myGameArea = {
  
  canvas: document.createElement('canvas'),
  frames: 0, 

  start: function () {
    this.canvas.width = W; 
    this.canvas.height = H; 
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

  printScore: function () {
    this.context.font = '32px Ruslan Display, cursive';
    this.context.fillStyle = 'yellow';
    this.context.textAlign = "center";
    if (score < 10) {
    this.context.fillText(`0${score}`, W - 35, H - 25);
    } else {
      this.context.fillText(`${score}`, W - 35, H - 25);
    }
  }   
};

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
    if (this.x > 0) this.x += -30;
  }

  moveRight() {
    if (this.x < (myGameArea.canvas.width - this.width)) this.x += 30;
  }

  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }
 
  crashWith(el) {
    return (
      this.bottom() > el.top() &&
      this.top() < el.bottom() &&
      this.right() > el.left() &&
      this.left() < el.right() &&
      this.bottom() > el.bottom()
    );
  }
}

//The Wooden Raft
const woodenRaft = new Component('darkred',(W/2 - 90), H - 50, 180, 20); //(color, x: (W/2)- (this.width/2), y: H - 50, width, height)

//Bush reeds
const bushReedsLeft = new Component('rgba(172, 255, 47, 0.568)', 0, H - 175, 125, 175);
const bushReedsRight = new Component('rgba(172, 255, 47, 0.568)', W - 125, H - 175, 125, 175);

//COMPONENTS with Random Positions
const crocodile1 = new Component('green', W / 5, 325, 75, 10);
const crocodile2 = new Component('green', W - 300, 375, 100, 15);
const crocodile3 = new Component('green', W / 3, H- 40, 50, 50);

const crocodiles = [crocodile1, crocodile2, crocodile3];
let crocodile;

function random(arr) {
  var randomIndex = Math.trunc (Math.random() * arr.length);
    return arr[randomIndex];
}

const framesNumber = 800; 
const speed = 1; 

let level = 0; 
function nextLevel() {
  if (score >= 10) {
    level = Math.trunc(score / 10);
  } 
  return level
}


let myOrangeParatroopers = [];
let myBrownParatroopers = [];

function updateRandomElements() {
  myGameArea.frames += 1;

  if (myGameArea.frames % 200 === 0) {
    crocodile = random(crocodiles);
  }
  crocodile.update();

  if (myGameArea.frames % (framesNumber/2) === 0) {
    var W = myGameArea.canvas.width;
    var minPosX = 0;
    var maxPosX = W - 50; 

    var orangePosX = Math.floor(Math.random() * (maxPosX - minPosX + 1) + minPosX);

    myOrangeParatroopers.push(new Component('orange', orangePosX, 0, 50 , 60)); 
  }

  for (i = 0; i < myOrangeParatroopers.length; i++) {
    myOrangeParatroopers[i].y += (speed + level) ;
    myOrangeParatroopers[i].update();
  }

  if (myGameArea.frames % framesNumber === 0) { //and score > 10 
    var W = myGameArea.canvas.width;
    var minPosX = 0;
    var maxPosX = W - 50; 

    var brownPosX = Math.floor(Math.random() * (maxPosX - minPosX + 1) + minPosX);

    myBrownParatroopers.push(new Component('brown', brownPosX, 0, 50 , 60)); //color,x ,y, width, height
  }

  for (i = 0; i < myBrownParatroopers.length; i++) {
    myBrownParatroopers[i].y += (speed + level)* 1.5;
    myBrownParatroopers[i].update();
  } 
}

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

//SAVED 
let scoreboard = new Component ('green', W - 65, H - 55, 60, 40);

function pickUp() {
  myOrangeParatroopers = myOrangeParatroopers.filter(function(el) {
    if (woodenRaft.crashWith(el)) {
      score += 1; 
      return false; 
    } else {
      return true; 
    } 
  })

  myBrownParatroopers = myBrownParatroopers.filter(function(el) {
    if (woodenRaft.crashWith(el)) {
      score += 1;
      return false; 
    } else {
      return true; 
    }  
  })
}

//GAME OVER

let sunkParatroopers = [];

function checkGameover() {
  myOrangeParatroopers = myOrangeParatroopers.filter(function(el) {
    if (el.bottom() > H) {
      sunkParatroopers.push(el);
      const openMouthCroco = new Component('green', el.left(), H - 100, 50, 100);
      openMouthCroco.update();
      return false;
    } else {
      return true;
    } 
  })

  myBrownParatroopers = myBrownParatroopers.filter(function(el) {
    if (el.bottom() > H) {
      sunkParatroopers.push(el);
      const openMouthCroco = new Component('green', el.left(), H - 100, 50, 100); 
      openMouthCroco.update();
      return false;
    } else {
      return true;
    } 
  })

  if (sunkParatroopers.length > 0) {
    myGameArea.stop();
  }
}

//Animation
function updateGameArea() {
  //
  //toutes les 20ms
  //
  myGameArea.clear();

  woodenRaft.update();

  pickUp();
  checkGameover();

  updateRandomElements();

  bushReedsLeft.update();
  bushReedsRight.update();

  scoreboard.update();
  myGameArea.printScore();

  nextLevel();

}

myGameArea.start();



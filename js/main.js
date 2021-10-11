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
    this.context.font = '35px Ruslan Display, cursive';
    this.context.fillStyle = '#FFD12C';
    this.context.textAlign = "center";
    if (score < 10) {
    this.context.fillText(`0${score}`, W - 35, H - 25);
    } else {
      this.context.fillText(`${score}`, W - 35, H - 25);
    }
  }   
};

// COMPONENTS
class Component {
  constructor(srcImg,x ,y, width, height) { 
    
    if (srcImg.includes('images/')) {
      this.image = new Image();

      this.image.src = srcImg;
      this.image.onload = () => {
        const imageRatio = this.image.naturalWidth/this.image.naturalHeight;
        this.height = this.width/imageRatio;
      }
    }
    
    this.x = x;
    this.y = y;
    this.width = width;  
  }

  update() {
    const ctx = myGameArea.context;

    if (this.image) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  moveLeft() {
    if (this.x > 0) this.x += -30;
  }
  moveRight() {
    if (this.x < (myGameArea.canvas.width - this.width)) this.x += 30;
  }

  left() {
    return this.x + this.width/12;
  }
  right() {
    return this.x + (this.width - this.width/12) ;
  }
  top() {
    return this.y + this.height/2;
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
const woodenRaft = new Component('images/wooden-raft.png',(W/2 - W/8), H - W/12, W / 4, this.height);

//Bush reeds
const bushReedsLeft = new Component('images/bushreeds-left.png', 0 - (W/17), H - W/4.5, W / 5, this.height);
const bushReedsRight = new Component('images/bushreeds-right.png', W - (W/6.5), H - W/4.5, W / 5, this.height);

//COMPONENTS with Random Positions
const crocodile1 = new Component('images/crocodile-1.png', W / 7, H - (H/3), W/6, 10);
const crocodile2 = new Component('images/crocodile-2.png', W - 300, H - (H/3.5), W/5, 15);
const crocodile3 = new Component('images/crocodile-3.png', W / 3, H- 50, W/5, 50);

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
    var maxPosX = W - (W/10); 

    var orangePosX = Math.floor(Math.random() * (maxPosX - minPosX + 1) + minPosX);

    myOrangeParatroopers.push(new Component('images/orange-paratrooper.png', orangePosX, 0, W / 8 , this.height)); 
  }

  for (i = 0; i < myOrangeParatroopers.length; i++) {
    myOrangeParatroopers[i].y += (speed + level) ;
    myOrangeParatroopers[i].update();
  }

  if (myGameArea.frames % framesNumber === 0) { 
    var W = myGameArea.canvas.width;
    var minPosX = 0;
    var maxPosX = W - (W/8); 

    var brownPosX = Math.floor(Math.random() * (maxPosX - minPosX + 1) + minPosX);

    myBrownParatroopers.push(new Component('images/brown-paratrooper.png', brownPosX, 0, W / 8 , this.height));
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
//let scoreboard = new Component ('images/scoreboard copie.png', W - W/3.755, H - H/4, 600, this.height);

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

  //scoreboard.update();
  myGameArea.printScore();

  nextLevel();

}

myGameArea.start();



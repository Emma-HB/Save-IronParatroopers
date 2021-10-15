let W = window.innerWidth;
let H = window.innerHeight;
let score = 0;

//HOMEPAGE 
//Audio
let audioHomepage = document.createElement("audio");
audioHomepage.src = "audio/mixkit-sounds-of-the-river-and-birds-2453.wav";
document.addEventListener('click',function () {
  audioHomepage.loop = true;
  audioHomepage.play();
});

//EVENTS:'CLICK' 
//To create transitions between different sections

//Button 'Start': section 'homepage' >> section 'info'
document.querySelector('.start-button').addEventListener('click',function () {
  //Transition
  document.querySelector('.homepage').style.display = 'none';
  document.querySelector('.info').style.display = 'flex';
  //Audio
  let audioClickStart = document.createElement("audio");
  audioClickStart.src = "audio/mixkit-fish-flapping-2457.wav";
  audioClickStart.play();
});

//Button 'Go !': section 'info' >> 'game-area canvas'
let playerName;
document.querySelector('.go-button').addEventListener('click',function () {
  //Store the playername get in the input
  playerName = document.querySelector('.playername-area').value;
  //Transition
  document.querySelector('.info').style.display = 'none';
  //Audio
  let audioClickGo = document.createElement("audio");
  audioClickGo.src = "audio/mixkit-fish-flapping-2457.wav";
  audioClickGo.play();
  //Start game area canvas
  myGameArea.start();
});

//Button 'Reset arrow': section 'game over' >> section 'homepage'
document.querySelector('.reset-button').addEventListener('click',function () {
  //To reloads the current URL, like the Refresh button in the browser
  document.location.reload();
});

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

    this.canvas.class =  document.querySelector('canvas').classList.add('game-area-canvas');
  },

	stop: function () {
    clearInterval(this.interval);
  },

	clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  //Remove the space this.canvas occupied in the body
  gameOver: function () {
    document.body.removeChild(this.canvas);
  },

  //Print the score during the game
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
      };
    }
    
    this.x = x;
    this.y = y;
    this.width = width;  
  }

  //Draw components
  update() {
    const ctx = myGameArea.context;

    if (this.image) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  //To move 'the Wooden raft' component
  moveLeft() {
    if (this.x > 0) this.x -= 30;
  }
  moveRight() {
    if (this.x < (myGameArea.canvas.width - this.width)) this.x += 30;
  }

  //To pick up the Ironparatroopers

  //Limits of 'the Wooden raft' component
  left() {
    return this.x + (this.width/12);
  }
  right() {
    return this.x + (this.width - (this.width/12));
  }
  top() {
    return this.y + (this.height/2);
  }
  bottom() {
    return this.y + this.height;
  }
 
  //Collision to pick up orangeParatroopers & brownParatroopers components
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

//The Wooden Raft (the player)
const woodenRaft = new Component('images/wooden-raft.png',(W/2 - W/8), H - W/12, W / 4, this.height);

//Bush reeds (design elements)
const bushReedsLeft = new Component('images/bushreeds-left.png', 0 - (W/17), H - W/4.5, W / 5, this.height);
const bushReedsRight = new Component('images/bushreeds-right.png', W - (W/6.5), H - W/4.5, W / 5, this.height);

//COMPONENTS with Random Positions
//CROCODILES (design elements)
const crocodile1 = new Component('images/crocodile-1.png', W / 7, H - (H/3), W/6, 10);
const crocodile2 = new Component('images/crocodile-2.png', W - 300, H - (H/3.5), W/5, 15);
const crocodile3 = new Component('images/crocodile-3.png', W / 3, H- 50, W/5, 50);

const crocodiles = [crocodile1, crocodile2, crocodile3];
let crocodile;

//To make the crocodile components appear at 3 random positions for a 3D movement effect
function random(arr) {
  var randomIndex = Math.trunc(Math.random() * arr.length);
  return arr[randomIndex];
}

//IRONPARATROOPERS
let myOrangeParatroopers = [];
let myBrownParatroopers = [];

//Control of the IronParatroopers' fall speed : accelerates each time the score reaches a new ten
const speed = 1; 
let level = 0; 
function nextLevel() {
  if (score >= 10) {
    level = Math.trunc(score / 10);
  } 
  return level;
}

//Random appearances & Fall effect  
const framesNumber = 800; 

function updateRandomElements() {
  //To change the crocodile’s position every 200 frames
  if (myGameArea.frames % 200 === 0) {
    crocodile = random(crocodiles);
  }
  crocodile.update();

  myGameArea.frames += 1;

  //To make new OrangeParatroopers appear every 400 frames
  if (myGameArea.frames % (framesNumber/2) === 0) {
    //from the top of the screen (this.y = 0) 
    //& from random positions according to the width of the screen (this.x = random position)
    var W = myGameArea.canvas.width;
    var minPosX = 0;
    var maxPosX = W - (W/10); 

    var orangePosX = Math.floor(Math.random() * (maxPosX - minPosX + 1) + minPosX);

    myOrangeParatroopers.push(new Component('images/orange-paratrooper.png', orangePosX, 0, W / 8 , this.height));
    
    //Audio
    let audioPlane = document.createElement("audio");
    audioPlane.src = "audio/mixkit-vibrating-wind-passing-by-2705.wav";
    audioPlane.play();
  }

  //Fall speed of OrangeParatroopers
  for (i = 0; i < myOrangeParatroopers.length; i++) {
    myOrangeParatroopers[i].y += (speed + level);
    myOrangeParatroopers[i].update();
  }

  //To make new BrownParatroopers appear every 800 frames
  if (myGameArea.frames % framesNumber === 0) { 
    var W = myGameArea.canvas.width;
    var minPosX = 0;
    var maxPosX = W - (W/10); 

    var brownPosX = Math.floor(Math.random() * (maxPosX - minPosX + 1) + minPosX);

    myBrownParatroopers.push(new Component('images/brown-paratrooper.png', brownPosX, 0, W / 8 , this.height));

    //Audio
    let audioHoleyCanopy = document.createElement("audio");
    audioHoleyCanopy.src = "audio/mixkit-cartoon-falling-whistle-395.wav";
    audioHoleyCanopy.play();
  }

  //Fall speed of BrownParatroopers (faster than the Oranges because the parachute canopy has holes!)
  for (i = 0; i < myBrownParatroopers.length; i++) {
    myBrownParatroopers[i].y += (speed + level)* 1.5;
    myBrownParatroopers[i].update();
  }  
}

//MOTIONS of the Wooden raft
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

//SAVED : Score increase for each Ironparatrooper picked up from the Wooden raft
function pickUp() {
  myOrangeParatroopers = myOrangeParatroopers.filter(function(el) {
    //if there is a collision between the Wooden raft and a array el (= paratrooper)
    if (woodenRaft.crashWith(el)) {
      score += 1;
      //Audio
      let audioVoice1 = document.createElement("audio");
      audioVoice1.src = "audio/mixkit-males-yes-victory-2012.wav";
      audioVoice1.play();   
      return false; //we don't keep el in myOrangeParatroopers array = it disappears from the game area
    } else {
      return true; //else we keep it
    } 
  });

  myBrownParatroopers = myBrownParatroopers.filter(function(el) {
    if (woodenRaft.crashWith(el)) {
      score += 1;
      //Audio
      let audioVoice2 = document.createElement("audio");
      audioVoice2.src = "audio/mixkit-fighting-man-voice-of-pain-2173.wav";
      audioVoice2.play();   
      return false; 
    } else {
      return true; 
    }  
  });
}

//GAME OVER : when a Ironparatrooper touches 'the water below the Wooden raft' (= bottom of game area)
let sunkParatroopers = [];

function checkGameover() {
  myOrangeParatroopers = myOrangeParatroopers.filter(function(el) {
    //if the bottom of el > the bottom of game area (= H)
    if (el.bottom() > H) {
      sunkParatroopers.push(el); //el is added to the 'sunkParatroopers' array
      return false; //we don't keep el in myOrangeParatroopers array = it disappears from the game area
    } else {
      return true; //else we keep it
    } 
  });

  myBrownParatroopers = myBrownParatroopers.filter(function(el) {
    if (el.bottom() > H) {
      sunkParatroopers.push(el);
      return false;
    } else {
      return true;
    } 
  });

  //if an Orange or Brown IronParatrooper is added to the sunkParatroopers aaray = Game Over!
  if (sunkParatroopers.length > 0) {
    //Audio
    let audioAngryCroco = document.createElement("audio");
    audioAngryCroco.src = "audio/mixkit-angry-monster-scream-1963.wav";
    audioAngryCroco.play();
    //Stop refresh canvas
    myGameArea.stop();
    //Remove the space it occupied in the body
    myGameArea.gameOver();
    //Show the section 'game-over'
    document.querySelector('.game-over').style.display = 'flex';
    document.querySelector('.player-name').textContent = `${playerName}`;
    //Print the final score 
    if (score < 10) {
      document.querySelector('.final-score').textContent = `0${score}`;
    } else {
      document.querySelector('.final-score').textContent = `${score}`;
    }
  }
};

//Animation
function updateGameArea() {
  //
  //every 16 milliseconds
  //
  myGameArea.clear();

  woodenRaft.update();

  pickUp();
  checkGameover();

  updateRandomElements();

  bushReedsLeft.update();
  bushReedsRight.update();

  myGameArea.printScore();

  nextLevel();
}
let robot, ghost;
let noteIndex = 0;
let notes = [
  261.63, 
  293.66, 
  329.63, 
  349.23, 
  392.0,
  440.0, 
  493.88, 
  523.25, 
  587.33, 
  659.25,
  698.46, 
  783.99, 
  880.0, 
  987.77, 
  1046.5,
  1174.66, 
  1318.51, 
  1396.91, 
  1567.98,
  1760.0, 
  1975.53, 
  2093.0
];
let osc;
let oscIsPlaying = false;
let setDistance = 999;
let robotAngry = false;
let robotHappy = false;
let robotEverAngry = false; 
let fade = 255;
let world;
let testMode = false; 
let testStartTime = 0; 
let testDuration = 6000; 
let mouseIsMoving = false; 
let lastMouseMoveTime = 0; 
let ghostVX = 0;
let ghostVY = 0;
let robotVX = 0;
let robotVY = 0;
let currentBG = 1; // 1=background1, 2=background2, 3=background3

function preload() {
  img1 = loadImage("background1.png");
  img2 = loadImage("background2.png");
  img3 = loadImage("background3.png");
  img4 = loadImage("background4.jpg");
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");

  osc = new p5.Oscillator("square");
  osc.freq(880);
  osc.amp(0);
  osc.start();

  ghost = new Ghost(width*3/4, height / 2);
  robot = new Robot(width/4, height / 2);
  world = new World();

  testMode = false;
  mouseIsMoving = false;
  lastMouseMoveTime = millis();
}

function draw() {
  background(25);

  if (mouseX !== pmouseX || mouseY !== pmouseY) {
    mouseIsMoving = true;
    lastMouseMoveTime = millis();
  } else {
    if (millis() - lastMouseMoveTime > 50) {
      mouseIsMoving = false;
    }
  }

  let distance = dist(ghost.x, ghost.y, robot.x, robot.y);
  setDistance = distance;
  world.update(distance);

  //constrain ghost in the right half
  if (testMode === false && currentBG === 1) {
    ghost.prevX = ghost.x;
    ghost.prevY = ghost.y;

    let targetX = constrain(mouseX, width / 2, width - 40);
    let targetY = constrain(mouseY, 40, height - 40);

    ghost.x += (targetX - ghost.x) * 0.18;
    ghost.y += (targetY - ghost.y) * 0.18;

    ghost.dx = ghost.x - ghost.prevX;
    ghost.dy = ghost.y - ghost.prevY;

    robot.x = width - ghost.x;
    robot.y = ghost.y;

    robot.x = constrain(robot.x, 40, width/2 - 40);
    robot.y = constrain(robot.y, 40, height - 40);
  }


  //BG1: angrymode and happymode
  if (testMode === false && currentBG === 1 && robot.y > height / 2 + 300 && robot.x > width / 2 - 400 && robot.x < width/2 - 100) {
    robotAngry = true;
    robotHappy = false;
    robotEverAngry = true; 
    osc.freq(1200);
    osc.amp(0.4, 0.1);
    setTimeout(() => {
      osc.amp(0, 0.5);
    }, 500);
  }else if (testMode === false && currentBG === 1 && robot.y > height / 2 - 200 && robot.y < height/2 + 100 && robot.x > width/2 - 400 && robot.x < width/2 - 100) {
    robotHappy = true;
    robotAngry = false;
    osc.freq(1200);
    osc.amp(0.4, 0.1);
    setTimeout(() => {
      osc.amp(0, 0.5);
    }, 500);
  } else if (testMode === false && currentBG === 1) {
    if (robot.y < height / 2 + 100 && robot.x < width / 2 - 100) {
      robotAngry = false;
      robotHappy = false;
    }
  }

  //切到BG2  
  if (testMode === false && mouseIsMoving === true && robotEverAngry === true && setDistance < 50 && currentBG === 1) {
    testMode = true;
    testStartTime = millis();
    robotAngry = true;
    fade = 255;
    currentBG = 2;

    ghost.x = width * 3/4;
    ghost.y = height / 2;
    robot.x = width / 4;
    robot.y = height / 2;
    ghostVX = random(-20, 20);
    ghostVY = random(-20, 20);
    robotVX = random(-20, 20);
    robotVY = random(-20, 20);

    if (abs(ghostVX) < 3) {
  if (random() < 0.5) {
    ghostVX = -3;
  } else {
    ghostVX = 3;
  }
}
    if (abs(ghostVY) < 3) {
  if (random() < 0.5) {
    ghostVY = -3;
  } else {
    ghostVY = 3;
  }
}
    if (abs(robotVX) < 3) {
  if (random() < 0.5) {
    robotVX = -3;
  } else {
    robotVX = 3;
  }
}

    if (abs(robotVY) < 3) {
  if (random() < 0.5) {
    robotVY = -3;
  } else {
    robotVY = 3;
  }
}

  }


  //在BG2中，如果长时间无操作，回到BG1
  if (testMode === true && currentBG === 2) {
    if (millis() - testStartTime > testDuration) {
      testMode = false;
      robotAngry = false;
      robotHappy = false;
      currentBG = 1;

      ghost.x = width * 3/4;
      ghost.y = height / 2;
      robot.x = width / 4;
      robot.y = height / 2;
      osc.amp(0, 0.5);
    }
  }

  //切到BG3
  if (testMode === true && currentBG === 2 && setDistance < 40 ) {
    testMode = false;
    robotAngry = false;
    currentBG = 3;
    ghost.x = width * 3/4;
    ghost.y = height / 2;
    robot.x = width / 4;
    robot.y = height / 2;
    ghostVX = 0;
    ghostVY = 0;
    robotVX = 0;
    robotVY = 0;
  }

  //在BG3中进行选择，回到BG1或BG4
  if (currentBG === 3) {
    tint(255, 255);
    image(img3, 0, 0, width, height);
  } else if (currentBG === 2) {
    tint(255, 255);
    image(img2, 0, 0, width, height);
  } else if (currentBG === 4) {
    tint(255,255);
    image(img4,0,0,width,height);
  } else {
    tint(255, fade);
    image(img1, 0, 0, width, height);
    tint(255, 255 - fade);
    image(img2, 0, 0, width, height);

    if (setDistance < 100 && robotEverAngry === true) {
      if (0 < fade && fade < 255) {
        fade--;
      }
    }
  }

  //在BG2中，相互碰撞
  if (testMode === true && currentBG === 2) {
    if (mouseIsMoving === false) {
      ghost.x += ghostVX;
      ghost.y += ghostVY;
      robot.x += robotVX;
      robot.y += robotVY;
    } else {
      let targetX = mouseX;
      let targetY = mouseY;

      ghost.x += (targetX - ghost.x) * 0.03;
      ghost.y += (targetY - ghost.y) * 0.03;

      robot.x += (targetX - robot.x) * 0.03;
      robot.y += (targetY - robot.y) * 0.03;
    }
    //防止浮动时，碰到border
    if (ghost.x < 40 || ghost.x > width - 40) {
      ghostVX *= -1;
    }
    if (ghost.y < 40 || ghost.y > height - 40){
      ghostVY *= -1;
    }
    if (robot.x < 40 || robot.x > width - 40) {
      robotVX *= -1;
    } 
    if (robot.y < 40 || robot.y > height - 40) {
      robotVY *= -1;
    }

    let d = dist(ghost.x, ghost.y, robot.x, robot.y);
    if (d < 120 && mouseIsMoving === false) {
      let tempVX = ghostVX;
      let tempVY = ghostVY;
      ghostVX = -robotVX;
      ghostVY = -robotVY;
      robotVX = -tempVX;
      robotVY = -tempVY;
    }
  } else if (testMode === false && currentBG === 1) {
    let floatOffset = sin(frameCount * 0.05) * 3;
    ghost.y += floatOffset;
    robot.y += floatOffset;
    ghost.y = constrain(ghost.y, 40, height - 40);
    robot.y = constrain(robot.y, 40, height - 40);
  } else if (currentBG === 3) {
    // BG3
  }

  
  distance = dist(ghost.x, ghost.y, robot.x, robot.y);
  setDistance = distance;
  world.update(distance);

  ghost.draw(world);
  robot.draw(world);

  //声音控制
  if (currentBG === 1) {
  let freqValue = map(distance, 0, 400, 800, 200, true);
  let ampValue = map(distance, 0, 400, 1.0, 0.0, true);
  if (distance > 10) {
    osc.freq(notes[noteIndex], 0.1);
    osc.amp(ampValue, 0.1);
  } else {
    osc.freq(0, 0.1);
  }
} else {
  osc.amp(0, 0.1);
}

// if (current BG === 4){

// }
}


class Ghost {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.dx = 0;
    this.dy = 0;
    this.normalColor = color(255, 255,255,160);
    this.alertColor = color(199,166,120,200);
  }

 

  draw(world) {
    push();
    translate(this.x, this.y);
    noStroke();

    if (world.isformed === true) {
      fill(this.alertColor);
    } else {
      fill(this.normalColor);
    }
    ellipse(0, 0, 210, 270);

    fill(0);
    ellipse(-45, -15, 36, 36);
    ellipse(45, -15, 36, 36);
    pop();
  }
}

class Robot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.normalColor = color(180);
    this.alertBody = color(92, 114, 125);
    this.float = random(2000);
  }

  draw(world) {
    push();
    translate(this.x, this.y);
    rectMode(CENTER);
    noStroke();

    if (robotAngry === true) {
      fill(255, 60, 60);
    }
    else if (setDistance < 100) {
      fill(92, 114, 125);
    } else {
      fill(180);
    }

    rect(0, 0, 180, 210, 30);
    fill(150);
    ellipse(-45, -30, 45, 45);
    ellipse(45, -30, 45, 45);

    if (robotAngry === true) {
      noStroke();
      fill(255, 140, 0, 180);
      ellipse(0, 10, 220, 280);
      fill(255, 220, 0, 200);
      ellipse(0, 20, 170, 240);
      fill(255, 255, 255, 200);
      ellipse(0, 30, 120, 160);
    }
    noStroke();
    rect(0, 0, 180, 210, 30);

    fill(0);
    ellipse(-45, -30, 45, 45);
    ellipse(45, -30, 45, 45);

    if (robotAngry === true) {
      stroke(0);
      strokeWeight(5);
      line(-65, -60, -25, -50);
      line(65, -60, 25, -50);

      noStroke();
      fill(255, 255, 255);
      ellipse(-55, -35, 10, 10);
      ellipse(35, -35, 10, 10);

      stroke(0);
      strokeWeight(4);
      noFill();
      line(-20, 35, 20, 35);
      arc(0, 40, 50, 20, 0, PI);

      fill(255);
      noStroke();
      triangle(-15, 35, -5, 35, -10, 45);
      triangle(5, 35, 15, 35, 10, 45);
    }

      if (robotHappy === true) {
      fill(137, 207, 140);
      stroke(0);
      strokeWeight(4);
      rect(0, 0, 180, 210, 30);
      fill(0);
      ellipse(-45, -30, 45, 45);
      ellipse(45, -30, 45, 45);
      fill(255);
      ellipse(-52, -35, 10, 10);
      ellipse(38, -35, 10, 10);
      stroke(0);
      strokeWeight(5);
      line(-65, -55, -30, -50);
      line(65, -55, 30, -50);
      noFill();
      stroke(0);
      strokeWeight(5);
      arc(0, 30, 80, 50, 0, PI);
      noStroke();


    }

    pop();
  }

}


class World{
  constructor(){
    this.isformed = false;
  }
  update(){
    if (setDistance < 20){
      this.isformed = true;
    } else {
      this.isformed = false;
    }
  }
}

function mousePressed() {
  if (currentBG === 3) {
    ghost.x = width * 3/4;
    ghost.y = height / 2;
    robot.x = width / 4;
    robot.y = height / 2;

    if (mouseX < width / 2) {
      currentBG = 1;
      testMode = false;
      fade = 255;
    } else {
      currentBG = 4;
      testMode = false;
    }
    return;
  }

  if (oscIsPlaying === false) {
    osc.start();
    osc.amp(0.4, 0.2);
    oscIsPlaying = true;
  }

  noteIndex++;
  if (noteIndex >= notes.length) noteIndex = 0;

  if (oscIsPlaying === true) {
    osc.freq(notes[noteIndex], 0.1);
  }
}

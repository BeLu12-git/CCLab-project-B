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
let testDuration = 40000; 
let mouseIsMoving = false; 
let lastMouseMoveTime = 0; 
let ghostVX = 0;
let ghostVY = 0;
let robotVX = 0;
let robotVY = 0;
let currentBG = 1;
let showTextSound = false;
let textStartTime = 0;
let DISTANCE_THRESHOLD = 5;
let leftColor;
let rightColor;
let finalTint = 0.5;
let tintColor;
let transition12 = false;
let transition12StartTime = 0;
let transition12Duration = 10000; 
let transition23 = false;   
let transition23StartTime = 0;
let transition23Duration = 10000;
let transition34 = false;
let transition34StartTime = 0;
let transition34Duration = 6000; 
let sideIntensity = 0;
let experimentCount = 0; 
let boats =[];
let oppenheimer;
let meetingkitty;
let thebattleinthesnow;
let quantummechanics;
let fusion;
let theimperialmarch;
let angry;
let happy;
let robotBg;
let angryPlayed = false;
let happyPlayed = false;
let musicPlaying = false;
let img1, img2, img3, img4;

function preload() {
  img1 = loadImage("background1.png");
  img2 = loadImage("background2.png");
  img3 = loadImage("background3.png");
  img4 = loadImage("background4.png");
  oppenheimer = loadSound("oppenheimer.mp3");
  meetingkitty = loadSound("meetingkitty.mp3");
  thebattleinthesnow = loadSound("thebattleinthesnow.mp3");
  quantummechanics = loadSound("quantummechanics.mp3");
  fusion = loadSound("fusion.mp3");
  theimperialmarch = loadSound("theimperialmarch.mp3");
  angry = loadSound("angry.wav");
  happy = loadSound("happy.wav");
  robotBg = loadSound("robot.flac");
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");
  
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(255);
  noStroke();

  osc = new p5.Oscillator("square");
  osc.freq(880);
  osc.amp(0);
  osc.start();

  ghost = new Ghost(width * 0.75, height * 0.5);
  robot = new Robot(width * 0.25, height * 0.5);
  world = new World();
  boats = [
    new Boat(width * 0.2, height * 0.75, 1.0, 0),
    new Boat(width * 0.5, height * 0.85, 1.5, 1),
    new Boat(width * 0.8, height * 0.9, 0.8, 2)
  ];
  testMode = false;
  mouseIsMoving = false;
  lastMouseMoveTime = millis();

  leftColor = color(255,0,0);
  rightColor = color(0,0,255);
  finalTint = 0.5;
  tintColor = lerpColor(leftColor, rightColor, finalTint); 

 
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

  //ghost和robot呈镜像；ghost永远在画布右端
  if (!testMode && currentBG === 1) {
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

  //angry & happy mode
  if (!testMode && currentBG === 1 
      && ghost.y > height * 0.2 && ghost.y < height * 0.3 
      && ghost.x > width * 0.7 && ghost.x < width * 0.8) {
    robotAngry = true;
    robotHappy = false;
    robotEverAngry = true;
    if (!angry.isPlaying()) {
      angryPlayed = true;
      happyPlayed = false;
      if (happy.isPlaying()) happy.stop();
      angry.play();
    }
  } else if (!testMode && currentBG === 1 
      && ghost.y > height * 0.35 && ghost.y < height * 0.45 
      && ghost.x > width * 0.7 && ghost.x < width * 0.8) {
    robotHappy = true;
    robotAngry = false;
    if (!happyPlayed){ 
      happyPlayed = true;
      angryPlayed = false;
      if (angry.isPlaying()){
         angry.stop();
      }
      if (!happy.isPlaying()) {
        happy.play();
      }
    }
  } else if (!testMode && currentBG === 1 
      && ghost.y > height * 0.45 && ghost.y < height * 0.65 
      && ghost.x > width * 0.7 && ghost.x < width * 0.8 ) {
    robotHappy = false;
    showTextSound = true;
    textStartTime = millis();
  } else if (!testMode && currentBG === 1) {
    if (robot.y < height / 2 + 100 && robot.x < width / 2 - 100) {
      robotAngry = false;
      robotHappy = false;
    }
  }

  //BG1 transition to BG2
  if (transition12) {
    let time12 = millis() - transition12StartTime;
    let t = constrain(time12 / transition12Duration, 0, 1);
    image(img1, 0, 0, width, height);
  if (t <= 0.5) {
      let t1 = map(t, 0, 0.5, 0, 1, true);
      let darkMode = map(t1, 0, 1, 0, 200, true);
      fill(0, darkMode);
      noStroke();
      rect(0, 0, width, height);

  let text1 = map(t1, 0, 1, 0, 255, true);
  fill(255, text1);
  textAlign(CENTER, CENTER);
  textSize(40);

  let counts = experimentCount + 1;  
  let tookWord;
  if (counts === 1)      tookWord = "one";
  else if (counts === 2) tookWord = "two";
  else if (counts === 3) tookWord = "three";
  else                tookWord = String(counts);

  text(
          "500 years ago...\nRobot Mind Experiment took " + 
          tookWord + "...\nBut failed....",
    width / 2,
    height / 2
    );

  } else {
    let t2 = map(t, 0.5, 1, 0, 1, true);

    let text1 = map(t2, 0, 1, 255, 0, true);
    fill(255, text1);
    textAlign(CENTER, CENTER);
    textSize(40);

  let counts = experimentCount + 1;  
  let tookWord;
  if (counts === 1)      tookWord = "one";
  else if (counts === 2) tookWord = "two";
  else if (counts === 3) tookWord = "three";
  else                tookWord = String(counts);

text(
  "500 years ago...\nRobot Mind Experiment took " + tookWord + "...\nBut failed....",
  width / 2,
  height / 2
);


  let bg2Alpha = map(t2, 0, 1, 0, 255, true);
  tint(255, bg2Alpha);
  image(img2, 0, 0, width, height);
  noTint();
  }

  if (t >= 1) {
    transition12 = false;
    currentBG = 2;
    experimentCount += 1;

    fadeOutSound(quantummechanics, 1000, () => {
      if (!fusion.isPlaying()) {
        fusion.setVolume(1.0);
        fusion.play();
        }
      });

    ghost.x = width * 3/4;
    ghost.y = height / 2;
    robot.x = width / 4;
    robot.y = height / 2;
    ghostVX = random(-5, 5);
    ghostVY = random(-5, 5);
    robotVX = random(-5, 5);
    robotVY = random(-5, 5);
    }
    return;
  }

 //BG2 back to BG1
  if (testMode && currentBG === 2) {
    if (millis() - testStartTime > testDuration) {
      testMode = false;
      robotAngry = false;
      robotHappy = false;
      currentBG = 1;
      fadeOutSound(fusion, 1000);

      ghost.x = width * 3/4;
      ghost.y = height / 2;
      robot.x = width / 4;
      robot.y = height / 2;
    }
  }

 //BG2 transition to BG3
  if (testMode && currentBG === 2 && setDistance < 40 && transition23 === false) {
    testMode = false;              
    robotAngry = false;
    transition23 = true;              
    transition23StartTime = millis();
    fadeOutSound(fusion, 1000);
  }


  if (transition23) {
    let time23 = millis() - transition23StartTime;
    let t = constrain(time23 / transition23Duration, 0, 1);
    image(img2, 0, 0, width, height);

    //fire
    let firePhase = constrain(map(t, 0, 0.5, 0, 1), 0, 1);
    let fireHeight = map(firePhase, 0, 1, 0, height * 1.2, true);  
    noStroke();
    for (let y = height; y > height - fireHeight; y -= 10) {
      let yy = map(y, height, height - fireHeight, 0, 1, true);
      let r = lerp(255, 180, yy);
      let g = lerp(180, 60, yy);
      let b = lerp(0,   20, yy);
      let a = lerp(150, 230, yy);     
      fill(r, g, b, a);
      rect(0, y, width, 12);
    }
    if (t > 0.5) {
      let t2 = map(t, 0.5, 1, 0, 1, true);

      let darkMode = map(t2, 0, 1, 0, 200, true);
      fill(0, darkMode);
      noStroke();
      rect(0, 0, width, height);

      let text1;
      if (t2 < 0.5) {
        text1 = map(t2, 0, 0.5, 0, 255, true);
      } else {
        text1 = map(t2, 0.5, 1, 255, 0, true);
      }

    fill(255, text1);
    textAlign(CENTER, CENTER);
    textSize(40);
    text(
        "2225AD\nYou were invited to the Robot Conference...\nTo decide whether or not implement the human mind transplantation experiment....",
        width / 2,
        height / 2
      );

      let bg3Alpha = map(t2, 0, 1, 0, 255, true);
      tint(255, bg3Alpha);
      image(img3, 0, 0, width, height);
      noTint();
    }

    if (t >= 1) {
      transition23 = false;
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
    return;
  }

  // BG3 transition to BG4
  if (transition34) {
    let time34 = millis() - transition34StartTime;
    let t = constrain(time34 / transition34Duration, 0, 1);
    image(img3, 0, 0, width, height);

    if (t <= 0.5) {
      let t1 = map(t, 0, 0.5, 0, 1, true);

      let darkMode = map(t1, 0, 1, 0, 200, true);
      fill(0, darkMode);
      noStroke();
      rect(0, 0, width, height);
      let text1 = map(t1, 0, 1, 0, 255, true);
      fill(255, text1);
      textAlign(CENTER, CENTER);
      textSize(40);
      text(
        "You decided not to take the experiment.\n100 years later, human extincted...",
        width / 2,
        height / 2
      );
    } else {
      let t2 = map(t, 0.5, 1, 0, 1, true);
      let text1 = map(t2, 0, 1, 255, 0, true);
      fill(255, text1);
      textAlign(CENTER, CENTER);
      textSize(40);
      text(
        "You decided not to take the experiment.\n100 years later, human extincted...",
        width / 2,
        height / 2
      );

      let bg4Alpha = map(t2, 0, 1, 0, 255, true);
      tint(255, bg4Alpha);
      image(img4, 0, 0, width, height);
      noTint();
    }

    if (t >= 1) {
      transition34 = false;
      currentBG = 4;
    }
    return;
  }

  //BG2,BG3,BG4
  if (currentBG === 3) {
    tint(tintColor);
    image(img3, 0, 0, width, height);
    let steps = 80;
    let maxAlpha = 200;  

  if (mouseX < width / 2) {
    for (let i = 0; i < steps; i++) {
      let x = width / 2 + (i / steps) * (width / 2);
      let wStep = (width / 2) / steps;
      let a = map(i, 0, steps - 1, 0, maxAlpha, true);
      fill(0, 0, 0, a);
      rect(x, 0, wStep + 1, height);
    }
  } else {
    for (let i = 0; i < steps; i++) {
      let x = (i / steps) * (width / 2);
      let wStep = (width / 2) / steps;
      let a = map(i, 0, steps - 1, 0, maxAlpha, true);
      fill(0, 0, 0, a);
      rect(x, 0, wStep + 1, height);
    }
  }

  } else if (currentBG === 2) {
    image(img2, 0, 0, width, height);
  } else if (currentBG === 4) {
    image(img4,0,0,width,height);
    noTint();
    for (let i = 0; i < boats.length; i++) {
      boats[i].update();
      boats[i].draw();
    }
    if (robotBg && !robotBg.isPlaying()) {
      robotBg.setVolume(0.15); 
      robotBg.loop();
    }
  } else if (currentBG === 1) {
    image(img1, 0, 0, width, height);
  }

  //BG3 play music
  if (currentBG === 3) {
    let angle = atan2(mouseY - pmouseY, mouseX - pmouseX);
    let dx = mouseX - pmouseX;
    let moveDist = dist(mouseX, mouseY, pmouseX, pmouseY);
    let base = 0;
    sideIntensity *= 0.9;

    if (moveDist > DISTANCE_THRESHOLD) {
      let t = map(abs(dx), DISTANCE_THRESHOLD, 50, 0, 1, true);

    if (dx > 0) {
      sideIntensity = constrain(base + t, -1, 1);
    } else if (dx < 0) {
      sideIntensity = constrain(base - t, -1, 1);
    }
    }
    tintColor = lerpColor(leftColor, rightColor, finalTint);

   
  }

  // BG2 testmode
  if (testMode && currentBG === 2) {
    if (!mouseIsMoving) {
      ghost.x += ghostVX;
      ghost.y += ghostVY;
      robot.x += robotVX;
      robot.y += robotVY;
    } else {
      let targetX = mouseX;
      let targetY = mouseY;
      ghost.x += (targetX - ghost.x) * 0.005;
      ghost.y += (targetY - ghost.y) * 0.005;
      robot.x += (targetX - robot.x) * 0.005;
      robot.y += (targetY - robot.y) * 0.005;
    }

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
    if (d < 120 && !mouseIsMoving) {
      let tempVX = ghostVX;
      let tempVY = ghostVY;
      ghostVX = -robotVX;
      ghostVY = -robotVY;
      robotVX = -tempVX;
      robotVY = -tempVY;
    }

    //BG1
  } else if (!testMode && currentBG === 1) {
    let floatOffset = sin(frameCount * 0.05) * 3;
    ghost.y += floatOffset;
    robot.y += floatOffset;
    ghost.y = constrain(ghost.y, 40, height - 40);
    robot.y = constrain(robot.y, 40, height - 40);
  }

  distance = dist(ghost.x, ghost.y, robot.x, robot.y);
  setDistance = distance;
  world.update(distance);

  if (currentBG === 1 || currentBG === 2) {
    ghost.draw(world);
    robot.draw(world);
  }

  if (currentBG === 1 && distance < 200) {
    drawMusicNotes();
  }

  if (currentBG === 1) {
    fill(255);
    textAlign(LEFT, TOP);
    textSize(32);
    text("3025AD", 20, 20);
  }

  if (showTextSound) {
    let textDuration = millis() - textStartTime;
    if (textDuration < 3000) {
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(40);
      text("Time... Time... Time...", width / 2, height / 2);
    } else {
      showTextSound = false;
    }
  }
}


class Ghost {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.dx = 0;
    this.dy = 0;
    this.normalColor = color(255, 255, 255, 200);
    this.alertColor = color(199, 166, 120, 230);
  }

  draw(world) {
    push();
    translate(this.x, this.y);
    noStroke();

    if (world.isformed) {
      fill(this.alertColor);
    } else {
      fill(this.normalColor);
    }

    let w = 220;
    let h = 260;
    let halfW = w / 2;
    let topJoinY = -h * 0.15;   
    let midY = h * 0.10;        
    let waveTopY = h * 0.28;    
    let waveBottomY = h * 0.40; 

    arc(0, topJoinY, 220, 260, PI, 0, OPEN);

    beginShape();
    curveVertex(-halfW, topJoinY);
    curveVertex(-halfW, topJoinY);
    curveVertex(-halfW, midY);
    curveVertex(-halfW * 0.6, waveBottomY);
    curveVertex(-halfW * 0.2, waveTopY);
    curveVertex(0, waveBottomY);
    curveVertex(halfW * 0.2, waveTopY);
    curveVertex(halfW * 0.6, waveBottomY);
    curveVertex(halfW, waveTopY);
    curveVertex(halfW, midY);
    curveVertex(halfW, topJoinY);
    curveVertex(halfW, topJoinY);
    endShape(CLOSE);

    fill(0, 200);
    let eyeOffsetX = 40;
    let eyeY = topJoinY + 30;
    ellipse(-eyeOffsetX, eyeY, 32, 42);
    ellipse(eyeOffsetX, eyeY, 32, 42);

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

    if (robotAngry) {
      fill(255, 120, 120);
    } else if (setDistance < 100) {
      fill(this.alertBody);
    } else {
      fill(this.normalColor);
    }

    rect(0, 0, 180, 210, 30);

    fill(150);
    ellipse(-75, -20, 25, 60);
    ellipse(75, -20, 25, 60);

    fill(220);
    rect(0, -40, 130, 50, 15);

    fill(0);
    ellipse(-35, -40, 30, 30);
    ellipse(35, -40, 30, 30);

    if (robotAngry) {
      fill(255, 50, 50);
      ellipse(-35, -40, 16, 16);
      ellipse(35, -40, 16, 16);
      stroke(0);
      strokeWeight(6);
      line(-55, -55, -20, -45); 
      line(55, -55, 20, -45);   
      noStroke();
      fill(255, 150, 0, 200);
      ellipse(0, -120, 60, 80);
      fill(255, 220, 0, 220);
      ellipse(0, -115, 40, 60);
    } else if (robotHappy) {
      fill(137, 207, 140);
      stroke(0);
      strokeWeight(4);
      rect(0, 0, 180, 210, 30);
      fill(0);
      ellipse(-35, -40, 30, 30);
      ellipse(35, -40, 30, 30);
      fill(255);
      ellipse(-40, -45, 8, 8);
      ellipse(30, -45, 8, 8);
      stroke(0);
      strokeWeight(4);
      line(-50, -55, -30, -50);
      line(50, -55, 30, -50);
      noFill();
      stroke(0);
      strokeWeight(5);
      arc(0, 15, 80, 50, 0, PI);
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
  //BG4 
  if (currentBG === 3 && !transition34) {
    ghost.x = width * 3/4;
    ghost.y = height / 2;
    robot.x = width / 4;
    robot.y = height / 2;

    if (mouseX < width / 2) {
      currentBG = 1;
      testMode = false;
      robotAngry = false;
      robotHappy = false;
      if (thebattleinthesnow.isPlaying()) thebattleinthesnow.stop();
      if (oppenheimer.isPlaying()) oppenheimer.stop();
      if (fusion.isPlaying()) fusion.stop();
      return;
    }

    transition34 = true;
    transition34StartTime = millis();
    fadeOutSound(thebattleinthesnow, 800);
    fadeOutSound(oppenheimer, 800, () => {
      if (!meetingkitty.isPlaying()) {
        meetingkitty.setVolume(1.0);
        meetingkitty.play();
      }
    });
    return;
  }

  if (currentBG === 1 &&
      mouseX < width * 0.40 && mouseX > width * 0.3 &&
      mouseY < height * 0.7 && mouseY > height * 0.6 &&
      !testMode && robotEverAngry) {

    testMode = true;
    testStartTime = millis();
    robotAngry = true;
    transition12 = true;
    transition12StartTime = millis();
    return;
  }

  if (currentBG === 1 && mouseOnMusicNotes()) {
    if (!musicPlaying) {
      quantummechanics.play();
      musicPlaying = true;
    } else {
      quantummechanics.pause();
      musicPlaying = false;
    }
    return;
  }
}

class Boat {
  constructor(x, y, vx, index) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.index = index;
  }

  update() {
    this.x += this.vx;
    if (this.x > width + 80) {
      this.x = -80;
    }
    this.currentY = this.y + sin(frameCount * 0.02) * 5;
  }

  draw() {
    let markColors = [
      color(0, 200, 255),
      color(255, 120, 0),
      color(120, 255, 120)
    ];
    let c = markColors[this.index % markColors.length];

    push();
    translate(this.x, this.currentY);
    noStroke();

    fill(190);
    ellipse(0, 0, 90, 26);

    fill(210);
    rect(0, -8, 40, 14, 6);

    fill(230, 230, 230, 180);
    ellipse(-20, -2, 16, 6);
    ellipse(25, 2, 18, 6);

    fill(40);
    ellipse(-10, -4, 6, 6);
    ellipse(0, -4, 6, 6);
    ellipse(10, -4, 6, 6);

    fill(150);
    rect(-35, 3, 10, 10, 3);
    rect(35, 3, 10, 10, 3);

    fill(c);
    ellipse(0, 5, 14, 14);
    fill(255, 255, 255, 180);
    ellipse(0, 5, 6, 6);

    pop();
  }
}

function drawMusicNotes() {
  push();
  translate(width / 2, height / 2);
  noFill();
  stroke(255);
  strokeWeight(4);

  line(-20, 20, -20, -40);
  fill(255);
  ellipse(-10, 25, 20, 16);

  noFill();
  stroke(255);
  strokeWeight(4);
  line(20, 0, 20, -50);
  fill(255);
  ellipse(30, 5, 18, 14);

  noFill();
  stroke(255);
  strokeWeight(3);
  bezier(-20, -40, -5, -60, 5, -55, 20, -50);
  pop();
}

function mouseOnMusicNotes() {
  let cx = width / 2;
  let cy = height / 2;
  let w = 120;
  let h = 120;
  return (mouseX > cx - w/2 && mouseX < cx + w/2 &&
          mouseY > cy - h/2 && mouseY < cy + h/2);
}

function fadeOutSound(snd, duration, onDone) {
  if (!snd || !snd.isPlaying()) {
    if (onDone) onDone();
    return;
  }

  let startTime = millis();
  let startVol = snd.getVolume ? snd.getVolume() : 1.0;

  function step() {
    let t = (millis() - startTime) / duration;
    if (t >= 1) {
      snd.setVolume(0);
      snd.stop();
      if (onDone) onDone();
    } else {
      let v = startVol * (1 - t);
      snd.setVolume(v);
      requestAnimationFrame(step);
    }
  }

  step();
}

function getTookPhrase(n) {
  let words = [];
  for (let i = 1; i <= n; i++) {
    let w;
    if (i === 1)      w = "one";
    else if (i === 2) w = "two";
    else if (i === 3) w = "three";
    else if (i === 4) w = "four";
    else if (i === 5) w = "five";
    else if (i === 6) w = "six";
    else if (i === 7) w = "seven";
    else if (i === 8) w = "eight";
    else if (i === 9) w = "nine";
    else              w = String(i); // 超过9就直接用数字，理论上可以到无穷大
    words.push("took " + w);
  }
  return words.join(" ");
}

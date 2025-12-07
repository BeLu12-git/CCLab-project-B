//修改字体
//添加声音：
//BG2: experiment
//BG3: battle


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
let showTextBG1 = false;
let showTextBG2 = false;
let showTextBG3 = false;
let textStartTime = 0;
let DISTANCE_THRESHOLD = 5;
let leftColor;
let rightColor;
let finalTint = 0.5;
let tintColor;
let transition12 = false;
let transition12StartTime = 0;
let transition12Duration = 6000;
let transition23 = false;   
let transition23StartTime = 0;
let transition23Duration = 12000;   
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
let angryPlayed = false;
let happyPlayed = false;
let musicPlaying = false;
let showTimeText = false;
let timeTextStart = 0;

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

  ghost = new Ghost(width -200, height-400);
  robot = new Robot(200, height-400);
  world = new World();

  testMode = false;
  mouseIsMoving = false;
  lastMouseMoveTime = millis();

  leftColor = color(255,0,0);
  rightColor = color(0,0,255);
  finalTint = 0.5;
  tintColor = lerpColor(leftColor, rightColor, finalTint); 


  boats = [
    new Boat(width * 0.2, height * 0.75, 1.0, 0),
    new Boat(width * 0.5, height * 0.85, 1.5, 1),
    new Boat(width * 0.8, height * 0.9, 0.8, 2)
  ];

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


  //BG1: angrymode and happymode and sound reminder
  if (testMode === false && currentBG === 1 
    && ghost.y > height * 0.2 &&ghost.y < height * 0.3 
    && ghost.x > width *0.7 && ghost.x < width * 0.8) {
    robotAngry = true;
    robotHappy = false;
    robotEverAngry = true;
    if(angry.isPlaying() === false ){
      angryPlayed = true;
      happyPlayed = false;
      if (happy.isPlaying()){
        happy.stop();
      }
      if (angry.isPlaying() === false ){
        angry.play();
      }
    }
  }else if (testMode === false && currentBG === 1 
    && ghost.y > height * 0.35 && ghost.y < height * 0.45 
    && ghost.x > width * 0.7 && ghost.x < width * 0.8) {
    robotHappy = true;
    robotAngry = false;
    if (happyPlayed === false){ 
    happyPlayed = true;
    angryPlayed = false;           // 退出 angry 状态
    if (angry.isPlaying()){
      angry.stop();
    } 
    if (happy.isPlaying() === false){
      happy.play();
    } 
  }
  } else if(testMode === false && currentBG === 1 
    && ghost.y > height * 0.45 && ghost.y < height * 0.65 
    && ghost.x > width * 0.7 && ghost.x < width * 0.8 ) {
    robotHappy = false;
    robotHappy = false;
    showTextSound = true;
    textStartTime = millis();
  } else if (testMode === false && currentBG === 1) {
    if (robot.y < height / 2 + 100 && robot.x < width / 2 - 100) {
      robotAngry = false;
      robotHappy = false;
    }
  }


  

  
//BG1 transition to BG2
  if (transition12 === true) {
     let t = (millis() - transition12StartTime) / transition12Duration;
  t = constrain(t, 0, 1);
  image(img1, 0, 0, width, height);
  let darkMode = map(t, 0, 0.4, 0, 200, true);  // 前 40% 时间变暗
  fill(0, darkMode);
  noStroke();
  rect(0, 0, width, height);
  let textTransition = 0;
  if (t > 0.2 && t < 0.8) {
    let tt = map(t, 0.2, 0.8, 0, 1, true); // 0~1
    if (tt < 0.5) {
      textTransition = map(tt, 0, 0.5, 0, 255, true);
    } else {
      textTransition = map(tt, 0.5, 1, 255, 0, true);
    }
  }

  if (textTransition > 0) {
    fill(255, textTransition);
    textAlign(CENTER, CENTER);
    textSize(40);
  let nth = experimentCount + 1;  
  let tookWord;
  if (nth === 1) {
    tookWord = "one";
  } else if (nth === 2) {
    tookWord = "two";
  } else if (nth === 3) {
    tookWord = "three";
  } else {
    tookWord = String(nth);   
  }

  text(
    "500 years ago...\nRobot Mind Experiment took " + tookWord + "...\nBut failed....",
    width / 2,
    height / 2
  );
  }

 
  let bg2Alpha = map(t, 0.5, 1.0, 0, 255, true);
  if (bg2Alpha > 0) {
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

  //在BG2中，如果长时间无操作，回到BG1
  if (testMode === true && currentBG === 2) {
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
if (testMode === true && currentBG === 2 && setDistance < 40 && !transition23) {
  testMode = false;              
  robotAngry = false;
  transition23 = true;              
  transition23StartTime = millis();

  fadeOutSound(fusion, 1000);
}

if (transition23 === true) {
  let t = (millis() - transition23StartTime) / transition23Duration;
  t = constrain(t, 0, 1);
  image(img2, 0, 0, width, height);
  let fireHeight = map(t, 0, 0.4, 0, height * 1.2, true);  
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

  let darkMode23 = map(t, 0.3, 0.7, 0, 200, true);
  fill(0, darkMode23);
  rect(0, 0, width, height);

  let textTransition23 = 0;
  if (t > 0.1 && t < 0.9) {
    let tt = map(t, 0.2, 0.8, 0, 1, true);
    if (tt < 0.5) {
      textTransition23 = map(tt, 0, 0.5, 0, 255, true);     // 先淡入
    } else {
      textTransition23 = map(tt, 0.5, 1, 255, 0, true);     // 再淡出
    }
  }

  if (textTransition23 > 0) {
    fill(255, textTransition23);
    textAlign(CENTER, CENTER);
    textSize(40);
    text(
      "2225AD\nYou were invited to the Robot Conference...\nTo decide whether or not implement the human mind transplantation experiment....",
      width / 2,
      height / 2
    );
  }

  // 5. 后半段 BG3 渐渐显现
  let bg3Alpha = map(t, 0.5, 1.0, 0, 255, true);
  if (bg3Alpha > 0) {
    tint(255, bg3Alpha);
    image(img3, 0, 0, width, height);
    noTint();
  }

  // 6. 转场结束：正式切到 BG3 并重置状态
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


  //在BG3中进行进行渐变效果，回到BG1或BG4; currentBG对应
  if (currentBG === 3) {
    tint(tintColor);
    image(img3, 0, 0, width, height);
    noTint();
     if (sideIntensity !== 0) {
    let steps = 80;  
    if (sideIntensity > 0) {
      for (let i = 0; i < steps; i++) {
        let x = width / 2 + (i / steps) * (width / 2);
        let wStep = (width / 2) / steps;
        let a = map(i, 0, steps - 1, 0, 200 * sideIntensity, true);
        fill(255, 255, 255, a);
        noStroke();
        rect(x, 0, wStep + 1, height);
      }
    } else {
      for (let i = 0; i < steps; i++) {
        let x = (i / steps) * (width / 2);
        let wStep = (width / 2) / steps;
        let a = map(steps - 1 - i, 0, steps - 1, 0, 200 * -sideIntensity, true);
        fill(0, 0, 0, a);
        noStroke();
        rect(x, 0, wStep + 1, height);
      }
    }
  }
  } else if (currentBG === 2) {
    tint(255, 255);
    image(img2, 0, 0, width, height);
  } else if (currentBG === 4) {
    tint(255,255);
    image(img4,0,0,width,height);
    noTint();
    for (let i = 0; i < boats.length; i++) {
    boats[i].update();
    boats[i].draw();
  }
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

  //BG3: tint changed based on mouse movement direction in BG3
  if(currentBG === 3){
    let angle = atan2(mouseY - pmouseY, mouseX - pmouseX);
    let distance = dist(mouseX, mouseY, pmouseX, pmouseY);
    let baseTint = 0.5;
    sideIntensity *= 0.9;

    if (distance > DISTANCE_THRESHOLD) {
      let t = map(distance, DISTANCE_THRESHOLD, 50, 0, 1, true);
      if (angle > radians(-45) && angle < radians(45)) {
      finalTint = constrain(baseTint + t * 0.5, 0, 1);
      sideIntensity = constrain(sideIntensity + 0.1 * t, -1, 1);
    }
      else if (angle > radians(135) || angle < radians(-135)) {
       finalTint = constrain(baseTint - t * 0.5, 0, 1);
      sideIntensity = constrain(sideIntensity - 0.1 * t, -1, 1);
    }
  } 
  tintColor = lerpColor(leftColor, rightColor, finalTint);

 if (currentBG === 3) {
  if (mouseX < width / 2) {
    // 鼠标在左半屏：淡出 oppenheimer，开始 battle
    if (!thebattleinthesnow.isPlaying()) {
      fadeOutSound(oppenheimer, 800, () => {
        thebattleinthesnow.setVolume(1.0);
        thebattleinthesnow.play();
      });
    }
  } else {
    // 鼠标在右半屏：淡出 battle，开始 oppenheimer
    if (!oppenheimer.isPlaying()) {
      fadeOutSound(thebattleinthesnow, 800, () => {
        oppenheimer.setVolume(1.0);
        oppenheimer.play();
      });
    }
  }
}
  fadeOutSound(thebattleinthesnow, 800);
  fadeOutSound(oppenheimer, 800);
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

      ghost.x += (targetX - ghost.x) * 0.005;
      ghost.y += (targetY - ghost.y) * 0.005;

      robot.x += (targetX - robot.x) * 0.005;
      robot.y += (targetY - robot.y) * 0.005;
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

  if (currentBG === 1 || currentBG === 2) {
  ghost.draw(world);
  robot.draw(world);
  }

  if (currentBG === 1 && distance < 200) {
    drawMusicNotes();
  }

//text display
if (showTextSound) {
  let textDuration = millis() - textStartTime;
  if (textDuration < 3000) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("Time... Time... Time...",
         width / 2, height / 2);
  } else {
    showTextSound = false;
  }
}

if (showTextBG1) {
  fill(255);
  textSize(40);
  text("3025AD",
      100,40);
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

    if (world.isformed === true) {
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

    if (robotAngry === true) {
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

    if (robotAngry === true) {
      fill(255, 50, 50);
      ellipse(-35, -40, 16, 16);
      ellipse(35, -40, 16, 16);
    }
    if (robotAngry === true) {
      stroke(0);
      strokeWeight(6);
      line(-55, -55, -20, -45); 
      line(55, -55, 20, -45);   
      noStroke();
      fill(255, 150, 0, 200);
      ellipse(0, -120, 60, 80);
      fill(255, 220, 0, 220);
      ellipse(0, -115, 40, 60);
    } else if (robotHappy === true) {
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
  if (currentBG === 3) {
    ghost.x = width * 3/4;
    ghost.y = height / 2;
    robot.x = width / 4;
    robot.y = height / 2;

  if (thebattleinthesnow.isPlaying()) {
      thebattleinthesnow.stop();
    }
  if (fusion.isPlaying()) {
    fusion.stop();
  }
  
  if (mouseX < width / 2) {
      currentBG = 1;
      testMode = false;
      fade = 255;
    } else {
      currentBG = 4;
      testMode = false;
       fadeOutSound(thebattleinthesnow, 800);
  fadeOutSound(oppenheimer, 800, () => {
    if (!meetingkitty.isPlaying()) {
      meetingkitty.setVolume(1.0);
      meetingkitty.play();
    }
  });
  }
  }
  if (currentBG === 1 &&
      mouseX < width * 0.40 && mouseX > width * 0.3 &&
      mouseY < height * 0.7 && mouseY > height * 0.6 &&
      testMode === false && robotEverAngry === true) {

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
  return
  }
}

class Boat {
  constructor(x, y, vx, index) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.index = index; // 用于选择不同颜色标志
  }

  update() {
    // 水平移动
    this.x += this.vx;
    if (this.x > width + 80) {
      this.x = -80;
    }

    // 轻微上下浮动（根据全局 frameCount）
    this.currentY = this.y + sin(frameCount * 0.02) * 5;
  }

  draw() {
    // 每艘船的颜色标志
    let markColors = [
      color(0, 200, 255),   // 青蓝
      color(255, 120, 0),   // 橙色
      color(120, 255, 120)  // 绿色
    ];
    let c = markColors[this.index % markColors.length];

    push();
    translate(this.x, this.currentY);
    noStroke();

    // 船身：银灰色主体
    fill(190); // 银灰色
    ellipse(0, 0, 90, 26);      // 主体椭圆

    // 上方舱体
    fill(210);
    rect(0, -8, 40, 14, 6);

    // 金属高光
    fill(230, 230, 230, 180);
    ellipse(-20, -2, 16, 6);
    ellipse(25, 2, 18, 6);

    // 舷窗
    fill(40);
    ellipse(-10, -4, 6, 6);
    ellipse(0, -4, 6, 6);
    ellipse(10, -4, 6, 6);

    // 底部推进器
    fill(150);
    rect(-35, 3, 10, 10, 3);
    rect(35, 3, 10, 10, 3);

    // 颜色标志：发光圆环
    fill(c);
    ellipse(0, 5, 14, 14);
    fill(255, 255, 255, 180);
    ellipse(0, 5, 6, 6);

    pop();
  }
}

function drawMusicNotes() {
  push();
  translate(width / 2, height / 2); // 画布中间为中心
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
  // 这里假设音符整体是以 (width/2, height/2) 为中心的矩形区域
  let cx = width / 2;
  let cy = height / 2;
  let w = 120; // 区域宽
  let h = 120; // 区域高

  return (mouseX > cx - w/2 && mouseX < cx + w/2 &&
          mouseY > cy - h/2 && mouseY < cy + h/2);
}

// this part was generated by AI;让一个声音在 duration 毫秒内从当前音量淡出到 0，然后调用回调函数（可选）
function fadeOutSound(snd, duration, onDone) {
  if (!snd || !snd.isPlaying()) {
    if (onDone) onDone();
    return;
  }

  let startTime = millis();
  let startVol = snd.getVolume ? snd.getVolume() : 1.0; // 如果没设过音量，则认为是 1

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

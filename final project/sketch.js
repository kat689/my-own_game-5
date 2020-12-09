var PLAY = 1;
var END = 0;
var gameState = PLAY;

var bgImg;
var plane, plane_running, plane_collided;
var ground, invisibleGround, groundImage;

var gem1,gem2,gems;
var greengemimg,redgemimg
var gemsCollected=0

var fireballsGroup, fireballImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;
var vexinator,vexinatorImg
localStorage = ["HighestScore"];
localStorage[0] = 0;

function preload(){
  plane_running =   loadImage("black_plane.png");
  //plane_collided = loadAnimation("plane_collided.png");
  greengemimg=loadImage("gem green.png")
  redgemimg=loadImage("gem red.png")
  
  bgImg = loadImage("star background.jpg");
  
  groundImage = loadImage("ground.png");
  
  fireballImage = loadImage("fireball.png");
  
  obstacle1 = loadImage("robot.png");
  obstacle2 = loadImage("snakeTrap.png");
  
  vexinatorImg=loadImage("vexinator.png")
  
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("purple reset button.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
    plane = createSprite(200, height/2,50,20);
  
  plane.addImage("running", plane_running);
  //plane.addAnimation("collided", plane_collided);
  plane.scale = 0.5;
  
  plane.setCollider("circle", 0, 0, 50);
  
  ground = createSprite(width/2,height,width,20);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.scale=2;
  ground.velocityX = -(1 + score/200);
  
  gameOver = createSprite(width/2,height/2 - 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2 + 50);
  restart.addImage(restartImg);
  
  gameOver.scale = 1;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  vexinator=createSprite(width-200,height-120)
   vexinator.addImage(vexinatorImg)
   vexinator.visible=false;
  invisibleGround = createSprite(width/2, height-70,width, 10);
  invisibleGround.visible = false;
  
  fireballsGroup = new Group();
  obstaclesGroup = new Group();
  gems=new Group();
  score = 0;
}

function draw() {
  //plane.debug = true;
  background(bgImg);
  
  if (gameState===PLAY){
    console.log(getFrameRate())
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + score/100);
           
    if (ground.x < 300){
      ground.x = ground.width/2;
    }
    if(keyDown("UP_ARROW")){
    plane.y=plane.y-5
    }
    if(keyDown("DOWN_ARROW")){
plane.y=plane.y+5
    }
    if(keyDown("LEFT_ARROW")&&plane.x>150){
      plane.x=plane.x-5
          }
          if(keyDown("RIGHT_ARROW")&&plane.x<windowWidth-150){
            plane.x=plane.x+5
                }
                if(score===350){
                  gem1=createSprite(width/2,height/2,50,50)
                  gem1.addImage(greengemimg)
                  gem1.scale=0.1
                  gem1.velocityX=-1
                  gems.add(gem1)
                  }
                  if(score===700){
                    gem2=createSprite(width/2,height/2,50,50)
                    gem2.addImage(redgemimg)
                    gem2.scale=0.3
                    gem2.velocityX=-1
                    gems.add(gem2)
                    }
                    if(gems.isTouching(plane)){
                      gemsCollected++
                      gems.destroyEach();
                    }
   if(score<=1200){
    spawnfireballs();
    spawnObstacles();
   }
   else{
    vexinator.visible=true;
   }
    if(obstaclesGroup.isTouching(plane)||fireballsGroup.isTouching(plane)){
        gameState = END;
        
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    plane.velocityY = 0;
    gems.setVelocityXEach(0)
    obstaclesGroup.setVelocityXEach(0);
    fireballsGroup.setVelocityXEach(0);
    
    //change the plane animation
   // plane.changeAnimation("collided",plane_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    fireballsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
 
  
  drawSprites();
  fill("cyan")
  textSize(20);
  textFont("Comic Sans MS");
  text("Score: "+ score, width/5, height/10);
  text("HI: "+ localStorage[0], width/20, height/10);
  text("Gems collected: "+ gemsCollected,width/20,height/7)

}

function spawnfireballs() {
  //write code here to spawn the fireballs
  if (frameCount % 150 === 0) {
    var fireball = createSprite(width+20,height-300,40,10);
    fireball.y = Math.round(random(height-300,height-700));
    fireball.addImage(fireballImage);
    fireball.scale = 0.5;
    fireball.velocityX = -3;
    
     //assign lifetime to the variable
    fireball.lifetime = 600;
    
    //adjust the depth
    fireball.depth = gameOver.depth;
    gameOver.depth = gameOver.depth + 1;
    
    
    
    //add each fireball to the group
    fireballsGroup.add(fireball);
  }
  
}

function spawnObstacles() {
  if(frameCount % 150 === 0) {
    var obstacle = createSprite(width,height-95,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale = (0.2);
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale = (0.1);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.8;
    obstacle.lifetime = 600;
    obstacle.collide(ground)
    obstacle.depth = plane.depth;
    plane.depth = plane.depth + 1;
    
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  fireballsGroup.destroyEach();
  
  //plane.changeAnimation("running",plane_running);
  
  if(localStorage[0]<score){
    localStorage[0] = score;
  }
  console.log(localStorage[0]);
  plane.x=200
  plane.y=height/2
  score = 0;
  
}

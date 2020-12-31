//Create variables here
var dog, database, foodS, foodStock;
var dogImg, happyDogImg;
var button1, button2;
var fedTime, lastFed;
var foodObj;
var changeState, readState, gameState;
var bedRImg, washRImg, gardenImg, sadDog;

function preload()
{
  //load images here
  dogImg = loadImage("images/Dog.png");
  happyDogImg = loadImage("images/happy dog.png");
  bedRImg = loadImage("images/Bed Room.png");
  washRImg = loadImage("images/Wash Room.png");
  gardenImg = loadImage("images/Garden.png");
  sadDog = loadImage("images/deadDog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(800, 400);

  dog = createSprite(250,250,10,10);
  dog.addImage("dog", dogImg);
  dog.scale = 0.2;

  feed = createButton("Feed the Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food")
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  
  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  });

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })
}


function draw() {  
  background(46,139,87);
  
  currentTime = hour();
  if(currentTime == (lastFed+1)){
    update("Playing");
    foodObj.garden();
  } 
  else if(currentTime == (lastFed+2)){
    update("Sleeping");
    foodObj.bedroom(); 
  }
  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }
  else{
    update("Hungry")
    foodObj.display();
  }
  foodObj.display();

  fill(255, 255, 254);
  textSize(15);
  if(lastFed >= 12){
    text("Last Feed : " + lastFed % 12 + " PM", 350, 30);
  }
  else if(lastFed == 0){
    text("Last Feed : 12 AM", 350, 30);
  }
  else{text("Last Feed : " + lastFed + " AM", 350,30);
  }

  if(gameState != "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(dogImg);
  }

  
  drawSprites();
  //add styles here
  textSize(20);
  fill("yellow");
  stroke("black");
  text("Note: Press the up arror key to feed the dog milk",15, 15)
  text("Food Remaining : "+ foodS,170,200)
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){
  if(x<=0){
    x=0;
  }
  else{
    x=x-1;
  }

  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
  Food:foodObj.getFoodStock(),
  FeedTime:hour(),
  gameState:"Hungry"
  });
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  });
}

function update(state){
    database.ref('/').update({
      gameState: state
    })
}
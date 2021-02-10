var dog,dogImg,dogImg1;
var database;
var foodS,foodStock;
var feed,addFood,fedTime,lastFed;
var foodObj;
function preload(){
   dogImg=loadImage("Dog.png");
   dogImg1=loadImage("happydog.png");
  }

//Function to set initial environment
function setup() {
  database=firebase.database();
  createCanvas(800,500);

  dog=createSprite(650,300,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  textSize(20); 

  foodObj=new Food();

  feed= createButton("Feed the Dog");
feed.position(700,95);
feed.mousePressed(addFoods);

addFood=createButton("Add Food");
addFood.position(800,95);
addFood.mousePressed(addFoods);
}

// function to display UI
function draw() {
  background(46,139,87);
 
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  
  drawSprites();
  fill(255,255,254);
  stroke("black");
  text("Food remaining : "+foodS,170,200);
  textSize(13);
  

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Fed:"+lastfed%12+"P.M.",350,30);
  }
  else if(lastFed===0){
    text("Last Fed: 12 A.M.",350,30);
  }
  else{
    text("Last Fed:"+lastFed+"A.M.",350,30);
  }

  foodObj.display();
}

//Function to read values from DB
function readStock(data){
  foodS=data.val();
}

//Function to write values in DB
function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  } 
  database.ref('/').update({
    Food:x
  })
}
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS

  })
 
}

function feedDog(){
 dog.addImage(dogImg1);

 foodObj.updateFoodStock(foodObj.getFoodStock()-1);
 database.ref('/').update({
   Food:foodObj.getFoodStock(),
   FeedTime:hour()
 })
}
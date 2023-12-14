import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';


// instantiate a loader
const loader = new OBJLoader();

let froggyDead = false;
let froggyWon = false;
let onLog = false;
let onWater = false;
let firstPerson = false;
var requestId;
var jumpCamera = 0;
var froggyHeight = 0.15;
var homeBorderWidth = 1;
let lives = 3;
let wins = 0;
let score = 0;
let tempScore = 0;
let start;
let end;
let level = 0;
let levelShow = 1;
let maxWins = 5;
let homesOccupied = [false, false, false, false, false];

var cars = [];
var carBBoxs = [];
var carsPositions;
var carMoveValue;

var logs = [];
var logPositions;
var logMoveValue;
var logBBoxs = [];

var turtles = [];
var turtleBBoxs = [];
var turtlePositions;
var turtleMoveValue;
var turtleMoveValueZ;

var layout = [
    {
        "carsPositions" :
        [[2.3, 0, 0.2], [2.3, 1.0, 0.2],
        [1.65, 1.5, 0.2], [1.65, -1.5, 0.2], 
        [3.0, -1.5, 0.2], [3.0, -2.2, 0.2], [3.0, -0.5, 0.2]],
        "carMoveValue": [-0.01, -0.01, 0.03, 0.03, 0.02, 0.02, 0.02],
        "logPositions" : [[0.55, 1, 0.2],
        [-0.20, -1, 0.05],
        [-0.8, 1.5, 0.05],
        [-1.4, -1.5, 0.05],
        [-2, -0.4, 0.05], [-2.0, -2.0, 0.05],
        [-2.6, -2.0, 0.05]],
        "logMoveValue" : [-0.02, 0.02, -0.02, 0.02, -0.02, -0.02, 0.02],
        "turtlePositions" : [[0.5, -1, 0.2], [0.5, -1.6, 0.2], [0.5, -2.2, 0.2],
        [-0.8, -1, -0.2],[-0.8, -1.6, -0.2], [-0.8, -2.2, -0.2]],
        "turtleMoveValue" : [-0.02, -0.02, -0.02, -0.02, -0.02, -0.02],
        "turtleMoveValueZ" : [-0.002, -0.002, -0.002, -0.002, -0.002, -0.002],
        "starPositions" : [[2.3, 0, 0.2], [2.3, 1, 0.2],
        [1.65, -1.0, 0.2], [1.65, -1.3, 0.2],[1.65, -1.6, 0.2], 
        [3.0, -1.0, 0.2]]
    },
    {
        "carsPositions" :
        [[2.3, 0, 0.2], [2.3, 1.0, 0.2],[2.3, 1.8, 0.2],[2.3, -1.0, 0.2],
        [1.65, 1.5, 0.2], [1.65, 0, 0.2], [1.65, 2.5, 0.2],
        [3.0, -1.5, 0.2], [3.0, -2.2, 0.2], [3.0, -0.5, 0.2]],
        "carMoveValue": [-0.03, -0.03, -0.03, -0.03, 0.03, 0.03, 0.03, 0.03, 0.03, 0.03],
        "logPositions" : [[0.55, 1, 0.2],
        [-0.20, -1, 0.05],
        [-0.8, 1.5, 0.05],
        [-1.4, -1.5, 0.05],
        [-2, -0.4, 0.05], [-2.0, -2.0, 0.05],
        [-2.6, -2.0, 0.05]],
        "logMoveValue" : [-0.03, 0.03, -0.03, 0.02, -0.03, -0.03, 0.02],
        "turtlePositions" : [[0.5, -1, 0.2], [0.5, -1.6, 0.2], [0.5, -2.2, 0.2],
        [-0.8, -1, -0.2],[-0.8, -1.6, -0.2], [-0.8, -2.2, -0.2]],
        "turtleMoveValue" : [-0.03, -0.03, -0.03, -0.03, -0.03, -0.03],
        "turtleMoveValueZ" : [-0.002, -0.002, -0.002, -0.002, -0.002, -0.002],
        "starPositions" : [[2.3, -1, 0.2], [2.3, -1.5, 0.2],
        [1.65, 1.0, 0.2], [1.65, 1.3, 0.2], 
        [3.0, 1.5, 0.2], [3.0, 2, 0.2]]
    }
    
]
const fragment = document.createDocumentFragment();
const span = fragment
  .appendChild(document.createElement("h1"))
  .appendChild(document.createElement("span", {id:"lives"}))
span.textContent = "Level: "+levelShow+"  |  Lives: " + lives + "  |  Wins: " + wins + " | Score: " + score;
document.body.appendChild(fragment);

const scene = new THREE.Scene();
// camera.position.set(0, 0, 8);

// first person view
const camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(9, 0, 9);
jumpCamera = 0;

camera.up = new THREE.Vector3(0, 0, 1);
camera.lookAt(new THREE.Vector3(0, 0, 0));


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
document.body.appendChild( renderer.domElement );

const Instructionfragment = document.createDocumentFragment();
const instrunctionSpan = Instructionfragment
  .appendChild(document.createElement("h1"))
  .appendChild(document.createElement("span", {id:"lives"}))
  instrunctionSpan.textContent = "Press ! to view Make it own part";
document.body.appendChild(Instructionfragment);
const legendSpan = document.createElement("h1");
legendSpan.textContent = "LEGEND:";
document.body.appendChild(legendSpan);
const legendSpan1 = document.createElement("h1");
legendSpan1.textContent = "Move - w(forward), s(backward), a(left), d(right), r(reset), c(Camera View Change)";
document.body.appendChild(legendSpan1);

const light = new THREE.DirectionalLight( 0xffffff, 1.5 );
light.position.set( 1, 1, 9 ); //default; light shining from top
light.castShadow = true; // default false
scene.add( light );

//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

// defining froggy first
const froggyGeometry = new THREE.BoxGeometry( 0.35, 0.35, froggyHeight*2); 
const froggyMaterial = new THREE.MeshPhongMaterial( {color: 0x00ff00} ); 
const froggy = new THREE.Mesh( froggyGeometry, froggyMaterial ); 
froggy.position.set(3.5, 0, froggyHeight);
froggy.castShadow = true;
scene.add( froggy );
var froggyMoveValue = 0;

let froggyBbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
froggyBbox.setFromObject(froggy);

// define fixed stuff first
// base ground
const baseGeometry = new THREE.PlaneGeometry( 7, 6);
const baseMaterial = new THREE.MeshPhongMaterial( { color: 0xacaeb0, specular: 0x050505 } );
const base = new THREE.Mesh( baseGeometry, baseMaterial );
base.receiveShadow = true;
scene.add( base );

// sidewalks
const roadBorderGeometry = new THREE.PlaneGeometry( 0.5, 6 );
const roadBorderMaterial = new THREE.MeshPhongMaterial( {color: 0x7e7f80, side: THREE.DoubleSide} );
const roadBorder1 = new THREE.Mesh( roadBorderGeometry, roadBorderMaterial );
roadBorder1.position.set(3.5, 0, 0);
roadBorder1.receiveShadow = true;
scene.add( roadBorder1 );

const roadBorder2 = new THREE.Mesh( roadBorderGeometry, roadBorderMaterial );
roadBorder2.position.set(1, 0, 0);
roadBorder2.receiveShadow = true;
scene.add( roadBorder2 );

// road lanes
const laneGeometry = new THREE.PlaneGeometry( 0.05, 6 );
const laneMaterial = new THREE.LineBasicMaterial( {color: 0x7e7f80, side: THREE.DoubleSide} );
const lane1 = new THREE.Mesh( laneGeometry, laneMaterial );
lane1.position.set(1.95, 0, 0);
lane1.receiveShadow = true;
scene.add( lane1 );

const lane2 = new THREE.Mesh( laneGeometry, laneMaterial );
lane2.position.set(2.6, 0, 0);
lane2.receiveShadow = true;
scene.add( lane2 );

// home grass
const homeBorderGeomtry = new THREE.PlaneGeometry( homeBorderWidth, 6 );
const homeBorderMaterial = new THREE.MeshPhongMaterial( {color: 0x4b8f46, side: THREE.DoubleSide} );
const homeBorder = new THREE.Mesh( homeBorderGeomtry, homeBorderMaterial );
homeBorder.position.set(-3.5, 0, 0);
homeBorder.receiveShadow = true;
scene.add( homeBorder );

// river
const riverGeometry = new THREE.PlaneGeometry( 3.9, 6);
const riverMaterial = new THREE.MeshPhongMaterial( { color: 0x4876d9, specular: 0x050505, side: THREE.DoubleSide } );
const river = new THREE.Mesh( riverGeometry, riverMaterial );
river.position.set(-1.2, 0, 0.0);
river.receiveShadow = true;
scene.add( river );

let riverBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
riverBBox.setFromObject(river);

const walls = [];
const wallPositions = [[-3.3, -2.75, 0.5], [-3.3, -1.65, 0.5] ,
[-3.3, -0.55, 0.5], [-3.3, 0.55, 0.5], 
[-3.3, 1.65, 0.5], [-3.3, 2.75, 0.5]];
var wallsBBoxs = [];
for (var i=0; i<wallPositions.length; i++){
    const wallGeometry = new THREE.BoxGeometry( 1.3, 0.5, 0.5); 
    const wallMaterial = new THREE.MeshPhongMaterial( {color: 0x4b8f46, specular: 0x050505} ); 
    const wall = new THREE.Mesh( wallGeometry, wallMaterial ); 
    var wallPos = wallPositions[i]
    wall.position.set(wallPos[0], wallPos[1], wallPos[2]);
    wall.castShadow = false;
    walls.push(wall);
    scene.add( wall );

    let wallBbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    wallBbox.setFromObject(walls[i]);
    wallsBBoxs.push(wallBbox);
}

function loadLevel(){
    levelShow = level + 1;

    // remove previous level objects
    for( var i = scene.children.length - 1; i >= 0; i--) { 
        var obj = scene.children[i];
        if (obj.name == "car" || obj.name == "log" || obj.name == "turtle" || obj.name == "star" || obj.name == "winners" ){
            scene.remove(obj); 
        }
    }

    start = new Date();
    
    cars = [];
    carBBoxs = [];
    carsPositions = layout[level].carsPositions;
    carMoveValue = layout[level].carMoveValue;
    var carWidth = 0.4;
    var carHeight = 0.5;
    
    for (var i=0; i<carsPositions.length; i++){
        const carGeometry = new THREE.BoxGeometry( carWidth, carHeight, 0.2); 
        const carMaterial = new THREE.MeshPhongMaterial( {color: 0xf71eec, specular: 0x050505 } ); 
        const car = new THREE.Mesh( carGeometry, carMaterial ); 
        var carPos = carsPositions[i];
        car.position.set(carPos[0], carPos[1], carPos[2]);
        car.name = "car";
        car.castShadow = true;
        cars.push(car);
        scene.add( car );
    
        let carBbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        carBbox.setFromObject(cars[i]);
        carBBoxs.push(carBbox);
    }
    
    logs = []
    logPositions = layout[level].logPositions;
    logMoveValue = layout[level].logMoveValue;
    logBBoxs = [];
    for (var i=0; i<logPositions.length; i++)
    {
        // const logGeometry = new THREE.CylinderGeometry( 0.2, 0.2, 1.5 )
        const logGeometry = new THREE.BoxGeometry( 0.4, 1.5, 0.2 );
        const logMaterial = new THREE.MeshPhongMaterial( {color: 0x8B4513, specular: 0x050505} ); 
        const log = new THREE.Mesh( logGeometry, logMaterial ); 
        var logPos = logPositions[i];
        log.position.set(logPos[0], logPos[1], logPos[2]);
        log.castShadow = false;
        log.name = "log";
        logs.push(log);
        scene.add( log );
    
        let logBbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        logBbox.setFromObject(logs[i]);
        logBBoxs.push(logBbox);
    }
    
    turtles = [];
    turtleBBoxs = [];
    turtlePositions = layout[level].turtlePositions;
    turtleMoveValue = layout[level].turtleMoveValue;
    turtleMoveValueZ = layout[level].turtleMoveValueZ;
    
    for (var i=0; i<turtlePositions.length; i++)
    {
        const turtleGeometry = new THREE.BoxGeometry( 0.4, 0.4, 0.2); 
        const turtleMaterial = new THREE.MeshPhongMaterial( {color: 0xe02832, specular: 0x050505 } ); 
        const turtle = new THREE.Mesh( turtleGeometry, turtleMaterial ); 
        var turtlePos = turtlePositions[i];
        turtle.position.set(turtlePos[0], turtlePos[1], turtlePos[2]);
        turtle.castShadow = false;
        turtle.name = "turtle";
        turtles.push(turtle)
        scene.add( turtles[i] );
    
        let turtleBbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        turtleBbox.setFromObject(turtles[i]);
        turtleBBoxs.push(turtleBbox);
    }    
}


function resetOutOfFrame(obj){
    if (obj.position.y > 3){
        obj.position.y = -3
    }
    if (obj.position.y < -3){
        obj.position.y = 3
    }
}
function animateCars(){

    for (var i=0; i<cars.length; i++){
        cars[i].position.y += carMoveValue[i];
        resetOutOfFrame(cars[i]);
        carBBoxs[i].copy(cars[i].geometry.boundingBox).applyMatrix4(cars[i].matrixWorld);
    }

}

function animateLogs(){

    for (var i=0; i<logs.length; i++){
        logs[i].position.y += logMoveValue[i];
        resetOutOfFrame(logs[i]);
        logBBoxs[i].copy(logs[i].geometry.boundingBox).applyMatrix4(logs[i].matrixWorld);
    }
}

function animateTurtles(){
    
    for (var i=0; i<turtles.length; i++){
        turtles[i].position.y += turtleMoveValue[i];
        turtles[i].position.z += turtleMoveValueZ[i];
        resetOutOfFrame(turtles[i]);
        if (turtles[i].position.z < -0.5){
            turtles[i].position.z = 0.2
        }
        turtleBBoxs[i].copy(turtles[i].geometry.boundingBox).applyMatrix4(turtles[i].matrixWorld);
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function resetFroggy(){

    cancelAnimationFrame( requestId );
    await sleep(1000);
    froggy.position.set(3.5, 0, 0.2);
    froggy.material.color.set(0x00ff00);
    onLog = false;
    onWater = false;
    froggyDead = false;
    froggyWon = false;
    froggyMoveValue = 0;
    froggyBbox.setFromObject(froggy);
    animate();
}

function checkCollisions(){
    for(var i=0; i<cars.length; i++){
        if(froggyBbox.intersectsBox(carBBoxs[i])){
            froggy.material.color.set(0x0f140f);
            froggyDead = true;
        }
    }    
}

function checkOnLogsOrTurtles(){
    for(var i=0; i<logs.length; i++){
        if(froggyBbox.intersectsBox(logBBoxs[i])){
            // console.log("intersected log", i);
            froggyMoveValue = logMoveValue[i];
            return true;
        }
    }  

    for(var i=0; i<turtles.length; i++){
        if(froggyBbox.intersectsBox(turtleBBoxs[i])){
            // console.log("intersected", i);
            froggyMoveValue = turtleMoveValue[i];
            return true;
        }
    }  
    // console.log(onLog, onWater);
    return false;

}
async function updateFroggy(){
    
    if(onLog == true && onWater == true){
        froggy.position.y += froggyMoveValue;
        froggyBbox.copy(froggy.geometry.boundingBox).applyMatrix4(froggy.matrixWorld);
        if (froggy.position.y > 3 || froggy.position.y < -3 || froggy.position.x > 3.6 || froggy.position.x < -3.6){
            froggyDead = true;
            
            resetFroggy();
        }
        if (firstPerson){
            camera.position.y += froggyMoveValue;
        }

    }
    await sleep(200);
    if(onLog == false && onWater == true){
            froggyDead = true;
        }
    
}

async function checkOnHome(){
    if (froggy.position.x < -3 && froggy.position.x > -3.5){
        for(var i=0; i<walls.length; i++){
            if(froggyBbox.intersectsBox(wallsBBoxs[i])){
                froggy.material.color.set(0x0f140f);
                froggyDead = true;
            }
        } 
        if(!froggyDead){ 
            for (var i=0; i<walls.length - 1; i++){
                if(froggy.position.y > walls[i].position.y && froggy.position.y < walls[i+1].position.y)
                {
                    if (!homesOccupied[i]){
                        homesOccupied[i] = true;
                        froggyWon = true;
                    }
                    else{
                        froggyDead = true;
                    }                
                }
            }
        }
        // console.log("homee", froggyWon);
    }   
}
const checkOnWater = async () => {
    if(froggy.position.x < roadBorder2.position.x && froggy.position.x > -3){
    onWater = true;
    onLog = await checkOnLogsOrTurtles();
    updateFroggy(); 
    }
    else{ 
            onWater = false;
            onLog = false;
    }
    // do something else here after firstFunction completes
  }

function changeCamera(){
    
    if (firstPerson){
        camera.fov = 150;
        camera.aspect = 1.5;
        camera.position.set(froggy.position.x -0.1 , 0, 0.4);
        camera.updateProjectionMatrix();
        jumpCamera = 0.6;
    }
    else{
        camera.fov = 35;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.position.set(9, 0, 9);
        camera.updateProjectionMatrix();
        jumpCamera = 0.0;
    }
}
async function resetCamera(){
    if (firstPerson){
        camera.fov = 150;
        camera.aspect = 1.5;
        camera.position.set(3.4, 0, 0.4);
        await sleep(1000);
        camera.updateProjectionMatrix();
    }
    else{
        camera.fov = 35;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.position.set(9, 0, 9);
        camera.updateProjectionMatrix();
        jumpCamera = 0.0;
    }

}

function resetScores(){
    lives = 3;
    wins = 0;
    // score = 0;
    tempScore = 0;
    homesOccupied = [false, false, false, false, false];
    for( var i = scene.children.length - 1; i >= 0; i--) { 
        var obj = scene.children[i];
        if (obj.name == "winners" ){
            scene.remove(obj); 
        }
    }
}
function froggyIsDead(){
        froggy.material.color.set(0x211a19);
        lives -= 1;
        tempScore = 0;
        if (lives <= 0){
            alert("Game Over");
            resetScores();
        }
        resetFroggy();
        resetCamera();
        start = new Date();
}
function froggyIsHome(){
    end = new Date();
    score = tempScore + 50 + Math.round(180/((end.getTime() - start.getTime())/1000)*100);
    wins += 1;
    froggy.material.color.set(0x2d7329);
    resetFroggy();
    resetCamera();
    var frogTemp = froggy.clone();
    frogTemp.name = "winners";
    scene.add(frogTemp);
    
    if (wins >= maxWins){
        // set scores
        score += 1000;
        alert("Level " + levelShow + " Complete. Final score: "+ score);
        level += 1;
        lives = 3;
        tempScore = 0;
        wins = 0;
        loadLevel();
    }
}
function animate() {
	requestId = requestAnimationFrame( animate );

    animateCars();
    animateLogs();
    animateTurtles();
    checkCollisions();
    checkOnWater();
    checkOnHome();
    if (froggyDead){
        froggyIsDead();
    }
    if (froggyWon){
        froggyIsHome();

    }

	// renderer.render( scene, camera );
    render();
    
}

loadLevel();
animate();

function render(){

    if (froggy.position.y > 3 || froggy.position.y < -3 || froggy.position.x > 3.6 || froggy.position.x < -3.6){
        froggyDead = true;
        resetFroggy();
    }
    froggyBbox.copy(froggy.geometry.boundingBox).applyMatrix4(froggy.matrixWorld);
    renderer.render( scene, camera );
    span.textContent = "Level: "+levelShow+"  |  Lives: " + lives + "  |  Wins: " + wins + " | Score: " + score;
}

document.addEventListener('keydown', (event) => {
    var name = event.key;
    // Alert the key name and key code on keydown
    var jump = 0.6;
    if(firstPerson){
        jumpCamera = 0.6
    }
    froggyMoveValue = 0;
    if (froggy.parent != scene){  
        froggy.parent = scene;
    }
    if (name == 'w'){
        froggy.position.x -= jump;
        camera.position.x -= jumpCamera;
        tempScore += 10;
    }
    if (name == 's'){
        froggy.position.x += jump;
        camera.position.x += jumpCamera;
    }
    if (name == 'a'){
        froggy.position.y -= jump;
        camera.position.y -= jumpCamera;
    }
    if (name == 'd'){
        froggy.position.y += jump;
        camera.position.y += jumpCamera;
    }
    if (name == 'r'){
        resetFroggy();
    }
    if (name == 'c'){
        if (firstPerson){
            firstPerson = false;
            changeCamera();
        }
        else{   
            firstPerson = true;
            changeCamera();
        }
    }
    
    render();
})
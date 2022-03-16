let serial;
let portnName = '/dev/tty.usbmodem145301'
let inData;


var canvas; // pointer to the canvas.
var agents = [];
var agentCount = 10;
var noiseScale = 100;
var noiseStrength = 10;
var noiseZRange = 1;
var noiseZVelocity = 1000;
var overlayAlpha = 10;
var strokeWidth = 10;
var drawMode = 1;

function setup() {
  serial = new p5.SerialPort('192.168.0.4')
  serial.on('data', serialEvent);
  serial.open(portnName);

  canvas = createCanvas(windowWidth / 1.8, windowHeight / 1.1);
  canvas.class("sketchStyle")
  // canvas.position(0, 0,'static')
  fill(0);
  canvas.parent('sketch') // choose a place on the page to be the 'parent' for our script.

  initialiseAgents();
}

function serialEvent() {
  // read a string from the serial port until newline is encountered:
  var inString = serial.readStringUntil('\r\n');


  if (inString.length > 0) {

    // Split the string to read values.
    var sensors = split(inString, ';');
    if (sensors.length == 4) {

    
     hovering(sensors[2])


      console.log(sensors[2])
      if ((sensors[0] > agentCount) || (sensors[0] < agentCount)) {
        agents.length = 0; // empty array.
        agentCount = sensors[0];
        initialiseAgents();
      }

      // Change draw mode.
      sensors[1] <= 20 ? drawMode = 2 : drawMode = 1;
    } 
  }
}

function draw() {

  fill(0, overlayAlpha);
  noStroke();
  rect(0, 0, width, height);

  for (var i = 0; i < agentCount; i++) {
    if (i % 10 == 0) {
      stroke(10, 255, 10)
    } else {
      stroke(255, 10, 10)

    }
    if (drawMode == 1) {
      agents[i].modeOne(strokeWidth, noiseScale, noiseStrength, noiseZVelocity);
    } else {
      agents[i].modeTwo(strokeWidth, noiseScale, noiseStrength, noiseZVelocity);
    }
  }

}

function inBetween(sensorsValue) {
  return (sensorsValue > (agentCount-15) && sensorsValue < (agentCount+15))
}

function initialiseAgents() {

  // initialise agents.
  for (var i = 0; i < agentCount; i++) {
    agents[i] = new Agent(noiseZRange);
  }
}

function hovering(numberButton){
  deselectOthers();
  document.getElementById("button"+numberButton).style.background='#909050';
}

function deselectOthers() {
  document.getElementById("button1").style.background='#ffffff';
  document.getElementById("button2").style.background='#ffffff';
  document.getElementById("button3").style.background='#ffffff';
  document.getElementById("button4").style.background='#ffffff';
}

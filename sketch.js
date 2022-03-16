let serial;
let portnName = '/dev/tty.usbmodem143301'
let inData;


var canvas; // pointer to the canvas.
var agents = [];
var agentCount = 1;
var noiseScale = 100;
var noiseStrength = 10;
var noiseZRange = 1;
var noiseZVelocity = 1000;
var overlayAlpha = 10;
var strokeWidth = 1;
var drawMode = 1;

var buttonActivated;

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
      var potentiometer = sensors[0];
      var ultrasound = sensors[1];
      var joy_x = sensors[2];
      var joy_pressed = sensors[3];

      hovering(joy_x);

      if (joy_pressed == 1) {
        buttonActivated = joy_x;
        activateOption(buttonActivated);
      }

      console.log(buttonActivated);

      // NUMBER AGENTS.
      if (buttonActivated == 1) {
        if ((potentiometer > agentCount) || (potentiometer < agentCount)) {
          agents.length = 0; // empty array.
          agentCount = potentiometer;
          initialiseAgents();
        }
      }
      // NOISE STRENGTH.
      else if (buttonActivated == 2) {
        noiseStrength = scalex(potentiometer, 0, 255, 1, 1000);
      }
      // STROKE WIDTH.
      else if (buttonActivated == 3) {
        strokeWidth = scalex(potentiometer, 0, 255, 1, 10);
      }
      // AGENTS COLOUR.
      else if (buttonActivated == 4) {

      }



      // Change draw mode.
      ultrasound <= 20 ? drawMode = 2 : drawMode = 1;
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
  return (sensorsValue > (agentCount - 15) && sensorsValue < (agentCount + 15))
}

function initialiseAgents() {

  // initialise agents.
  for (var i = 0; i < agentCount; i++) {
    agents[i] = new Agent(noiseZRange);
  }
}

/**
 * Acts as a hovering button - gets activated when joystick is on an option.
 * @param {} numberButton 
 */
function hovering(numberButton) {
  dehoverOthers();
  document.getElementById("button" + numberButton).style.background = '#FFA500';
}

/**
 * Deselect other options.
 */
function dehoverOthers() {
  document.getElementById("button1").style.background = '#ffffff';
  document.getElementById("button2").style.background = '#ffffff';
  document.getElementById("button3").style.background = '#ffffff';
  document.getElementById("button4").style.background = '#ffffff';
}

function deactivateOptions() {
  document.getElementById("button1").style.borderColor = "black";
  document.getElementById("button2").style.borderColor = "black";
  document.getElementById("button3").style.borderColor = "black";
  document.getElementById("button4").style.borderColor = "black";
}

function activateOption(numberButton) {
  deactivateOptions();
  document.getElementById("button" + numberButton).style.background = '#900000';
  document.getElementById("button" + numberButton).style.borderColor = "red";
}

/**
 * Manual implementation of scale - map function. maps a range of values to another.
 * @param {*} number 
 * @param {*} inMin 
 * @param {*} inMax 
 * @param {*} outMin 
 * @param {*} outMax 
 */
function scalex(number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
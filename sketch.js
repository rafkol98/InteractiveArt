let serial;
let portnName = '/dev/tty.usbmodem145401'
let inData;


var canvas; // pointer to the canvas.
var agents = [];
var agentCount = 4000;
var noiseScale = 100;
var noiseStrength = 10;
var noiseZRange = 0.4;
var noiseZVelocity = 0.01;
var overlayAlpha = 10;
var strokeWidth = 0.3;
var drawMode = 1;

var secondColourNum= 1;
var colourNum = 2;

var colPic; 

var buttonActivated;

function setup() {
  serial = new p5.SerialPort('192.168.0.4')
  serial.on('data', serialEvent);
  serial.open(portnName);

  canvas = createCanvas(windowWidth / 1.5, windowHeight / 1.2);
  canvas.class("sketchStyle")
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

      console.log(joy_x)
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
          agentCount = scalex(potentiometer, 0, 255, 1, 8000);
          initialiseAgents();
        }
      }
      // NOISE STRENGTH.
      else if (buttonActivated == 2) {
        noiseStrength = scalex(potentiometer, 0, 255, 1, 1000);
      }
      // STROKE WIDTH.
      else if (buttonActivated == 3) {
        strokeWidth = scalex(potentiometer, 0, 255, 0.1, 2);
      }
      // AGENTS PRIMARY COLOUR.
      else if (buttonActivated == 4) {
        colourNum = parseInt(scalex(potentiometer, 0, 255, 1, 3), 10); // cast to integer.
      } 
      // AGENTS SECONDARY COLOUR.
      else if (buttonActivated == 5) {
        secondColourNum = parseInt(scalex(potentiometer, 0, 255, 1, 3), 10); // cast to integer.
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
    colour(i); // colour the lines.

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
  document.getElementById("button5").style.background = '#ffffff';
}

function deactivateOptions() {
  document.getElementById("button1").style.borderColor = "black";
  document.getElementById("button2").style.borderColor = "black";
  document.getElementById("button3").style.borderColor = "black";
  document.getElementById("button4").style.borderColor = "black";
  document.getElementById("button5").style.borderColor = "black";
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

function colour(index) {
  // primary colour.
  if (colourNum == 1) {
    stroke(10, 255, 10)
  } else if (colourNum == 2) {
    stroke(255, 10, 10)
  } else if (colourNum == 3) {
    stroke(10, 10, 255)
  }

  // second colour.
  if (secondColourNum == 1 && (index % 10 == 0)) {
    stroke(10, 255, 10)
  } else if (secondColourNum == 2 && (index % 10 == 0)) {
    stroke(255, 10, 10)
  } else if (secondColourNum == 3 && (index % 10 == 0)) {
    stroke(10, 10, 255)
  }
}
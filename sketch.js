let serial;
let portnName = '/dev/tty.usbmodem145401'
let inData;

var canvas; // pointer to the canvas.

// Interactive agents.
var agents = [];
var agentCount = 100;
var noiseScale = 100; //TODO
var noiseStrength = 0;
var noiseZRange = 0.4;
var overlayAlpha = 100; // TODO
var strokeWidth = 0.3;
var drawMode = 1;

// Colours.
var secondColourNum = 0;
var colourNum = 0;
var backgroundColour = [20, 20, 20]

// Buttons.
var buttonActivated;
var ready = false;

// Serial controls.
var potentiometer, ultrasound, joy_x, joy_colour, joy_pressed;

function setup() {
  // serial communication.
  serial = new p5.SerialPort('192.168.0.4')
  serial.on('data', serialEvent);
  serial.open(portnName);

  canvas = createCanvas(windowWidth / 1.8, windowHeight / 1.2);
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

    if (sensors.length == 5) {
      // initialise sensors.
      potentiometer = sensors[0];
      ultrasound = sensors[1];
      joy_x = sensors[2];
      joy_colour = sensors[3];
      joy_pressed = sensors[4];

      // hover the options, except if button activated is 4, 5 or 7.
      if (buttonActivated != 4 && buttonActivated != 5 && buttonActivated != 7) {
        hovering("button", joy_x);
      }
      // hover the colours.
      else {
        hovering("colour", joy_colour)
      }

      // Handle press of button.
      joyButtonPressed();

      // Handle control the options.
      controlOptions();

      // Change draw mode.
      ultrasound <= 20 ? drawMode = 2 : drawMode = 1;
    }
  }
}

function draw() {
  backgroundColour.push(overlayAlpha);
  fill(backgroundColour);
  noStroke();
  rect(0, 0, width, height);

  for (var i = 0; i < agentCount; i++) {
    colour(i); // colour the lines.

    if (drawMode == 1) {
      agents[i].modeOne(strokeWidth, noiseScale, noiseStrength);
    } else {
      agents[i].modeTwo(strokeWidth, noiseScale, noiseStrength);
    }
  }
}

function inBetween(sensorsValue) {
  return (sensorsValue > (agentCount - 15) && sensorsValue < (agentCount + 15))
}

/**
 * Initialise the agents.
 */
function initialiseAgents() {
  for (var i = 0; i < agentCount; i++) {
    agents[i] = new Agent(noiseZRange);
  }
}

/**
 * Handle the go back button.
 */
function goBackButton() {
  buttonActivated = null;
  deactivateOptions("button");
  deactivateOptions("colour");
  dehoverOthers("colour");
}

/**
 * 
 */
function joyButtonPressed() {
  if (joy_pressed == 1) {
    // if button activated is 4 then set the primary colour as the one selected.
    if (buttonActivated == 4) {
      if (joy_colour == -1) {
        goBackButton();
      } else {
        colourNum = joy_colour;
        activateOption("colour", colourNum);
      }
    }
    // if button activated is 5 then set the secondary colour as the one selected.
    else if (buttonActivated == 5) {
      if (joy_colour == -1) {
        goBackButton();
      } else {
        secondColourNum = joy_colour;
        activateOption("colour", colourNum);
      }
    } else if (buttonActivated == 7) {
      if (joy_colour == -1) {
        goBackButton();
      } else {
        updateBackgroundColour(joy_colour);
        activateOption("colour", joy_colour);
      }
    }
    // otherwise it means that we are in the options menu (not colours), therefore change the options.
    else {
      buttonActivated = joy_x;
      activateOption("button", buttonActivated);
    }
  }
}

/**
 * 
 */
function controlOptions() {
  // NUMBER AGENTS.
  if (buttonActivated == 1) {
    if ((potentiometer > agentCount) || (potentiometer < agentCount)) {
      agents.length = 0; // empty array.
      agentCount = scalex(potentiometer, 0, 255, 1, 2000);
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
  else if (buttonActivated == 4 || buttonActivated == 5 || buttonActivated == 7) {
    serial.write("colour*" + joy_colour + ";");
  }
  // NOISE SCALE.
  else if (buttonActivated == 6) {
    noiseScale = scalex(potentiometer, 0, 255, 1, 5000);
    console.log(noiseScale);
  } 
  else if (buttonActivated == 8) {
    console.log("mesa")
    overlayAlpha = scalex(potentiometer, 0, 255, 1, 1000);
    console.log(overlayAlpha)
  }
}

/**
 * Acts as a hovering button - gets activated when joystick is on an option.
 * @param {} numberButton 
 */
function hovering(stringIn, numberButton) {
  dehoverOthers(stringIn);
  if (stringIn == "button") {
    document.getElementById(stringIn + numberButton).style.background = '#FFA500';
  } else {
    document.getElementById(stringIn + numberButton).style.borderColor = "orange";
  }
}

/**
 * Deselect other options.
 */
function dehoverOthers(stringIn) {
  if (stringIn == "button") {
    for (let i = 1; i <= 8; i++) {
      document.getElementById(stringIn + i).style.background = '#ffffff';
    }
  } else {
    for (let i = -1; i <= 7; i++) {
      document.getElementById(stringIn + i).style.borderColor = "black";
    }
  }
}

/**
 * Deactivate options.
 */
function deactivateOptions(stringIn) {
  for (let i = 1; i <= 7; i++) {
    document.getElementById(stringIn + i).style.borderColor = "black";
  }

  if (stringIn == 'colour') {
    document.getElementById(stringIn + "-1").style.borderColor = "black";
    document.getElementById(stringIn + "0").style.borderColor = "black";
  } else {
    document.getElementById(stringIn + "8").style.borderColor = "black";
  }
}

/**
 * Activate an option.
 * @param {*} stringIn 
 * @param {*} numberButton 
 */
function activateOption(stringIn, numberButton) {
  deactivateOptions(stringIn);
  if (stringIn == 'button') {
    document.getElementById(stringIn + numberButton).style.background = '#900000';
  }
  document.getElementById(stringIn + numberButton).style.borderColor = "red";
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

function updateBackgroundColour(colourNum) {
  // background colour.
  if (colourNum == 0) {
    backgroundColour = [255, 255, 255]
  } else if (colourNum == 1) {
    backgroundColour = [255, 0, 0]
  } else if (colourNum == 2) {
    backgroundColour = [0, 255, 0]
  } else if (colourNum == 3) {
    backgroundColour = [0, 0, 255]
  } else if (colourNum == 4) {
    backgroundColour = [255, 20, 147]
  } else if (colourNum == 5) {
    backgroundColour = [0, 0, 0]
  } else if (colourNum == 6) {
    backgroundColour = [0, 178, 169]
  } else if (colourNum == 7) {
    backgroundColour = [150, 50, 0]
  }
}

function colour(index) {
  // primary colour.
  if (colourNum == 0) {
    stroke(255, 255, 255)
  } else if (colourNum == 1) {
    stroke(255, 0, 0)
  } else if (colourNum == 2) {
    stroke(0, 255, 0)
  } else if (colourNum == 3) {
    stroke(0, 0, 255)
  } else if (colourNum == 4) {
    stroke(255, 20, 147)
  } else if (colourNum == 5) {
    stroke(0, 0, 0)
  } else if (colourNum == 6) {
    stroke(0, 178, 169)
  } else if (colourNum == 7) {
    stroke(150, 50, 0)
  }

  // second colour.
  if (secondColourNum == 0 && (index % 10 == 0)) {
    stroke(255, 255, 255)
  } else if (secondColourNum == 1 && (index % 10 == 0)) {
    stroke(255, 0, 0)
  } else if (secondColourNum == 2 && (index % 10 == 0)) {
    stroke(0, 255, 0)
  } else if (secondColourNum == 3 && (index % 10 == 0)) {
    stroke(0, 0, 255)
  } else if (secondColourNum == 4 && (index % 10 == 0)) {
    stroke(255, 20, 147)
  } else if (secondColourNum == 5 && (index % 10 == 0)) {
    stroke(0, 0, 0)
  } else if (secondColourNum == 6 && (index % 10 == 0)) {
    stroke(0, 178, 169)
  } else if (secondColourNum == 7 && (index % 10 == 0)) {
    stroke(150, 50, 0)
  }
}
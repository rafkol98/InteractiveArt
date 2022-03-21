let serial;
let portnName = '/dev/tty.usbmodem146301'
let inData;

var canvas; // pointer to the canvas.

// Interactive agents.
var agents = [];
var agentCount = 100;
var agentMaxVelocity = 5;

var noiseScale = 100; 
var noiseStrength = 0;
var maxNoiseRange = 0.4;
var alphaChannel = 100; 
var agentWidth = 0.3;
var movementMode = 1;

// Colours.
var secondColourNum = 0;
var colourNum = 0;
var backgroundColour = [20, 20, 20]

// Buttons.
var buttonActivated;
var ready = false;

// Serial controls.
var potentiometer, ultrasound, joy_x,  joy_colour, joy_pressed;

// Ultrasound sensor.
var arrayScreenshot = new Array();  // Screenshot using ultrasound sensor.
var direction = 1;


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

function draw() {
  // Save canvas if ultrasound array has more than 5 elements.
  if (arrayScreenshot.length > 5) {
    saveCanvas('myCanvas', 'jpg');
    arrayScreenshot = [];
  }

  fill(backgroundColour[0], backgroundColour[1], backgroundColour[2], alphaChannel);
  noStroke();
  rect(0, 0, width, height);

  for (var i = 0; i < agentCount; i++) {
    colour(i); // colour the lines.

    if (movementMode == 1) {
      agents[i].normal(agentWidth, noiseScale, noiseStrength);
    } else {
      // control direction - ultrasonic sensor.
      if (direction == 4) {
        direction = 1; // reset direction.
      } else {
        if (i % 100 == 0) {
          direction++;
        }
      }
      agents[i].ultrasonicControl(agentWidth, noiseScale, noiseStrength, direction);
    }
  }
}

function serialEvent() {
  // read a string from the serial port until newline is encountered:
  var inString = serial.readStringUntil('\r\n');

  if (inString.length > 0) {
    // Split the string to read values.
    var sensors = split(inString, ';');

    if (sensors.length == 5) {
      // Read sensors values.
      potentiometer = sensors[0];
      ultrasound = sensors[1];
      joy_x = sensors[2];
      joy_colour = sensors[3];
      joy_pressed = sensors[4];

      console.log(joy_x);

      // hover the options, except if button activated is 6, 7 or 8 (the colour buttons).
      if (buttonActivated != 6 && buttonActivated != 7 && buttonActivated != 8) {
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

      // Check the ultrasound sensor and act appropriately.
      controlUltrasound();
    }
  }
}



/**
 * Initialise the agents.
 */
function initialiseAgents() {
  for (var i = 0; i < agentCount; i++) {
    agents[i] = new Agent(maxNoiseRange, agentMaxVelocity);
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
 * Activate option when button is pressed while hovering that option.
 */
function joyButtonPressed() {

  if (joy_pressed == 1) {
    $('#instructionsModal').modal('hide');
    
    // if button activated is 6 then set the primary colour as the one selected.
    if (buttonActivated == 6) {
      if (joy_colour == -1) {
        goBackButton();
      } else {
        colourNum = joy_colour;
        activateOption("colour", colourNum);
      }
    }
    // if button activated is 7 then set the secondary colour as the one selected.
    else if (buttonActivated == 7) {
      if (joy_colour == -1) {
        goBackButton();
      } else {
        secondColourNum = joy_colour;
        activateOption("colour", colourNum);
      }
    } 
    // if button activated is 8 then set then change the background colour.
    else if (buttonActivated == 8) {
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
 * Control the variables/options and change their values accordingly.
 */
function controlOptions() {
  // NUMBER AGENTS.
  if (buttonActivated == 1) {
    if ((potentiometer > agentCount) || (potentiometer < agentCount)) {
      agents.length = 0; // empty array.
      agentCount = manualMap(potentiometer, 0, 1023, 1, 2000);
      initialiseAgents();
    }
  }
  // NOISE STRENGTH.
  else if (buttonActivated == 2) {
    noiseStrength = manualMap(potentiometer, 0, 1023, 1, 1000);
  }
  // AGENTS WIDTH.
  else if (buttonActivated == 3) {
    agentWidth = manualMap(potentiometer, 0, 1023, 0.1, 2);
  }
 
  // NOISE SCALE.
  else if (buttonActivated == 4) {
    noiseScale = manualMap(potentiometer, 0, 1023, 1, 5000);
    console.log(noiseScale);
  }
  // ALPHA CHANNEL.
  else if (buttonActivated == 5) {
    alphaChannel = manualMap(potentiometer, 0, 1023, 1, 200);
    console.log(alphaChannel)
  }

   // AGENTS PRIMARY COLOUR.
   else if (buttonActivated == 6 || buttonActivated == 7 || buttonActivated == 8) {
    serial.write("colour*" + joy_colour + ";");
  }
}

/**
 * 
 */
function controlUltrasound() {
  // Change draw mode.
  ultrasound <= 20 ? movementMode = 2 : movementMode = 1;

  // If ultrasound reading is 1185 it means that the user is touching the sensor.
  // If they do that then populate an array which will be used to save canvas - screenshot
  // when it has more than 15 elements i.e. when the user has been holding their hand there for ~1 second.
  if (ultrasound > 1180) {
    arrayScreenshot.push(true);
  } else {
    arrayScreenshot = [];
  }
}

/**
 * Acts as a hovering button - gets activated when joystick is on an option.
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
 * Dehover other options.
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
 * Activate an option, turning its background red.
 */
function activateOption(stringIn, numberButton) {
  deactivateOptions(stringIn);
  if (stringIn == 'button') {
    document.getElementById(stringIn + numberButton).style.background = '#900000';
  }
  document.getElementById(stringIn + numberButton).style.borderColor = "red";
}

/**
 * Manual implementation of scale - map function. Maps a range of values to another.
 * @param {*} number 
 * @param {*} inMin 
 * @param {*} inMax 
 * @param {*} outMin 
 * @param {*} outMax 
 */
function manualMap(number, inMin, inMax, outMin, outMax) {
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
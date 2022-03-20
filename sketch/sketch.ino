#include <Adafruit_NeoPixel.h>
// pins for joystick. Only use X as we just want to change between different options.
const int XPIN = A5;
const int BPIN = 9;

// pins and variables for Ultrasound sensor.
const int ECHOPIN = 2;
const int TRIGPIN = 3;
// variables for measuring distance using ultrasonic sensor.
long duration;
int distance; 

// Setup neopixel LEDS.
const int LEDPIN = 6;
const int NUMPIXELS = 8; // number of pixels in the adafruit LED.
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, LEDPIN, NEO_GRB + NEO_KHZ800);
// variable for default colours of agents.
int colourSelected = 0;


void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  pixels.begin(); 

  pinMode(TRIGPIN, OUTPUT); // Sets the trigPin as an OUTPUT
  pinMode(ECHOPIN, INPUT); // Sets the echoPin as an INPUT

  pinMode(BPIN,INPUT); 
  digitalWrite(BPIN,HIGH); 
  turnOffLeds(); // turn off ALL leds.
}

void loop() {
  checkSerial();
  usePotentiometer();
  calculateDistance();
  useJoystick();
  
  delay(200);
}

/**
 * Light up the Neopixel leds. The given number specifies which LED to light up.
 * The opacity specifies the opacity level for the LED - different between primary and secondary colours.
 */
void lightUpLeds(int numberLed) {
    turnOffLeds();
    
   switch (numberLed) {
     case 0:
       pixels.setPixelColor(0, pixels.Color(50,50,50)); // white 
      break;
    case 1:
      pixels.setPixelColor(1, pixels.Color(255,0,0)); // red 
      break;
    case 2:
      pixels.setPixelColor(2, pixels.Color(0,255,0)); // green 
      break;
    case 3:
       pixels.setPixelColor(3, pixels.Color(0,0,255)); // blue.
      break;
    case 4:
       pixels.setPixelColor(4, pixels.Color(255,20,147)); // pink
      break;
    case 5:
      pixels.setPixelColor(5, pixels.Color(0,0,0)); // black
      break;
    case 6:
      pixels.setPixelColor(6, pixels.Color(0,178,169)); // teal
      break;
    case 7:
      pixels.setPixelColor(7, pixels.Color(254,80,0)); // orange
      break;
  }

   pixels.show();
}

/**
 * Use the joystick.
 */
void useJoystick() {
  int xValue = analogRead(XPIN); // read analogue value.
   
  int mappedX = map(xValue, 0, 1023, 1, 9); // map from 1 to 9 - used for navigation options.
  int mappedXColours = map(xValue, 0, 1023, -1, 8); // map from -1 to 8 - used for navigating colours. -1 is for back button.
  
  int bValue = digitalRead(BPIN); // read whether button was pressed in.

  // Print to serial.
  Serial.print(mappedX);
  Serial.print(";");
  Serial.print(mappedXColours);
  Serial.print(";");
  Serial.println(!bValue);
}

/**
 * Get potentiometer's values and print them to the serial communication.
 */
void usePotentiometer() {
  int ardRead = analogRead(A0); // read analogue input.
  
  Serial.print(ardRead);  // Print the usePotentiometer value to serial.
  Serial.print(";");  
}

/**
 * Calculate distance from sensor using ultrasonic sound.
 */
void calculateDistance() {
  // Clears the trigPin condition
  digitalWrite(TRIGPIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIGPIN, HIGH);   // Sets the trigPin HIGH (ACTIVE) for 10 microseconds
  delayMicroseconds(10);
  digitalWrite(TRIGPIN, LOW);
  
  duration = pulseIn(ECHOPIN, HIGH); // read echopin and return sound wave travel time in seconds
  distance = duration * 0.034 / 2; // Speed of sound wave divided by 2 (go and back)

  Serial.print(distance);  // Print the distance to serial.
  Serial.print(";");  
}

/**
 * Turn of all LEDs except primary when changing secondary and vice versa.
 */
void turnOffLeds() {
  // turn off all leds.
  for(int i=0; i<NUMPIXELS; i++) {
   pixels.setPixelColor(i, pixels.Color(0, 0, 0));
  }
}

/**
 * Check if for new messages on the serial port. This is used to control the LED to light up.
 */
void checkSerial() {
  if(Serial.available() > 0) {
    String getStart = Serial.readStringUntil('*');
    // light up the primary colour led.
    if (getStart == "colour") {
      String ledIn = Serial.readStringUntil(';');
      colourSelected = ledIn.toInt();
      lightUpLeds(colourSelected); // light up primary colour selected.  
    }
     while(Serial.available() > 0) {
        Serial.read();
      }
  }
}

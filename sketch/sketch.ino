
// pins for Ultrasoound.
const int ECHOPIN = 2;
const int TRIGPIN = 3;

// pins for joystick. Only use X as we just want to change between different options.
const int XPIN = A5;
const int BPIN = 9;

long duration;
int distance; 

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  pinMode(TRIGPIN, OUTPUT); // Sets the trigPin as an OUTPUT
  pinMode(ECHOPIN, INPUT); // Sets the echoPin as an INPUT

  pinMode(9,INPUT); 
  digitalWrite(9,HIGH); 
}

void loop() {
  potentiometer();
  calculateDistance();
  useJoystick();
  
  delay(200);
}

/**
 * Use the joystick.
 */
void useJoystick() {
  int xValue = analogRead(XPIN);   
  int mappedX = map(xValue, 0, 1023, 1, 5);
  
  int bValue = digitalRead(BPIN);
  Serial.print(mappedX);
  Serial.print(";");
  Serial.println(!bValue);
}

void potentiometer() {
  int ardRead = analogRead(A0);
  int mappedVal = map(ardRead, 0, 1023, 0, 255);
  
  Serial.print(mappedVal);  // Print the potentiometer value to serial.
  Serial.print(";");  
}

void calculateDistance() {
  // Clears the trigPin condition
  digitalWrite(TRIGPIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIGPIN, HIGH);   // Sets the trigPin HIGH (ACTIVE) for 10 microseconds
  delayMicroseconds(10);
  digitalWrite(TRIGPIN, LOW);
  
  duration = pulseIn(ECHOPIN, HIGH); // read echopin and return sound wave travel time in seconds
  distance = duration * 0.034 / 2; // Speed of sound wave divided by 2 (go and back)

//  String x = ;
  Serial.print(distance);  // Print the distance to serial.
  Serial.print(";");  
}

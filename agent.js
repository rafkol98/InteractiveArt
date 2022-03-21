// AUTHOR: 210017984
/**
 * Create a new agent object.
 * @param maxNoiseRange - the noise range
 * @param maxVelocity 
 */
var Agent = function (maxNoiseRange, maxVelocity) {
  this.agentVector = createVector(random(canvas.width), random(canvas.height));
  this.agentVectorOld = this.agentVector.copy();
  this.stepSize = random(1, maxVelocity); // length of the step.
  this.noiseZ = random(maxNoiseRange); // create random noise (movement) up to a passed in range.
  this.left = true; 
  this.up = true;
};

/**
 * Update an agent. Updates both horizontal and vertical movement but also appearance (size).
 * @param agentWidth - the width/size of the agent.
 * @param left - boolean flag whether the agent is moving leftwards.
 * @param up - boolean flag whether the agent is moving upwards.
 */
Agent.prototype.update = function (agentWidth, angle, left, up) {
  this.moveHorizontally(left, angle) // move the agent horizontally.
  this.moveVertically(up, angle) // move the agent vertically.

  this.endLessMovement(); // create endless movements of the agents.

  strokeWeight(agentWidth * this.stepSize);
  // create a new line starting from the previous agent to the current.
  line(this.agentVectorOld.x, this.agentVectorOld.y, this.agentVector.x, this.agentVector.y); 

  this.agentVectorOld = this.agentVector.copy(); // create old agentVectors copy.
};

/**
 * Make them agents move endlessly.
 */
Agent.prototype.endLessMovement = function() {
  // If the agent went out of the canvas from the left, then put them on the right 
  // just outside the border without changing their movement direction. This way they
  // will come back in the canvas in the next steps.
  if (this.agentVector.x < -10) {
    this.agentVectorOld.x = width + 10;
    this.agentVector.x = width + 10;
   
  }
  // If the agent went out of the canvas from the right, then put them on the left 
  // just outside the border without changing their movement direction. This way they
  // will come back in the canvas in the next steps.
  if (this.agentVector.x > width + 10) {
    this.agentVectorOld.x = -10;
    this.agentVector.x = -10;
    
  }
  // If the agents went out of the canvas from the bottom, place them just outside the top of the canvas,
  // without changing their direction - will come back in the next steps.
  if (this.agentVector.y < -10) {
    this.agentVectorOld.y = height + 10;
    this.agentVector.y = height + 10;
  }
  // If the agents went out of the canvas from the top, place them just outside the bottom of the canvas,
  // without changing their direction - will come back in the next steps.
  if (this.agentVector.y > height + 10) {
    this.agentVectorOld.y = -10;
    this.agentVector.y = -10;
  }
}

/**
 * Move an agent horizontally.
 */
Agent.prototype.moveHorizontally = function(left, angle) {
  // Move agents to the left.
  if (left) {
    this.agentVector.x -= cos(angle) * this.stepSize;
  } 
  // Move agents to the right.
  else {
    this.agentVector.x += cos(angle) * this.stepSize;
  }
}

/**
 * Move an agent vertically.
 */
Agent.prototype.moveVertically = function(up, angle) {
  // Move agents upwards.
  if (up) {
    this.agentVector.y -= sin(angle) * this.stepSize;
  } 
  // Move agents downwards.
  else {
    this.agentVector.y += sin(angle) * this.stepSize;
  }
}

/**
 * Move the agents normally.
 */
Agent.prototype.normal = function (agentWidth, noiseScale, noiseStrength) {
  angle = noise(this.agentVector.x / noiseScale, this.agentVector.y / noiseScale, this.noiseZ) * noiseStrength;
  this.update(agentWidth, angle, this.left, this.up); // update agent's movement.
};

/**
 * Control the agents using the ultrasonic control.
 */
Agent.prototype.ultrasonicControl = function (agentWidth, noiseScale, noiseStrength, direction) {
  angle = noise(this.agentVector.x / noiseScale, this.agentVector.y / noiseScale, this.noiseZ) * noiseStrength;
  // change direction when ultrasonic control.
  if (direction == 1) {
    this.update(agentWidth, angle, !this.left, this.up);
  } else if (direction == 2) {
    this.update(agentWidth, angle, this.left, !this.up);
  } else {
    this.update(agentWidth, angle, !this.left, !this.up);
  }
};

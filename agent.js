/**
 * 
 * @param {*} noiseZRange 
 * @param {*} maxVelocity 
 */
var Agent = function (noiseZRange, maxVelocity) {
  this.vector = createVector(random(canvas.width), random(canvas.height));
  this.vectorOld = this.vector.copy();
  this.stepSize = random(1, maxVelocity);
  this.angle;
  this.noiseZ = random(noiseZRange);
  // move to the left and upwards.
  this.left = true;
  this.up = true;
};

/**
 * Update an agent. Updates both horizontal and vertical movement but also appearance (size).
 */
Agent.prototype.update = function (agentWidth, left, up) {
  this.moveHorizontally(left)
  this.moveVertically(up)

  this.endLessMovement(); // create endless movements of the agents.

  strokeWeight(agentWidth * this.stepSize);
  line(this.vectorOld.x, this.vectorOld.y, this.vector.x, this.vector.y); // create a new line.

  this.vectorOld = this.vector.copy(); // create old vectors copy.
};

/**
 * Make them agents move endlessly.
 */
Agent.prototype.endLessMovement = function() {
  if (this.vector.x < -10) {
    this.vector.x = this.vectorOld.x = width + 10;
  }
  if (this.vector.x > width + 10) {
    this.vector.x = this.vectorOld.x = -10;
  }
  if (this.vector.y < -10) {
    this.vector.y = this.vectorOld.y = height + 10;
  }
  if (this.vector.y > height + 10) {
    this.vector.y = this.vectorOld.y = -10;
  }
}

/**
 * Move an agent horizontally.
 */
Agent.prototype.moveHorizontally = function(left) {
  // Move agents to the left.
  if (left) {
    this.vector.x -= cos(this.angle) * this.stepSize;
  } 
  // Move agents to the right.
  else {
    this.vector.x += cos(this.angle) * this.stepSize;
  }
}

/**
 * Move an agent vertically.
 */
Agent.prototype.moveVertically = function(up) {
  // Move agents upwards.
  if (up) {
    this.vector.y -= sin(this.angle) * this.stepSize;
  } 
  // Move agents downwards.
  else {
    this.vector.y += sin(this.angle) * this.stepSize;
  }
}

// First mode drawing.
Agent.prototype.normal = function (agentWidth, noiseScale, noiseStrength) {
  this.angle = noise(this.vector.x / noiseScale, this.vector.y / noiseScale, this.noiseZ) * noiseStrength;
  this.update(agentWidth, this.left, this.up);
};

// Second mode drawing.
Agent.prototype.ultrasonicControl = function (agentWidth, noiseScale, noiseStrength, direction) {
  this.angle = noise(this.vector.x / noiseScale, this.vector.y / noiseScale, this.noiseZ) * noiseStrength;
  if (direction == 1) {
    this.update(agentWidth, !this.left, this.up);
  } else if (direction == 2) {
    this.update(agentWidth, this.left, !this.up);
  } else {
    this.update(agentWidth, !this.left, !this.up);
  }
};

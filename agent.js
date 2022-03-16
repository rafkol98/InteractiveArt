// create a new agent.
var Agent = function(noiseZRange) {
    this.vector = createVector(random(canvas.width), random(canvas.height));
    this.vectorOld = this.vector.copy();
    this.stepSize = random(1, 5);
    this.angle;
    this.noiseZ = random(noiseZRange);
  };
  
  // Update agents appearance - make them move given width and velocity.
  Agent.prototype.update = function(strokeWidth, noiseZVelocity) {
    this.vector.x += cos(this.angle) * this.stepSize;
    this.vector.y += sin(this.angle) * this.stepSize;
  
    if (this.vector.x < -10) this.vector.x = this.vectorOld.x = width + 10;
    if (this.vector.x > width + 10) this.vector.x = this.vectorOld.x = -10;
    if (this.vector.y < -10) this.vector.y = this.vectorOld.y = height + 10;
    if (this.vector.y > height + 10) this.vector.y = this.vectorOld.y = -10;
  
    strokeWeight(strokeWidth * this.stepSize);
    line(this.vectorOld.x, this.vectorOld.y, this.vector.x, this.vector.y);
  
    this.vectorOld = this.vector.copy(); // create old vectors copy.
    this.noiseZ += noiseZVelocity;
  };
  
  // First mode drawing.
  Agent.prototype.modeOne = function(strokeWidth, noiseScale, noiseStrength, noiseZVelocity) {
    this.angle = noise(this.vector.x / noiseScale, this.vector.y / noiseScale, this.noiseZ) * noiseStrength;
    this.update(strokeWidth, noiseZVelocity);
  };
  
  // Second mode drawing.
  Agent.prototype.modeTwo = function(strokeWidth, noiseScale, noiseStrength, noiseZVelocity) {
    this.angle = noise(this.vector.x / noiseScale, this.vector.y / noiseScale, this.noiseZ) * 24;
    this.angle = (this.angle - floor(this.angle)) * noiseStrength;
    this.update(strokeWidth, noiseZVelocity);
  };
  
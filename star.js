class Star {
    constructor(mass, orbitSize, eccentricity, tau, color, luminosity = 10) {
      this.position = createVector(0, 0, 0);
      this.mass = mass;
      this.orbitSize = orbitSize;
      this.eccentricity = eccentricity;
      this.radius = 5 * Math.sqrt(mass);
      this.tau = tau;
      this.color = color;
      this.orbitPath = [];
      this.temperature = 2000;
      this.luminosity = luminosity;
  
      this.colorMap = {
        blue: [0, 0, 255],
        red: [255, 0, 0],
        green: [0, 255, 0],
        yellow: [255, 255, 0],
        purple: [255, 0, 255],
        orange: [255, 128, 0],
        cyan: [0, 255, 255],
        magenta: [255, 0, 255],
        lime: [128, 255, 0],
        pink: [255, 0, 128],
        teal: [0, 128, 255],
        lavender: [128, 0, 255],
        brown: [128, 64, 0],
        beige: [255, 255, 128],
        maroon: [128, 0, 64],
      };
    }
  
    draw() {
      fill(this.colorMap[this.color]);
      ellipse(
        width / 2 + this.position.x,
        height / 2 + this.position.y,
        this.radius,
        this.radius
      );
    }
  
    drawPath() {
      // The drawPath() function iterates over each point in the orbitPath array, except for the last one. 
      // For each point, it calculates a shade value based on its position in the array, using the map() function. 
      // It then sets the stroke color to the shade value and draws a line between the current point and the next one in the array. 
      // The coordinates of the points are adjusted so that they are centered on the canvas.
      for (let i = 0; i < this.orbitPath.length - 1; i++) {
        const shade = map(i, 0, this.orbitPath.length, 50, 220);
        stroke(shade);
        const startX = this.orbitPath[i].x + width / 2;
        const startY = this.orbitPath[i].y + height / 2;
        const endX = this.orbitPath[i + 1].x + width / 2;
        const endY = this.orbitPath[i + 1].y + height / 2;
        line(startX, startY, endX, endY);
      }
    }
  
    update(time) {
      this.luminosity = this.calculateLuminosity();

      this.position.x = this.orbitSize * Math.cos(this.tau);
      this.position.y = this.orbitSize * Math.sin(this.tau);

      this.orbitPath.push(this.position.copy());
    }
  
    timeToEccentricity(time) {
      // Calculates the eccentric anomaly of the star's position at a given time. 
      // The eccentric anomaly represents the angle between the point on the ellipse where the star is currently 
      // located and the point on the ellipse where the star would be if the orbit were circular.
      const eccentricArray = [];
      const eccentricAnomalyArray = [];
      const distances = [];
      time = time % 2 * Math.PI;
  
      for (let i = 0; i < numOfRecordedPaths; i++) {
        eccentricArray[i] = (2 * Math.PI * i) / numOfRecordedPaths;
        eccentricAnomalyArray[i] =
          eccentricArray[i] - this.eccentricity * Math.sin(eccentricArray[i]);
        distances[i] = Math.abs(eccentricAnomalyArray[i] - time);
      }
  
      return eccentricArray[distances.indexOf(Math.min(...distances))];
    }
    
    calculateLuminosity() {
        const radius = this.radius * 1.496e+11; 
        const temperatureKelvin = this.temperature + 273.15;
        const luminosity = 4 * Math.PI * Math.pow(radius, 2) * 5.67e-8 * Math.pow(temperatureKelvin, 4);
        return luminosity;
    }
}
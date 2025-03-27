// Global variables to store sponge properties
let spongePositions; // Array of cube positions
let spongeSize;      // Size of the smallest cubes
let minZ;            // Minimum z-coordinate for color mapping
let maxZ;            // Maximum z-coordinate for color mapping

function setup() {
  // Create a WEBGL canvas
  createCanvas(800, 600, WEBGL);
  
  // Define initial parameters
  let level = 2;         // Fractal level (0, 1, 2, or 3)
  let initial_size = 300; // Initial cube size in pixels
  
  // Generate the Menger sponge
  let { positions, size } = generateSponge(level, initial_size);
  spongePositions = positions;
  spongeSize = size;
  
  // Calculate min and max z for color gradient
  minZ = Math.min(...positions.map(p => p.z));
  maxZ = Math.max(...positions.map(p => p.z));
}

/** 
 * Generates positions and size for the Menger sponge at a given level
 * @param {number} level - The fractal level
 * @param {number} initial_size - The size of the level-0 cube
 * @returns {Object} - Contains positions array and final cube size
 */
function generateSponge(level, initial_size) {
  let positions = [{ x: 0, y: 0, z: 0 }]; // Start with a single cube at origin
  let size = initial_size;
  
  // Iterate for each level
  for (let l = 1; l <= level; l++) {
    let new_positions = [];
    for (let pos of positions) {
      // Generate 3x3x3 grid of smaller cubes
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          for (let k = -1; k <= 1; k++) {
            // Count how many coordinates are on the edge (-1 or 1)
            let edgeCount = [i, j, k].filter(v => v === -1 || v === 1).length;
            // Keep cubes where at least two coordinates are on the edge
            if (edgeCount >= 2) {
              new_positions.push({
                x: pos.x + i * size / 3,
                y: pos.y + j * size / 3,
                z: pos.z + k * size / 3
              });
            }
          }
        }
      }
    }
    positions = new_positions; // Update positions for next level
    size /= 3;                // Reduce size for next level
  }
  
  return { positions, size };
}

function draw() {
  // Clear the background
  background(0);
  
  // Add ambient light to illuminate the scene softly
  ambientLight(50);
  
  // Create an orbiting point light
  let angle = frameCount * 0.02; // Orbit speed
  let lightPosX = 500 * cos(angle); // Orbit radius of 500
  let lightPosZ = 500 * sin(angle);
  pointLight(255, 255, 255, lightPosX, 0, lightPosZ); // White light
  
  // Rotate the entire sponge around the y-axis
  rotateY(frameCount * 0.01);
  
  // Draw each cube in the sponge
  for (let pos of spongePositions) {
    push(); // Save transformation state
    
    // Move to the cube's position
    translate(pos.x, pos.y, pos.z);
    
    // Calculate color based on z-coordinate (red to blue gradient)
    let t = map(pos.z, minZ, maxZ, 0, 1);
    let c = lerpColor(color(255, 0, 0), color(0, 0, 255), t);
    
    // Set material properties
    ambientMaterial(c);      // Base color for diffuse lighting
    specularMaterial(255);   // White specular highlights
    shininess(50);           // Shininess factor
    
    // Draw the cube
    box(spongeSize);
    
    pop(); // Restore transformation state
  }
}

import * as THREE from "three";

export default function getStarfield({ numStars = 500 } = {}) {
  function randomSpherePoint() {
    // Increase the radius range for farther stars
    const radius = Math.random() * 400 + 400; // Now stars are between 100 and 200 units away
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    // Randomize the hue for more color diversity
    const hue = Math.random(); // Random hue between 0 and 1
    return {
      pos: new THREE.Vector3(x, y, z),
      hue,
      minDist: radius,
    };
  }

  const verts = [];
  const colors = [];
  let col;

  for (let i = 0; i < numStars; i += 1) {
    const p = randomSpherePoint();
    const { pos, hue } = p;

    // Create color using hue, and vary saturation and lightness for diversity
    col = new THREE.Color().setHSL(hue, Math.random() * 0.8 + 0.2, Math.random() * 0.5 + 0.4); // Random saturation and lightness

    verts.push(pos.x, pos.y, pos.z);
    colors.push(col.r, col.g, col.b);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: new THREE.TextureLoader().load(
      "/textures/stars/circle.png"
    ),
  });

  const points = new THREE.Points(geo, mat);
  return points;
}

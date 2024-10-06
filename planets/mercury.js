import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
// THREE.ColorManagement.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;  // disable panning

const mercuryGroup = new THREE.Group();
mercuryGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(mercuryGroup);
const detail = 12;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("https://img1.cgtrader.com/items/2721780/b79c8f9722/pbr-dirty-concrete-8-8k-seamless-texture-with-5-variations-3d-model.jpg"),
});
// material.map.colorSpace = THREE.SRGBColorSpace;
const mercuryMesh = new THREE.Mesh(geometry, material);
mercuryGroup.add(mercuryMesh);

const fresnelMat = getFresnelMat({rimHex : "#808080."});
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
mercuryGroup.add(glowMesh);

const stars = getStarfield({numStars: 2000});
scene.add(stars);

const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5).normalize();
scene.add(sunLight);

async function fetchMercuryData() {
  const mercuryData = {
      name: "Mercury",
      distanceFromSun: "57.9 million km", // Average distance
      equatorialRadius: "2,439.7 km",
      gravity: "3.7 m/s²",
      moons: "0"
  };

  // Update the HTML with Mercury data
  document.getElementById('planet-distance').innerText = `Distance from Sun: ${mercuryData.distanceFromSun}`;
  document.getElementById('planet-radius').innerText = `Equatorial Radius: ${mercuryData.equatorialRadius}`;
  document.getElementById('planet-gravity').innerText = `Gravity: ${mercuryData.gravity}`;
  document.getElementById('planet-moons').innerText = `Moons: ${mercuryData.moons}`;
}

// Call the function to fetch Mercury data when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  fetchMercuryData(); // Call the fetchMercuryData function
  animate(); // Start the animation
});


function animate() {
  requestAnimationFrame(animate);

  mercuryMesh.rotation.y += 0.002;
  glowMesh.rotation.y += 0.002;
  stars.rotation.y -= 0.0002;
  renderer.render(scene, camera);
}

animate();

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);
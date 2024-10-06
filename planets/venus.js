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

const venusGroup = new THREE.Group();
venusGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(venusGroup);
const detail = 12;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Venus_map_NASA_JPL_Magellan-Venera-Pioneer.jpg/400px-Venus_map_NASA_JPL_Magellan-Venera-Pioneer.jpg"),
  bumpScale: 0.04,
});
// material.map.colorSpace = THREE.SRGBColorSpace;
const venusMesh = new THREE.Mesh(geometry, material);
venusGroup.add(venusMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("https://upload.wikimedia.org/wikipedia/commons/6/63/Solarsystemscope_texture_2k_venus_atmosphere.jpg"),
  blending: THREE.AdditiveBlending,
  // alphaTest: 0.3,
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
venusGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat({rimHex : "#b86e00"});
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
venusGroup.add(glowMesh);

const stars = getStarfield({numStars: 2000});
scene.add(stars);

const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5).normalize();
scene.add(sunLight);

function animate() {
  requestAnimationFrame(animate);

  venusMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.0045;
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
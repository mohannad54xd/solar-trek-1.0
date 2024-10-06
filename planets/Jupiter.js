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

const jupiterGroup = new THREE.Group();
jupiterGroup.rotation.z = 3.13 * Math.PI / 180;
scene.add(jupiterGroup);
const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Optional: smooth the controls
  controls.dampingFactor = 0.25; // Optional: adjust damping
  controls.enablePan = false;  // disable panning
const detail = 12;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("https://th.bing.com/th/id/R.13499b529f5bd076a766330d526fcba9?rik=N7h67KGeEtw%2fsg&riu=http%3a%2f%2fvis.sciencemag.org%2fspace-graveyard%2fimg%2ftextures%2fjupitermap.jpg&ehk=ckR9s1BBqSYV8Zh8P08hdFaninIiBw7nyPS7EmmuV%2bQ%3d&risl=&pid=ImgRaw&r=0"),
  bumpScale: 0.04,
});
// material.map.colorSpace = THREE.SRGBColorSpace;
const jupiterMesh = new THREE.Mesh(geometry, material);
jupiterGroup.add(jupiterMesh);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const fresnelMat = getFresnelMat({rimHex : "#b86e00"});
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
jupiterGroup.add(glowMesh);

const stars = getStarfield({numStars: 2000});
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

function animate() {
  requestAnimationFrame(animate);

  jupiterMesh.rotation.y += 0.0018;
  glowMesh.rotation.y += 0.002;
  stars.rotation.y -= 0.0002;
  renderer.render(scene, camera);
}

animate();

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

const plutoGroup = new THREE.Group();
plutoGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(plutoGroup);
const detail = 12;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/23f0f15e-433f-49a3-802f-79b777dfd3e2/db521cw-a833ecba-101c-4bc7-b2e8-4dfd94941c9a.png/v1/fill/w_1600,h_801,q_80,strp/pluto_map_19_1_2019__by_robi777_db521cw-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODAxIiwicGF0aCI6IlwvZlwvMjNmMGYxNWUtNDMzZi00OWEzLTgwMmYtNzliNzc3ZGZkM2UyXC9kYjUyMWN3LWE4MzNlY2JhLTEwMWMtNGJjNy1iMmU4LTRkZmQ5NDk0MWM5YS5wbmciLCJ3aWR0aCI6Ijw9MTYwMCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.7_2wKgVeQFTxv6kVnOwdxjRUC_hoyPWhmwikEyqf1fc"),
  bumpScale: 0.04,
});
// material.map.colorSpace = THREE.SRGBColorSpace;
const plutoMesh = new THREE.Mesh(geometry, material);
plutoGroup.add(plutoMesh);

const fresnelMat = getFresnelMat({rimHex : "#DCDCDC"});
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
plutoGroup.add(glowMesh);

const stars = getStarfield({numStars: 2000});
scene.add(stars);

const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5).normalize();
scene.add(sunLight);

function animate() {
  requestAnimationFrame(animate);

  plutoMesh.rotation.y += 0.002;
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
import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";




const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;  // disable panning

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);
const detail = 12
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
    map: loader.load("https://th.bing.com/th/id/R.104467cb39c42f297296b0bbd4a3f481?rik=hPjkPpaK68wcgg&pid=ImgRaw&r=0"),
    specularMap: loader.load("https://www.researchgate.net/publication/321536667/figure/fig14/AS:568250895433731@1512492979899/Regions-of-the-ocean-where-the-non-black-pixel-correction-is-likely-to-be-applied.png"),
    bumpMap: loader.load("https://th.bing.com/th/id/OIP.IcFYGOwgDrOKLe3HwVcahgHaDt?rs=1&pid=ImgDetMain"),
    bumpScale: 0.04,
});
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
    map: loader.load("https://upload.wikimedia.org/wikipedia/commons/5/5d/City_Lights_2012_-_Flat_map.jpg"),
    blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
    map: loader.load("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/18fc9e8c-8d1d-4492-a808-d125b9310556/d7pxfv4-6a44b369-8c61-41c8-937b-432f356e5ec7.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzE4ZmM5ZThjLThkMWQtNDQ5Mi1hODA4LWQxMjViOTMxMDU1NlwvZDdweGZ2NC02YTQ0YjM2OS04YzYxLTQxYzgtOTM3Yi00MzJmMzU2ZTVlYzcucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ee-eKe4cRDHjefvkVSp2FdJrh0kSKMU9FOsYQC3-5pk"),
    transparent: true,
    blending: THREE.AdditiveBlending,
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const stars = getStarfield({ numStars: 2000 });
scene.add(stars);

const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5).normalize();
scene.add(sunLight);

// Function to fetch Earth data
async function fetchEarthData() {
    const earthData = {
        name: "Earth",
        distanceFromSun: "149.6 million km", // Average distance
        equatorialRadius: "6,371 km",
        gravity: "9.807 m/s²",
        moons: "1 (Moon)"
    };

    // Update the HTML with Earth data
    document.getElementById('planet-distance').innerText = `Distance from Sun: ${earthData.distanceFromSun}`;
    document.getElementById('planet-radius').innerText = `Equatorial Radius: ${earthData.equatorialRadius}`;
    document.getElementById('planet-gravity').innerText = `Gravity: ${earthData.gravity}`;
    document.getElementById('planet-moons').innerText = `Moons: ${earthData.moons}`;
}

// Call the function to fetch Earth data when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    fetchEarthData(); // Call the fetchEarthData function
    animate(); // Start the animation
});

// Animation function for Earth and stars
function animate() {
    requestAnimationFrame(animate);

    earthMesh.rotation.y += 0.002;
    lightsMesh.rotation.y += 0.002;
    cloudsMesh.rotation.y += 0.0033;
    glowMesh.rotation.y += 0.002;
    stars.rotation.y -= 0.0002;
    renderer.render(scene, camera);
}

// Handle window resizing
function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);

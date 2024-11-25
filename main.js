import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Box from "./src/box";
import {
  spawnEnemy,
  enemiesActions,
  playerActions,
  addPlayerEvents,
} from "./src/core";

// 1. create a scene
const scene = new THREE.Scene();

// 2. create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 8;
camera.position.y = 3;
camera.position.x = 3;

// 3. create objects and add them to the scene
const player = new Box({ width: 1, height: 1, depth: 1 });
player.castShadow = true;
scene.add(player);

const ground = new Box({
  width: 10,
  height: 0.5,
  depth: 15,
  color: 0x0014f6,
  phongMaterial: true,
  position: {
    x: 0,
    y: -2,
    z: -2,
  },
});
ground.receiveShadow = true;
scene.add(ground);

// 4. add Light to the scene
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-1, 3, 1);
light.castShadow = true;
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// 5. create the renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// ADD EVENTS
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});
addPlayerEvents();

const enemies = [];
const game = {
  score: 1,
  spawnRate: 100,
  frames: 0,
};

// 6. animate
function animate() {
  const animationId = requestAnimationFrame(animate);
  renderer.render(scene, camera);

  // do all the actions related to the player
  playerActions(player, ground);

  spawnEnemy(game, enemies, ground, scene);

  // do all the actions related to the enemies
  enemiesActions(enemies, ground, player, animationId, scene);

  game.frames++;
}

animate();


import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Box from "./src/box";
import {
  spawnEnemy,
  enemiesActions,
  playerActions,
  addPlayerEvents,
  gameOver,
  pauseGame,
  sounds,
} from "./src/core";
import UI from "./src/ui";
import { KEYS } from "./src/utils";

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
renderer.render(scene, camera);

// add 360 background texture
const textureLoader = new THREE.TextureLoader();
textureLoader.load("/textures/futuristic-bg.jpg", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.magFilter = THREE.LinearFilter; // Smooth scaling
  texture.minFilter = THREE.LinearMipmapLinearFilter; // Better downscaling
  texture.colorSpace = THREE.SRGBColorSpace; // Preserve correct colors

  scene.background = texture; // Set the 360° background
  renderer.render(scene, camera);
});

// ADD EVENTS
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});
addPlayerEvents();

const enemies = [];
const game = {
  score: 0,
  spawnRate: 100,
  frames: 0,
};

let isGameOver = false;
const ui = new UI();

// 6. animate
function animate() {
  const animationId = requestAnimationFrame(animate);
  renderer.render(scene, camera);

  // do all the actions related to the player
  isGameOver = playerActions(player, ground);
  if (isGameOver)
    return gameOver(animationId, ui, scene, player, enemies, game);

  spawnEnemy(game, enemies, ground, scene);

  // do all the actions related to the enemies
  isGameOver = enemiesActions(enemies, ground, player, scene);
  if (isGameOver)
    return gameOver(animationId, ui, scene, player, enemies, game);

  ui.setScore(game.score);

  // check if the game is paused
  if (KEYS.p.pressed || KEYS.esc.pressed) return pauseGame(animationId, ui);

  game.frames++;
}

// ADD THE UI OF THE GAME.
ui.onPlay(animate);
ui.onSound((isOn) => {
  if(isOn) {
    sounds.background.play();
    for (const sound in sounds) {
      if(sound != "background") {
        sounds[sound].volume = 1.0;
      }
    }
  } else {
    sounds.background.pause();
    for (const sound in sounds) {
      if(sound != "background") {
        sounds[sound].volume = 0.0;
      }
    }
  }
})
ui.insertToDom();


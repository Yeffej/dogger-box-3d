import { KEYS, onKeyPress, remove3dObj } from "./utils";
import Box from "./box";

const background = new Audio("./sounds/background.mp3");
background.loop = true;
background.volume = 0.5;
const start = new Audio("./sounds/game-start.mp3");
start.volume = 0.0;
const jump = new Audio("./sounds/jump.mp3");
jump.volume = 0.0;
const over = new Audio("./sounds/game-over.wav");
over.volume = 0.0;

export const sounds = {
  background,
  start,
  jump,
  over
}

const movementSpeed = 3;

// returns true if the game is over
export function playerActions(player, ground) {
  // neutral movement (velocity)
  player.velocity.x = 0;
  player.velocity.z = 0;

  // vertical movement; TODO: add friction
  if (KEYS.w.pressed) {
    player.velocity.z = -movementSpeed;
  } else if (KEYS.s.pressed) {
    player.velocity.z = movementSpeed;
  }

  // horizontal movement; TODO: add friction
  if (KEYS.a.pressed) {
    player.velocity.x = -movementSpeed;
  } else if (KEYS.d.pressed) {
    player.velocity.x = movementSpeed;
  }

  // jumping
  if (KEYS.space.pressed) {
    player.jump(ground);
  }

  // if player is out of bounds, the game is over
  if (player.checkIfOutBounds(ground)) return true;

  player.update(ground);

  return false; // the game is not over
}

// if return true the enemy has collided with the player
export function enemiesActions(enemies, ground, player, scene) {
  let isPlayerDead = false;

  enemies.forEach((enemy) => {
    // acelerate the enemy in the z axis
    enemy.velocity.z += 2 * enemy.timeStep;
    enemy.update(ground);

    if (enemy.colladingWith(player)) {
      // the game is over
      isPlayerDead = true;
    }

    if (enemy.checkIfOutBounds(ground)) {
      // remove enemy from scene and enemies array
      remove3dObj(enemy, scene);
      const index = enemies.indexOf(enemy);
      if (index > -1) enemies.splice(index, 1);
    }
  });

  return isPlayerDead;
}

export function spawnEnemy(game, enemies, ground, scene) {
  // spawn enimies by frame passed
  if (game.frames % game.spawnRate == 0) {
    // DECREASE SPAWN RATE BY TIME PASS
    if (game.spawnRate > 30 && game.score % 10 == 0) {
      game.spawnRate -= 30;
    }

    const randomPositionX = (Math.random() - 0.5) * ground.width;
    const enemy = new Box({
      width: 1,
      height: 1,
      depth: 1,
      color: 0xff0000,
      position: {
        x: randomPositionX,
        y: 0,
        z: -7,
      },
    });

    enemy.castShadow = true;
    scene.add(enemy);
    enemies.push(enemy);

    // increase the score by enemy created.
    game.score++;
    // console.log(game);
  }
}

export function addPlayerEvents() {
  window.addEventListener("keydown", (e) => {
    onKeyPress(e.code, true);
  });

  window.addEventListener("keyup", (e) => {
    onKeyPress(e.code, false);
  });
}

export function gameOver(animationId, ui, scene, player, enemies, game) {
  // game over sound.
  sounds.over.play();

  // reset game stats
  game.score = 0;
  game.spawnRate = 100;
  game.frames = 0;

  // remove enemies from scene
  enemies.forEach((enemy) => {
    remove3dObj(enemy, scene);
  });
  enemies.length = 0; // wipe the array mantaining the reference

  // reset player position and velocity
  player.position.set(0, 0, 0);
  player.velocity = { x: 0, y: 0, z: 0 };

  ui.goTo("main");
  return cancelAnimationFrame(animationId);
}

export function pauseGame(animationId, ui) {
  ui.mainPlayBtn.textContent = "Pause";
  ui.goTo("main");
  return cancelAnimationFrame(animationId);
}

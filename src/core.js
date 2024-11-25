import { KEYS, remove3dObj } from "./utils";
import Box from "./box";

const movementSpeed = 3;

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

  player.update(ground);
}

export function enemiesActions(enemies, ground, player, animationId, scene) {
  enemies.forEach((enemy) => {
    // acelerate the enemy in the z axis
    enemy.velocity.z += 2 * enemy.timeStep;
    enemy.update(ground);

    if (enemy.colladingWith(player)) {
      cancelAnimationFrame(animationId);
    }

    if (enemy.checkIfOutBounds(ground)) {
      // remove enemy from scene and enemies array
      remove3dObj(enemy, scene);
      const index = enemies.indexOf(enemy);
      if (index > -1) enemies.splice(index, 1);
    }
  });
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
    switch (e.code) {
      case "KeyW":
        KEYS.w.pressed = true;
        break;

      case "KeyS":
        KEYS.s.pressed = true;
        break;

      case "KeyA":
        KEYS.a.pressed = true;
        break;

      case "KeyD":
        KEYS.d.pressed = true;
        break;

      case "Space":
        KEYS.space.pressed = true;
        break;

      default:
        break;
    }
  });

  window.addEventListener("keyup", (e) => {
    switch (e.code) {
      case "KeyW":
        KEYS.w.pressed = false;
        break;

      case "KeyS":
        KEYS.s.pressed = false;
        break;

      case "KeyA":
        KEYS.a.pressed = false;
        break;

      case "KeyD":
        KEYS.d.pressed = false;
        break;

      case "Space":
        KEYS.space.pressed = false;
        break;

      default:
        break;
    }
  });
}

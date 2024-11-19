import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'


class Box extends THREE.Mesh {
  constructor({ 
    width,
    height,
    depth,
    color = 0x00ff00,
    phongMaterial = false,
    position = {x: 0, y: 0, z: 0},
    velocity = {x: 0, y: 0, z: 0},
    // friction = 0.02
  }) {
    // call parent constructor
    let material = new THREE.MeshStandardMaterial({ color })

    if (phongMaterial) {
      material = new THREE.MeshPhongMaterial({ color })
    }

    super(
      new THREE.BoxGeometry(width, height, depth),
      material
    )

    // init box properties
    this.width = width
    this.height = height
    this.depth = depth
    this.position.set(position.x, position.y, position.z)
    this.velocity = velocity
    this.gravity = 9.8
    // this.friction = friction
    const FRAMES = 60
    this.timeStep = 1/FRAMES

    this.#calculateBoundaries()
  }

  update(ground) {
    this.#calculateBoundaries()

    // apply position movement
    this.position.x += this.velocity.x * this.timeStep
    this.position.y += this.velocity.y * this.timeStep
    this.position.z += this.velocity.z * this.timeStep

    this.#applyGravity(ground)
  }

  #calculateBoundaries() {
    this.top = this.position.y + this.height / 2
    this.bottom = this.position.y - this.height / 2

    this.left = this.position.x - this.width / 2
    this.right = this.position.x + this.width / 2

    this.front = this.position.z - this.depth / 2
    this.back = this.position.z + this.depth / 2
  }

  #applyGravity(ground) {
    if(this.colladingWith(ground)) {
      this.velocity.y = -this.velocity.y * 0.5
    } else {
      this.velocity.y += -this.gravity * this.timeStep
    }
  }

  colladingWith(otherBox) {
    const collisionX = this.right >= otherBox.left && this.left <= otherBox.right
    const collisionY = this.top >= otherBox.bottom &&
    // the calculation is made to sum the velocity in which an object impact the other. 
    // otherwise the object will cross the object
      (this.bottom + this.velocity.y * this.timeStep) <= otherBox.top
    const collisionZ = this.back >= otherBox.front && this.front <= otherBox.back

    return collisionX && collisionY && collisionZ
  }

  jump(platform, velocity = 5) {
    if(this.colladingWith(platform)) {
      this.velocity.y = velocity
    } 
  }

  checkIfOutBounds(ground) {
    const distance = this.position.distanceTo(ground.position);
    return distance > 20
  }

}


// 1. create a scene
const scene = new THREE.Scene()

// 2. create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 8
camera.position.y = 3
camera.position.x = 3

// 3. create objects and add them to the scene
const cube = new Box({ width: 1, height: 1, depth: 1 })
cube.castShadow = true
scene.add(cube)

const ground = new Box({
  width: 10,
  height: 0.5,
  depth: 15,
  color: 0x0014f6,
  phongMaterial: true,
  position: {
    x: 0,
    y: -2,
    z: -2
  }
})
ground.receiveShadow = true
scene.add(ground)

// 4. add Light to the scene
const light = new THREE.DirectionalLight(0xFFFFFF, 1)
light.position.set(-1, 3, 1)
light.castShadow = true
scene.add(light)
scene.add(new THREE.AmbientLight(0xFFFFFF, 0.5))

// 5. create the renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

// APPLY MOVEMENT
const keys = {
  w: {
    pressed: false
  },
  s: {
    pressed: false
  },
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  space: {
    pressed: false
  },
}

window.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'KeyW':
      keys.w.pressed = true
      break;

    case 'KeyS':
      keys.s.pressed = true
      break;

    case 'KeyA':
      keys.a.pressed = true
      break;

    case 'KeyD':
      keys.d.pressed = true
      break;

    case 'Space':
      keys.space.pressed = true
      break;
  
    default:
      break;
  }
})

window.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'KeyW':
      keys.w.pressed = false
      break;

    case 'KeyS':
      keys.s.pressed = false
      break;

    case 'KeyA':
      keys.a.pressed = false
      break;

    case 'KeyD':
      keys.d.pressed = false
      break;

    case 'Space':
      keys.space.pressed = false
      break;
  
    default:
      break;
  }
})

// remove a 3d object from scene and free memory
function removeObj(obj) {
  scene.remove(obj)
  // free memory
  cube.geometry.dispose()
  cube.material.dispose()
}

const enemies = []
const movementSpeed = 3

let score = 1
let spawnRate = 100
let frames = 0

// 6. animate
function animate() {
  const animationId = requestAnimationFrame(animate)
  renderer.render(scene, camera)

  // neutral movement (velocity)
  cube.velocity.x = 0
  cube.velocity.z = 0

  // vertical movement; TODO: add friction
  if(keys.w.pressed) {
    cube.velocity.z = -movementSpeed
  } else if (keys.s.pressed) {
    cube.velocity.z = movementSpeed
  }

  // horizontal movement; TODO: add friction
  if(keys.a.pressed) {
    cube.velocity.x = -movementSpeed
  } else if (keys.d.pressed) {
    cube.velocity.x = movementSpeed
  }

  // jumping
  if(keys.space.pressed) {
    cube.jump(ground)
  }

  cube.update(ground)

  // spawn enimies by frame passed
  if(frames % spawnRate == 0) {
    // DECREASE SPAWN RATE BY TIME PASS
    if(spawnRate > 30 && score % 10 == 0) {
      spawnRate -= 30
    }


    const randomPositionX = (Math.random() - 0.5) * ground.width 
    const enemy = new Box({
      width: 1,
      height: 1,
      depth: 1,
      color: 0xFF0000,
      position: {
        x: randomPositionX,
        y: 0,
        z:  -7
      },
    })
    
    enemy.castShadow = true
    scene.add(enemy)
    enemies.push(enemy)

    // increase the score by enemy created.
    score++

    console.log('enemies.length:', enemies.length)
  }

  enemies.forEach(enemy => {
    // acelerate the enemy in the z axis
    enemy.velocity.z += 2 * enemy.timeStep
    enemy.update(ground)

    if(enemy.colladingWith(cube)) {
      cancelAnimationFrame(animationId)
    }

    if(enemy.checkIfOutBounds(ground)) {
      // remove enemy from scene and enemies array
      removeObj(enemy)
      const index = enemies.indexOf(enemy);
      if (index > -1) enemies.splice(index, 1);
    }
  })

  frames++
}

animate()

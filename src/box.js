import * as THREE from "three";

class Box extends THREE.Mesh {
  constructor({
    width,
    height,
    depth,
    color = 0x00ff00,
    phongMaterial = false,
    position = { x: 0, y: 0, z: 0 },
    velocity = { x: 0, y: 0, z: 0 },
    // friction = 0.02
  }) {
    let material = new THREE.MeshStandardMaterial({ color });
    if (phongMaterial) {
      material = new THREE.MeshPhongMaterial({ color });
    }

    // call parent constructor
    super(new THREE.BoxGeometry(width, height, depth), material);

    // init box properties
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.position.set(position.x, position.y, position.z);
    this.velocity = velocity;
    this.gravity = 9.8;
    // this.friction = friction
    const FRAMES = 60;
    this.timeStep = 1 / FRAMES;

    this.#calculateBoundaries();
  }

  update(ground) {
    this.#calculateBoundaries();

    // apply position movement
    this.position.x += this.velocity.x * this.timeStep;
    this.position.y += this.velocity.y * this.timeStep;
    this.position.z += this.velocity.z * this.timeStep;

    this.#applyGravity(ground);
  }

  #calculateBoundaries() {
    this.top = this.position.y + this.height / 2;
    this.bottom = this.position.y - this.height / 2;

    this.left = this.position.x - this.width / 2;
    this.right = this.position.x + this.width / 2;

    this.front = this.position.z - this.depth / 2;
    this.back = this.position.z + this.depth / 2;
  }

  #applyGravity(ground) {
    if (this.colladingWithGround(ground)) {
      this.velocity.y = -this.velocity.y * 0.5;
    } else {
      this.velocity.y += -this.gravity * this.timeStep;
    }
  }

  colladingWith(otherBox) {
    const collisionX =
      this.right >= otherBox.left && this.left <= otherBox.right;

    // the calculation is made to sum the velocity in which an object impact the other. otherwise the object will cross the object
    const bottom = this.bottom + this.velocity.y * this.timeStep;
    const collisionY = this.top >= otherBox.bottom && bottom <= otherBox.top;

    const collisionZ =
      this.back >= otherBox.front && this.front <= otherBox.back;

    return collisionX && collisionY && collisionZ;
  }

  // this function is require because Im using a very simple collision system
  colladingWithGround(ground) {
    const collisionX = this.right >= ground.left && this.left <= ground.right;

    const bottom = this.bottom + this.velocity.y * this.timeStep;
    const collisionY =
      this.top >= ground.top &&
      bottom <= ground.top &&
      bottom >= ground.top - 0.1;

    const collisionZ = this.back >= ground.front && this.front <= ground.back;

    return collisionX && collisionY && collisionZ;
  }

  jump(platform, velocity = 5) {
    if (this.colladingWithGround(platform)) {
      this.velocity.y = velocity;
    }
  }

  checkIfOutBounds(ground) {
    const distance = this.position.distanceTo(ground.position);
    return distance > 20;
  }
}

export default Box;

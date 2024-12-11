export const KEYS = {
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
  p: {
    pressed: false,
  },
  esc: {
    pressed: false,
  },
};

export const onKeyPress = (code, isPressed) => {
  switch (code) {
    case "KeyW":
      KEYS.w.pressed = isPressed;
      break;

    case "KeyS":
      KEYS.s.pressed = isPressed;
      break;

    case "KeyA":
      KEYS.a.pressed = isPressed;
      break;

    case "KeyD":
      KEYS.d.pressed = isPressed;
      break;

    case "Space":
      KEYS.space.pressed = isPressed;
      break;

    case "KeyP":
      KEYS.p.pressed = isPressed;
      break;

    case "Escape":
      KEYS.esc.pressed = isPressed;
      break;
  }
};

// remove a 3d object from scene and free memory
export const remove3dObj = (obj, scene) => {
  scene.remove(obj);
  // free memory
  obj.geometry.dispose();
  obj.material.dispose();
};

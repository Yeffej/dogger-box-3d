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
};

// remove a 3d object from scene and free memory
export const remove3dObj = (obj, scene) => {
  scene.remove(obj);
  // free memory
  obj.geometry.dispose();
  obj.material.dispose();
};

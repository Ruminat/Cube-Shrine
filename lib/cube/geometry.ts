import * as THREE from "three";

let cubieGeometry: THREE.BoxGeometry | null = null;

export const getCubieGeometry = (): THREE.BoxGeometry => {
  if (!cubieGeometry) {
    cubieGeometry = new THREE.BoxGeometry(1, 1, 1);
  }
  return cubieGeometry;
};

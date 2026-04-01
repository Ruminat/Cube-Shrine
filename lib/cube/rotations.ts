import * as THREE from "three";
import type { RotationStep } from "@/types/cube";
import type { CubeCubie } from "./factory";

const EPSILON = 0.01;

const axisByFace: Record<RotationStep["face"], THREE.Vector3> = {
  U: new THREE.Vector3(0, 1, 0),
  D: new THREE.Vector3(0, -1, 0),
  L: new THREE.Vector3(-1, 0, 0),
  R: new THREE.Vector3(1, 0, 0),
  F: new THREE.Vector3(0, 0, 1),
  B: new THREE.Vector3(0, 0, -1),
  // M follows L-direction conventions in cubing notation.
  M: new THREE.Vector3(-1, 0, 0),
  S: new THREE.Vector3(0, 0, 1),
  u: new THREE.Vector3(0, 1, 0),
  d: new THREE.Vector3(0, -1, 0),
  l: new THREE.Vector3(-1, 0, 0),
  r: new THREE.Vector3(1, 0, 0),
  f: new THREE.Vector3(0, 0, 1),
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1)
};

const layerByFace: Record<RotationStep["face"], "x" | "y" | "z"> = {
  U: "y",
  D: "y",
  L: "x",
  R: "x",
  F: "z",
  B: "z",
  M: "x",
  S: "z",
  u: "y",
  d: "y",
  l: "x",
  r: "x",
  f: "z",
  x: "x",
  y: "y",
  z: "z"
};

const layerSign: Record<RotationStep["face"], number> = {
  U: 1,
  D: -1,
  L: -1,
  R: 1,
  F: 1,
  B: -1,
  M: 0,
  S: 0,
  u: 1,
  d: -1,
  l: -1,
  r: 1,
  f: 1,
  x: 1,
  y: 1,
  z: 1
};

const isWholeCubeMove = (face: RotationStep["face"]): boolean =>
  face === "x" || face === "y" || face === "z";

const isWideMove = (face: RotationStep["face"]): face is "u" | "d" | "l" | "r" | "f" =>
  face === "u" || face === "d" || face === "l" || face === "r" || face === "f";

const roundToLayer = (value: number): number => Math.round(value);

export const rotateFace = (
  cubies: CubeCubie[],
  step: RotationStep,
  cubeGroup: THREE.Group,
  spacing: number
) => {
  const axis = axisByFace[step.face];
  const layerAxis = layerByFace[step.face];
  const sign = layerSign[step.face];
  // Invert parser angle sign to match standard cube notation direction.
  const radians = THREE.MathUtils.degToRad(-step.angle);
  const selected = cubies.filter((cubie) => {
    if (isWholeCubeMove(step.face)) {
      return true;
    }
    const coord = cubie.userData.coord[layerAxis];
    if (isWideMove(step.face)) {
      return sign > 0 ? coord > -EPSILON : coord < EPSILON;
    }
    return Math.abs(coord - sign) < EPSILON;
  });

  selected.forEach((cubie) => {
    cubie.position.applyAxisAngle(axis, radians);
    cubie.rotateOnWorldAxis(axis, radians);
    cubie.userData.coord.set(
      roundToLayer(cubie.position.x / spacing),
      roundToLayer(cubie.position.y / spacing),
      roundToLayer(cubie.position.z / spacing)
    );
  });

  cubeGroup.updateMatrixWorld(true);
};

export const applyPreparation = (
  cubies: CubeCubie[],
  cubeGroup: THREE.Group,
  spacing: number,
  rotations: RotationStep[]
) => {
  rotations.forEach((rotation) => rotateFace(cubies, rotation, cubeGroup, spacing));
};

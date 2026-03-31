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
  M: new THREE.Vector3(1, 0, 0),
  S: new THREE.Vector3(0, 0, 1)
};

const layerByFace: Record<RotationStep["face"], "x" | "y" | "z"> = {
  U: "y",
  D: "y",
  L: "x",
  R: "x",
  F: "z",
  B: "z",
  M: "x",
  S: "z"
};

const layerSign: Record<RotationStep["face"], number> = {
  U: 1,
  D: -1,
  L: -1,
  R: 1,
  F: 1,
  B: -1,
  M: 0,
  S: 0
};

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
  const selected = cubies.filter(
    (cubie) => Math.abs(cubie.userData.coord[layerAxis] - sign) < EPSILON
  );

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

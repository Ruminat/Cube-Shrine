import * as THREE from "three";
import { getCubieGeometry } from "./geometry";
import type { CubeMaterialSet } from "./colors";

export type CubeCubie = THREE.Mesh<THREE.BoxGeometry, THREE.Material[]> & {
  userData: { coord: THREE.Vector3 };
};

const axisPositions = [-1, 0, 1];

const materialsForCubie = (
  x: number,
  y: number,
  z: number,
  materialSet: CubeMaterialSet
): THREE.Material[] => [
  x === 1 ? materialSet.red : materialSet.hidden,
  x === -1 ? materialSet.orange : materialSet.hidden,
  y === 1 ? materialSet.white : materialSet.hidden,
  y === -1 ? materialSet.yellow : materialSet.hidden,
  z === 1 ? materialSet.green : materialSet.hidden,
  z === -1 ? materialSet.blue : materialSet.hidden
];

export const createCubeElements = (
  cubeElementSize: number,
  cubeGap: number,
  materialSet: CubeMaterialSet
): CubeCubie[] => {
  const spacing = cubeElementSize + cubeGap;
  const geometry = getCubieGeometry();
  const cubies: CubeCubie[] = [];

  axisPositions.forEach((x) => {
    axisPositions.forEach((y) => {
      axisPositions.forEach((z) => {
        const cubie = new THREE.Mesh(
          geometry,
          materialsForCubie(x, y, z, materialSet)
        ) as unknown as CubeCubie;

        cubie.scale.setScalar(cubeElementSize);
        cubie.position.set(x * spacing, y * spacing, z * spacing);
        cubie.userData = { coord: new THREE.Vector3(x, y, z) };
        cubies.push(cubie);
      });
    });
  });

  return cubies;
};

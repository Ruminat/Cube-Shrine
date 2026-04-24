import type { RotationStep } from "./cubeTypes";
import type { Axis, Cubie, NormalKey, PaletteKey, Vector3 } from "./cubieModel";
import { normalToVector, vectorToNormal } from "./geometry";
import { roundCoord } from "./coords";

export const rotateVector = (vector: Vector3, axis: Axis, direction: 1 | -1): Vector3 => {
  if (axis === "x") {
    return direction === 1
      ? { x: vector.x, y: -vector.z, z: vector.y }
      : { x: vector.x, y: vector.z, z: -vector.y };
  }
  if (axis === "y") {
    return direction === 1
      ? { x: vector.z, y: vector.y, z: -vector.x }
      : { x: -vector.z, y: vector.y, z: vector.x };
  }
  return direction === 1
    ? { x: -vector.y, y: vector.x, z: vector.z }
    : { x: vector.y, y: -vector.x, z: vector.z };
};

export const createSolvedCubies = (): Cubie[] => {
  const cubies: Cubie[] = [];
  for (let x = -1; x <= 1; x += 1) {
    for (let y = -1; y <= 1; y += 1) {
      for (let z = -1; z <= 1; z += 1) {
        const stickers: Partial<Record<NormalKey, PaletteKey>> = {};
        if (x === 1) stickers["x+"] = "green";
        if (x === -1) stickers["x-"] = "blue";
        if (y === 1) stickers["y+"] = "yellow";
        if (y === -1) stickers["y-"] = "white";
        if (z === 1) stickers["z+"] = "orange";
        if (z === -1) stickers["z-"] = "red";
        cubies.push({ x, y, z, stickers });
      }
    }
  }
  return cubies;
};

const applyQuarterTurn = (
  cubies: Cubie[],
  axis: Axis,
  direction: 1 | -1,
  selector: (cubie: Cubie) => boolean
) => {
  cubies.forEach((cubie) => {
    if (!selector(cubie)) return;

    const rotatedCoord = rotateVector(cubie, axis, direction);
    cubie.x = roundCoord(rotatedCoord.x);
    cubie.y = roundCoord(rotatedCoord.y);
    cubie.z = roundCoord(rotatedCoord.z);

    const nextStickers: Partial<Record<NormalKey, PaletteKey>> = {};
    Object.entries(cubie.stickers).forEach(([normal, color]) => {
      if (!color) return;
      const rotatedNormal = rotateVector(normalToVector(normal as NormalKey), axis, direction);
      nextStickers[vectorToNormal(rotatedNormal)] = color;
    });
    cubie.stickers = nextStickers;
  });
};

export const applyRotationStep = (cubies: Cubie[], step: RotationStep) => {
  const turns = Math.abs(step.angle) === 180 ? 2 : 1;
  const stepDirection: 1 | -1 = step.angle > 0 ? 1 : -1;

  const faceConfig: Record<
    RotationStep["face"],
    { axis: Axis; cw: 1 | -1; selector: (cubie: Cubie) => boolean }
  > = {
    U: { axis: "y", cw: -1, selector: (cubie) => cubie.y === 1 },
    D: { axis: "y", cw: 1, selector: (cubie) => cubie.y === -1 },
    L: { axis: "x", cw: 1, selector: (cubie) => cubie.x === -1 },
    R: { axis: "x", cw: -1, selector: (cubie) => cubie.x === 1 },
    F: { axis: "z", cw: -1, selector: (cubie) => cubie.z === 1 },
    B: { axis: "z", cw: 1, selector: (cubie) => cubie.z === -1 },
    M: { axis: "x", cw: 1, selector: (cubie) => cubie.x === 0 },
    S: { axis: "z", cw: -1, selector: (cubie) => cubie.z === 0 },
    u: { axis: "y", cw: -1, selector: (cubie) => cubie.y >= 0 },
    d: { axis: "y", cw: 1, selector: (cubie) => cubie.y <= 0 },
    l: { axis: "x", cw: 1, selector: (cubie) => cubie.x <= 0 },
    r: { axis: "x", cw: -1, selector: (cubie) => cubie.x >= 0 },
    f: { axis: "z", cw: -1, selector: (cubie) => cubie.z >= 0 },
    x: { axis: "x", cw: -1, selector: () => true },
    y: { axis: "y", cw: -1, selector: () => true },
    z: { axis: "z", cw: -1, selector: () => true }
  };

  const config = faceConfig[step.face];
  const direction = (config.cw * stepDirection) as 1 | -1;

  for (let turnIndex = 0; turnIndex < turns; turnIndex += 1) {
    applyQuarterTurn(cubies, config.axis, direction, config.selector);
  }
};

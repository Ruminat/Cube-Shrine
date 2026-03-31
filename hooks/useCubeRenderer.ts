"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { RotationStep } from "@/types/cube";
import { useCSSVariables } from "./useCSSVariables";

interface UseCubeRendererOptions {
  size: number;
  preparationRotations: RotationStep[];
  interactive?: boolean;
}

type NormalKey = "x+" | "x-" | "y+" | "y-" | "z+" | "z-";
type PaletteKey = "white" | "yellow" | "red" | "orange" | "green" | "blue";
type Axis = "x" | "y" | "z";

interface Cubie {
  x: number;
  y: number;
  z: number;
  stickers: Partial<Record<NormalKey, PaletteKey>>;
}

interface CubeRendererRefs {
  mountRef: RefObject<HTMLDivElement | null>;
  cubiesRef: RefObject<Cubie[]>;
  redrawRef: RefObject<(() => void) | null>;
}

const getPaletteFromCSS = (): Record<PaletteKey, string> => {
  const style = getComputedStyle(document.documentElement);
  return {
    white: style.getPropertyValue("--cube-color-white").trim(),
    yellow: style.getPropertyValue("--cube-color-yellow").trim(),
    red: style.getPropertyValue("--cube-color-red").trim(),
    orange: style.getPropertyValue("--cube-color-orange").trim(),
    green: style.getPropertyValue("--cube-color-green").trim(),
    blue: style.getPropertyValue("--cube-color-blue").trim(),
  };
};

const roundCoord = (value: number): number => Math.round(value);

const rotateVector = (
  vector: { x: number; y: number; z: number },
  axis: Axis,
  direction: 1 | -1
) => {
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

const normalToVector = (normal: NormalKey) => {
  if (normal === "x+") return { x: 1, y: 0, z: 0 };
  if (normal === "x-") return { x: -1, y: 0, z: 0 };
  if (normal === "y+") return { x: 0, y: 1, z: 0 };
  if (normal === "y-") return { x: 0, y: -1, z: 0 };
  if (normal === "z+") return { x: 0, y: 0, z: 1 };
  return { x: 0, y: 0, z: -1 };
};

const vectorToNormal = (vector: { x: number; y: number; z: number }): NormalKey => {
  if (vector.x === 1) return "x+";
  if (vector.x === -1) return "x-";
  if (vector.y === 1) return "y+";
  if (vector.y === -1) return "y-";
  if (vector.z === 1) return "z+";
  return "z-";
};

const createSolvedCubies = (): Cubie[] => {
  const cubies: Cubie[] = [];
  for (let x = -1; x <= 1; x += 1) {
    for (let y = -1; y <= 1; y += 1) {
      for (let z = -1; z <= 1; z += 1) {
        const stickers: Partial<Record<NormalKey, PaletteKey>> = {};
        if (x === 1) stickers["x+"] = "green";
        if (x === -1) stickers["x-"] = "blue";
        if (y === 1) stickers["y+"] = "yellow";
        if (y === -1) stickers["y-"] = "white";
        if (z === 1) stickers["z+"] = "red";
        if (z === -1) stickers["z-"] = "orange";
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

const applyRotationStep = (cubies: Cubie[], step: RotationStep) => {
  const turns = Math.abs(step.angle) === 180 ? 2 : 1;
  const stepDirection: 1 | -1 = step.angle > 0 ? 1 : -1;

  const faceConfig: Record<RotationStep["face"], { axis: Axis; cw: 1 | -1; selector: (cubie: Cubie) => boolean }> = {
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
  };

  const config = faceConfig[step.face];
  const direction = (config.cw * stepDirection) as 1 | -1;

  for (let turnIndex = 0; turnIndex < turns; turnIndex += 1) {
    applyQuarterTurn(cubies, config.axis, direction, config.selector);
  }
};

const projectPoint = (point: { x: number; y: number; z: number }, tile: number, size: number) => ({
  x: size * 0.5 + (point.x - point.z) * tile,
  y: size * 0.55 + (point.x + point.z) * tile * 0.5 - point.y * tile,
});

const drawStickerFace = ({
  context,
  cubie,
  normal,
  color,
  tile,
  size,
}: {
  context: CanvasRenderingContext2D;
  cubie: Cubie;
  normal: NormalKey;
  color: string;
  tile: number;
  size: number;
}) => {
  const normalVector = normalToVector(normal);
  const center = {
    x: cubie.x + normalVector.x * 0.5,
    y: cubie.y + normalVector.y * 0.5,
    z: cubie.z + normalVector.z * 0.5,
  };

  const tangentVectors: Record<NormalKey, [{ x: number; y: number; z: number }, { x: number; y: number; z: number }]> = {
    "x+": [{ x: 0, y: -1, z: 0 }, { x: 0, y: 0, z: -1 }],
    "x-": [{ x: 0, y: -1, z: 0 }, { x: 0, y: 0, z: 1 }],
    "y+": [{ x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: -1 }],
    "y-": [{ x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }],
    "z+": [{ x: 1, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }],
    "z-": [{ x: -1, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }],
  };
  const [u, v] = tangentVectors[normal];
  const half = 0.45;
  const corners = [
    { x: center.x - u.x * half - v.x * half, y: center.y - u.y * half - v.y * half, z: center.z - u.z * half - v.z * half },
    { x: center.x + u.x * half - v.x * half, y: center.y + u.y * half - v.y * half, z: center.z + u.z * half - v.z * half },
    { x: center.x + u.x * half + v.x * half, y: center.y + u.y * half + v.y * half, z: center.z + u.z * half + v.z * half },
    { x: center.x - u.x * half + v.x * half, y: center.y - u.y * half + v.y * half, z: center.z - u.z * half + v.z * half },
  ];
  const projected = corners.map((corner) => projectPoint(corner, tile, size));

  context.beginPath();
  context.moveTo(projected[0].x, projected[0].y);
  context.lineTo(projected[1].x, projected[1].y);
  context.lineTo(projected[2].x, projected[2].y);
  context.lineTo(projected[3].x, projected[3].y);
  context.closePath();
  context.fillStyle = color;
  context.fill();
  context.lineWidth = Math.max(1, tile * 0.07);
  context.strokeStyle = "rgba(15, 23, 42, 0.35)";
  context.stroke();
};

const drawCube = (
  context: CanvasRenderingContext2D,
  cubies: Cubie[],
  size: number,
  palette: Record<PaletteKey, string>
) => {
  context.clearRect(0, 0, size, size);
  const tile = size / 7.2;
  const visibleFaces: NormalKey[] = ["y+", "x+", "z+"];

  const surfaces = cubies
    .flatMap((cubie) =>
      visibleFaces
        .filter((normal) => cubie.stickers[normal])
        .map((normal) => ({
          cubie,
          normal,
          colorKey: cubie.stickers[normal] as PaletteKey,
          depth: cubie.x + cubie.z - cubie.y,
        }))
    )
    .sort((a, b) => a.depth - b.depth);

  surfaces.forEach((surface) => {
    drawStickerFace({
      context,
      cubie: surface.cubie,
      normal: surface.normal,
      color: palette[surface.colorKey],
      tile,
      size,
    });
  });
};

const useCubeSceneLifecycle = ({
  size,
  preparationRotations,
  refs,
}: {
  size: number;
  preparationRotations: RotationStep[];
  refs: CubeRendererRefs;
}) => {
  const { mountRef, cubiesRef, redrawRef } = refs;

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    const canvas = document.createElement("canvas");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(size * dpr);
    canvas.height = Math.floor(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    mountNode.appendChild(canvas);

    const context = canvas.getContext("2d");
    if (!context) {
      mountNode.removeChild(canvas);
      return;
    }
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    cubiesRef.current = createSolvedCubies();
    preparationRotations.forEach((rotation) => {
      applyRotationStep(cubiesRef.current, rotation);
    });

    const redraw = () => {
      const palette = getPaletteFromCSS();
      drawCube(context, cubiesRef.current, size, palette);
    };
    redrawRef.current = redraw;
    redraw();

    return () => {
      redrawRef.current = null;
      cubiesRef.current = [];
      mountNode.removeChild(canvas);
    };
  }, [size, preparationRotations, mountRef, cubiesRef, redrawRef]);
};

const useCubePaletteSync = ({
  paletteVersion,
  requestRender,
}: {
  paletteVersion: string;
  requestRender: () => void;
}) => {
  useEffect(() => {
    if (!paletteVersion) return;
    requestRender();
  }, [paletteVersion, requestRender]);
};

export const useCubeRenderer = ({
  size,
  preparationRotations,
  interactive: _interactive = true,
}: UseCubeRendererOptions) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cubiesRef = useRef<Cubie[]>([]);
  const redrawRef = useRef<(() => void) | null>(null);
  const { paletteVersion } = useCSSVariables();

  const requestRender = useCallback(() => {
    redrawRef.current?.();
  }, []);

  const resetCube = useCallback(() => {
    cubiesRef.current = createSolvedCubies();
    requestRender();
  }, [requestRender]);

  const applyPreparationRotations = useCallback(() => {
    if (!cubiesRef.current.length) return;
    preparationRotations.forEach((rotation) => {
      applyRotationStep(cubiesRef.current, rotation);
    });
    requestRender();
  }, [preparationRotations, requestRender]);

  const rotateByStep = useCallback((step: RotationStep) => {
    if (!cubiesRef.current.length) return;
    applyRotationStep(cubiesRef.current, step);
    requestRender();
  }, [requestRender]);

  useCubeSceneLifecycle({
    size,
    preparationRotations,
    refs: {
      mountRef,
      cubiesRef,
      redrawRef,
    },
  });

  useCubePaletteSync({
    paletteVersion,
    requestRender,
  });

  return {
    mountRef,
    rotateFace: rotateByStep,
    resetCube,
    applyPreparation: applyPreparationRotations
  };
};

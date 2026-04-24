"use client";

import { useCallback, useRef } from "react";
import type { RotationStep } from "../core/cubeTypes";
import { useCubePalette } from "./CubePaletteContext";
import type { UseCubeRendererOptions } from "./cubeRendererTypes";
import { CUBE_FULL_QUALITY_MIN_SIZE_PX } from "../render/renderConstants";
import { useCubePaletteSync, useCubeSceneLifecycle } from "./hooks";
import { applyRotationStep, createSolvedCubies } from "../core/rotation";

export const useCubeRenderer = ({ size, preparationRotations }: UseCubeRendererOptions) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cubiesRef = useRef(createSolvedCubies());
  const redrawRef = useRef<(() => void) | null>(null);
  const { paletteVersion } = useCubePalette();
  const previewQuality = size < CUBE_FULL_QUALITY_MIN_SIZE_PX;

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

  const rotateByStep = useCallback(
    (step: RotationStep) => {
      if (!cubiesRef.current.length) return;
      applyRotationStep(cubiesRef.current, step);
      requestRender();
    },
    [requestRender]
  );

  useCubeSceneLifecycle({
    size,
    preparationRotations,
    previewQuality,
    refs: {
      mountRef,
      cubiesRef,
      redrawRef
    }
  });

  useCubePaletteSync({
    paletteVersion,
    requestRender
  });

  return {
    mountRef,
    rotateFace: rotateByStep,
    resetCube,
    applyPreparation: applyPreparationRotations
  };
};

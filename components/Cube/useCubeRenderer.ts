"use client";

import { useCallback, useRef } from "react";
import type { RotationStep } from "@/types/cube";
import { useCubePalette } from "@/components/Cube/CubePaletteContext";
import type { UseCubeRendererOptions } from "./definitions";
import { useCubePaletteSync, useCubeSceneLifecycle } from "./hooks";
import { applyRotationStep, createSolvedCubies } from "./rotation";

export const useCubeRenderer = ({
  size,
  preparationRotations,
  interactive = true
}: UseCubeRendererOptions) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cubiesRef = useRef(createSolvedCubies());
  const redrawRef = useRef<(() => void) | null>(null);
  const { paletteVersion } = useCubePalette();

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
    interactive,
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

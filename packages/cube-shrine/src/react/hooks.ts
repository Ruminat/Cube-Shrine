"use client";

import { useEffect } from "react";
import type { RotationStep } from "../core/cubeTypes";
import type { CubeRendererRefs } from "./cubeRendererTypes";
import { drawCube } from "../render/drawCube";
import { applyRotationStep, createSolvedCubies } from "../core/rotation";
import { getPaletteFromCSS } from "../render/paletteFromCss";
import { CUBE_DETAIL_DPR_CAP, CUBE_PREVIEW_DPR_CAP } from "../render/renderConstants";

export const useCubeSceneLifecycle = ({
  size,
  preparationRotations,
  previewQuality,
  refs
}: {
  size: number;
  preparationRotations: RotationStep[];
  previewQuality: boolean;
  refs: CubeRendererRefs;
}) => {
  const { mountRef, cubiesRef, redrawRef } = refs;

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    const canvas = document.createElement("canvas");
    const deviceDpr = window.devicePixelRatio || 1;
    const dpr = previewQuality
      ? Math.min(deviceDpr, CUBE_PREVIEW_DPR_CAP)
      : Math.min(deviceDpr, CUBE_DETAIL_DPR_CAP);
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
      drawCube(context, cubiesRef.current, size, palette, { compactFill: previewQuality });
    };
    redrawRef.current = redraw;
    redraw();

    return () => {
      redrawRef.current = null;
      cubiesRef.current = [];
      mountNode.removeChild(canvas);
    };
  }, [size, preparationRotations, previewQuality, mountRef, cubiesRef, redrawRef]);
};

export const useCubePaletteSync = ({
  paletteVersion,
  requestRender
}: {
  paletteVersion: string;
  requestRender: () => void;
}) => {
  useEffect(() => {
    if (!paletteVersion) return;
    requestRender();
  }, [paletteVersion, requestRender]);
};

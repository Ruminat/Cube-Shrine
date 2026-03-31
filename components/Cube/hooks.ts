"use client";

import { useEffect } from "react";
import type { RotationStep } from "@/types/cube";
import type { CubeRendererRefs } from "./definitions";
import { drawCube } from "./render";
import { applyRotationStep, createSolvedCubies } from "./rotation";
import { getPaletteFromCSS } from "./utils";

export const useCubeSceneLifecycle = ({
  size,
  preparationRotations,
  refs
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

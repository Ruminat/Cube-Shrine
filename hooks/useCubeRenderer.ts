"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createCubeElements, type CubeCubie } from "@/lib/cube/factory";
import { applyPreparation, rotateFace } from "@/lib/cube/rotations";
import { getMaterialsFromCSSVariables } from "@/lib/cube/colors";
import type { RotationStep } from "@/types/cube";
import { useCSSVariables } from "./useCSSVariables";

interface UseCubeRendererOptions {
  size: number;
  preparationRotations: RotationStep[];
}

interface CubeRendererRefs {
  mountRef: RefObject<HTMLDivElement | null>;
  cubiesRef: RefObject<CubeCubie[]>;
  cubeGroupRef: RefObject<THREE.Group | null>;
  spacingRef: RefObject<number>;
  materialsRef: RefObject<ReturnType<typeof getMaterialsFromCSSVariables> | null>;
}

interface CubeDimensions {
  elementSize: number;
  cubeGap: number;
}

const getCubeDimensionsFromCSS = (): CubeDimensions => {
  const rootStyle = getComputedStyle(document.documentElement);
  const elementSize = parseFloat(rootStyle.getPropertyValue("--cube-element-size"));
  const cubeGap = parseFloat(rootStyle.getPropertyValue("--cube-gap"));
  return { elementSize, cubeGap };
};

const createSceneLights = () => {
  const ambient = new THREE.AmbientLight(0xffffff, 0.9);
  const directional = new THREE.DirectionalLight(0xffffff, 0.6);
  directional.position.set(6, 6, 6);
  return { ambient, directional };
};

const getFaceMaterialKey = (axis: "x" | "y" | "z", sign: 1 | -1) => {
  if (axis === "x") return sign === 1 ? "red" : "orange";
  if (axis === "y") return sign === 1 ? "white" : "yellow";
  return sign === 1 ? "green" : "blue";
};

const useCubeSceneLifecycle = ({
  size,
  preparationRotations,
  refs,
  rebuildMaterials,
}: {
  size: number;
  preparationRotations: RotationStep[];
  refs: CubeRendererRefs;
  rebuildMaterials: () => void;
}) => {
  const { mountRef, cubiesRef, cubeGroupRef, spacingRef, materialsRef } = refs;

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    rebuildMaterials();
    const { elementSize, cubeGap } = getCubeDimensionsFromCSS();
    spacingRef.current = elementSize + cubeGap;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(4, 4, 4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    mountNode.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = false;
    controls.update();

    const { ambient, directional } = createSceneLights();
    scene.add(ambient, directional);

    const cubeGroup = new THREE.Group();
    cubeGroupRef.current = cubeGroup;
    scene.add(cubeGroup);

    const cubies = createCubeElements(elementSize, cubeGap, materialsRef.current!);
    cubiesRef.current = cubies;
    cubies.forEach((cubie) => cubeGroup.add(cubie));
    applyPreparation(cubies, cubeGroup, spacingRef.current, preparationRotations);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      controls.dispose();
      renderer.dispose();
      scene.clear();
      mountNode.removeChild(renderer.domElement);
    };
  }, [size, preparationRotations, rebuildMaterials, mountRef, cubiesRef, cubeGroupRef, spacingRef, materialsRef]);
};

const useCubePaletteSync = ({
  paletteVersion,
  materialsRef,
  cubeGroupRef,
}: {
  paletteVersion: string;
  materialsRef: RefObject<ReturnType<typeof getMaterialsFromCSSVariables> | null>;
  cubeGroupRef: RefObject<THREE.Group | null>;
}) => {
  useEffect(() => {
    if (!cubeGroupRef.current || !paletteVersion || !materialsRef.current) return;
    const nextSet = getMaterialsFromCSSVariables();
    const materialKeys: (keyof ReturnType<typeof getMaterialsFromCSSVariables>)[] = [
      "white",
      "yellow",
      "red",
      "orange",
      "green",
      "blue",
      "hidden",
    ];

    materialKeys.forEach((key) => {
      const currentMaterial = materialsRef.current![key];
      const nextMaterial = nextSet[key];
      currentMaterial.color.copy(nextMaterial.color);
      currentMaterial.needsUpdate = true;
    });
  }, [paletteVersion, materialsRef, cubeGroupRef]);
};

export const useCubeRenderer = ({
  size,
  preparationRotations
}: UseCubeRendererOptions) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cubiesRef = useRef<CubeCubie[]>([]);
  const cubeGroupRef = useRef<THREE.Group | null>(null);
  const spacingRef = useRef(1);
  const materialsRef = useRef<ReturnType<typeof getMaterialsFromCSSVariables> | null>(null);
  const { paletteVersion } = useCSSVariables();

  const rebuildMaterials = useCallback(() => {
    materialsRef.current = getMaterialsFromCSSVariables();
  }, []);

  const resetCube = useCallback(() => {
    if (!cubeGroupRef.current) return;
    cubeGroupRef.current.rotation.set(0, 0, 0);
  }, []);

  const applyPreparationRotations = useCallback(() => {
    if (!cubeGroupRef.current) return;
    applyPreparation(
      cubiesRef.current,
      cubeGroupRef.current,
      spacingRef.current,
      preparationRotations
    );
  }, [preparationRotations]);

  const rotateByStep = useCallback((step: RotationStep) => {
    if (!cubeGroupRef.current) return;
    rotateFace(cubiesRef.current, step, cubeGroupRef.current, spacingRef.current);
  }, []);

  useCubeSceneLifecycle({
    size,
    preparationRotations,
    refs: {
      mountRef,
      cubiesRef,
      cubeGroupRef,
      spacingRef,
      materialsRef,
    },
    rebuildMaterials,
  });

  useCubePaletteSync({
    paletteVersion,
    materialsRef,
    cubeGroupRef,
  });

  return {
    mountRef,
    rotateFace: rotateByStep,
    resetCube,
    applyPreparation: applyPreparationRotations
  };
};

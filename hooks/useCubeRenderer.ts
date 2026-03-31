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
  interactive?: boolean;
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

const disposeMaterialSet = (materialSet: ReturnType<typeof getMaterialsFromCSSVariables> | null) => {
  if (!materialSet) return;

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
    materialSet[key].dispose();
  });
};

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

const useCubeSceneLifecycle = ({
  size,
  preparationRotations,
  interactive,
  refs,
  rebuildMaterials,
  setRenderScene,
}: {
  size: number;
  preparationRotations: RotationStep[];
  interactive: boolean;
  refs: CubeRendererRefs;
  rebuildMaterials: () => void;
  setRenderScene: (renderScene: (() => void) | null) => void;
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

    const controls = interactive ? new OrbitControls(camera, renderer.domElement) : null;
    if (controls) {
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.autoRotate = false;
      controls.update();
    }

    const { ambient, directional } = createSceneLights();
    scene.add(ambient, directional);

    const cubeGroup = new THREE.Group();
    cubeGroupRef.current = cubeGroup;
    scene.add(cubeGroup);

    const cubies = createCubeElements(elementSize, cubeGap, materialsRef.current!);
    cubiesRef.current = cubies;
    cubies.forEach((cubie) => cubeGroup.add(cubie));
    applyPreparation(cubies, cubeGroup, spacingRef.current, preparationRotations);

    const renderScene = () => {
      if (controls) controls.update();
      renderer.render(scene, camera);
    };
    setRenderScene(() => renderScene);

    let frame = 0;
    if (interactive) {
      const animate = () => {
        frame = requestAnimationFrame(animate);
        renderScene();
      };
      animate();
    } else {
      renderScene();
    }

    return () => {
      cancelAnimationFrame(frame);
      setRenderScene(null);
      if (controls) controls.dispose();
      cubeGroup.clear();
      cubiesRef.current = [];
      cubeGroupRef.current = null;
      disposeMaterialSet(materialsRef.current);
      materialsRef.current = null;
      renderer.renderLists.dispose();
      renderer.forceContextLoss();
      renderer.dispose();
      scene.clear();
      mountNode.removeChild(renderer.domElement);
    };
  }, [interactive, size, preparationRotations, rebuildMaterials, mountRef, cubiesRef, cubeGroupRef, spacingRef, materialsRef, setRenderScene]);
};

const useCubePaletteSync = ({
  paletteVersion,
  materialsRef,
  cubeGroupRef,
  requestRender,
}: {
  paletteVersion: string;
  materialsRef: RefObject<ReturnType<typeof getMaterialsFromCSSVariables> | null>;
  cubeGroupRef: RefObject<THREE.Group | null>;
  requestRender: () => void;
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
    disposeMaterialSet(nextSet);
    requestRender();
  }, [paletteVersion, materialsRef, cubeGroupRef, requestRender]);
};

export const useCubeRenderer = ({
  size,
  preparationRotations,
  interactive = true
}: UseCubeRendererOptions) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cubiesRef = useRef<CubeCubie[]>([]);
  const cubeGroupRef = useRef<THREE.Group | null>(null);
  const spacingRef = useRef(1);
  const materialsRef = useRef<ReturnType<typeof getMaterialsFromCSSVariables> | null>(null);
  const renderSceneRef = useRef<(() => void) | null>(null);
  const { paletteVersion } = useCSSVariables();

  const rebuildMaterials = useCallback(() => {
    materialsRef.current = getMaterialsFromCSSVariables();
  }, []);

  const requestRender = useCallback(() => {
    renderSceneRef.current?.();
  }, []);

  const resetCube = useCallback(() => {
    if (!cubeGroupRef.current) return;
    cubeGroupRef.current.rotation.set(0, 0, 0);
    requestRender();
  }, [requestRender]);

  const applyPreparationRotations = useCallback(() => {
    if (!cubeGroupRef.current) return;
    applyPreparation(
      cubiesRef.current,
      cubeGroupRef.current,
      spacingRef.current,
      preparationRotations
    );
    requestRender();
  }, [preparationRotations, requestRender]);

  const rotateByStep = useCallback((step: RotationStep) => {
    if (!cubeGroupRef.current) return;
    rotateFace(cubiesRef.current, step, cubeGroupRef.current, spacingRef.current);
    requestRender();
  }, [requestRender]);

  useCubeSceneLifecycle({
    size,
    preparationRotations,
    interactive,
    refs: {
      mountRef,
      cubiesRef,
      cubeGroupRef,
      spacingRef,
      materialsRef,
    },
    rebuildMaterials,
    setRenderScene: (renderScene) => {
      renderSceneRef.current = renderScene;
    },
  });

  useCubePaletteSync({
    paletteVersion,
    materialsRef,
    cubeGroupRef,
    requestRender,
  });

  return {
    mountRef,
    rotateFace: rotateByStep,
    resetCube,
    applyPreparation: applyPreparationRotations
  };
};

import * as THREE from "three";

const readCssVar = (name: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const getMaterialsFromCSSVariables = () => {
  const palette = {
    white: new THREE.Color(readCssVar("--cube-color-white")),
    yellow: new THREE.Color(readCssVar("--cube-color-yellow")),
    red: new THREE.Color(readCssVar("--cube-color-red")),
    orange: new THREE.Color(readCssVar("--cube-color-orange")),
    green: new THREE.Color(readCssVar("--cube-color-green")),
    blue: new THREE.Color(readCssVar("--cube-color-blue")),
    hidden: new THREE.Color("#111827")
  };

  return {
    white: new THREE.MeshStandardMaterial({ color: palette.white }),
    yellow: new THREE.MeshStandardMaterial({ color: palette.yellow }),
    red: new THREE.MeshStandardMaterial({ color: palette.red }),
    orange: new THREE.MeshStandardMaterial({ color: palette.orange }),
    green: new THREE.MeshStandardMaterial({ color: palette.green }),
    blue: new THREE.MeshStandardMaterial({ color: palette.blue }),
    hidden: new THREE.MeshStandardMaterial({ color: palette.hidden })
  };
};

export type CubeMaterialSet = ReturnType<typeof getMaterialsFromCSSVariables>;

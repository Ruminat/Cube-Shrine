import type { RotationStep } from "@shreklabs/cube-shrine/core";
import { MiniCube } from "@shreklabs/cube-shrine/react";
import styles from "./CubeRenderer.module.scss";

interface CubeRendererProps {
  size: number;
  preparationRotations: RotationStep[];
}

export function CubeRenderer({ size, preparationRotations }: CubeRendererProps) {
  return (
    <div className={styles.wrapper}>
      <MiniCube size={size} preparationRotations={preparationRotations} />
    </div>
  );
}

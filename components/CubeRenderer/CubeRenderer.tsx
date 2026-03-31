import type { RotationStep } from "@/types/cube";
import { MiniCube } from "@/components/MiniCube/MiniCube";
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

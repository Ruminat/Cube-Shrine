import { cn } from "@/lib/utils";
import styles from "./AlgorithmNotation.module.scss";

interface AlgorithmNotationProps {
  notation: string;
  className?: string;
}

export function AlgorithmNotation({ notation, className }: AlgorithmNotationProps) {
  return <p className={cn(styles.notation, className)}>{notation}</p>;
}

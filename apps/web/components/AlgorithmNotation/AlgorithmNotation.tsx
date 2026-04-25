import { cn } from "@/lib/utils";
import styles from "./AlgorithmNotation.module.scss";

interface AlgorithmNotationProps {
  notation: string;
  className?: string;
  /** When true, overrides the default left-aligned notation (SCSS wins over generic utility classes). */
  centered?: boolean;
}

export function AlgorithmNotation({ notation, className, centered }: AlgorithmNotationProps) {
  return <p className={cn(styles.notation, centered && styles.notationCentered, className)}>{notation}</p>;
}

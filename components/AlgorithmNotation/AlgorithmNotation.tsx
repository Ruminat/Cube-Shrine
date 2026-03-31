import styles from "./AlgorithmNotation.module.scss";

interface AlgorithmNotationProps {
  notation: string;
}

export function AlgorithmNotation({ notation }: AlgorithmNotationProps) {
  return <p className={styles.notation}>{notation}</p>;
}

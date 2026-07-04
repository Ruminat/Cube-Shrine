"use client";

import { useCallback, type SyntheticEvent } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Heading } from "@radix-ui/themes";
import { AlgorithmCard } from "@/components/AlgorithmCard/AlgorithmCard";
import type { NotationCategoryGroup } from "@/data/notation-moves";
import {
  useHiddenAlgorithmGroups,
  useHiddenAlgorithmSubgroups,
} from "@/lib/client-storage/hidden-disclosures";
import { hiddenAlgorithmGroups$, hiddenAlgorithmSubgroups$ } from "@/lib/hidden-disclosures-prefs";
import type { Algorithm } from "@/types/algorithm";
import styles from "@/components/AlgorithmGroup/AlgorithmGroup.module.scss";

export interface NotationGroupProps {
  group: NotationCategoryGroup;
  onOpenMove: (algorithm: Algorithm) => void;
  isMoveReversed: (algorithmId: string) => boolean;
  onToggleMoveReverse: (algorithmId: string) => void;
}

function MoveCardGrid({
  moves,
  onOpenMove,
  isMoveReversed,
  onToggleMoveReverse,
}: {
  moves: Algorithm[];
  onOpenMove: (algorithm: Algorithm) => void;
  isMoveReversed: (algorithmId: string) => boolean;
  onToggleMoveReverse: (algorithmId: string) => void;
}) {
  return (
    <div className={styles.gridStretch}>
      {moves.map((move) => (
        <AlgorithmCard
          key={move.id}
          algorithm={move}
          isReversed={isMoveReversed(move.id)}
          onClick={onOpenMove}
          onToggleReverse={() => onToggleMoveReverse(move.id)}
        />
      ))}
    </div>
  );
}

export function NotationGroup({
  group,
  onOpenMove,
  isMoveReversed,
  onToggleMoveReverse,
}: NotationGroupProps) {
  const categoryStorageId = `notation-${group.id}`;
  const headingId = `notation-group-${group.id}`;
  const hiddenGroups = useHiddenAlgorithmGroups();
  const hiddenSubgroups = useHiddenAlgorithmSubgroups();
  const isGroupOpen = !hiddenGroups.has(categoryStorageId);

  const handleGroupToggle = useCallback(
    (event: SyntheticEvent<HTMLDetailsElement>) => {
      const nextIsOpen = event.currentTarget.open;
      const next = new Set(hiddenAlgorithmGroups$.get());
      if (nextIsOpen) {
        next.delete(categoryStorageId);
      } else {
        next.add(categoryStorageId);
      }
      hiddenAlgorithmGroups$.set(Array.from(next));
    },
    [categoryStorageId],
  );

  const handleFaceGroupToggle = useCallback((faceGroupId: string, nextIsOpen: boolean) => {
    const next = new Set(hiddenAlgorithmSubgroups$.get());
    if (nextIsOpen) {
      next.delete(faceGroupId);
    } else {
      next.add(faceGroupId);
    }
    hiddenAlgorithmSubgroups$.set(Array.from(next));
  }, []);

  return (
    <section className={styles.group} aria-labelledby={headingId}>
      <details
        className={styles.disclosure}
        open={isGroupOpen}
        aria-labelledby={headingId}
        onToggle={handleGroupToggle}
      >
        <summary className={styles.categorySummary}>
          <ChevronDownIcon className={styles.summaryChevron} aria-hidden />
          <Heading as="h2" size="4" className={styles.groupTitle} id={headingId}>
            {group.title}
          </Heading>
        </summary>
        <div className={styles.disclosureBody}>
          <p className="mb-3 text-sm text-muted-foreground">{group.description}</p>
          <div className={styles.subgroups}>
            {group.faceGroups.map((faceGroup) => {
              const subHeadingId = `notation-face-${faceGroup.id}`;
              const isSubgroupOpen = !hiddenSubgroups.has(faceGroup.id);
              return (
                <details
                  key={faceGroup.id}
                  className={styles.subDisclosure}
                  open={isSubgroupOpen}
                  aria-labelledby={subHeadingId}
                  onToggle={(event) => handleFaceGroupToggle(faceGroup.id, event.currentTarget.open)}
                >
                  <summary className={styles.subSummary}>
                    <ChevronDownIcon className={styles.subSummaryChevron} aria-hidden />
                    <h3 className={styles.subgroupTitle} id={subHeadingId}>
                      {faceGroup.title}
                    </h3>
                  </summary>
                  <div className={styles.subDisclosureBody}>
                    <MoveCardGrid
                      moves={faceGroup.moves}
                      onOpenMove={onOpenMove}
                      isMoveReversed={isMoveReversed}
                      onToggleMoveReverse={onToggleMoveReverse}
                    />
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </details>
    </section>
  );
}

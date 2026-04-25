"use client";

import { useCallback, type SyntheticEvent } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Heading, Switch, Text } from "@radix-ui/themes";
import { AlgorithmCard } from "@/components/AlgorithmCard/AlgorithmCard";
import type { AlgorithmCategoryGroup } from "@/data/algorithms";
import {
  useHiddenAlgorithmGroups,
  useHiddenAlgorithmSubgroups,
} from "@/lib/client-storage/hidden-disclosures";
import { hiddenAlgorithmGroups$, hiddenAlgorithmSubgroups$ } from "@/lib/hidden-disclosures-prefs";
import { useOllTopFlatViewEnabled, usePllTopFlatViewEnabled } from "@/lib/client-storage/top-flat-view";
import { ollTopFlatViewEnabled$, pllTopFlatViewEnabled$ } from "@/lib/top-flat-view-prefs";
import type { Algorithm } from "@/types/algorithm";
import styles from "./AlgorithmGroup.module.scss";

export interface AlgorithmGroupProps {
  group: AlgorithmCategoryGroup;
  onOpenAlgorithm: (algorithm: Algorithm) => void;
  isAlgorithmReversed: (algorithmId: string) => boolean;
  onToggleAlgorithmReverse: (algorithmId: string) => void;
}

function AlgorithmCardGrid({
  algorithms,
  onOpenAlgorithm,
  isAlgorithmReversed,
  onToggleAlgorithmReverse,
}: {
  algorithms: Algorithm[];
  onOpenAlgorithm: (algorithm: Algorithm) => void;
  isAlgorithmReversed: (algorithmId: string) => boolean;
  onToggleAlgorithmReverse: (algorithmId: string) => void;
}) {
  return (
    <div className={styles.grid}>
      {algorithms.map((algorithm) => (
        <AlgorithmCard
          key={algorithm.id}
          algorithm={algorithm}
          isReversed={isAlgorithmReversed(algorithm.id)}
          onClick={onOpenAlgorithm}
          onToggleReverse={() => onToggleAlgorithmReverse(algorithm.id)}
        />
      ))}
    </div>
  );
}

export function AlgorithmGroup({
  group,
  onOpenAlgorithm,
  isAlgorithmReversed,
  onToggleAlgorithmReverse,
}: AlgorithmGroupProps) {
  const headingId = `alg-group-${group.category}`;
  const hiddenGroups = useHiddenAlgorithmGroups();
  const hiddenSubgroups = useHiddenAlgorithmSubgroups();
  const isGroupOpen = !hiddenGroups.has(group.category);
  const isOll = group.category === "OLL";
  const isPll = group.category === "PLL";
  const ollSwitchChecked = useOllTopFlatViewEnabled();
  const pllSwitchChecked = usePllTopFlatViewEnabled();

  const handleGroupToggle = useCallback(
    (event: SyntheticEvent<HTMLDetailsElement>) => {
      const nextIsOpen = event.currentTarget.open;
      const next = new Set(hiddenAlgorithmGroups$.get());
      if (nextIsOpen) {
        next.delete(group.category);
      } else {
        next.add(group.category);
      }
      hiddenAlgorithmGroups$.set(Array.from(next));
    },
    [group.category]
  );

  const handleSubgroupToggle = useCallback((subgroupId: string, nextIsOpen: boolean) => {
    const next = new Set(hiddenAlgorithmSubgroups$.get());
    if (nextIsOpen) {
      next.delete(subgroupId);
    } else {
      next.add(subgroupId);
    }
    hiddenAlgorithmSubgroups$.set(Array.from(next));
  }, []);

  const hasFlatViewToggle = isOll || isPll;
  const categorySummaryClass = hasFlatViewToggle
    ? `${styles.categorySummary} ${styles.categorySummaryWithFlatViewToggle}`
    : styles.categorySummary;

  const flatViewToggle = isOll ? (
    <div
      className={styles.topFlatViewToggle}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <Text size="1" color="gray" weight="medium" as="span">
        Top flat view
      </Text>
      <Switch
        checked={ollSwitchChecked}
        onCheckedChange={ollTopFlatViewEnabled$.set}
        aria-label="Toggle OLL flat top view with side yellow indicators"
      />
    </div>
  ) : isPll ? (
    <div
      className={styles.topFlatViewToggle}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <Text size="1" color="gray" weight="medium" as="span">
        Top flat view
      </Text>
      <Switch
        checked={pllSwitchChecked}
        onCheckedChange={pllTopFlatViewEnabled$.set}
        aria-label="Toggle PLL flat top view with permutation arrows"
      />
    </div>
  ) : null;

  if (group.variant === "flat") {
    return (
      <section className={styles.group} aria-labelledby={headingId}>
        <details className={styles.disclosure} open={isGroupOpen} aria-labelledby={headingId} onToggle={handleGroupToggle}>
          <summary className={categorySummaryClass}>
            <ChevronDownIcon className={styles.summaryChevron} aria-hidden />
            <Heading as="h2" size="4" className={styles.groupTitle} id={headingId}>
              {group.category}
            </Heading>
            {flatViewToggle}
          </summary>
          <div className={styles.disclosureBody}>
            <AlgorithmCardGrid
              algorithms={group.algorithms}
              onOpenAlgorithm={onOpenAlgorithm}
              isAlgorithmReversed={isAlgorithmReversed}
              onToggleAlgorithmReverse={onToggleAlgorithmReverse}
            />
          </div>
        </details>
      </section>
    );
  }

  return (
    <section className={styles.group} aria-labelledby={headingId}>
      <details className={styles.disclosure} open={isGroupOpen} aria-labelledby={headingId} onToggle={handleGroupToggle}>
        <summary className={categorySummaryClass}>
          <ChevronDownIcon className={styles.summaryChevron} aria-hidden />
          <Heading as="h2" size="4" className={styles.groupTitle} id={headingId}>
            {group.category}
          </Heading>
          {flatViewToggle}
        </summary>
        <div className={styles.disclosureBody}>
          <div className={styles.subgroups}>
            {group.subgroups.map((section) => {
              const subHeadingId = `alg-subgroup-${section.id}`;
              const isSubgroupOpen = !hiddenSubgroups.has(section.id);
              return (
                <details
                  key={section.id}
                  className={styles.subDisclosure}
                  open={isSubgroupOpen}
                  aria-labelledby={subHeadingId}
                  onToggle={(event) => handleSubgroupToggle(section.id, event.currentTarget.open)}
                >
                  <summary className={styles.subSummary}>
                    <ChevronDownIcon className={styles.subSummaryChevron} aria-hidden />
                    <h3 className={styles.subgroupTitle} id={subHeadingId}>
                      {section.title}
                    </h3>
                  </summary>
                  <div className={styles.subDisclosureBody}>
                    <AlgorithmCardGrid
                      algorithms={section.algorithms}
                      onOpenAlgorithm={onOpenAlgorithm}
                      isAlgorithmReversed={isAlgorithmReversed}
                      onToggleAlgorithmReverse={onToggleAlgorithmReverse}
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

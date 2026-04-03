"use client";

import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Heading, Switch, Text } from "@radix-ui/themes";
import { AlgorithmCard } from "@/components/AlgorithmCard/AlgorithmCard";
import type { AlgorithmCategoryGroup } from "@/data/algorithms";
import type { Algorithm } from "@/types/algorithm";
import styles from "./AlgorithmGroup.module.scss";

export interface AlgorithmGroupProps {
  group: AlgorithmCategoryGroup;
  onOpenAlgorithm: (algorithm: Algorithm) => void;
  isAlgorithmReversed: (algorithmId: string) => boolean;
  onToggleAlgorithmReverse: (algorithmId: string) => void;
  ollSpecialTopView?: boolean;
  onOllSpecialTopViewChange?: (value: boolean) => void;
  pllSpecialTopView?: boolean;
  onPllSpecialTopViewChange?: (value: boolean) => void;
}

function AlgorithmCardGrid({
  algorithms,
  onOpenAlgorithm,
  isAlgorithmReversed,
  onToggleAlgorithmReverse,
  useOllSpecialTopView,
  usePllSpecialTopView,
}: {
  algorithms: Algorithm[];
  onOpenAlgorithm: (algorithm: Algorithm) => void;
  isAlgorithmReversed: (algorithmId: string) => boolean;
  onToggleAlgorithmReverse: (algorithmId: string) => void;
  useOllSpecialTopView: boolean;
  usePllSpecialTopView: boolean;
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
          useOllSpecialTopView={useOllSpecialTopView}
          usePllSpecialTopView={usePllSpecialTopView}
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
  ollSpecialTopView = false,
  onOllSpecialTopViewChange,
  pllSpecialTopView = false,
  onPllSpecialTopViewChange,
}: AlgorithmGroupProps) {
  const headingId = `alg-group-${group.category}`;
  const isOll = group.category === "OLL";
  const isPll = group.category === "PLL";
  const useOllSpecialTopView = isOll && ollSpecialTopView;
  const usePllSpecialTopView = isPll && pllSpecialTopView;
  const hasFlatViewToggle =
    (isOll && onOllSpecialTopViewChange) || (isPll && onPllSpecialTopViewChange);
  const categorySummaryClass = hasFlatViewToggle
    ? `${styles.categorySummary} ${styles.categorySummaryWithFlatViewToggle}`
    : styles.categorySummary;

  const ollToggle =
    isOll && onOllSpecialTopViewChange ? (
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
          checked={ollSpecialTopView}
          onCheckedChange={onOllSpecialTopViewChange}
          aria-label="Toggle OLL flat top view with side yellow indicators"
        />
      </div>
    ) : null;

  const pllToggle =
    isPll && onPllSpecialTopViewChange ? (
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
          checked={pllSpecialTopView}
          onCheckedChange={onPllSpecialTopViewChange}
          aria-label="Toggle PLL flat top view with side colors and permutation arrows"
        />
      </div>
    ) : null;

  if (group.variant === "flat") {
    return (
      <section className={styles.group} aria-labelledby={headingId}>
        <details className={styles.disclosure} open aria-labelledby={headingId}>
          <summary className={categorySummaryClass}>
            <ChevronDownIcon className={styles.summaryChevron} aria-hidden />
            <Heading as='h2' size='4' className={styles.groupTitle} id={headingId}>
              {group.category}
            </Heading>
            {ollToggle}
            {pllToggle}
          </summary>
          <div className={styles.disclosureBody}>
            <AlgorithmCardGrid
              algorithms={group.algorithms}
              onOpenAlgorithm={onOpenAlgorithm}
              isAlgorithmReversed={isAlgorithmReversed}
              onToggleAlgorithmReverse={onToggleAlgorithmReverse}
              useOllSpecialTopView={useOllSpecialTopView}
              usePllSpecialTopView={usePllSpecialTopView}
            />
          </div>
        </details>
      </section>
    );
  }

  return (
    <section className={styles.group} aria-labelledby={headingId}>
      <details className={styles.disclosure} open aria-labelledby={headingId}>
        <summary className={categorySummaryClass}>
          <ChevronDownIcon className={styles.summaryChevron} aria-hidden />
          <Heading as='h2' size='4' className={styles.groupTitle} id={headingId}>
            {group.category}
          </Heading>
          {ollToggle}
          {pllToggle}
        </summary>
        <div className={styles.disclosureBody}>
          <div className={styles.subgroups}>
            {group.subgroups.map((section) => {
              const subHeadingId = `alg-subgroup-${section.id}`;
              return (
                <details key={section.id} className={styles.subDisclosure} open aria-labelledby={subHeadingId}>
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
                      useOllSpecialTopView={useOllSpecialTopView}
                      usePllSpecialTopView={usePllSpecialTopView}
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

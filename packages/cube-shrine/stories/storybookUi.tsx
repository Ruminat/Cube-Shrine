import { Box, Flex, SegmentedControl, Text } from "@radix-ui/themes";
import type { ReactNode } from "react";

export type IsoFlatMode = "iso" | "flat";

export function IsoFlatToggle({
  value,
  onChange
}: {
  value: IsoFlatMode;
  onChange: (next: IsoFlatMode) => void;
}) {
  return (
    <Flex align="center" gap="3" wrap="wrap">
      <Text size="2" weight="medium" color="gray">
        View
      </Text>
      <SegmentedControl.Root
        value={value}
        onValueChange={(v) => {
          if (v === "iso" || v === "flat") onChange(v);
        }}
      >
        <SegmentedControl.Item value="iso">Isometric</SegmentedControl.Item>
        <SegmentedControl.Item value="flat">Top flat</SegmentedControl.Item>
      </SegmentedControl.Root>
    </Flex>
  );
}

/** Matches Single-move story cards: centered cube + monospace caption. */
export function AlgorithmStoryCard({
  title,
  notation,
  children
}: {
  title: string;
  notation: string;
  children: ReactNode;
}) {
  return (
    <Box
      style={{
        textAlign: "center",
        borderRadius: "var(--radius-3)",
        border: "1px solid var(--gray-a6)",
        background: "var(--color-panel-solid)",
        padding: "var(--space-3)",
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-2)"
      }}
    >
      <Text size="2" weight="bold">
        {title}
      </Text>
      <Box style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</Box>
      <Text
        size="1"
        style={{
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          wordBreak: "break-word",
          maxWidth: "100%",
          color: "var(--gray-11)"
        }}
      >
        {notation}
      </Text>
    </Box>
  );
}

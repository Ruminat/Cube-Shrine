import type { Meta, StoryObj } from "@storybook/react";
import { useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  ScrollArea,
  Separator,
  Text,
  TextArea
} from "@radix-ui/themes";
import {
  invertNotationSequence,
  normalizeAlgorithm,
  parseNotation,
  parseReversedNotation,
  validateAlgorithm,
  validateOLLAlgorithm,
  validatePLLAlgorithm,
  type RotationStep
} from "@shreklabs/cube-shrine/core";
import { MiniCube } from "@shreklabs/cube-shrine/react";

const meta = {
  title: "Utilities",
  parameters: {
    docs: {
      description: {
        component:
          "Notation parsing, reversal, and PLL-style reversed steps. The **mini cube** applies `parseNotation(input)` so you can see the forward interpretation at a glance."
      }
    }
  }
} satisfies Meta;

export default meta;

const formatStep = (step: RotationStep): string => {
  if (step.angle === 180 || step.angle === -180) return `${step.face}2`;
  if (step.angle === -90) return `${step.face}'`;
  return `${step.face}`;
};

function StepChipRail({ label, steps, color }: { label: string; steps: RotationStep[]; color: "blue" | "orange" }) {
  return (
    <Box>
      <Text size="1" weight="medium" color="gray" mb="1">
        {label}
      </Text>
      <ScrollArea scrollbars="horizontal" type="hover">
        <Flex gap="1" pb="1" style={{ minHeight: 28 }}>
          {steps.length === 0 ? (
            <Text size="1" color="gray">
              (empty)
            </Text>
          ) : (
            steps.map((step, i) => (
              <Badge key={`${label}-${i}`} color={color} variant="soft" size="1">
                {formatStep(step)}
              </Badge>
            ))
          )}
        </Flex>
      </ScrollArea>
    </Box>
  );
}

function JsonPanel({ label, value }: { label: string; value: unknown }) {
  return (
    <Card size="1">
      <Text size="1" weight="medium" color="gray" mb="2">
        {label}
      </Text>
      <pre
        style={{
          margin: 0,
          padding: 12,
          borderRadius: 6,
          background: "var(--gray-a2)",
          fontSize: 12,
          overflow: "auto",
          maxHeight: 200,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        }}
      >
        {JSON.stringify(value, null, 2)}
      </pre>
    </Card>
  );
}

function AlgorithmUtilsPanel() {
  const [input, setInput] = useState("R U R' U' (R' F R F')");

  const parsed = useMemo(() => parseNotation(input), [input]);
  const inverted = useMemo(() => invertNotationSequence(input), [input]);
  const reversedSteps = useMemo(() => parseReversedNotation(input), [input]);

  return (
    <Flex direction="column" gap="4" style={{ maxWidth: 1100 }}>
      <Heading size="5">Notation utilities</Heading>
      <Text size="2" color="gray">
        Edit WCA-style notation. Forward steps become move chips; JSON panels mirror what tests and the site consume.
      </Text>

      <Grid columns={{ initial: "1", md: "2" }} gap="4" align="start">
        <Flex direction="column" gap="3">
          <Box>
            <Text size="2" weight="medium" mb="1" as="div">
              Input
            </Text>
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
              style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: 13 }}
            />
          </Box>

          <StepChipRail label="parseNotation — forward atomic steps" steps={parsed} color="blue" />
          <StepChipRail label="parseReversedNotation — PLL-style prep steps" steps={reversedSteps} color="orange" />

          <Card size="1" variant="surface">
            <Flex direction="column" gap="2">
              <Text size="1" weight="medium" color="gray" as="div">
                invertNotationSequence — string that undoes the sequence
              </Text>
              <Text
                size="2"
                as="div"
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  wordBreak: "break-word"
                }}
              >
                {inverted || "—"}
              </Text>
            </Flex>
          </Card>

          <Separator size="4" />

          <JsonPanel label="parseNotation(input) — RotationStep[]" value={parsed} />
          <JsonPanel label="parseReversedNotation(input) — RotationStep[]" value={reversedSteps} />
        </Flex>

        <Card size="2" variant="classic">
          <Flex direction="column" gap="3" align="center">
            <Text size="2" weight="bold">
              Cube after forward parse
            </Text>
            <Text size="1" color="gray" align="center">
              <code>MiniCube</code> with <code>preparationRotations={'{'}parseNotation(input){'}'}</code>
            </Text>
            <Box py="2">
              <MiniCube size={112} preparationRotations={parsed} deferUntilVisible={false} />
            </Box>
            <Separator size="4" />
            <Text size="1" color="gray" align="center">
              PLL / inverse prep uses the orange chip sequence instead of the blue one.
            </Text>
          </Flex>
        </Card>
      </Grid>
    </Flex>
  );
}

export const ParseInvertReverse: StoryObj = {
  name: "Parse · invert · reversed steps",
  render: () => <AlgorithmUtilsPanel />
};

function ValidateNormalizePanel() {
  const [sample, setSample] = useState("  R   U2'  M'  ");
  const validationError = validateAlgorithm(sample);
  const normalized = normalizeAlgorithm(sample);

  return (
    <Flex direction="column" gap="3" style={{ maxWidth: 720 }}>
      <Heading size="5">Validate & normalize</Heading>
      <Text size="2" color="gray">
        <code>validateAlgorithm</code> returns an error string or <code>undefined</code>.{" "}
        <code>normalizeAlgorithm</code> returns a canonical string only when the input is valid (see Vitest:{" "}
        <code>algorithmFormat.test.ts</code>).
      </Text>
      <TextArea
        value={sample}
        onChange={(e) => setSample(e.target.value)}
        rows={3}
        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: 13 }}
      />
      <Card size="1" variant="surface">
        <Text size="2" weight="medium" mb="1" as="div">
          validateAlgorithm(input)
        </Text>
        <Text size="2" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
          {validationError === undefined ? "undefined (valid)" : JSON.stringify(validationError)}
        </Text>
      </Card>
      <Card size="1" variant="surface">
        <Text size="2" weight="medium" mb="1" as="div">
          normalizeAlgorithm(input)
        </Text>
        <Text size="2" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
          {normalized === undefined ? "undefined (invalid)" : JSON.stringify(normalized)}
        </Text>
      </Card>
    </Flex>
  );
}

export const ValidateAndNormalize: StoryObj = {
  name: "Validate & normalize",
  render: () => <ValidateNormalizePanel />
};

const SUNE = "(R U R' U) (R U2 R')";
const T_PERM = "(R U R' U') R' F R2 U' R' U' R U R' F'";
const ANTI_SUNE = "(L' U' L U') (L' U2 L)";

function CaseValidatorRow({ label, error }: { label: string; error: string | undefined }) {
  const ok = error === undefined;
  return (
    <Card
      size="2"
      style={{
        borderLeftWidth: 4,
        borderLeftStyle: "solid",
        borderLeftColor: ok ? "var(--green-9)" : "var(--red-9)",
        background: ok ? "var(--green-a2)" : "var(--red-a2)"
      }}
    >
      <Flex align="center" justify="between" gap="3" wrap="wrap">
        <Text size="2" weight="bold">
          {label}
        </Text>
        <Badge color={ok ? "green" : "red"} variant="solid" size="2" highContrast>
          {ok ? "Pass" : "Fail"}
        </Badge>
      </Flex>
      {!ok ? (
        <Text size="1" color="gray" mt="2" style={{ fontFamily: "ui-monospace, Menlo, monospace", wordBreak: "break-word" }}>
          {error}
        </Text>
      ) : null}
    </Card>
  );
}

function ValidateCaseAlgorithmsPanel() {
  const [notation, setNotation] = useState(SUNE);
  const pllError = validatePLLAlgorithm(notation);
  const ollError = validateOLLAlgorithm(notation);

  return (
    <Flex direction="column" gap="3" style={{ maxWidth: 720 }}>
      <Heading size="5">PLL / OLL case validation</Heading>
      <Text size="2" color="gray">
        Green and red rows summarize the cube after <code>parseReversedNotation</code> (same prep as <code>MiniCube</code>{" "}
        cards). Failed checks show the message under the row.
      </Text>
      <TextArea
        value={notation}
        onChange={(e) => setNotation(e.target.value)}
        rows={4}
        style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: 13 }}
      />
      <Flex gap="2" wrap="wrap">
        <Button type="button" size="1" variant="soft" color="blue" onClick={() => setNotation(SUNE)}>
          Apply Sune example
        </Button>
        <Button type="button" size="1" variant="soft" color="blue" onClick={() => setNotation(ANTI_SUNE)}>
          Apply Anti-Sune example
        </Button>
        <Button type="button" size="1" variant="soft" color="orange" onClick={() => setNotation(T_PERM)}>
          Apply T perm example
        </Button>
      </Flex>
      <CaseValidatorRow label="validatePLLAlgorithm" error={pllError} />
      <CaseValidatorRow label="validateOLLAlgorithm" error={ollError} />
    </Flex>
  );
}

export const ValidatePllOllCases: StoryObj = {
  name: "Validate · PLL / OLL cases",
  render: () => <ValidateCaseAlgorithmsPanel />
};

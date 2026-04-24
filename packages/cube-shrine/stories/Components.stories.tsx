import type { Meta, StoryObj } from "@storybook/react";
import { Card, Flex, Grid, Heading, Separator, Text, TextArea, TextField } from "@radix-ui/themes";
import { parseNotation } from "@shreklabs/cube-shrine/core";
import { MiniCube, useAlgorithmInput, useAlgorithmTextArea } from "@shreklabs/cube-shrine/react";

const meta = {
  title: "Components",
  parameters: {
    docs: {
      description: {
        component:
          "React helpers from `@shreklabs/cube-shrine/react`. Algorithm fields use `validateAlgorithm` / `normalizeAlgorithm` from the core package."
      }
    }
  }
} satisfies Meta;

export default meta;

export const MiniCubeShowcase: StoryObj = {
  name: "MiniCube",
  render: () => (
    <Flex direction="column" gap="4" style={{ maxWidth: 520 }}>
      <Heading size="5">MiniCube</Heading>
      <Text size="2" color="gray">
        Same props as on the site: <code>preparationRotations</code> from <code>parseNotation</code> or{" "}
        <code>parseReversedNotation</code>.
      </Text>
      <Card size="2">
        <Flex direction="column" gap="3" align="center">
          <MiniCube size={120} preparationRotations={parseNotation("R U R' U'")} deferUntilVisible={false} />
          <Text size="1" color="gray" align="center">
            <code>R U R&apos; U&apos;</code>
          </Text>
        </Flex>
      </Card>
    </Flex>
  )
};

function AlgorithmFieldsDemo() {
  const strict = useAlgorithmInput({
    allowInvalid: false,
    initialValue: "R U R' U'"
  });
  const loose = useAlgorithmTextArea({
    allowInvalid: true,
    initialValue: "R U R'"
  });

  const prep = !strict.error ? parseNotation(strict.value) : [];

  return (
    <Flex direction="column" gap="4" style={{ maxWidth: 960 }}>
      <Heading size="5">Algorithm fields</Heading>
      <Text size="2" color="gray">
        <strong>Strict</strong> input rejects any change that would make the string invalid (including paste). A{" "}
        <code>MiniCube</code> below mirrors the current strict value when it parses.
      </Text>
      <Text size="2" color="gray">
        <strong>Permissive</strong> textarea keeps invalid text and exposes <code>error</code> plus <code>normalized</code>{" "}
        when the string is valid.
      </Text>

      <Grid columns={{ initial: "1", md: "2" }} gap="4" align="start">
        <Card size="2">
          <Text size="2" weight="bold" mb="2" as="div">
            Strict (useAlgorithmInput)
          </Text>
          <TextField.Root
            size="2"
            mb="2"
            {...strict.inputProps}
            placeholder="e.g. R U R' U'"
            style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}
          />
          <Flex direction="column" gap="1" mb="3">
            <Text size="1" color="gray" as="div">
              error: {strict.error ?? "—"}
            </Text>
            <Text size="1" color="gray" as="div">
              normalized: {strict.normalized ?? "—"}
            </Text>
          </Flex>
          <Separator size="4" />
          <Text size="1" weight="medium" color="gray" mb="2" as="div">
            MiniCube (strict value)
          </Text>
          <Flex justify="center">
            <MiniCube size={100} preparationRotations={prep} deferUntilVisible={false} />
          </Flex>
        </Card>

        <Card size="2">
          <Text size="2" weight="bold" mb="2" as="div">
            Permissive (useAlgorithmTextArea)
          </Text>
          <TextArea
            {...loose.textareaProps}
            rows={4}
            mb="2"
            style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: 13 }}
          />
          <Flex direction="column" gap="1">
            <Text size="1" color="gray" as="div">
              error: {loose.error ?? "—"}
            </Text>
            <Text size="1" color="gray" as="div">
              normalized: {loose.normalized ?? "—"}
            </Text>
          </Flex>
        </Card>
      </Grid>
    </Flex>
  );
}

export const AlgorithmFields: StoryObj = {
  name: "Algorithm input · textarea",
  render: () => <AlgorithmFieldsDemo />
};

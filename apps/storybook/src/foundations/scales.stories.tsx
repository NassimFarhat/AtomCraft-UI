import { typeStyles } from "@atomcraft/tokens";
import { Card, CardContent, Grid, Stack, Text } from "@atomcraft/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Foundations/Scales", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Typography: Story = {
  render: () => (
    <Stack gap="4">
      {Object.keys(typeStyles).map((name) => (
        <Stack key={name} direction={{ base: "column", md: "row" }} gap="4" align="baseline">
          <Text size="xs" tone="tertiary" style={{ inlineSize: "8rem", flexShrink: 0 }}>
            {name}
          </Text>
          <span
            style={{
              fontSize: `var(--ac-type-${name}-size)`,
              lineHeight: `var(--ac-type-${name}-line-height)`,
              fontWeight: `var(--ac-type-${name}-weight)`,
              letterSpacing: `var(--ac-type-${name}-tracking)`,
            }}
          >
            Design systems scale teams
          </span>
        </Stack>
      ))}
    </Stack>
  ),
};

const SPACES = ["1", "2", "3", "4", "6", "8", "12", "16", "24"];

export const Spacing: Story = {
  render: () => (
    <Stack gap="2">
      {SPACES.map((space) => (
        <Stack key={space} direction="row" gap="4" align="center">
          <Text size="xs" tone="tertiary" style={{ inlineSize: "6rem" }}>
            --ac-space-{space}
          </Text>
          <div
            style={{
              inlineSize: `var(--ac-space-${space})`,
              blockSize: "1rem",
              borderRadius: "3px",
              background: "var(--ac-color-primary-solid)",
            }}
          />
        </Stack>
      ))}
    </Stack>
  ),
};

export const RadiusAndElevation: Story = {
  render: () => (
    <Grid minItemWidth="10rem" gap="6">
      {["card", "raised", "dropdown", "dialog"].map((level) => (
        <Card key={level} style={{ boxShadow: `var(--ac-elevation-${level})` }}>
          <CardContent>
            <Text size="sm" weight="medium">
              elevation-{level}
            </Text>
            <Text size="xs" tone="tertiary">
              radius-card (change Shape in the toolbar)
            </Text>
          </CardContent>
        </Card>
      ))}
    </Grid>
  ),
};

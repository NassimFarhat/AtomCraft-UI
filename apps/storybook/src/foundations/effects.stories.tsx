import { CHART_SERIES } from "@atomscraft/tokens";
import { Grid, Heading, Stack, Text } from "@atomscraft/react";
import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Foundations/Effects",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const tile: CSSProperties = {
  blockSize: "7rem",
  borderRadius: "var(--ac-radius-card)",
  border: "1px solid var(--ac-color-border-subtle)",
};

function Sample({
  label,
  style,
  children,
}: {
  label: string;
  style: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <Stack gap="2">
      <div style={{ ...tile, ...style }}>{children}</div>
      <Text size="xs" tone="tertiary">
        {label}
      </Text>
    </Stack>
  );
}

const GRADIENTS = ["brand", "brand-soft", "brand-border", "brand-glow", "brand-mesh", "surface"];

/** Brand gradients follow the Theme and Mode toolbar settings. */
export const Gradients: Story = {
  render: () => (
    <Stack gap="6">
      <Heading level={2} size="display-sm">
        <span
          style={{
            backgroundImage: "var(--ac-gradient-brand-text)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Gradient headline
        </span>
      </Heading>
      <Grid minItemWidth="12rem" gap="4">
        {GRADIENTS.map((name) => (
          <Sample
            key={name}
            label={`--ac-gradient-${name}`}
            style={{
              backgroundImage: `var(--ac-gradient-${name})`,
              backgroundColor: "var(--ac-color-bg-surface)",
            }}
          />
        ))}
      </Grid>
    </Stack>
  ),
};

const SHADOWS = ["xs", "sm", "md", "lg", "xl", "2xl", "inner", "ring", "focus"];

/** Shadows resolve per color mode: switch Mode to compare light and dark depth. */
export const Shadows: Story = {
  render: () => (
    <Grid minItemWidth="10rem" gap="6">
      {SHADOWS.map((name) => (
        <Sample
          key={name}
          label={`--ac-shadow-${name}`}
          style={{
            background: "var(--ac-color-bg-surface-raised)",
            border: "none",
            boxShadow: `var(--ac-shadow-${name})`,
          }}
        />
      ))}
    </Grid>
  ),
};

/** Translucent surface over the brand mesh, as used by sticky bars and overlays. */
export const Glass: Story = {
  render: () => (
    <div
      style={{
        ...tile,
        blockSize: "14rem",
        display: "grid",
        placeItems: "center",
        backgroundImage: "var(--ac-gradient-brand-mesh)",
      }}
    >
      <div
        style={{
          padding: "var(--ac-space-6)",
          borderRadius: "var(--ac-radius-card)",
          background: "var(--ac-color-bg-glass)",
          border: "1px solid var(--ac-color-bg-glass-border)",
          backdropFilter: "blur(var(--ac-blur-md))",
          boxShadow: "var(--ac-shadow-lg)",
        }}
      >
        <Text weight="medium">--ac-color-bg-glass</Text>
      </div>
    </div>
  ),
};

/** Categorical series for charts: fixed across brands, 3:1 on every surface. */
export const ChartSeries: Story = {
  render: () => (
    <Grid minItemWidth="7rem" gap="4">
      {CHART_SERIES.map((name, index) => (
        <Sample
          key={name}
          label={`--ac-color-chart-${index + 1} (${name})`}
          style={{ blockSize: "3rem", background: `var(--ac-color-chart-${index + 1})` }}
        />
      ))}
    </Grid>
  ),
};

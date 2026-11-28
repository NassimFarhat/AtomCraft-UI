import { BRAND_NAMES } from "@atomscraft/tokens";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Grid,
  Input,
  Progress,
  Stack,
  Switch,
  Tag,
  Text,
} from "@atomscraft/react";
import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

/**
 * Every brand theme side by side, each in its own `data-ac-theme` zone. Themes nest, so
 * one page can host several brands; switch Mode, Density, Shape or Contrast in the
 * toolbar and every zone follows.
 */
const meta = {
  title: "Foundations/Theme playground",
  parameters: { layout: "padded" },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const gradientText: CSSProperties = {
  backgroundImage: "var(--ac-gradient-brand-text)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
};

function BrandSample({ brand }: { brand: string }) {
  return (
    <div data-ac-theme={brand}>
      <Card variant="elevated" style={{ overflow: "hidden" }}>
        <div
          aria-hidden="true"
          style={{ blockSize: "4.5rem", backgroundImage: "var(--ac-gradient-brand-mesh)" }}
        />
        <CardContent>
          <Stack gap="4">
            <Stack direction="row" justify="between" align="center">
              <Text weight="semibold" style={{ ...gradientText, textTransform: "capitalize" }}>
                {brand}
              </Text>
              <Badge tone="primary" dot>
                Active
              </Badge>
            </Stack>
            <Input aria-label={`${brand} sample field`} placeholder="name@company.com" />
            <Progress aria-label={`${brand} progress`} value={64} />
            <Stack direction="row" gap="2" align="center" wrap>
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="soft">
                Soft
              </Button>
              <Switch aria-label={`${brand} switch`} defaultChecked />
              <Tag tone="primary" size="sm">
                Tag
              </Tag>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </div>
  );
}

export const AllBrands: Story = {
  render: () => (
    <Grid minItemWidth="16rem" gap="4" style={{ inlineSize: "min(72rem, 100%)" }}>
      {BRAND_NAMES.map((brand) => (
        <BrandSample key={brand} brand={brand} />
      ))}
    </Grid>
  ),
};

/** Light and dark zones on one page: each resolves its own surfaces, shadows and brand. */
export const LightAndDark: Story = {
  render: () => (
    <Grid columns={{ base: 1, md: 2 }} gap="4" style={{ inlineSize: "min(56rem, 100%)" }}>
      {(["light", "dark"] as const).map((mode) => (
        <div
          key={mode}
          data-ac-mode={mode}
          style={{
            padding: "var(--ac-space-6)",
            borderRadius: "var(--ac-radius-card)",
            background: "var(--ac-color-bg-canvas)",
            color: "var(--ac-color-text-primary)",
          }}
        >
          <Stack gap="3">
            <Text size="xs" tone="tertiary" style={{ textTransform: "capitalize" }}>
              {mode} zone
            </Text>
            <BrandSample brand="violet" />
          </Stack>
        </div>
      ))}
    </Grid>
  ),
};

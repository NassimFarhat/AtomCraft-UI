import { BASE_TOKENS, INTENTS, INTENT_ROLES, palettes } from "@atomscraft/tokens";
import { Grid, Heading, Stack, Text } from "@atomscraft/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Foundations/Colors", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const kebab = (value: string) => value.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

function Swatch({ name, variable }: { name: string; variable: string }) {
  return (
    <Stack gap="1">
      <div
        style={{
          blockSize: "3rem",
          borderRadius: "var(--ac-radius-control)",
          border: "1px solid var(--ac-color-border-default)",
          background: `var(${variable})`,
        }}
      />
      <Text size="xs" weight="medium">
        {name}
      </Text>
      <Text size="xs" tone="tertiary">
        {variable}
      </Text>
    </Stack>
  );
}

export const SemanticSurfaces: Story = {
  render: () => (
    <Grid minItemWidth="9rem" gap="4">
      {BASE_TOKENS.map((token) => (
        <Swatch key={token} name={token} variable={`--ac-color-${kebab(token)}`} />
      ))}
    </Grid>
  ),
};

export const Intents: Story = {
  render: () => (
    <Stack gap="6">
      <Text tone="secondary">
        Switch the Theme and Mode in the toolbar: primary follows the brand, status colors never
        change meaning.
      </Text>
      {INTENTS.map((intent) => (
        <Stack key={intent} gap="2">
          <Heading level={3} size="5">
            {intent}
          </Heading>
          <Grid minItemWidth="7rem" gap="3">
            {INTENT_ROLES.map((role) => (
              <Swatch key={role} name={role} variable={`--ac-color-${intent}-${kebab(role)}`} />
            ))}
          </Grid>
        </Stack>
      ))}
    </Stack>
  ),
};

export const Palettes: Story = {
  render: () => (
    <Stack gap="4">
      {Object.entries(palettes).map(([name, palette]) => (
        <Stack key={name} gap="1">
          <Text size="sm" weight="semibold">
            {name}
          </Text>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(11, minmax(0, 1fr))",
              gap: "4px",
            }}
          >
            {Object.entries(palette).map(([shade, value]) => (
              <div
                key={shade}
                title={`${name}-${shade} ${value}`}
                style={{ blockSize: "2.5rem", borderRadius: "6px", background: value }}
              />
            ))}
          </div>
        </Stack>
      ))}
    </Stack>
  ),
};

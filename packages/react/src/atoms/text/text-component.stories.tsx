import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Text } from "./text";

const meta = {
  title: "Atoms/Text",
  component: Text,
  args: { children: "The quick brown fox jumps over the lazy dog." },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SizesAndTones: Story = {
  render: () => (
    <Stack gap="3">
      {(["lg", "md", "sm", "xs"] as const).map((size) => (
        <Text key={size} size={size}>
          {size.toUpperCase()} text for readable interface content.
        </Text>
      ))}
      <Text tone="secondary">Secondary text for supporting information.</Text>
      <Text tone="tertiary">Tertiary text for quiet hints.</Text>
      <Text tone="danger" weight="medium">
        Danger text with an explicit message.
      </Text>
      <Text truncate style={{ inlineSize: "16rem" }}>
        A longer line that truncates with an ellipsis when it no longer fits.
      </Text>
    </Stack>
  ),
};

export const SemanticElements: Story = {
  render: () => (
    <Stack gap="3">
      <Text as="p">A paragraph element.</Text>
      <Text as="span">An inline span element.</Text>
      <Text as="small" tone="secondary">
        A small element for supporting text.
      </Text>
      <Text as="strong" weight="semibold">
        A strong element for emphasized text.
      </Text>
    </Stack>
  ),
};

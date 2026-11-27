import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "../../layout";
import { Heading } from "./heading";

const meta = {
  title: "Atoms/Heading",
  component: Heading,
  args: { children: "Build with clarity", level: 2 },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const DocumentLevels: Story = {
  render: () => (
    <Stack gap="3">
      <Heading level={1}>Page title</Heading>
      <Heading level={2}>Section title</Heading>
      <Heading level={3}>Subsection title</Heading>
      <Heading level={4}>Nested heading</Heading>
    </Stack>
  ),
};

export const VisualSizeAndTone: Story = {
  render: () => (
    <Stack gap="3">
      <Heading level={2} size="display-md">
        Large display, correct outline
      </Heading>
      <Heading level={3} tone="secondary">
        Secondary heading
      </Heading>
    </Stack>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flex } from "../../layout";
import { ColorSwatch } from "./color-swatch";

const meta = {
  title: "Atoms/ColorSwatch",
  component: ColorSwatch,
  args: { color: "var(--ac-color-primary-solid)", label: "Primary" },
} satisfies Meta<typeof ColorSwatch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Palette: Story = {
  render: () => (
    <Flex wrap gap="2">
      <ColorSwatch color="var(--ac-color-primary-solid)" label="Indigo" />
      <ColorSwatch color="var(--ac-color-success-solid)" label="Success" />
      <ColorSwatch color="var(--ac-color-warning-solid)" label="Warning" />
      <ColorSwatch color="var(--ac-color-danger-solid)" label="Danger" />
    </Flex>
  ),
};

export const Selected: Story = {
  args: { color: "var(--ac-color-primary-solid)", label: "Selected", defaultSelected: true },
};

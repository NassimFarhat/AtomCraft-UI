import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { SplitButton } from "./split-button";

const meta = {
  title: "Molecules/SplitButton",
  component: SplitButton,
  args: {
    label: "Save",
    menuLabel: "More save options",
    onClick: fn(),
    actions: [
      { id: "draft", label: "Save as draft", onSelect: fn() },
      { id: "copy", label: "Save a copy", onSelect: fn() },
    ],
  },
} satisfies Meta<typeof SplitButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const SaveActions: Story = {};

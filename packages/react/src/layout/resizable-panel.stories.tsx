import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "../atoms/text";
import { ResizablePanel } from "./layout";

const meta = { title: "Layout/ResizablePanel", component: ResizablePanel } satisfies Meta<
  typeof ResizablePanel
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  args: {
    tabIndex: 0,
    "aria-label": "Resizable notes panel",
    style: {
      inlineSize: "20rem",
      maxInlineSize: "calc(100vw - 5rem)",
      padding: "var(--ac-space-4)",
    },
    children: <Text>Drag the resize handle at the inline edge.</Text>,
  },
};

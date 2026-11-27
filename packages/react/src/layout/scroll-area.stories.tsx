import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea } from "./layout";

const meta = { title: "Layout/ScrollArea", component: ScrollArea } satisfies Meta<
  typeof ScrollArea
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const LongContent: Story = {
  args: {
    "aria-label": "Scrollable activity list",
    style: {
      maxBlockSize: "14rem",
      padding: "var(--ac-space-3)",
      border: "1px solid var(--ac-color-border-default)",
    },
    children: Array.from({ length: 12 }, (_, index) => (
      <p key={index}>Activity item {index + 1}</p>
    )),
  },
};

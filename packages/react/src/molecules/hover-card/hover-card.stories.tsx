import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button";
import { HoverCard } from "./hover-card";

const meta = {
  title: "Molecules/HoverCard",
  component: HoverCard,
  args: {
    children: (
      <Button variant="outline" tone="neutral">
        Hover or focus
      </Button>
    ),
    content: "A rich preview can include links and other content.",
    label: "Component preview",
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Preview: Story = {};

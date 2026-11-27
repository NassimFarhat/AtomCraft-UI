import type { Meta, StoryObj } from "@storybook/react-vite";
import { TreeView } from "./catalog-navigation";

const meta = {
  title: "Organisms/TreeView",
  component: TreeView,
  args: {
    label: "Project files",
    defaultExpandedIds: ["src"],
    nodes: [
      {
        id: "src",
        label: "src",
        children: [
          {
            id: "atoms",
            label: "atoms",
            children: [
              { id: "button", label: "button.tsx" },
              { id: "input", label: "input.tsx" },
            ],
          },
          { id: "index", label: "index.ts" },
        ],
      },
      { id: "docs", label: "docs" },
    ],
  },
} satisfies Meta<typeof TreeView>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Hierarchy: Story = {};

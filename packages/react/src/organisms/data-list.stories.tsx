import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataList } from "./essentials";

const meta = {
  title: "Organisms/DataList",
  component: DataList,
  args: {
    items: [
      { id: "core", title: "@atomscraft/core", description: "Behavior primitives", value: "0.1.1" },
      {
        id: "react",
        title: "@atomscraft/react",
        description: "Accessible React components",
        value: "0.1.1",
      },
    ],
  },
} satisfies Meta<typeof DataList>;
export default meta;
type Story = StoryObj<typeof meta>;
export const PackageList: Story = {};

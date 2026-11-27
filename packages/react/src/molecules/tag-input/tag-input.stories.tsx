import type { Meta, StoryObj } from "@storybook/react-vite";
import { TagInput } from "./tag-input";

const meta = { title: "Molecules/TagInput", component: TagInput } satisfies Meta<typeof TagInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Recipients: Story = {
  args: {
    "aria-label": "Add a recipient",
    placeholder: "Type a name and press Enter",
    defaultValue: ["Design", "Research"],
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { CustomSelect } from "./index";

const meta = {
  title: "Molecules/CustomSelect",
  component: CustomSelect,
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "22rem", maxInlineSize: "calc(100vw - 5rem)" }}>{Story()}</div>
    ),
  ],
  args: {
    "aria-label": "Workspace role",
    placeholder: "Choose a role",
    options: [
      { value: "owner", label: "Owner", description: "Full access" },
      { value: "editor", label: "Editor", description: "Can change content" },
      { value: "viewer", label: "Viewer", description: "Read only" },
    ],
  },
} satisfies Meta<typeof CustomSelect>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Roles: Story = {};

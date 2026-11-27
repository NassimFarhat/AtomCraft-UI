import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "./stepper";

const meta = {
  title: "Molecules/Stepper",
  component: Stepper,
  args: {
    label: "Create a workspace",
    currentStep: 2,
    steps: [
      { id: "details", label: "Details", description: "Name the workspace" },
      { id: "members", label: "Members", description: "Invite collaborators" },
      { id: "review", label: "Review" },
    ],
  },
} satisfies Meta<typeof Stepper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};
export const Vertical: Story = { args: { orientation: "vertical" } };

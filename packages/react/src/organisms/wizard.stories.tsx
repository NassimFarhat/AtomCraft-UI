import type { Meta, StoryObj } from "@storybook/react-vite";
import { Wizard } from "./catalog-workflow";

const meta = {
  title: "Organisms/Wizard",
  component: Wizard,
  args: {
    label: "Create workspace",
    previousLabel: "Back",
    nextLabel: "Continue",
    completeLabel: "Create workspace",
    onComplete: () => undefined,
    steps: [
      {
        id: "details",
        label: "Details",
        description: "Workspace basics",
        content: "Collect the workspace name and purpose here.",
      },
      {
        id: "members",
        label: "Members",
        description: "Invite teammates",
        content: "Choose who should have access.",
      },
      {
        id: "review",
        label: "Review",
        description: "Confirm setup",
        content: "Review the settings before creating the workspace.",
      },
    ],
  },
} satisfies Meta<typeof Wizard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const FirstStep: Story = {};
export const SecondStep: Story = { args: { defaultStep: 2 } };

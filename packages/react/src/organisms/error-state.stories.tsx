import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../atoms/button";
import { ErrorState } from "./essentials";

const meta = {
  title: "Organisms/ErrorState",
  component: ErrorState,
  args: {
    title: "Report could not load",
    children: "Check your connection and try again.",
    action: <Button>Try again</Button>,
  },
} satisfies Meta<typeof ErrorState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Retry: Story = {};

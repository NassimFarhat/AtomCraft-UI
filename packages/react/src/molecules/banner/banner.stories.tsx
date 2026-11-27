import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button";
import { Banner } from "./banner";

const meta = {
  title: "Molecules/Banner",
  component: Banner,
  args: {
    title: "Scheduled maintenance",
    children: "The dashboard will be unavailable from 22:00 to 22:30 UTC.",
  },
} satisfies Meta<typeof Banner>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Information: Story = {};
export const WithAction: Story = {
  args: {
    tone: "warning",
    action: (
      <Button size="sm" variant="outline" tone="neutral">
        View status
      </Button>
    ),
    dismissible: true,
    onDismiss: () => undefined,
  },
};

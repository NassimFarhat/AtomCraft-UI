import type { Meta, StoryObj } from "@storybook/react-vite";
import { Timeline } from "./catalog-workflow";

const meta = {
  title: "Organisms/Timeline",
  component: Timeline,
  args: {
    items: [
      {
        id: "created",
        title: "Project created",
        time: "9:12 AM",
        dateTime: "2026-11-27T09:12:00",
        tone: "success",
      },
      {
        id: "review",
        title: "Design review requested",
        description: "Three reviewers were notified.",
        time: "10:05 AM",
        dateTime: "2026-11-27T10:05:00",
      },
      {
        id: "publish",
        title: "Release scheduled",
        time: "2:00 PM",
        dateTime: "2026-11-27T14:00:00",
        tone: "warning",
      },
    ],
  },
} satisfies Meta<typeof Timeline>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Activity: Story = {};

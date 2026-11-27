import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateTimePicker } from "./date-time-picker";

const meta = {
  title: "Molecules/DateTimePicker",
  component: DateTimePicker,
  args: { "aria-label": "Appointment date and time" },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "19rem", maxInlineSize: "calc(100vw - 5rem)" }}>{Story()}</div>
    ),
  ],
} satisfies Meta<typeof DateTimePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Appointment: Story = { args: { defaultValue: new Date(2026, 10, 26, 14, 30) } };

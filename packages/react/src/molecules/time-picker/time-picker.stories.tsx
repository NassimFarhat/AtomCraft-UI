import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimePicker } from "./time-picker";

const meta = {
  title: "Molecules/TimePicker",
  component: TimePicker,
  args: { "aria-label": "Start time" },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "19rem", maxInlineSize: "calc(100vw - 5rem)" }}>{Story()}</div>
    ),
  ],
} satisfies Meta<typeof TimePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Meeting: Story = { args: { defaultValue: "09:30", step: 900 } };
export const Bounded: Story = { args: { min: "09:00", max: "17:00", step: 1800 } };

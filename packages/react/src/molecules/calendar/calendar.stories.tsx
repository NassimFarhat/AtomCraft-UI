import type { Meta, StoryObj } from "@storybook/react-vite";
import { addDays } from "@atomscraft/core";
import { Calendar } from "./calendar";

const today = new Date();

const meta = {
  title: "Molecules/Calendar",
  component: Calendar,
  args: { defaultValue: today },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Calendar {...args} />,
};

export const WithBounds: Story = {
  render: () => (
    <Calendar
      defaultValue={today}
      min={addDays(today, -7)}
      max={addDays(today, 21)}
      isDateDisabled={(date) => date.getDay() === 0}
    />
  ),
};

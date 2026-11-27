import type { Meta, StoryObj } from "@storybook/react-vite";
import { addDays } from "@atomscraft/core";
import { Stack } from "../../layout";
import { DatePicker } from "./date-picker";

const meta = {
  title: "Molecules/DatePicker",
  component: DatePicker,
  args: { "aria-label": "Release date" },
  decorators: [
    (Story) => (
      <div style={{ inlineSize: "19rem", maxInlineSize: "calc(100vw - 5rem)" }}>{Story()}</div>
    ),
  ],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const referenceDate = new Date(2026, 5, 18);

export const Default: Story = {
  args: { defaultValue: referenceDate, showFormatHint: true },
};

export const WithDateLimits: Story = {
  args: {
    min: addDays(referenceDate, -7),
    max: addDays(referenceDate, 21),
    isDateDisabled: (date) => date.getDay() === 0,
    showFormatHint: true,
  },
};

export const States: Story = {
  render: () => (
    <Stack gap="3">
      <DatePicker aria-label="Optional date" />
      <DatePicker aria-label="Invalid date" invalid defaultValue={referenceDate} />
      <DatePicker aria-label="Disabled date" disabled defaultValue={referenceDate} />
    </Stack>
  ),
};

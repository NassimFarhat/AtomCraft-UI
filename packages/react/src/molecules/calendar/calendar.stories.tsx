import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { addDays } from "@atomcraft/core";
import { Text } from "../../atoms/text";
import { Stack } from "../../layout";
import { Card, CardContent } from "../card";
import { DatePicker } from "../date-picker";
import { Calendar } from "./calendar";

const today = new Date();

const meta = {
  title: "Molecules/Calendar & DatePicker",
  component: Calendar,
  args: { defaultValue: today },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card>
      <CardContent>
        <Calendar {...args} />
      </CardContent>
    </Card>
  ),
};

export const WithBounds: Story = {
  render: () => (
    <Card>
      <CardContent>
        <Calendar
          defaultValue={today}
          min={addDays(today, -7)}
          max={addDays(today, 21)}
          isDateDisabled={(date) => date.getDay() === 0}
        />
      </CardContent>
    </Card>
  ),
};

export const Picker: Story = {
  render: () => {
    const Demo = () => {
      const [date, setDate] = useState<Date | null>(today);
      return (
        <Stack gap="3" style={{ inlineSize: "18rem" }}>
          <DatePicker aria-label="Due date" value={date} showFormatHint onValueChange={setDate} />
          <Text size="sm" tone="secondary">
            {date ? date.toDateString() : "No date"}
          </Text>
        </Stack>
      );
    };
    return <Demo />;
  },
};

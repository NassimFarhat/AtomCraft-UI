import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Label } from "../label";
import { Text } from "../text";
import { Stack } from "../../layout";
import { Slider, SliderRange } from "./slider";

const meta = {
  title: "Atoms/Slider",
  component: Slider,
  args: { label: "Volume", defaultValue: 40 },
  decorators: [(Story) => <div style={{ inlineSize: "22rem" }}>{Story()}</div>],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <Stack gap="5">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Slider key={size} label={`Volume (${size})`} size={size} defaultValue={50} />
      ))}
    </Stack>
  ),
};

export const Tones: Story = {
  render: () => (
    <Stack gap="5">
      <Slider label="Primary" defaultValue={30} />
      <Slider label="Success" tone="success" defaultValue={60} />
      <Slider label="Danger" tone="danger" defaultValue={85} />
    </Stack>
  ),
};

export const WithMarks: Story = {
  args: {
    step: 25,
    marks: [
      { value: 0, label: "0" },
      { value: 25, label: "25" },
      { value: 50, label: "50" },
      { value: 75, label: "75" },
      { value: 100, label: "100" },
    ],
  },
  decorators: [
    (Story) => <div style={{ inlineSize: "22rem", paddingBlockEnd: "1.5rem" }}>{Story()}</div>,
  ],
};

export const Disabled: Story = { args: { disabled: true } };

export const WithALabel: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState(12);
      const format = (amount: number) => `${amount} TND`;
      return (
        <Stack gap="2">
          <Label htmlFor="budget-label" id="budget-label">
            Daily budget
          </Label>
          <Slider
            labelledBy="budget-label"
            value={value}
            max={50}
            formatValue={format}
            onValueChange={setValue}
          />
          <Text size="sm" tone="secondary">
            <bdi>{format(value)}</bdi>
          </Text>
        </Stack>
      );
    };
    return <Demo />;
  },
};

export const Range: Story = {
  render: () => (
    <SliderRange
      labels={["Minimum price", "Maximum price"]}
      defaultValue={[200, 800]}
      max={1000}
      step={50}
      formatValue={(value) => `${value} TND`}
    />
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  decorators: [(Story) => <div style={{ blockSize: "12rem" }}>{Story()}</div>],
};

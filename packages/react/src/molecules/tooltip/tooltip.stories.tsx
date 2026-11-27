import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button";
import { Stack } from "../../layout";
import { Tooltip } from "./tooltip";

const meta = {
  title: "Molecules/Tooltip",
  component: Tooltip,
  args: { content: "Short help text", children: <Button>Hover or focus</Button> },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Placement: Story = {
  render: () => (
    <Stack
      direction="row"
      gap="3"
      align="center"
      style={{ inlineSize: "min(22rem, calc(100vw - 5rem))", flexWrap: "wrap" }}
    >
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <Tooltip key={side} content={`Short help text shown ${side}`} side={side} delay={0}>
          <Button variant="outline" tone="neutral">
            {side}
          </Button>
        </Tooltip>
      ))}
    </Stack>
  ),
};

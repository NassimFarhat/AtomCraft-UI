import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button";
import { Input } from "../../atoms/input";
import { Stack } from "../../layout";
import { Field } from "../field";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "./popover";

const meta = {
  title: "Molecules/Popover",
  component: Popover,
  args: { children: <Button>Open popover</Button> },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AnchoredForm: Story = {
  render: () => (
    <Popover side="bottom" align="start">
      <PopoverTrigger>
        <Button variant="outline" tone="neutral">
          Edit dimensions
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Edit dimensions">
        <Stack gap="3" style={{ inlineSize: "16rem" }}>
          <Field label="Width">
            <Input aria-label="Width" defaultValue="100%" size="sm" />
          </Field>
          <Field label="Height">
            <Input aria-label="Height" defaultValue="auto" size="sm" />
          </Field>
          <PopoverClose>
            <Button size="sm">Apply</Button>
          </PopoverClose>
        </Stack>
      </PopoverContent>
    </Popover>
  ),
};

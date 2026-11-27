import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button";
import { ButtonGroup } from "./button-group";

const meta = { title: "Molecules/ButtonGroup", component: ButtonGroup } satisfies Meta<
  typeof ButtonGroup
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Actions: Story = {
  args: {
    "aria-label": "Document actions",
    children: (
      <>
        <Button variant="outline">Save draft</Button>
        <Button>Publish</Button>
      </>
    ),
  },
};

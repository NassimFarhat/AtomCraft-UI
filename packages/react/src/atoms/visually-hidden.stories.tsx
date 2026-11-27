import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { IconSearch } from "../icons";
import { VisuallyHidden } from "../utils";

const meta = {
  title: "Atoms/VisuallyHidden",
  component: VisuallyHidden,
  parameters: {
    docs: {
      description: {
        component:
          "Hides text visually while keeping it available to assistive technology. Use it to give icon-only controls an accessible name.",
      },
    },
  },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IconButtonLabel: Story = {
  render: () => (
    <div>
      <Button variant="outline" tone="neutral">
        <IconSearch aria-hidden="true" />
        <VisuallyHidden>Search</VisuallyHidden>
      </Button>
      <p>The button is named “Search” for assistive technology.</p>
    </div>
  ),
};

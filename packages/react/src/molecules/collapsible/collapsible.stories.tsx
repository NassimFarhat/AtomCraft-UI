import type { Meta, StoryObj } from "@storybook/react-vite";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";

const meta = {
  title: "Molecules/Collapsible",
  component: Collapsible,
  args: { children: null },
} satisfies Meta<typeof Collapsible>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Disclosure: Story = {
  render: () => (
    <Collapsible>
      <CollapsibleTrigger>Advanced settings</CollapsibleTrigger>
      <CollapsibleContent>Optional settings for the current workspace.</CollapsibleContent>
    </Collapsible>
  ),
};

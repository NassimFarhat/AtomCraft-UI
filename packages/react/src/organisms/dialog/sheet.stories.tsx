import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button";
import { Text } from "../../atoms/text";
import { Stack } from "../../layout";
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

const meta = {
  title: "Organisms/Sheet",
  component: Sheet,
  args: { children: null },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SidePanels: Story = {
  render: () => (
    <Stack direction="row" gap="2" wrap>
      {(["start", "end", "bottom"] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger>
            <Button variant="outline" tone="neutral">
              Open {side}
            </Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Narrow down the project list.</SheetDescription>
            </SheetHeader>
            <SheetBody>
              <Text tone="secondary">This panel opens from the {side} edge.</Text>
            </SheetBody>
            <SheetClose>
              <Button>Done</Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      ))}
    </Stack>
  ),
};

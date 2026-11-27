import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../atoms/button";
import { Text } from "../../atoms/text";
import { Stack } from "../../layout";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./index";

const meta = {
  title: "Organisms/Drawer",
  component: Drawer,
  args: { children: null },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SidePanels: Story = {
  render: () => (
    <Stack direction="row" gap="2" wrap>
      {(["start", "end", "bottom"] as const).map((side) => (
        <Drawer key={side}>
          <DrawerTrigger>
            <Button variant="outline" tone="neutral">
              Open {side} drawer
            </Button>
          </DrawerTrigger>
          <DrawerContent side={side}>
            <DrawerHeader>
              <DrawerTitle>Project filters</DrawerTitle>
              <DrawerDescription>Choose the projects you want to see.</DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <Text tone="secondary">This drawer slides from the {side} edge.</Text>
            </DrawerBody>
            <DrawerClose>
              <Button>Done</Button>
            </DrawerClose>
          </DrawerContent>
        </Drawer>
      ))}
    </Stack>
  ),
};

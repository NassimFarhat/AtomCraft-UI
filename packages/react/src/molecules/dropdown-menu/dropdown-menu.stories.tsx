import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button, IconButton } from "../../atoms/button";
import { Input } from "../../atoms/input";
import { IconCopy, IconMoreHorizontal, IconPencil, IconTrash, IconUser } from "../../icons";
import { Stack } from "../../layout";
import { Field } from "../field";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "../popover";
import { Tooltip } from "../tooltip";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const meta = {
  title: "Molecules/Overlays",
  component: DropdownMenu,
  args: { children: null },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Menu: Story = {
  render: function MenuStory() {
    const [compact, setCompact] = useState(false);
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <IconButton label="Project actions" variant="outline">
            <IconMoreHorizontal />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Project</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem icon={<IconPencil />} shortcut="⌘E">
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem icon={<IconCopy />} shortcut="⌘D">
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem icon={<IconUser />} disabled>
              Transfer ownership
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={compact} onCheckedChange={setCompact}>
            Compact view
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem icon={<IconTrash />} tone="danger" shortcut="⌫">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

export const PopoverForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline" tone="neutral">
          Edit dimensions
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Dimensions">
        <Stack gap="3" style={{ inlineSize: "16rem" }}>
          <Field label="Width">
            <Input defaultValue="100%" size="sm" />
          </Field>
          <Field label="Height">
            <Input defaultValue="auto" size="sm" />
          </Field>
          <PopoverClose>
            <Button size="sm">Apply</Button>
          </PopoverClose>
        </Stack>
      </PopoverContent>
    </Popover>
  ),
};

export const Tooltips: Story = {
  render: () => (
    <Stack direction="row" gap="3">
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <Tooltip key={side} content={`Tooltip on the ${side}`} side={side}>
          <Button variant="outline" tone="neutral">
            {side}
          </Button>
        </Tooltip>
      ))}
    </Stack>
  ),
};

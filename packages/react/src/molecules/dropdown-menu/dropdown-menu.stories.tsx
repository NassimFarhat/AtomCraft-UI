import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { IconButton } from "../../atoms/button";
import { IconCopy, IconMoreHorizontal, IconPencil, IconTrash, IconUser } from "../../icons";
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
  title: "Molecules/DropdownMenu",
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

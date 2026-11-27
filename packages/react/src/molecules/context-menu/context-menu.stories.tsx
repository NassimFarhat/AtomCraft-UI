import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./context-menu";

const meta = {
  title: "Molecules/ContextMenu",
  component: ContextMenu,
  args: { children: <></> },
} satisfies Meta<typeof ContextMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const RightClick: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          style={{
            minBlockSize: 180,
            display: "grid",
            placeItems: "center",
            border: "1px dashed var(--ac-color-border-default)",
            borderRadius: "var(--ac-radius-card)",
          }}
        >
          Right-click or press Shift+F10
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuItem onSelect={() => undefined}>Open</ContextMenuItem>
        <ContextMenuItem onSelect={() => undefined}>Duplicate</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled>Archive</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

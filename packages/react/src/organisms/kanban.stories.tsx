import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kanban } from "./catalog-workflow";

const meta = {
  title: "Organisms/Kanban",
  component: Kanban,
  args: {
    label: "Sprint board",
    moveLabel: "Move to column",
    onMoveCard: () => undefined,
    columns: [
      {
        id: "todo",
        title: "To do",
        cards: [
          { id: "tokens", title: "Review tokens", description: "Check dark theme contrast." },
        ],
      },
      { id: "doing", title: "In progress", cards: [{ id: "docs", title: "Write component docs" }] },
      { id: "done", title: "Done", cards: [] },
    ],
  },
} satisfies Meta<typeof Kanban>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Board: Story = {};

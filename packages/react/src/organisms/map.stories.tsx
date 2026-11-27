import type { Meta, StoryObj } from "@storybook/react-vite";
import { Map } from "./catalog-workflow";

const meta = {
  title: "Organisms/Map",
  component: Map,
  args: {
    label: "Office locations",
    markers: [
      { id: "tunis", label: "Tunis office", x: 54, y: 37, detail: "Tunis" },
      { id: "sf", label: "San Francisco office", x: 25, y: 43, detail: "San Francisco" },
      { id: "tokyo", label: "Tokyo office", x: 82, y: 48, detail: "Tokyo" },
    ],
    onMarkerSelect: () => undefined,
  },
  render: (args) => (
    <div style={{ inlineSize: "48rem", maxInlineSize: "calc(100vw - var(--ac-space-12))" }}>
      <Map {...args} />
    </div>
  ),
} satisfies Meta<typeof Map>;
export default meta;
type Story = StoryObj<typeof meta>;
export const MarkerCanvas: Story = {};

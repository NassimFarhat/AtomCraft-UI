import type { Meta, StoryObj } from "@storybook/react-vite";
import { AspectRatio } from "./layout";

const meta = { title: "Layout/AspectRatio", component: AspectRatio } satisfies Meta<
  typeof AspectRatio
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Video: Story = {
  args: {
    children: (
      <div
        style={{ display: "grid", placeItems: "center", background: "var(--ac-color-bg-muted)" }}
      >
        16:9
      </div>
    ),
  },
};
export const Square: Story = { args: { ratio: 1, children: <div aria-label="Square preview" /> } };

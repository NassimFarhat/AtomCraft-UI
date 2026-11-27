import type { Meta, StoryObj } from "@storybook/react-vite";
import { Carousel } from "./catalog-workflow";

const meta = {
  title: "Organisms/Carousel",
  component: Carousel,
  args: {
    label: "Release highlights",
    previousLabel: "Previous",
    nextLabel: "Next",
    slideLabel: (index: number, total: number) => `Slide ${index} of ${total}`,
    items: ["New components", "Theme updates", "Accessibility improvements"],
  },
} satisfies Meta<typeof Carousel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Slides: Story = {};
export const Looping: Story = { args: { loop: true } };

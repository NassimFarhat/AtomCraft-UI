import type { Meta, StoryObj } from "@storybook/react-vite";
import { Image } from "./image";

const illustration = "/landscape.svg";

const meta = { title: "Atoms/Image", component: Image } satisfies Meta<typeof Image>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Landscape: Story = {
  args: { src: illustration, alt: "Illustrated hills beneath a sun", aspectRatio: 16 / 9 },
};

export const LoadFallback: Story = {
  args: {
    src: "/missing-image.jpg",
    alt: "Product preview",
    aspectRatio: 4 / 3,
    fallback: "Preview unavailable",
  },
};

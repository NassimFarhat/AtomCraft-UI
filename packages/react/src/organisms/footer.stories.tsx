import type { Meta, StoryObj } from "@storybook/react-vite";
import { Footer } from "./catalog-collaboration";

const meta = {
  title: "Organisms/Footer",
  component: Footer,
  args: {
    label: "Footer navigation",
    brand: <strong>AtomCraft</strong>,
    links: [
      { id: "docs", label: "Documentation", href: "#docs" },
      { id: "packages", label: "Packages", href: "#packages" },
      { id: "support", label: "Support", href: "#support" },
    ],
    copyright: "© 2026 AtomCraft",
  },
} satisfies Meta<typeof Footer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

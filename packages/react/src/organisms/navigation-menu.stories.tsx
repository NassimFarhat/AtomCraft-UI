import type { Meta, StoryObj } from "@storybook/react-vite";
import { NavigationMenu } from "./catalog-navigation";

const meta = {
  title: "Organisms/NavigationMenu",
  component: NavigationMenu,
  args: {
    label: "Main navigation",
    items: [
      {
        id: "products",
        label: "Products",
        href: "/products",
        children: [{ id: "components", label: "Components", href: "/components" }],
      },
      { id: "docs", label: "Documentation", href: "/docs" },
    ],
  },
} satisfies Meta<typeof NavigationMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

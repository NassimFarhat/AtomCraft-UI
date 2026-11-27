import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconFolder, IconHome, IconInbox } from "../../icons";
import { Stack } from "../../layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "../breadcrumb";
import { NavItem } from "../nav-item";
import { Pagination } from "./pagination";

const meta = {
  title: "Examples/Navigation patterns",
  component: Pagination,
  args: { totalPages: 12, defaultPage: 5 },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PaginationStory: Story = { name: "Pagination" };

export const BreadcrumbStory: Story = {
  name: "Breadcrumb",
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href="#home">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#components">Components</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
};

export const NavItems: Story = {
  render: () => (
    <nav aria-label="Example">
      <Stack gap="1" style={{ inlineSize: "15rem" }}>
        <NavItem href="#home" icon={<IconHome />} active>
          Home
        </NavItem>
        <NavItem href="#inbox" icon={<IconInbox />} badge={12}>
          Inbox
        </NavItem>
        <NavItem href="#projects" icon={<IconFolder />}>
          Projects
        </NavItem>
      </Stack>
    </nav>
  ),
};

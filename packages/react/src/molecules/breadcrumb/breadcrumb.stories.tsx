import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "./breadcrumb";

const meta = { title: "Molecules/Breadcrumb", component: Breadcrumb } satisfies Meta<
  typeof Breadcrumb
>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href="#workspace">Workspace</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#projects">Projects</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbPage>Design system</BreadcrumbPage>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
};

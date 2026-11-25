import {
  AppShell,
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Grid,
  Header,
  Heading,
  IconBell,
  IconButton,
  IconCalendar,
  IconChart,
  IconFolder,
  IconHome,
  IconInbox,
  IconLogOut,
  IconMail,
  IconPlus,
  IconSettings,
  IconSparkles,
  IconUser,
  Progress,
  SearchField,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarTrigger,
  Stack,
  Stat,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
  toast,
} from "@atomcraft/react";
import type { DataTableColumn } from "@atomcraft/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = { title: "Examples/Dashboard", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

type Order = {
  id: string;
  customer: string;
  plan: string;
  status: "paid" | "pending" | "refunded";
  amount: number;
};

const orders: Order[] = [
  { id: "#3021", customer: "Amel Ben Salah", plan: "Team", status: "paid", amount: 1290 },
  { id: "#3020", customer: "Zied Trabelsi", plan: "Pro", status: "pending", amount: 149 },
  { id: "#3019", customer: "Emna Gharbi", plan: "Pro", status: "paid", amount: 149 },
  { id: "#3018", customer: "Youssef Kchaou", plan: "Starter", status: "refunded", amount: 0 },
  { id: "#3017", customer: "Sarra Jlassi", plan: "Team", status: "paid", amount: 1290 },
];

const STATUS_TONE = { paid: "success", pending: "warning", refunded: "neutral" } as const;
const money = new Intl.NumberFormat("fr-TN", {
  style: "currency",
  currency: "TND",
  maximumFractionDigits: 0,
});

const columns: DataTableColumn<Order>[] = [
  { key: "id", header: "Order" },
  {
    key: "customer",
    header: "Customer",
    sortable: true,
    cell: (row) => (
      <Stack direction="row" gap="2" align="center">
        <Avatar name={row.customer} size="xs" tone="primary" />
        {row.customer}
      </Stack>
    ),
  },
  { key: "plan", header: "Plan", sortable: true },
  {
    key: "status",
    header: "Status",
    cell: (row) => (
      <Badge dot tone={STATUS_TONE[row.status]}>
        {row.status}
      </Badge>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    sortable: true,
    align: "end",
    cell: (row) => money.format(row.amount),
  },
];

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Avatar name="AtomCraft" fallback="AC" shape="square" size="sm" tone="primary" />
        <Text weight="semibold" className="ac-nav-item__label">
          AtomCraft
        </Text>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup label="Overview">
          <SidebarItem href="#dashboard" icon={<IconHome />} tooltip="Dashboard" active>
            Dashboard
          </SidebarItem>
          <SidebarItem href="#analytics" icon={<IconChart />} tooltip="Analytics">
            Analytics
          </SidebarItem>
          <SidebarItem href="#inbox" icon={<IconInbox />} tooltip="Inbox" badge={8}>
            Inbox
          </SidebarItem>
        </SidebarGroup>
        <SidebarGroup label="Workspace">
          <SidebarItem href="#projects" icon={<IconFolder />} tooltip="Projects">
            Projects
          </SidebarItem>
          <SidebarItem href="#calendar" icon={<IconCalendar />} tooltip="Calendar">
            Calendar
          </SidebarItem>
          <SidebarItem href="#settings" icon={<IconSettings />} tooltip="Settings">
            Settings
          </SidebarItem>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Avatar name="Nassim Farhat" size="sm" status="online" />
        <Stack gap="0" className="ac-nav-item__label">
          <Text size="sm" weight="medium">
            Nassim Farhat
          </Text>
          <Text size="xs" tone="secondary">
            Admin
          </Text>
        </Stack>
      </SidebarFooter>
    </Sidebar>
  );
}

function UserMenu() {
  return (
    <DropdownMenu align="end">
      <DropdownMenuTrigger>
        <button
          type="button"
          className="ac-button"
          data-variant="ghost"
          data-tone="neutral"
          data-size="md"
          data-icon-only=""
          aria-label="Account"
        >
          <Avatar name="Nassim Farhat" size="sm" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>nassim@atomcraft.dev</DropdownMenuLabel>
        <DropdownMenuItem icon={<IconUser />}>Profile</DropdownMenuItem>
        <DropdownMenuItem icon={<IconSettings />}>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<IconLogOut />} tone="danger">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AppHeader() {
  return (
    <Header
      start={<SidebarTrigger />}
      brand={
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="#workspace">Workspace</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
      }
      actions={
        <>
          <div style={{ inlineSize: "16rem" }} className="sb-hide-mobile">
            <SearchField size="sm" placeholder="Search…" shortcut="⌘K" />
          </div>
          <IconButton label="Notifications">
            <IconBell />
          </IconButton>
          <UserMenu />
        </>
      }
    />
  );
}

export const Overview: Story = {
  render: () => (
    <AppShell header={<AppHeader />} sidebar={<AppSidebar />}>
      <Container size="xl" style={{ paddingBlock: "var(--ac-space-8)" }}>
        <Stack gap="8">
          <Stack direction={{ base: "column", md: "row" }} justify="between" gap="4">
            <Stack gap="1">
              <Heading level={1}>Good morning, Nassim</Heading>
              <Text tone="secondary">Here is what happened in your workspace this week.</Text>
            </Stack>
            <Stack direction="row" gap="2">
              <Button variant="outline" tone="neutral">
                <IconMail /> Invite
              </Button>
              <Button
                onClick={() =>
                  toast.success("Project created", { description: "“Atlas” is ready." })
                }
              >
                <IconPlus /> New project
              </Button>
            </Stack>
          </Stack>

          <Grid columns={{ base: 1, sm: 2, xl: 4 }} gap="4">
            <Card>
              <CardContent>
                <Stat
                  label="Revenue"
                  value="48 290 TND"
                  delta="+12.4%"
                  trend="up"
                  caption="vs last month"
                  icon={<IconChart />}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Stat
                  label="Subscriptions"
                  value="1 284"
                  delta="+6.2%"
                  trend="up"
                  caption="vs last month"
                  icon={<IconUser />}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Stat
                  label="Open tickets"
                  value="37"
                  delta="-9"
                  trend="down"
                  invertTrend
                  caption="this week"
                  icon={<IconInbox />}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Stat
                  label="Churn"
                  value="1.8%"
                  delta="+0.2 pt"
                  trend="up"
                  invertTrend
                  caption="vs last month"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid columns={{ base: 1, lg: 3 }} gap="4">
            <Card style={{ gridColumn: "span var(--_span, 1)" }} className="sb-span-2">
              <CardHeader>
                <CardTitle>Recent orders</CardTitle>
                <CardDescription>Payments received in the last 7 days.</CardDescription>
                <CardAction>
                  <Button variant="ghost" tone="neutral" size="sm">
                    View all
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <DataTable
                  caption="Recent orders"
                  hideCaption
                  columns={columns}
                  rows={orders}
                  getRowId={(row) => row.id}
                  selectable
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Usage</CardTitle>
                <CardDescription>Team plan · resets on Dec 1</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="storage" variant="segmented">
                  <TabsList aria-label="Usage">
                    <TabsTrigger value="storage">Storage</TabsTrigger>
                    <TabsTrigger value="seats">Seats</TabsTrigger>
                  </TabsList>
                  <TabsContent value="storage">
                    <Stack gap="4">
                      <Stack gap="2">
                        <Text size="sm">Files · 7.2 of 10 GB</Text>
                        <Progress aria-label="Files" value={72} />
                      </Stack>
                      <Stack gap="2">
                        <Text size="sm">Media · 9.4 of 10 GB</Text>
                        <Progress aria-label="Media" value={94} tone="warning" />
                      </Stack>
                    </Stack>
                  </TabsContent>
                  <TabsContent value="seats">
                    <Stack gap="2">
                      <Text size="sm">18 of 25 seats</Text>
                      <Progress aria-label="Seats" value={72} tone="success" />
                    </Stack>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardContent>
                <Button variant="soft" block>
                  <IconSparkles /> Upgrade plan
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Stack>
      </Container>
    </AppShell>
  ),
};

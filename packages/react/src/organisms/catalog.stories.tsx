import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { IconChart, IconHome, IconInbox, IconSettings } from "../icons";
import { Stack } from "../layout";
import { BottomNavigation, NavigationMenu, TreeView } from "./catalog-navigation";
import { Carousel, Chart, FilterBar, Kanban, Map, Timeline, Wizard } from "./catalog-workflow";
import {
  Chat,
  CommentsThread,
  FileManager,
  Footer,
  NotificationCenter,
  OnboardingTour,
  PricingTable,
  RichTextEditor,
} from "./catalog-collaboration";
import { NavigationRail, SkipLink } from "./essentials";

const meta = { title: "Organisms/Catalog" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const NavigationMenuExample: Story = {
  render: () => (
    <NavigationMenu
      label="Main navigation"
      items={[
        {
          id: "products",
          label: "Products",
          href: "/products",
          children: [
            { id: "components", label: "Components", href: "/components" },
            { id: "tokens", label: "Tokens", href: "/tokens" },
          ],
        },
        { id: "docs", label: "Documentation", href: "/docs" },
      ]}
    />
  ),
};
export const BottomNavigationExample: Story = {
  render: () => (
    <BottomNavigation
      label="Mobile navigation"
      items={[
        { id: "home", label: "Home", href: "#home", icon: <IconHome />, current: true },
        { id: "inbox", label: "Inbox", href: "#inbox", icon: <IconInbox />, badge: 3 },
        { id: "settings", label: "Settings", href: "#settings", icon: <IconSettings /> },
      ]}
    />
  ),
};
export const TreeViewExample: Story = {
  render: () => (
    <TreeView
      label="Project files"
      defaultExpandedIds={["src"]}
      nodes={[
        {
          id: "src",
          label: "src",
          children: [
            {
              id: "atoms",
              label: "atoms",
              children: [
                { id: "button", label: "button.tsx" },
                { id: "input", label: "input.tsx" },
              ],
            },
            { id: "index", label: "index.ts" },
          ],
        },
        { id: "docs", label: "docs" },
      ]}
    />
  ),
};
export const NavigationRailExample: Story = {
  render: () => (
    <NavigationRail
      label="Workspace"
      items={[
        { id: "home", label: "Home", href: "#home", icon: <IconHome />, current: true },
        { id: "analytics", label: "Analytics", href: "#analytics", icon: <IconChart /> },
        { id: "inbox", label: "Inbox", href: "#inbox", icon: <IconInbox />, badge: 3 },
      ]}
    />
  ),
};
export const SkipLinkExample: Story = {
  render: () => (
    <Stack gap="3">
      <SkipLink href="#demo-content">Skip to the example content</SkipLink>
      <p id="demo-content">Focus the skip link to reveal it and move to the main content.</p>
    </Stack>
  ),
};

function InteractiveFilterBar() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  return (
    <FilterBar
      query={query}
      onQueryChange={setQuery}
      queryLabel="Search projects"
      filters={[
        {
          id: "status",
          label: "Status",
          value: status,
          options: [
            { value: "all", label: "All statuses" },
            { value: "active", label: "Active" },
            { value: "archived", label: "Archived" },
          ],
        },
      ]}
      onFilterChange={(_, value) => setStatus(value)}
      resetLabel="Reset filters"
      onReset={() => {
        setQuery("");
        setStatus("all");
      }}
    />
  );
}
export const FilterBarExample: Story = { render: () => <InteractiveFilterBar /> };

export const WizardExample: Story = {
  render: () => (
    <Wizard
      label="Create workspace"
      previousLabel="Back"
      nextLabel="Continue"
      completeLabel="Create workspace"
      steps={[
        {
          id: "details",
          label: "Details",
          description: "Workspace basics",
          content: <p>Collect the workspace name and purpose here.</p>,
        },
        {
          id: "members",
          label: "Members",
          description: "Invite teammates",
          content: <p>Choose who should have access.</p>,
        },
        {
          id: "review",
          label: "Review",
          description: "Confirm setup",
          content: <p>Review the settings before creating the workspace.</p>,
        },
      ]}
      onComplete={() => undefined}
    />
  ),
};
export const CarouselExample: Story = {
  render: () => (
    <Carousel
      label="Release highlights"
      previousLabel="Previous"
      nextLabel="Next"
      slideLabel={(index, total) => `Slide ${index} of ${total}`}
      items={[
        <div key="one">
          <h3>New components</h3>
          <p>Explore new controls and patterns.</p>
        </div>,
        <div key="two">
          <h3>Theme updates</h3>
          <p>Preview semantic palettes and density options.</p>
        </div>,
        <div key="three">
          <h3>Accessibility</h3>
          <p>Review keyboard and screen reader behavior.</p>
        </div>,
      ]}
    />
  ),
};
export const TimelineExample: Story = {
  render: () => (
    <Timeline
      items={[
        {
          id: "created",
          title: "Project created",
          time: "9:12 AM",
          dateTime: "2026-11-27T09:12:00",
          tone: "success",
        },
        {
          id: "review",
          title: "Design review requested",
          description: "Three reviewers were notified.",
          time: "10:05 AM",
          dateTime: "2026-11-27T10:05:00",
        },
        {
          id: "publish",
          title: "Release scheduled",
          time: "2:00 PM",
          dateTime: "2026-11-27T14:00:00",
          tone: "warning",
        },
      ]}
    />
  ),
};
function InteractiveKanban() {
  const [columns, setColumns] = useState([
    {
      id: "todo",
      title: "To do",
      cards: [{ id: "tokens", title: "Review tokens", description: "Check dark theme contrast." }],
    },
    {
      id: "doing",
      title: "In progress",
      cards: [{ id: "docs", title: "Write component docs" }],
    },
    { id: "done", title: "Done", cards: [] },
  ]);

  return (
    <Kanban
      label="Sprint board"
      moveLabel="Move to column"
      columns={columns}
      onMoveCard={(cardId, destinationId) => {
        setColumns((current) => {
          const source = current.find((column) => column.cards.some((card) => card.id === cardId));
          const destination = current.find((column) => column.id === destinationId);
          const card = source?.cards.find((item) => item.id === cardId);
          if (!source || !destination || !card || source.id === destination.id) return current;

          return current.map((column) => {
            if (column.id === source.id) {
              return { ...column, cards: column.cards.filter((item) => item.id !== cardId) };
            }
            if (column.id === destination.id) {
              return { ...column, cards: [...column.cards, card] };
            }
            return column;
          });
        });
      }}
    />
  );
}

export const KanbanExample: Story = { render: () => <InteractiveKanban /> };
export const ChartExample: Story = {
  render: () => (
    <Chart
      label="Weekly package installs"
      categoryLabel="Day"
      valueLabel="Installs"
      type="line"
      data={[
        { label: "Mon", value: 120 },
        { label: "Tue", value: 160 },
        { label: "Wed", value: 142 },
        { label: "Thu", value: 210 },
        { label: "Fri", value: 188 },
      ]}
    />
  ),
};
export const MapExample: Story = {
  render: () => (
    <Map
      label="Office locations"
      markers={[
        { id: "tunis", label: "Tunis office", x: 54, y: 37, detail: "Tunis" },
        { id: "sf", label: "San Francisco office", x: 25, y: 43, detail: "San Francisco" },
        { id: "tokyo", label: "Tokyo office", x: 82, y: 48, detail: "Tokyo" },
      ]}
      onMarkerSelect={() => undefined}
    />
  ),
};
export const RichTextEditorExample: Story = {
  render: () => (
    <RichTextEditor
      label="Release notes"
      placeholder="Write with Markdown formatting…"
      formatLabels={{ bold: "Bold", italic: "Italic", bulletList: "Bullet list" }}
      defaultValue={"Highlights\n\nNew component examples are ready for review."}
    />
  ),
};
export const ChatExample: Story = {
  render: () => (
    <Chat
      label="Project discussion"
      inputLabel="Write a message"
      submitLabel="Send"
      emptyLabel="No messages yet."
      messages={[
        {
          id: "one",
          author: "Morgan Lee",
          timestamp: "10:42 AM",
          direction: "incoming",
          body: "The latest review is ready.",
        },
        {
          id: "two",
          author: "You",
          timestamp: "10:45 AM",
          direction: "outgoing",
          body: "I will take a look today.",
        },
      ]}
      onSend={() => undefined}
    />
  ),
};
export const NotificationCenterExample: Story = {
  render: () => (
    <NotificationCenter
      label="Notifications"
      markReadLabel="Mark read"
      dismissLabel="Dismiss"
      emptyLabel="You are all caught up."
      notifications={[
        {
          id: "review",
          title: "Review requested",
          description: "Morgan mentioned you in the button review.",
          time: "5 minutes ago",
          read: false,
        },
        {
          id: "release",
          title: "Release complete",
          description: "Version 0.1.1 is available.",
          time: "Yesterday",
          read: true,
        },
      ]}
      onMarkRead={() => undefined}
      onDismiss={() => undefined}
    />
  ),
};
export const CommentsThreadExample: Story = {
  render: () => (
    <CommentsThread
      label="Design review comments"
      inputLabel="Add a comment"
      submitLabel="Comment"
      emptyLabel="Start the discussion."
      comments={[
        {
          id: "one",
          author: "Morgan Lee",
          timestamp: "10:42 AM",
          body: "The spacing looks consistent across the states.",
        },
      ]}
      onAddComment={() => undefined}
    />
  ),
};
export const FileManagerExample: Story = {
  render: () => (
    <FileManager
      label="Project files"
      emptyLabel="This folder is empty."
      openFolderLabel="Open"
      downloadLabel="Download"
      deleteLabel="Delete"
      items={[
        { id: "design", name: "Design", kind: "folder", modified: "Today" },
        { id: "tokens", name: "tokens.json", kind: "file", size: "18 KB", modified: "Yesterday" },
      ]}
      onOpenFolder={() => undefined}
      onSelect={() => undefined}
      onDownload={() => undefined}
      onDelete={() => undefined}
    />
  ),
};
export const OnboardingTourExample: Story = {
  render: () => (
    <OnboardingTour
      defaultOpen
      steps={[
        {
          id: "catalog",
          title: "Browse components",
          description: "Search and filter the component catalog.",
        },
        {
          id: "preview",
          title: "Preview states",
          description: "Switch variants and inspect component behavior.",
        },
        {
          id: "code",
          title: "Copy usage",
          description: "Copy install and usage snippets into your project.",
        },
      ]}
      previousLabel="Back"
      nextLabel="Next"
      finishLabel="Finish"
      skipLabel="Skip tour"
      stepLabel={(step, total) => `Step ${step} of ${total}`}
    />
  ),
};
export const PricingTableExample: Story = {
  render: () => (
    <PricingTable
      label="Plans"
      actionLabel="Choose plan"
      periodLabel="per month"
      plans={[
        {
          id: "starter",
          name: "Starter",
          amount: 0,
          currency: "USD",
          description: "For small projects.",
          features: ["Core components", "Community support"],
        },
        {
          id: "team",
          name: "Team",
          amount: 24,
          currency: "USD",
          period: "per seat / month",
          featured: true,
          description: "For growing teams.",
          features: ["All components", "Shared themes", "Priority support"],
        },
      ]}
      onSelectPlan={() => undefined}
    />
  ),
};
export const FooterExample: Story = {
  render: () => (
    <Footer
      label="Footer navigation"
      brand={<strong>AtomCraft</strong>}
      links={[
        { id: "docs", label: "Documentation", href: "#docs" },
        { id: "packages", label: "Packages", href: "#packages" },
        { id: "support", label: "Support", href: "#support" },
      ]}
      copyright="© 2026 AtomCraft"
    />
  ),
};

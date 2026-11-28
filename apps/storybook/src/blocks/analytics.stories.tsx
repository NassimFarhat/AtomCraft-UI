import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Chart,
  Container,
  DataList,
  Grid,
  Heading,
  IconChart,
  IconSparkles,
  IconUser,
  Progress,
  SegmentedControl,
  Stack,
  Stat,
  Text,
} from "@atomscraft/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

/**
 * Analytics overview block: a period switcher, KPI row, a chart card, top pages and a
 * traffic-source breakdown that uses the categorical chart colors.
 */
const meta = { title: "Blocks/Analytics", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const SERIES = {
  week: [
    { label: "Mon", value: 1240 },
    { label: "Tue", value: 1610 },
    { label: "Wed", value: 1425 },
    { label: "Thu", value: 2105 },
    { label: "Fri", value: 1880 },
    { label: "Sat", value: 960 },
    { label: "Sun", value: 870 },
  ],
  month: [
    { label: "W1", value: 8420 },
    { label: "W2", value: 9310 },
    { label: "W3", value: 10120 },
    { label: "W4", value: 11980 },
  ],
} as const;

const SOURCES = [
  ["Organic search", 42],
  ["Direct", 27],
  ["Referral", 16],
  ["Social", 9],
  ["Email", 6],
] as const;

function AnalyticsOverview() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  return (
    <Container size="xl" style={{ paddingBlock: "var(--ac-layout-section)" }}>
      <Stack gap="8">
        <Stack direction={{ base: "column", md: "row" }} justify="between" gap="4">
          <Stack gap="1">
            <Heading level={1} size="2">
              Analytics
            </Heading>
            <Text tone="secondary">Documentation traffic for atomcraft.dev.</Text>
          </Stack>
          <SegmentedControl
            label="Period"
            value={period}
            onValueChange={(value) => setPeriod(value as "week" | "month")}
            options={[
              { value: "week", label: "7 days" },
              { value: "month", label: "30 days" },
            ]}
          />
        </Stack>

        <Grid columns={{ base: 1, sm: 3 }} gap="4">
          <Card>
            <CardContent>
              <Stat
                label="Visitors"
                value={period === "week" ? "10 090" : "39 830"}
                delta="+18%"
                trend="up"
                caption="vs previous period"
                icon={<IconUser />}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Stat
                label="Component views"
                value={period === "week" ? "48 112" : "191 404"}
                delta="+9.1%"
                trend="up"
                caption="vs previous period"
                icon={<IconChart />}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Stat
                label="Bounce rate"
                value="31.4%"
                delta="-2.3 pt"
                trend="down"
                invertTrend
                caption="vs previous period"
                icon={<IconSparkles />}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid columns={{ base: 1, lg: 3 }} gap="4">
          <Card className="sb-span-2" style={{ gridColumn: "span var(--_span, 1)" }}>
            <CardHeader>
              <CardTitle>Visitors</CardTitle>
              <CardDescription>
                {period === "week" ? "Daily, last 7 days" : "Weekly, last 30 days"}
              </CardDescription>
              <CardAction>
                <Badge tone="success" dot>
                  Live
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Chart
                label="Visitors"
                categoryLabel={period === "week" ? "Day" : "Week"}
                valueLabel="Visitors"
                data={SERIES[period]}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Traffic sources</CardTitle>
              <CardDescription>Share of visits</CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap="4">
                {SOURCES.map(([name, share], index) => (
                  <Stack key={name} gap="1">
                    <Stack direction="row" justify="between">
                      <Text size="sm">{name}</Text>
                      <Text size="sm" tone="secondary">
                        {share}%
                      </Text>
                    </Stack>
                    {/* Each source takes the next categorical chart color on a neutral track. */}
                    <Progress
                      aria-label={`${name} share`}
                      value={share}
                      size="sm"
                      style={{
                        ["--ac-tone-solid" as string]: `var(--ac-color-chart-${index + 1})`,
                        ["--ac-tone-soft-hover" as string]: "var(--ac-color-bg-muted)",
                      }}
                    />
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Card>
          <CardHeader>
            <CardTitle>Top pages</CardTitle>
            <CardDescription>Most visited documentation pages</CardDescription>
          </CardHeader>
          <CardContent>
            <DataList
              items={[
                { id: "button", title: "Button", description: "/atoms/button", value: "8 412" },
                {
                  id: "table",
                  title: "DataTable",
                  description: "/organisms/data-table",
                  value: "6 190",
                },
                { id: "dialog", title: "Dialog", description: "/organisms/dialog", value: "5 774" },
                {
                  id: "tokens",
                  title: "Design tokens",
                  description: "/foundations/tokens",
                  value: "4 018",
                },
              ]}
            />
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}

export const Overview: Story = { render: () => <AnalyticsOverview /> };

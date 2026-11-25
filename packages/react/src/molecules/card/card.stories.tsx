import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../../atoms/avatar";
import { Badge } from "../../atoms/badge";
import { Button } from "../../atoms/button";
import { Progress } from "../../atoms/progress";
import { Text } from "../../atoms/text";
import { IconChart, IconCheck, IconUser } from "../../icons";
import { Grid, Stack } from "../../layout";
import { AvatarGroup } from "../avatar-group";
import { Stat } from "../stat";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

const meta = {
  title: "Molecules/Card & Stat",
  component: Card,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pricing: Story = {
  render: () => (
    <Grid minItemWidth="16rem" gap="4" style={{ maxInlineSize: "56rem" }}>
      {(["Starter", "Pro", "Team"] as const).map((plan) => (
        <Card key={plan} variant={plan === "Pro" ? "elevated" : "outline"}>
          <CardHeader>
            <CardTitle>{plan}</CardTitle>
            <CardDescription>Everything you need to ship faster.</CardDescription>
            {plan === "Pro" && (
              <CardAction>
                <Badge tone="primary">Popular</Badge>
              </CardAction>
            )}
          </CardHeader>
          <CardContent>
            <Stack gap="2">
              {["All components", "Theme generator", "Figma kit"].map((feature) => (
                <Text key={feature} size="sm" tone="secondary">
                  <IconCheck /> {feature}
                </Text>
              ))}
            </Stack>
          </CardContent>
          <CardFooter>
            <Button
              block
              variant={plan === "Pro" ? "solid" : "outline"}
              tone={plan === "Pro" ? "primary" : "neutral"}
            >
              Choose {plan}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </Grid>
  ),
};

export const Stats: Story = {
  render: () => (
    <Grid columns={{ base: 1, md: 3 }} gap="4" style={{ maxInlineSize: "56rem" }}>
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
            label="Active users"
            value="2 841"
            delta="+3.1%"
            trend="up"
            caption="this week"
            icon={<IconUser />}
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Stat
            label="Churn"
            value="1.8%"
            delta="-0.4 pt"
            trend="down"
            invertTrend
            caption="vs last month"
          />
        </CardContent>
      </Card>
    </Grid>
  ),
};

export const Team: Story = {
  render: () => (
    <Card style={{ maxInlineSize: "24rem" }}>
      <CardHeader>
        <CardTitle>Design system squad</CardTitle>
        <CardDescription>Sprint 14 · 8 of 12 tasks done</CardDescription>
      </CardHeader>
      <CardContent>
        <Stack gap="4">
          <Progress aria-label="Sprint progress" value={66} />
          <AvatarGroup max={4} size="sm">
            {[
              "Nassim Farhat",
              "Amel Ben Salah",
              "Zied Trabelsi",
              "Emna Gharbi",
              "Youssef Kchaou",
            ].map((name) => (
              <Avatar key={name} name={name} size="sm" tone="primary" />
            ))}
          </AvatarGroup>
        </Stack>
      </CardContent>
    </Card>
  ),
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardContent, CardHeader, CardTitle } from "../molecules/card";
import { Container, Grid, Stack } from "./layout";
import { Text } from "../atoms/text";

const meta = { title: "Layout/Primitives" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const ResponsiveComposition: Story = {
  render: () => (
    <Container size="xl">
      <Stack gap="6">
        <Stack direction={{ base: "column", md: "row" }} justify="between" gap="3">
          <Text size="lg" weight="semibold">
            Responsive primitives
          </Text>
          <Text size="sm" tone="secondary">
            Resize the canvas to see the direction change.
          </Text>
        </Stack>
        <Grid columns={{ base: 1, sm: 2, lg: 3 }} gap="4">
          {[
            ["Stack", "Flex rhythm with token gaps"],
            ["Grid", "Responsive or fluid columns"],
            ["Container", "Centered readable measure"],
          ].map(([title, description]) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Text tone="secondary">{description}</Text>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Container>
  ),
};

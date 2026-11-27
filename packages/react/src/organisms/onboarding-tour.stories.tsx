import type { Meta, StoryObj } from "@storybook/react-vite";
import { OnboardingTour } from "./catalog-collaboration";

const meta = {
  title: "Organisms/OnboardingTour",
  component: OnboardingTour,
  args: {
    defaultOpen: true,
    steps: [
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
    ],
    previousLabel: "Back",
    nextLabel: "Next",
    finishLabel: "Finish",
    skipLabel: "Skip tour",
    stepLabel: (step: number, total: number) => `Step ${step} of ${total}`,
  },
} satisfies Meta<typeof OnboardingTour>;
export default meta;
type Story = StoryObj<typeof meta>;
export const GuidedSteps: Story = {};

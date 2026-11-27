import "@atomscraft/css";
import { AtomCraftProvider, Toaster } from "../../../packages/react/src";
import type { Decorator, Preview } from "@storybook/react-vite";
import type { ToasterProps } from "../../../packages/react/src";

type ToastPosition = NonNullable<ToasterProps["position"]>;
const TOAST_POSITIONS: ToastPosition[] = [
  "top-start",
  "top-center",
  "top-end",
  "bottom-start",
  "bottom-center",
  "bottom-end",
];

function isToastPosition(value: unknown): value is ToastPosition {
  return typeof value === "string" && TOAST_POSITIONS.includes(value as ToastPosition);
}

type Globals = {
  mode: "light" | "dark";
  theme: string;
  density: "compact" | "comfortable" | "spacious";
  shape: "rounded" | "sharp" | "pill";
  contrast: "normal" | "more";
  locale: string;
};

/** Every story renders inside the provider, driven by the toolbar, like a real application. */
const withAtomCraft: Decorator = (Story, context) => {
  const { mode, theme, density, shape, contrast, locale } = context.globals as Globals;
  const storyPosition = context.args["toasterPosition"] ?? context.args["position"];
  document.documentElement.dataset["acMode"] = mode;
  return (
    <AtomCraftProvider
      locale={locale}
      mode={mode}
      theme={theme}
      density={density}
      shape={shape}
      contrast={contrast === "normal" ? undefined : contrast}
    >
      <div className="sb-canvas">
        <Story />
      </div>
      <Toaster position={isToastPosition(storyPosition) ? storyPosition : "bottom-end"} />
    </AtomCraftProvider>
  );
};

const toolbar = <Icon extends string>(title: string, icon: Icon, items: string[]) => ({
  description: title,
  toolbar: { title, icon, items, dynamicTitle: true },
});

const preview: Preview = {
  tags: ["autodocs"],
  decorators: [withAtomCraft],
  globalTypes: {
    mode: toolbar("Mode", "contrast", ["light", "dark"]),
    theme: toolbar("Theme", "paintbrush", [
      "indigo",
      "blue",
      "violet",
      "emerald",
      "teal",
      "rose",
      "orange",
      "mono",
    ]),
    density: toolbar("Density", "component", ["compact", "comfortable", "spacious"]),
    shape: toolbar("Shape", "circle", ["rounded", "sharp", "pill"]),
    contrast: toolbar("Contrast", "contrast", ["normal", "more"]),
    locale: toolbar("Locale", "globe", ["en", "fr", "ar"]),
  },
  initialGlobals: {
    mode: "light",
    theme: "indigo",
    density: "comfortable",
    shape: "rounded",
    contrast: "normal",
    locale: "en",
  },
  parameters: {
    layout: "centered",
    controls: { expanded: true },
    a11y: { test: "error" },
    options: {
      storySort: {
        order: ["Foundations", "Atoms", "Molecules", "Organisms", "Layout", "Examples"],
      },
    },
  },
};

export default preview;

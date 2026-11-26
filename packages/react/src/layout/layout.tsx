import { cn, dataAttr } from "@atomscraft/core";
import { forwardRef } from "react";
import type { CSSProperties, HTMLAttributes } from "react";
import { Slot } from "../utils";

/** Spacing keys of the 4px grid (`4` = 1rem). */
export type Space =
  "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12" | "16" | "20" | "24";
export type Breakpoint = "base" | "sm" | "md" | "lg" | "xl";
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

const space = (key: Space) => `var(--ac-space-${key})`;

/** Turns a responsive prop into `--_name-<breakpoint>` CSS variables read by media queries. */
type CssVars = Record<`--${string}`, string>;

function responsiveVars<T>(
  name: string,
  value: Responsive<T> | undefined,
  format: (item: T) => string,
): CssVars {
  if (value === undefined) return {};
  const entries =
    typeof value === "object" && value !== null ? Object.entries(value) : [["base", value]];
  return Object.fromEntries(
    entries.map(([breakpoint, item]) => [`--_${name}-${breakpoint}`, format(item as T)]),
  );
}

type LayoutProps = HTMLAttributes<HTMLElement> & { asChild?: boolean };

export type StackProps = LayoutProps & {
  direction?: Responsive<"row" | "column">;
  gap?: Space;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
};

/** Flex layout with token gaps. `direction={{ base: "column", md: "row" }}` stacks on mobile. */
export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  {
    direction = "column",
    gap = "4",
    align,
    justify,
    wrap = false,
    asChild = false,
    className,
    style,
    ...props
  },
  ref,
) {
  const Component = asChild ? Slot : "div";
  return (
    <Component
      {...props}
      ref={ref}
      data-slot="stack"
      data-align={align}
      data-justify={justify}
      data-wrap={dataAttr(wrap)}
      className={cn("ac-stack", className)}
      style={
        {
          ...style,
          "--_gap": space(gap),
          ...responsiveVars("direction", direction, String),
        } as CSSProperties
      }
    />
  );
});

export type GridProps = LayoutProps & {
  /** Fixed columns, per breakpoint if needed: `{ base: 1, md: 2, lg: 4 }`. */
  columns?: Responsive<number>;
  /** Fluid alternative: as many columns as fit, each at least this wide. */
  minItemWidth?: string;
  gap?: Space;
};

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { columns = 1, minItemWidth, gap = "4", asChild = false, className, style, ...props },
  ref,
) {
  const Component = asChild ? Slot : "div";
  const vars: CssVars = minItemWidth
    ? { "--_min-item": minItemWidth }
    : responsiveVars("columns", columns, String);
  return (
    <Component
      {...props}
      ref={ref}
      data-slot="grid"
      data-fluid={dataAttr(Boolean(minItemWidth))}
      className={cn("ac-grid", className)}
      style={{ ...style, "--_gap": space(gap), ...vars } as CSSProperties}
    />
  );
});

export type ContainerProps = LayoutProps & { size?: "sm" | "md" | "lg" | "xl" | "full" };

/** Centered content with a maximum width and responsive side padding. */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { size = "lg", asChild = false, className, ...props },
  ref,
) {
  const Component = asChild ? Slot : "div";
  return (
    <Component
      {...props}
      ref={ref}
      data-slot="container"
      data-size={size}
      className={cn("ac-container", className)}
    />
  );
});

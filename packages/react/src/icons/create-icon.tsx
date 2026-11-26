import { cn } from "@atomscraft/core";
import { forwardRef } from "react";
import type { ReactNode, SVGAttributes } from "react";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

export type IconBaseProps = Omit<SVGAttributes<SVGSVGElement>, "children"> & {
  /** Defaults to 1em, so the icon follows the surrounding text. */
  size?: IconSize | undefined;
  /** Accessible name. Without it the icon is decorative and hidden from assistive technologies. */
  label?: string | undefined;
};

type IconDefinition = { name: string; children: ReactNode; mirrorInRtl?: boolean };

/** Builds a 24×24 stroke icon. Directional icons are mirrored in right-to-left layouts. */
export function createIcon({ name, children, mirrorInRtl = false }: IconDefinition) {
  const IconComponent = forwardRef<SVGSVGElement, IconBaseProps>(function IconComponent(
    { size, label, className, ...props },
    ref,
  ) {
    return (
      <svg
        {...props}
        ref={ref}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        focusable="false"
        data-slot="icon"
        data-icon={name}
        data-size={size}
        data-mirror={mirrorInRtl ? "" : undefined}
        className={cn("ac-icon", className)}
      >
        {children}
      </svg>
    );
  });
  IconComponent.displayName = `Icon${name}`;
  return IconComponent;
}

export type IconComponent = ReturnType<typeof createIcon>;

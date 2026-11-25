import { forwardRef } from "react";
import * as iconSet from "../../icons/icons";
import type { IconBaseProps, IconComponent } from "../../icons";

type WithoutPrefix<T extends string> = T extends `Icon${infer Name}` ? Name : never;

/** Every icon in the built-in set, without the `Icon` prefix: "Check", "ChevronDown"... */
export type IconName = WithoutPrefix<keyof typeof iconSet>;

const REGISTRY = Object.fromEntries(
  Object.entries(iconSet).map(([key, component]) => [key.slice("Icon".length), component]),
) as Readonly<Record<IconName, IconComponent>>;

/** Sorted list of the built-in names, for documentation and pickers. */
export const iconNames: readonly IconName[] = Object.keys(REGISTRY).sort() as IconName[];

export type IconProps = IconBaseProps & { name: IconName };

/**
 * Renders a built-in icon by name, so components can take an icon as a plain prop.
 *
 * It references the whole built-in set: where bundle size matters, import the
 * individual `IconCheck`-style components instead, or build your own with `createIcon`.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon({ name, ...props }, ref) {
  const Glyph = REGISTRY[name];
  return <Glyph {...props} ref={ref} />;
});

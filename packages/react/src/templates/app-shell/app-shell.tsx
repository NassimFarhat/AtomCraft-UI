import { cn } from "@atomcraft/core";
import type { HTMLAttributes, ReactNode } from "react";
import { SidebarProvider } from "../../organisms/sidebar";
import type { SidebarProviderProps } from "../../organisms/sidebar";
import { useMessages } from "../../provider";

export type AppShellProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  header?: ReactNode;
  sidebar?: ReactNode;
  /** Page content, rendered in the single <main> landmark. */
  children: ReactNode;
  /** Id of the main region, target of the skip link. */
  mainId?: string;
  sidebarState?: Omit<SidebarProviderProps, "children">;
};

/**
 * Application layout: skip link, sidebar, header and main region.
 * The sidebar turns into a drawer below the `lg` breakpoint.
 */
export function AppShell({
  header,
  sidebar,
  children,
  mainId = "main",
  sidebarState,
  className,
  ...props
}: AppShellProps) {
  const messages = useMessages();
  return (
    <SidebarProvider {...sidebarState}>
      <div {...props} data-slot="app-shell" className={cn("ac-app-shell", className)}>
        <a href={`#${mainId}`} className="ac-skip-link">
          {messages.skipToContent}
        </a>
        {sidebar}
        <div className="ac-app-shell__main">
          {header}
          <main id={mainId} tabIndex={-1} className="ac-app-shell__content">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

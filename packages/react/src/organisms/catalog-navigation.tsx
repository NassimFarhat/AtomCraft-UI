import { cn } from "@atomscraft/core";
import { forwardRef, useEffect, useId, useState } from "react";
import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode, FocusEvent } from "react";
import { useControllableState } from "../hooks";

export type NavigationMenuLink = {
  id: string;
  label: string;
  href: string;
  current?: boolean;
  disabled?: boolean;
};
export type NavigationMenuItem = NavigationMenuLink & { children?: readonly NavigationMenuLink[] };
export type NavigationMenuProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  label: string;
  items: readonly NavigationMenuItem[];
};

/** Data-driven site navigation with disclosure submenus and standard links. */
export const NavigationMenu = forwardRef<HTMLElement, NavigationMenuProps>(function NavigationMenu(
  { label, items, className, ...props },
  ref,
) {
  const [openId, setOpenId] = useState<string | null>(null);
  const id = useId();
  return (
    <nav
      {...props}
      ref={ref}
      aria-label={label}
      data-slot="navigation-menu"
      className={cn("ac-navigation-menu", className)}
    >
      <ul className="ac-navigation-menu__list">
        {items.map((item) => {
          const hasChildren = Boolean(item.children?.length);
          const expanded = openId === item.id;
          return (
            <li key={item.id} className="ac-navigation-menu__item">
              {hasChildren ? (
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`${id}-${item.id}-submenu`}
                  disabled={item.disabled}
                  className="ac-navigation-menu__trigger"
                  onClick={() => setOpenId(expanded ? null : item.id)}
                >
                  {item.label}
                  <span aria-hidden="true" className="ac-navigation-menu__chevron">
                    ⌄
                  </span>
                </button>
              ) : (
                <a
                  href={item.disabled ? undefined : item.href}
                  aria-current={item.current ? "page" : undefined}
                  aria-disabled={item.disabled || undefined}
                  className="ac-navigation-menu__link"
                >
                  {item.label}
                </a>
              )}
              {hasChildren && (
                <ul
                  id={`${id}-${item.id}-submenu`}
                  hidden={!expanded}
                  className="ac-navigation-menu__submenu"
                >
                  {item.children?.map((child) => (
                    <li key={child.id}>
                      <a
                        href={child.disabled ? undefined : child.href}
                        aria-current={child.current ? "page" : undefined}
                        aria-disabled={child.disabled || undefined}
                        className="ac-navigation-menu__link"
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
});

export type BottomNavigationItem = {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  current?: boolean;
  badge?: ReactNode;
};
export type BottomNavigationProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  label: string;
  items: readonly BottomNavigationItem[];
};
export const BottomNavigation = forwardRef<HTMLElement, BottomNavigationProps>(
  function BottomNavigation({ label, items, className, ...props }, ref) {
    return (
      <nav
        {...props}
        ref={ref}
        aria-label={label}
        data-slot="bottom-navigation"
        className={cn("ac-bottom-navigation", className)}
      >
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            aria-current={item.current ? "page" : undefined}
            className="ac-bottom-navigation__item"
          >
            <span className="ac-bottom-navigation__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="ac-bottom-navigation__label">{item.label}</span>
            {item.badge !== undefined && (
              <span className="ac-bottom-navigation__badge">{item.badge}</span>
            )}
          </a>
        ))}
      </nav>
    );
  },
);

export type TreeNode = {
  id: string;
  label: string;
  disabled?: boolean;
  children?: readonly TreeNode[];
};
export type TreeViewProps = Omit<HTMLAttributes<HTMLUListElement>, "children"> & {
  label: string;
  nodes: readonly TreeNode[];
  selectedId?: string;
  defaultSelectedId?: string;
  onSelectedChange?: (id: string) => void;
  expandedIds?: readonly string[];
  defaultExpandedIds?: readonly string[];
  onExpandedChange?: (ids: readonly string[]) => void;
};

/** Hierarchical tree with selection and Left/Right/Up/Down/Home/End navigation. */
export const TreeView = forwardRef<HTMLUListElement, TreeViewProps>(function TreeView(
  {
    label,
    nodes,
    selectedId,
    defaultSelectedId = "",
    onSelectedChange,
    expandedIds,
    defaultExpandedIds = [],
    onExpandedChange,
    className,
    onKeyDown,
    ...props
  },
  ref,
) {
  const treeId = useId();
  const [selected, setSelected] = useControllableState({
    value: selectedId,
    defaultValue: defaultSelectedId,
    onChange: onSelectedChange,
  });
  const [expanded, setExpanded] = useControllableState({
    value: expandedIds,
    defaultValue: defaultExpandedIds,
    onChange: onExpandedChange,
  });
  const [activeId, setActiveId] = useState(selected || nodes[0]?.id || "");

  useEffect(() => {
    if (activeId) document.getElementById(`${treeId}-${activeId}`)?.focus();
  }, [activeId, expanded, treeId]);

  const toggle = (id: string) =>
    setExpanded((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const current = (event.target as HTMLElement).closest<HTMLElement>("[role='treeitem']");
    const root = event.currentTarget;
    if (!current) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[role='treeitem']"));
    const index = items.indexOf(current);
    const id = current.dataset.treeNode;
    const node = id ? findTreeNode(nodes, id) : undefined;
    const parentId = current.dataset.parentId;
    const focusAt = (next: HTMLElement | undefined) => {
      if (next) {
        event.preventDefault();
        setActiveId(next.dataset.treeNode ?? "");
      }
    };
    if (event.key === "ArrowDown") focusAt(items[index + 1]);
    else if (event.key === "ArrowUp") focusAt(items[index - 1]);
    else if (event.key === "Home") focusAt(items[0]);
    else if (event.key === "End") focusAt(items.at(-1));
    else if (event.key === "ArrowRight" && node?.children?.length) {
      event.preventDefault();
      if (!expanded.includes(node.id)) toggle(node.id);
      else setActiveId(node.children[0]?.id ?? node.id);
    } else if (event.key === "ArrowLeft") {
      if (node?.children?.length && expanded.includes(node.id)) {
        event.preventDefault();
        toggle(node.id);
      } else if (parentId) {
        event.preventDefault();
        setActiveId(parentId);
      }
    } else if ((event.key === "Enter" || event.key === " ") && !node?.disabled) {
      event.preventDefault();
      if (node?.children?.length) toggle(node.id);
      setSelected(node?.id ?? "");
    }
  };

  const renderNodes = (entries: readonly TreeNode[], parentId?: string) =>
    entries.map((node) => {
      const isExpanded = expanded.includes(node.id);
      return (
        <li
          key={node.id}
          id={`${treeId}-${node.id}`}
          role="treeitem"
          aria-selected={selected === node.id}
          aria-expanded={node.children?.length ? isExpanded : undefined}
          aria-disabled={node.disabled || undefined}
          tabIndex={activeId === node.id ? 0 : -1}
          data-tree-node={node.id}
          data-parent-id={parentId}
          data-disabled={node.disabled || undefined}
          className="ac-tree-view__item"
          onFocus={(event: FocusEvent<HTMLLIElement>) => {
            if (event.target === event.currentTarget) setActiveId(node.id);
          }}
          onClick={(event: MouseEvent<HTMLLIElement>) => {
            if ((event.target as HTMLElement).closest("[role='treeitem']") !== event.currentTarget)
              return;
            if (!node.disabled) {
              setActiveId(node.id);
              setSelected(node.id);
            }
          }}
        >
          <span className="ac-tree-view__row">
            <span aria-hidden="true" className="ac-tree-view__disclosure">
              {node.children?.length ? (isExpanded ? "⌄" : "›") : ""}
            </span>
            <span className="ac-tree-view__label">{node.label}</span>
          </span>
          {node.children?.length && isExpanded && (
            <ul role="group" className="ac-tree-view__group">
              {renderNodes(node.children, node.id)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <ul
      {...props}
      ref={ref}
      role="tree"
      aria-label={label}
      data-slot="tree-view"
      className={cn("ac-tree-view", className)}
      onKeyDown={handleKeyDown}
    >
      {renderNodes(nodes)}
    </ul>
  );
});

function findTreeNode(nodes: readonly TreeNode[], id: string): TreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    const child = node.children && findTreeNode(node.children, id);
    if (child) return child;
  }
  return undefined;
}

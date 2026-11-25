import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useAtomCraft } from "../provider";

const subscribe = () => () => undefined;

/** Renders children at the end of the AtomCraft root (or the body), outside overflow clipping. */
export function Portal({ children }: { children: ReactNode }) {
  const { portalContainer } = useAtomCraft();
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  if (!isClient) return null;
  return createPortal(children, portalContainer ?? document.body);
}

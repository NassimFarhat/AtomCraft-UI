/** Minimal observable store, framework-agnostic. Adapters subscribe to it. */
export type Store<T> = {
  get(): T;
  set(update: T | ((previous: T) => T)): void;
  subscribe(listener: () => void): () => void;
};

export function createStore<T>(initialValue: T): Store<T> {
  let value = initialValue;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set(update) {
      value = typeof update === "function" ? (update as (previous: T) => T)(value) : update;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

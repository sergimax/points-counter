/**
 * Read the RootStore from context.
 * Must live in `.ts` (not the provider `.tsx`) for react-refresh rules.
 */
import { useContext } from "react";
import { RootStoreContext } from "./root-store-context.ts";
import type { RootStore } from "./root-store.ts";

export function useRootStore(): RootStore {
  const store = useContext(RootStoreContext);
  if (!store) {
    throw new Error("useRootStore must be used within RootStoreProvider");
  }
  return store;
}

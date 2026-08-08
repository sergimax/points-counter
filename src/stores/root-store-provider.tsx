/**
 * Provides the singleton `rootStore` to the React tree.
 * Wrap the app once in `main.tsx` (inside theme / locale providers).
 */
import type { ReactNode } from "react";
import { RootStoreContext } from "./root-store-context.ts";
import { rootStore } from "./root-store.ts";

export function RootStoreProvider({ children }: { children: ReactNode }) {
  return (
    <RootStoreContext.Provider value={rootStore}>
      {children}
    </RootStoreContext.Provider>
  );
}

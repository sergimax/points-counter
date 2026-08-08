/**
 * React context holding the RootStore instance.
 * Kept in a `.ts` file (no components) so Fast Refresh stays happy.
 */
import { createContext } from "react";
import type { RootStore } from "./root-store.ts";

export const RootStoreContext = createContext<RootStore | null>(null);

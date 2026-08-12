/**
 * One-time localStorage rename: copy legacy → current if current is unset,
 * then drop the legacy key.
 */
export function migrateLocalStorageKey(
  legacyKey: string,
  currentKey: string,
): void {
  if (legacyKey === currentKey || typeof localStorage === "undefined") {
    return;
  }
  try {
    if (localStorage.getItem(currentKey) != null) {
      localStorage.removeItem(legacyKey);
      return;
    }
    const legacy = localStorage.getItem(legacyKey);
    if (legacy != null) {
      localStorage.setItem(currentKey, legacy);
      localStorage.removeItem(legacyKey);
    }
  } catch {
    // ignore quota / private mode
  }
}

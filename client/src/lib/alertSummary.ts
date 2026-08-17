export function summarizeAlertItems<T>(items: readonly T[], limit = 5) {
  const safeLimit = Math.max(0, limit);
  const visibleItems = items.slice(0, safeLimit);

  return {
    visibleItems,
    hiddenCount: Math.max(0, items.length - visibleItems.length),
  };
}

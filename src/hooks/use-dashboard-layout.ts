import { useEffect, useMemo, useState } from "react";

export type DashboardWidgetSize = "compact" | "wide" | "full";
export type DashboardLayoutPreset = "balanced" | "compact" | "expanded";

export type DashboardLayoutItem = {
  id: string;
  visible: boolean;
  size: DashboardWidgetSize;
};

export type DashboardWidgetDefault = {
  id: string;
  visible?: boolean;
  size: DashboardWidgetSize;
  availableSizes: DashboardWidgetSize[];
};

const sizeRank: Record<DashboardWidgetSize, number> = {
  compact: 1,
  wide: 2,
  full: 3,
};

const createDefaultLayout = (defaults: DashboardWidgetDefault[]): DashboardLayoutItem[] =>
  defaults.map(({ id, visible = true, size }) => ({
    id,
    visible,
    size,
  }));

const clampSize = (
  size: DashboardWidgetSize | undefined,
  availableSizes: DashboardWidgetSize[],
  fallback: DashboardWidgetSize,
) => {
  if (size && availableSizes.includes(size)) return size;
  return fallback;
};

const normalizeStoredLayout = (
  stored: DashboardLayoutItem[],
  defaults: DashboardWidgetDefault[],
): DashboardLayoutItem[] => {
  const defaultsById = new Map(defaults.map((item) => [item.id, item]));
  const seen = new Set<string>();

  const validItems = stored.flatMap((item) => {
    const widget = defaultsById.get(item.id);
    if (!widget || seen.has(item.id)) return [];

    seen.add(item.id);

    return [
      {
        id: item.id,
        visible: typeof item.visible === "boolean" ? item.visible : widget.visible ?? true,
        size: clampSize(item.size, widget.availableSizes, widget.size),
      },
    ];
  });

  const missingItems = defaults
    .filter((item) => !seen.has(item.id))
    .map(({ id, visible = true, size }) => ({
      id,
      visible,
      size,
    }));

  return [...validItems, ...missingItems];
};

const readStoredLayout = (storageKey: string, defaults: DashboardWidgetDefault[]) => {
  if (typeof window === "undefined") return createDefaultLayout(defaults);

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return createDefaultLayout(defaults);

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return createDefaultLayout(defaults);

    return normalizeStoredLayout(parsed as DashboardLayoutItem[], defaults);
  } catch {
    return createDefaultLayout(defaults);
  }
};

const smallestSize = (availableSizes: DashboardWidgetSize[]) =>
  [...availableSizes].sort((a, b) => sizeRank[a] - sizeRank[b])[0] ?? "compact";

const largestSize = (availableSizes: DashboardWidgetSize[]) =>
  [...availableSizes].sort((a, b) => sizeRank[b] - sizeRank[a])[0] ?? "full";

const createPresetLayout = (
  preset: DashboardLayoutPreset,
  defaults: DashboardWidgetDefault[],
): DashboardLayoutItem[] => {
  switch (preset) {
    case "compact":
      return defaults.map(({ id, visible = true, availableSizes }) => ({
        id,
        visible,
        size: smallestSize(availableSizes),
      }));
    case "expanded":
      return defaults.map(({ id, visible = true, availableSizes }) => ({
        id,
        visible,
        size: largestSize(availableSizes),
      }));
    case "balanced":
    default:
      return createDefaultLayout(defaults);
  }
};

export function useDashboardLayout(storageKey: string, defaults: DashboardWidgetDefault[]) {
  const defaultsKey = useMemo(
    () =>
      defaults
        .map((item) => `${item.id}:${item.visible ?? true}:${item.size}:${item.availableSizes.join(",")}`)
        .join("|"),
    [defaults],
  );

  const [layout, setLayout] = useState<DashboardLayoutItem[]>(() => readStoredLayout(storageKey, defaults));

  useEffect(() => {
    setLayout((current) => normalizeStoredLayout(current, defaults));
  }, [defaults, defaultsKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(layout));
  }, [layout, storageKey]);

  const toggleVisibility = (itemId: string, visible: boolean) => {
    setLayout((current) =>
      current.map((item) => (item.id === itemId ? { ...item, visible } : item)),
    );
  };

  const showWidget = (itemId: string) => {
    toggleVisibility(itemId, true);
  };

  const setSize = (itemId: string, size: DashboardWidgetSize) => {
    const defaultsById = new Map(defaults.map((item) => [item.id, item]));

    setLayout((current) =>
      current.map((item) => {
        if (item.id !== itemId) return item;

        const widget = defaultsById.get(item.id);
        if (!widget || !widget.availableSizes.includes(size)) return item;

        return {
          ...item,
          size,
        };
      }),
    );
  };

  const moveTo = (itemId: string, position: "top" | "bottom") => {
    setLayout((current) => {
      const currentIndex = current.findIndex((item) => item.id === itemId);
      if (currentIndex === -1) return current;

      const nextLayout = [...current];
      const [item] = nextLayout.splice(currentIndex, 1);

      if (position === "top") {
        nextLayout.unshift(item);
      } else {
        nextLayout.push(item);
      }

      return nextLayout;
    });
  };

  const move = (itemId: string, direction: "up" | "down") => {
    setLayout((current) => {
      const currentIndex = current.findIndex((item) => item.id === itemId);
      if (currentIndex === -1) return current;

      const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (nextIndex < 0 || nextIndex >= current.length) return current;

      const nextLayout = [...current];
      const [item] = nextLayout.splice(currentIndex, 1);
      nextLayout.splice(nextIndex, 0, item);
      return nextLayout;
    });
  };

  const applyPreset = (preset: DashboardLayoutPreset) => {
    setLayout(createPresetLayout(preset, defaults));
  };

  const resetItem = (itemId: string) => {
    const defaultsById = new Map(defaults.map((item) => [item.id, item]));

    setLayout((current) =>
      current.map((item) => {
        if (item.id !== itemId) return item;

        const widget = defaultsById.get(item.id);
        if (!widget) return item;

        return {
          id: item.id,
          visible: widget.visible ?? true,
          size: widget.size,
        };
      }),
    );
  };

  const reset = () => {
    setLayout(createDefaultLayout(defaults));
  };

  return {
    layout,
    applyPreset,
    move,
    moveTo,
    reset,
    resetItem,
    setSize,
    showWidget,
    toggleVisibility,
  };
}

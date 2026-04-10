import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronsDown,
  ChevronsUp,
  EyeOff,
  LayoutDashboard,
  MoreHorizontal,
  Plus,
  RotateCcw,
  ScanSearch,
  SlidersHorizontal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardLayoutPreset, DashboardWidgetSize } from "@/hooks/use-dashboard-layout";
import { cn } from "@/lib/utils";

export type DashboardCustomizerItem = {
  id: string;
  title: string;
  description: string;
  visible: boolean;
  size: DashboardWidgetSize;
  availableSizes: DashboardWidgetSize[];
};

export type DashboardWidgetMenuControls = {
  availableSizes: DashboardWidgetSize[];
  canMoveDown: boolean;
  canPinBottom: boolean;
  canPinTop: boolean;
  canMoveUp: boolean;
  currentSize: DashboardWidgetSize;
  editing?: boolean;
  onFocus?: () => void;
  onHide: () => void;
  onMove: (direction: "up" | "down") => void;
  onMoveTo: (position: "top" | "bottom") => void;
  onReset: () => void;
  onSizeChange: (size: DashboardWidgetSize) => void;
  title: string;
};

type DashboardCustomizerToolbarProps = {
  editing: boolean;
  hiddenCount: number;
  onApplyPreset: (preset: DashboardLayoutPreset) => void;
  onEditChange: (editing: boolean) => void;
  onReset: () => void;
};

type DashboardHiddenWidgetsProps = {
  items: DashboardCustomizerItem[];
  onShow: (itemId: string) => void;
};

type DashboardEditableWidgetProps = {
  children: React.ReactNode;
  editing: boolean;
  index: number;
  item: DashboardCustomizerItem;
  total: number;
  onHide: (itemId: string) => void;
  onMove: (itemId: string, direction: "up" | "down") => void;
  onSizeChange: (itemId: string, size: DashboardWidgetSize) => void;
};

const sizeLabels: Record<DashboardWidgetSize, string> = {
  compact: "1 col",
  wide: "2 col",
  full: "Full",
};

const orderedSizes: DashboardWidgetSize[] = ["compact", "wide", "full"];

export const dashboardSizeClasses: Record<DashboardWidgetSize, string> = {
  compact: "lg:col-span-1",
  wide: "lg:col-span-2",
  full: "lg:col-span-3",
};

export function DashboardWidgetMenu({ controls }: { controls: DashboardWidgetMenuControls }) {
  if (controls.editing) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-transparent hover:border-border/70">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="pb-1">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">{controls.title}</p>
            <p className="text-xs font-normal text-muted-foreground">Dashboard widget controls</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {controls.onFocus ? (
          <>
            <DropdownMenuItem onClick={controls.onFocus}>
              <ScanSearch className="mr-2 h-4 w-4" /> Open focus view
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : null}
        <DropdownMenuLabel>Position</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => controls.onMoveTo("top")} disabled={!controls.canPinTop}>
          <ChevronsUp className="mr-2 h-4 w-4" /> Pin to top
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => controls.onMoveTo("bottom")} disabled={!controls.canPinBottom}>
          <ChevronsDown className="mr-2 h-4 w-4" /> Send to bottom
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => controls.onMove("up")} disabled={!controls.canMoveUp}>
          <ArrowUp className="mr-2 h-4 w-4" /> Move up
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => controls.onMove("down")} disabled={!controls.canMoveDown}>
          <ArrowDown className="mr-2 h-4 w-4" /> Move down
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Size and layout
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-44">
            <DropdownMenuLabel>Widget width</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={controls.currentSize} onValueChange={(value) => controls.onSizeChange(value as DashboardWidgetSize)}>
              {controls.availableSizes.map((size) => (
                <DropdownMenuRadioItem key={size} value={size}>
                  {sizeLabels[size]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem onClick={controls.onReset}>
          <RotateCcw className="mr-2 h-4 w-4" /> Restore widget defaults
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={controls.onHide}>
          <EyeOff className="mr-2 h-4 w-4" /> Hide widget
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DashboardCustomizerToolbar({
  editing,
  hiddenCount,
  onApplyPreset,
  onEditChange,
  onReset,
}: DashboardCustomizerToolbarProps) {
  if (!editing) {
    return (
      <Button variant="outline" size="sm" className="h-9 gap-2 border-border/70 bg-background px-4 text-sm" onClick={() => onEditChange(true)}>
        <LayoutDashboard className="h-4 w-4" /> Customize layout
      </Button>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-border/70 bg-card px-4 py-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/30 text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-foreground">Customize layout</p>
              <Badge variant="outline" className="h-5 rounded-md px-2 text-[10px] font-normal text-muted-foreground">
                Auto-saved
              </Badge>
              {hiddenCount > 0 ? (
                <Badge variant="outline" className="h-5 rounded-md px-2 text-[10px] font-normal text-muted-foreground">
                  {hiddenCount} hidden
                </Badge>
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground">
              Resize, reorder, or hide widgets inline.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
          <div className="grid w-full grid-cols-3 gap-1 rounded-xl border border-border/70 bg-muted/20 p-1 lg:w-auto">
            <Button type="button" variant="ghost" size="sm" className="h-8 rounded-lg px-3 text-xs" onClick={() => onApplyPreset("balanced")}>
              Balanced
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 rounded-lg px-3 text-xs" onClick={() => onApplyPreset("compact")}>
              Compact
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 rounded-lg px-3 text-xs" onClick={() => onApplyPreset("expanded")}>
              Expanded
            </Button>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 lg:w-auto">
            <Button type="button" variant="outline" size="sm" className="h-8 gap-2 rounded-lg px-3 text-xs" onClick={onReset}>
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
            <Button type="button" size="sm" className="h-8 gap-2 rounded-lg px-3 text-xs" onClick={() => onEditChange(false)}>
              <Check className="h-3.5 w-3.5" /> Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardHiddenWidgets({ items, onShow }: DashboardHiddenWidgetsProps) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-dashed border-border/70 bg-muted/10 px-4 py-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Hidden widgets</p>
          <p className="text-xs text-muted-foreground">Restore removed widgets as needed.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Button
              key={item.id}
              type="button"
              variant="outline"
              size="sm"
              className="h-8 w-full justify-center gap-2 rounded-lg bg-background sm:w-auto"
              onClick={() => onShow(item.id)}
            >
              <Plus className="h-3.5 w-3.5" /> {item.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardEditableWidget({
  children,
  editing,
  index,
  item,
  total,
  onHide,
  onMove,
  onSizeChange,
}: DashboardEditableWidgetProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [dragSize, setDragSize] = useState<DashboardWidgetSize | null>(null);
  const resizeStateRef = useRef<{
    pointerId: number;
    startX: number;
    startIndex: number;
    sortedSizes: DashboardWidgetSize[];
  } | null>(null);

  const effectiveSize = dragSize ?? item.size;

  useEffect(() => {
    if (!editing) {
      setIsResizing(false);
      setDragSize(null);
      resizeStateRef.current = null;
    }
  }, [editing]);

  const handleResizeStart = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!editing) return;

    const sortedSizes = [...item.availableSizes].sort(
      (left, right) => orderedSizes.indexOf(left) - orderedSizes.indexOf(right),
    );
    const startIndex = sortedSizes.indexOf(item.size);
    if (startIndex === -1 || sortedSizes.length <= 1) return;

    resizeStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startIndex,
      sortedSizes,
    };

    setIsResizing(true);
    setDragSize(item.size);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handleResizeMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const resizeState = resizeStateRef.current;
    if (!resizeState || resizeState.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - resizeState.startX;
    const step = Math.round(deltaX / 96);
    const nextIndex = Math.max(
      0,
      Math.min(resizeState.sortedSizes.length - 1, resizeState.startIndex + step),
    );
    setDragSize(resizeState.sortedSizes[nextIndex]);
  };

  const handleResizeEnd = (event: React.PointerEvent<HTMLButtonElement>) => {
    const resizeState = resizeStateRef.current;
    if (!resizeState || resizeState.pointerId !== event.pointerId) return;

    event.currentTarget.releasePointerCapture(event.pointerId);

    const nextSize = dragSize ?? item.size;
    resizeStateRef.current = null;
    setIsResizing(false);
    setDragSize(null);

    if (nextSize !== item.size) {
      onSizeChange(item.id, nextSize);
    }
  };

  return (
    <div className={cn(dashboardSizeClasses[effectiveSize], "min-w-0 self-stretch")}>
      <div
        className={cn(
          "relative transition-all",
          editing && "rounded-2xl border border-dashed border-border/80 bg-muted/5",
          isResizing && "ring-primary/50",
        )}
      >
        {editing ? (
          <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
            <div className="pointer-events-auto inline-flex max-w-full items-center gap-2 self-start rounded-lg border border-border/80 bg-background px-2.5 py-1.5">
              <p className="max-w-[10rem] truncate text-[11px] font-medium text-foreground">{item.title}</p>
              <Badge variant="outline" className="h-5 rounded-md px-2 text-[10px] font-normal text-muted-foreground">
                  {index + 1}/{total}
                </Badge>
            </div>

            <div className="pointer-events-auto flex w-full flex-col gap-2 lg:w-auto lg:items-end">
              <div className="grid w-full grid-cols-3 gap-1 rounded-lg border border-border/80 bg-background p-1 lg:w-auto">
                  {item.availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => onSizeChange(item.id, size)}
                      className={cn(
                        "rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                        effectiveSize === size
                          ? "bg-foreground text-background"
                          : "text-muted-foreground",
                      )}
                    >
                      {sizeLabels[size]}
                    </button>
                  ))}
              </div>

              <div className="grid w-full grid-cols-3 gap-1 rounded-lg border border-border/80 bg-background p-1 lg:w-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-md px-2"
                    onClick={() => onMove(item.id, "up")}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-md px-2"
                    onClick={() => onMove(item.id, "down")}
                    disabled={index === total - 1}
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-md px-2 text-muted-foreground"
                    onClick={() => onHide(item.id)}
                  >
                    <EyeOff className="h-3.5 w-3.5" />
                  </Button>
              </div>
            </div>
          </div>
        ) : null}
        {editing ? (
          <button
            type="button"
            aria-label={`Resize ${item.title}`}
            className={cn(
              "absolute bottom-3 right-3 z-20 hidden h-8 w-8 items-center justify-center rounded-lg border border-border/80 bg-background text-muted-foreground lg:inline-flex",
              isResizing && "cursor-ew-resize text-foreground",
            )}
            onPointerDown={handleResizeStart}
            onPointerMove={handleResizeMove}
            onPointerUp={handleResizeEnd}
            onPointerCancel={handleResizeEnd}
          >
            <span className="sr-only">Drag to resize widget</span>
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M2.5 8h11" />
              <path d="M11 4.5 13.5 8 11 11.5" />
              <path d="M5 4.5 2.5 8 5 11.5" />
            </svg>
          </button>
        ) : null}
        <div className={cn(editing && "pb-12 pt-36 lg:pt-20")}>{children}</div>
      </div>
    </div>
  );
}

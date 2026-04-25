import { FullscreenLoader, OrbitLoader } from "@/components/Loaders";
import { cn } from "@/lib/utils";

type BackendLoadingIndicatorProps = {
  label?: string;
  className?: string;
  compact?: boolean;
  inline?: boolean;
  fullscreen?: boolean;
};

export function BackendLoadingIndicator({
  label = "Loading...",
  className,
  compact = false,
  inline = false,
  fullscreen = false,
}: BackendLoadingIndicatorProps) {
  if (fullscreen) {
    return <FullscreenLoader status={label} />;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        compact ? "min-h-[8rem]" : "min-h-[14rem]",
        inline && "min-h-0",
        className,
      )}
    >
      <div
        aria-live="polite"
        aria-busy="true"
        className={cn(
          "flex flex-col items-center justify-center gap-3 text-center",
          inline ? "py-1" : "rounded-3xl border border-border/60 bg-background/80 px-6 py-6 shadow-sm backdrop-blur-sm",
        )}
      >
        <OrbitLoader size={compact || inline ? "sm" : "md"} />
        <span className={cn("text-sm text-muted-foreground", inline && "text-xs")}>{label}</span>
      </div>
    </div>
  );
}

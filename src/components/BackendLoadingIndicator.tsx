import { cn } from "@/lib/utils";

type BackendLoadingIndicatorProps = {
  label?: string;
  className?: string;
  compact?: boolean;
  inline?: boolean;
};

export function BackendLoadingIndicator({
  label = "Loading...",
  className,
  compact = false,
  inline = false,
}: BackendLoadingIndicatorProps) {
  return (
    <div
      className={cn(
        "backend-loading-shell",
        compact && "backend-loading-shell--compact",
        inline && "backend-loading-shell--inline",
        className,
      )}
    >
      <div className="backend-loading-container" aria-live="polite" aria-busy="true">
        <div className="backend-loading-house" aria-hidden="true">
          <div className="backend-loading-roof">
            <svg viewBox="0 0 36 20" fill="none">
              <path
                d="M4 16 L18 4 L32 16"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="backend-loading-door" />
        </div>
        <span className="backend-loading-text">{label}</span>
      </div>
    </div>
  );
}

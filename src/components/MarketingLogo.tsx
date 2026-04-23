import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

type MarketingLogoProps = {
  className?: string;
  textClassName?: string;
  iconBoxClassName?: string;
  iconClassName?: string;
  to?: string;
  textTone?: "light" | "dark";
};

export default function MarketingLogo({
  className,
  textClassName,
  iconBoxClassName,
  iconClassName,
  to = "/",
  textTone = "dark",
}: MarketingLogoProps) {
  return (
    <Link to={to} className={cn("flex items-center gap-[10px]", className)}>
      <div className={cn("flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#c4714a]", iconBoxClassName)}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={cn("h-[14px] w-[14px] text-white", iconClassName)}
        >
          <path
            d="M4 11.5L12 4.5L20 11.5"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="9" y="13" width="6" height="7" rx="3" fill="currentColor" />
        </svg>
      </div>
      <span
        className={cn(
          "font-serif text-[20px] font-semibold leading-none tracking-[-0.02em]",
          textTone === "light" ? "text-white" : "text-[#161412]",
          textClassName,
        )}
      >
        Veri<em className="italic text-[#c4714a]">nest</em>
      </span>
    </Link>
  );
}

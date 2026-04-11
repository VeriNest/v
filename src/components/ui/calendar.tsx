import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DayContentProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function CalendarDayContent(props: DayContentProps) {
  const hasScheduled = props.activeModifiers.scheduled;
  const hasPending = props.activeModifiers.pending;
  const hasEvent =
    props.activeModifiers.hasEvent ||
    props.activeModifiers.booked ||
    hasScheduled ||
    hasPending;

  const dotClassName = hasScheduled
    ? "bg-emerald-500"
    : hasPending
      ? "bg-amber-500"
      : "bg-primary";

  return (
    <span className="relative inline-flex h-full w-full items-center justify-center">
      <span>{props.date.getDate()}</span>
      {hasEvent ? (
        <span className={`absolute bottom-1.5 h-1.5 w-1.5 rounded-full ${dotClassName}`} />
      ) : null}
    </span>
  );
}

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("w-full", className)}
      classNames={{
        months: "flex w-full flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0",
        month: "w-full min-w-0 space-y-4",
        caption: "relative flex items-center justify-center px-9 pt-1",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-0",
        nav_button_next: "absolute right-0",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full justify-between",
        head_cell: "flex-1 text-center text-muted-foreground rounded-md font-normal text-[0.8rem]",
        row: "mt-2 flex w-full justify-between",
        cell: "relative h-10 flex-1 p-0 text-center text-sm [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-10 w-full p-0 font-normal aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        DayContent: CalendarDayContent,
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

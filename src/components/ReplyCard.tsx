import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";
import { CommentReply } from "@/lib/api";

function formatRelativeTimestamp(value: string | null | undefined) {
  if (!value) {
    return "Recently";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Recently";
  }

  return formatDistanceToNow(parsed, { addSuffix: true });
}

export function ReplyCard({ reply }: { reply: CommentReply }) {
  return (
    <div className="space-y-2 rounded-2xl border border-border/50 bg-background px-3 py-3 sm:px-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {reply.author_avatar ? (
            <img
              src={reply.author_avatar}
              alt={reply.author_name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <User size={16} />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">
              {reply.author_name}
            </p>
            <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[11px] capitalize text-muted-foreground">
              {reply.author_role}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatRelativeTimestamp(reply.reply.created_at)}
          </p>
        </div>
      </div>
      <p className="text-sm leading-6 text-muted-foreground sm:pl-11">
        {reply.reply.content}
      </p>
    </div>
  );
}

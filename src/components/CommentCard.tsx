import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ReplyForm } from "./ReplyForm";
import { ReplyCard } from "./ReplyCard";
import { User, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { PropertyComment, CommentReply } from "@/lib/api";

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

export function CommentCard({
  comment,
  propertyId,
}: {
  comment: PropertyComment;
  propertyId: string;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const replyCount = comment.replies?.length || 0;

  return (
    <div className="space-y-4 rounded-3xl border border-border/60 bg-secondary/10 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {comment.author_avatar ? (
            <img
              src={comment.author_avatar}
              alt={comment.author_name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <User size={20} />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground sm:text-base">{comment.author_name}</p>
            <span className="rounded-full bg-background px-2 py-1 text-[11px] capitalize text-muted-foreground">
              {comment.author_role}
            </span>
          </div>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {formatRelativeTimestamp(comment.comment.created_at)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-background px-4 py-3">
        <p className="text-sm leading-6 text-muted-foreground">{comment.comment.content}</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="flex items-center gap-1 text-sm text-muted-foreground transition hover:text-primary"
        >
          <MessageCircle size={16} />
          Reply
        </button>
        {replyCount > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-sm text-muted-foreground transition hover:text-primary"
          >
            {showReplies ? (
              <>
                <ChevronUp size={16} />
                Hide replies ({replyCount})
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Show replies ({replyCount})
              </>
            )}
          </button>
        )}
      </div>

      {showReplyForm && (
        <div className="rounded-2xl border border-border/60 bg-background p-3 sm:ml-12 sm:p-4">
          <ReplyForm
            commentId={comment.comment.id}
            propertyId={propertyId}
            onSuccess={() => {
              setShowReplyForm(false);
              setShowReplies(true);
            }}
          />
        </div>
      )}

      {showReplies && replyCount > 0 && (
        <div className="space-y-3 border-l border-border/60 pl-3 sm:ml-12 sm:pl-4">
          {comment.replies.map((reply: CommentReply, index) => (
            <ReplyCard
              key={reply.reply.id || `${reply.reply.user_id}-${reply.reply.created_at || index}-${index}`}
              reply={reply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { propertiesApi, PropertyComment, getStoredSession } from "@/lib/api";
import { CommentForm } from "./CommentForm";
import { CommentCard } from "./CommentCard";
import { toast } from "sonner";

export function CommentSection({ propertyId }: { propertyId: string }) {
  const queryClient = useQueryClient();
  const session = getStoredSession();
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["comments", propertyId, limit, offset],
    queryFn: () => propertiesApi.comments.list(propertyId, limit, offset),
  });

  // Check if user already has a comment on this property (for 1 thread per user rule)
  const userHasComment = data?.comments.some(c => c.comment.user_id === session?.user.id);

  const createCommentMutation = useMutation({
    mutationFn: (content: string) =>
      propertiesApi.comments.create(propertyId, content),
    onSuccess: async () => {
      toast.success("Comment posted");
      await queryClient.invalidateQueries({
        queryKey: ["comments", propertyId],
      });
      await queryClient.refetchQueries({
        queryKey: ["comments", propertyId],
      });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to post comment";
      toast.error(message);
    },
  });

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Failed to load comments. Please try again.
      </div>
    );
  }

  const comments: PropertyComment[] = data?.comments || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">Comments ({total})</h3>
        {session ? (
          userHasComment ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/8 p-4 text-sm leading-6 text-primary">
              You already have a comment thread on this property. You can reply to your comment or start a new conversation through direct messaging with the agent.
            </div>
          ) : (
            <CommentForm
              onSubmit={(content) => createCommentMutation.mutate(content)}
              isLoading={createCommentMutation.isPending}
            />
          )
        ) : (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-200">
            Sign in to post a comment or inquiry about this property.
          </div>
        )}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="rounded-2xl border border-border/60 bg-secondary/15 py-8 text-center text-sm text-muted-foreground">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-secondary/15 py-8 text-center text-sm text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment, index) => (
            <CommentCard
              key={comment.comment.id || `${comment.comment.user_id}-${comment.comment.created_at || index}-${index}`}
              comment={comment}
              propertyId={propertyId}
            />
          ))
        )}
      </div>

      {comments.length > 0 && total > limit && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="rounded-xl border border-border/60 px-4 py-2 text-sm text-foreground disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= total}
            className="rounded-xl border border-border/60 px-4 py-2 text-sm text-foreground disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

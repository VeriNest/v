import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { propertiesApi } from "@/lib/api";
import { toast } from "sonner";

export function ReplyForm({
  commentId,
  propertyId,
  onSuccess,
}: {
  commentId: string;
  propertyId: string;
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const replyMutation = useMutation({
    mutationFn: (replyContent: string) => propertiesApi.comments.reply(commentId, replyContent),
    onSuccess: () => {
      toast.success("Reply posted");
      queryClient.invalidateQueries({
        queryKey: ["comments", propertyId],
      });
      setContent("");
      onSuccess?.();
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to create reply";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      replyMutation.mutate(content);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a reply..."
        disabled={replyMutation.isPending}
        rows={2}
        className="w-full resize-none rounded-2xl border border-border/60 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={!content.trim() || replyMutation.isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        <MessageCircle size={14} />
        {replyMutation.isPending ? "Posting..." : "Reply"}
      </button>
    </form>
  );
}

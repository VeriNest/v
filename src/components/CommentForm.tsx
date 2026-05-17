import { useState } from "react";
import { MessageCircle } from "lucide-react";

export function CommentForm({
  onSubmit,
  isLoading,
  placeholder = "Enquire or Share your thoughts about this property...",
}: {
  onSubmit: (content: string) => void;
  isLoading: boolean;
  placeholder?: string;
}) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          rows={3}
          className="w-full resize-none rounded-2xl border border-border/60 bg-secondary/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
        />
      </div>
      <button
        type="submit"
        disabled={!content.trim() || isLoading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        <MessageCircle size={16} />
        {isLoading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}

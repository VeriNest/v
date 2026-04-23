import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck, Star } from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { getStoredSession, reviewsApi, usersApi } from "@/lib/api";

export default function AgentProfile() {
  const { id } = useParams();
  const session = getStoredSession();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { data } = useQuery({
    queryKey: ["/users", id],
    queryFn: () => usersApi.get(id!),
    enabled: Boolean(id),
  });
  const { data: reviews = [] } = useQuery({
    queryKey: ["/users", id, "reviews"],
    queryFn: () => usersApi.reviews(id!),
    enabled: Boolean(id),
  });
  const reviewMutation = useMutation({
    mutationFn: () => reviewsApi.create({ revieweeId: id!, rating, comment }),
    onSuccess: () => {
      toast.success("Agent review submitted");
      setComment("");
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ["/users", id, "reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/users", id] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Unable to submit review";
      toast.error(message);
    },
  });

  const user = data as any;
  const initials = useMemo(
    () =>
      String(user?.full_name ?? "AG")
        .split(" ")
        .map((part: string) => part[0])
        .join("")
        .slice(0, 2),
    [user?.full_name],
  );

  if (!user) {
    return (
      <div className="space-y-4">
        <DashboardPageHeader title="Agent Profile" description="Profile not available." />
        <Button variant="outline" asChild>
          <Link to="/seeker/offers"><ArrowLeft className="mr-2 h-4 w-4" />Back to offers</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={user.full_name ?? "Agent"}
        description="Public agent profile and review summary."
        actions={
          <Button variant="outline" asChild>
            <Link to="/seeker/offers"><ArrowLeft className="mr-2 h-4 w-4" />Back to offers</Link>
          </Button>
        }
      />

      <Card className="border border-border/60 shadow-sm">
        <CardContent className="space-y-5 p-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border border-border/60">
              <AvatarFallback className="bg-primary/10 font-semibold text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">{user.full_name}</h2>
                <DashboardStatusBadge tone="info">{String(user.role ?? "agent")}</DashboardStatusBadge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {Number(user.average_rating ?? 0).toFixed(1)}
                </span>
                <span>{Number(user.review_count ?? 0)} reviews</span>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  {String(user.verification_status ?? "pending")}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-secondary/20 p-4 text-sm text-muted-foreground">
            {user.bio ?? "No profile bio added yet."}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {session?.user.role === "seeker" && session.user.id !== id ? (
          <Card className="border border-border/60 shadow-sm">
            <CardContent className="space-y-4 p-4">
              <p className="text-sm font-semibold text-foreground">Leave a review</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button" onClick={() => setRating(value)} className={value <= rating ? "text-amber-500" : "text-muted-foreground/40"}>
                    <Star className={`h-5 w-5 ${value <= rating ? "fill-current" : ""}`} />
                  </button>
                ))}
              </div>
              <Textarea
                rows={4}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Share your experience with this agent."
              />
              <Button onClick={() => reviewMutation.mutate()} disabled={reviewMutation.isPending || comment.trim().length < 6}>
                Submit review
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {reviews.length ? (
          reviews.map((review: any) => (
            <Card key={review.id} className="border border-border/60 shadow-sm">
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">{review.reviewer_name ?? "Verified user"}</p>
                  <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: Number(review.rating ?? 0) }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border border-border/60 shadow-sm">
            <CardContent className="p-4 text-sm text-muted-foreground">No public reviews yet.</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

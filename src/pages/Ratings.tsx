import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { transactions, userDatabase } from "@/lib/store";

const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <button key={i} onClick={() => onChange(i)} className="p-0.5">
        <Star className={`w-6 h-6 transition-colors ${i <= value ? "fill-black text-black" : "text-muted-foreground/30"}`} />
      </button>
    ))}
  </div>
);

export default function Ratings() {
  const [selectedTx, setSelectedTx] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [ratedIds, setRatedIds] = useState<Set<string>>(new Set(["TXN-004", "TXN-006"]));

  const completedTxs = transactions.filter((t) => t.status === "completed");

  const submitRating = (txId: string) => {
    if (rating === 0) return toast.error("Please select a rating");
    setRatedIds((prev) => new Set([...prev, txId]));
    setSelectedTx(null);
    setRating(0);
    setReview("");
    toast.success("Rating submitted!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ratings & Reviews</h1>
        <p className="text-sm text-muted-foreground">Rate your escrow experience and build trust in the community.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rate Completed Transactions</CardTitle>
              <CardDescription>Leave a rating for your recent transactions.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {completedTxs.length === 0 && (
                  <p className="px-6 py-8 text-center text-sm text-muted-foreground">No completed transactions to rate yet.</p>
                )}
                {completedTxs.map((tx) => {
                  const rated = ratedIds.has(tx.id);
                  return (
                    <div key={tx.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">{tx.party}</p>
                          <p className="text-xs text-muted-foreground">{tx.id} · {tx.amount} · {tx.date}</p>
                        </div>
                        {rated ? (
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Rated
                          </Badge>
                        ) : (
                          <Button size="sm" variant={selectedTx === tx.id ? "secondary" : "default"}
                            onClick={() => setSelectedTx(selectedTx === tx.id ? null : tx.id)}>
                            Rate Now
                          </Button>
                        )}
                      </div>

                      {selectedTx === tx.id && (
                        <div className="mt-4 p-4 rounded-lg bg-muted/50 space-y-4">
                          <div>
                            <p className="text-sm font-medium text-foreground mb-2">How was your experience?</p>
                            <StarRating value={rating} onChange={setRating} />
                          </div>
                          <div className="flex gap-3">
                            <Button size="sm" variant="outline" className="gap-1"><ThumbsUp className="w-3 h-3" /> Smooth</Button>
                            <Button size="sm" variant="outline" className="gap-1"><ThumbsDown className="w-3 h-3" /> Issues</Button>
                          </div>
                          <Textarea placeholder="Write a review (optional)..." value={review} onChange={(e) => setReview(e.target.value)} />
                          <Button size="sm" onClick={() => submitRating(tx.id)}>Submit Rating</Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Rated Users</CardTitle>
            <CardDescription>Most trusted members in the community.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...userDatabase]
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 5)
              .map((user, i) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3 h-3 ${s <= Math.round(user.rating) ? "fill-black text-black" : "text-muted-foreground/30"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{user.rating} · {user.totalTrades} txns</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">{user.badge}</Badge>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
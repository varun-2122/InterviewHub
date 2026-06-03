"use client";

import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import toast from "react-hot-toast";
import { MessageSquarePlus, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { resolveInterviewerInfo } from "@/lib/coreUtils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { format } from "date-fns";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";

interface FeedbackModalProps {
  interviewId: Id<"interviews">;
}

// Dialog letting interviewers post evaluation scores and feedback comments
export function FeedbackModal({ interviewId }: FeedbackModalProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [scoreRating, setScoreRating] = useState("3");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveFeedback = useMutation(api.notes.postEvaluationNote);
  const profileList = useQuery(api.accounts.fetchAllProfiles);
  const notesHistory = useQuery(api.notes.fetchEvaluationNotes, { interviewId });

  const submitComment = async () => {
    if (!commentText.trim()) {
      return toast.error("Write review notes before submitting.");
    }

    setIsSubmitting(true);
    try {
      await saveFeedback({
        interviewId,
        content: commentText.trim(),
        rating: parseInt(scoreRating),
      });

      toast.success("Feedback posted successfully.");
      setCommentText("");
      setScoreRating("3");
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to commit session notes:", err);
      toast.error("Failed to save comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const drawStars = (score: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((val) => (
        <Star
          key={val}
          className={`h-3.5 w-3.5 ${val <= score ? "fill-primary text-primary" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  );

  // Show loading state rather than silently hiding the button while data loads
  const isLoading = notesHistory === undefined || profileList === undefined;

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="w-full font-medium"
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
          ) : (
            <MessageSquarePlus className="h-4 w-4 mr-1.5" />
          )}
          <span>{isLoading ? "Loading..." : "Add Comment"}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px] rounded-xl border border-border">
        <DialogHeader>
          <DialogTitle className="text-base font-bold tracking-tight text-foreground">
            Session Evaluation Notes
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 my-2">
          {notesHistory && notesHistory.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Logged Comments
                </h4>
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  {notesHistory.length} {notesHistory.length === 1 ? "Note" : "Notes"}
                </Badge>
              </div>

              <ScrollArea className="h-[200px] border rounded-lg p-2.5 bg-muted/10">
                <div className="space-y-3">
                  {notesHistory.map((item: any, idx: number) => {
                    const host = resolveInterviewerInfo(profileList || [], item.interviewerId);
                    return (
                      <div key={idx} className="rounded-lg border bg-card p-3 space-y-2 text-sm shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={host.avatarUrl} />
                              <AvatarFallback className="text-xs">{host.letters}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-xs font-bold text-foreground">{host.fullName}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(item._creationTime, "MMM d, yyyy • h:mm a")}
                              </p>
                            </div>
                          </div>
                          {drawStars(item.rating)}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pl-1 whitespace-pre-wrap">
                          {item.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}

          <div className="space-y-4 pt-1 border-t">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Assessment Rating</Label>
              <Select value={scoreRating} onValueChange={setScoreRating}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Rate candidate" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <SelectItem key={stars} value={stars.toString()} className="text-xs cursor-pointer">
                      <div className="flex items-center gap-2">{drawStars(stars)}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Detailed Evaluation Feedback</Label>
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Submit your detailed review comments about this candidate..."
                className="h-24 text-xs resize-none"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setModalOpen(false)}
            className="text-xs font-medium"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={submitComment}
            className="text-xs font-medium bg-primary hover:bg-primary/95"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                Saving...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FeedbackModal;

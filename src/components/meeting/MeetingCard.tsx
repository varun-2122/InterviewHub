"use client";

import { useMeetingActions } from "@/hooks/useMeetingActions";
import { Doc } from "../../../convex/_generated/dataModel";
import { getMeetingLiveStatus } from "@/lib/coreUtils";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Calendar } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type MeetingDocument = Doc<"interviews">;

interface MeetingCardProps {
  interview: MeetingDocument;
}

// Display card for single interview meeting details
export function MeetingCard({ interview }: MeetingCardProps) {
  const { navigateToCall } = useMeetingActions();
  const meetingState = getMeetingLiveStatus(interview);

  const timeLabel = format(
    new Date(interview.startTime),
    "EEEE, MMMM d · h:mm a"
  );

  return (
    <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="space-y-2.5 p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary/70" />
            <span>{timeLabel}</span>
          </div>

          <Badge
            variant={
              meetingState === "live"
                ? "default"
                : meetingState === "upcoming"
                  ? "secondary"
                  : "outline"
            }
            className="capitalize"
          >
            {meetingState === "live"
              ? "Live Now"
              : meetingState === "upcoming"
                ? "Scheduled"
                : "Completed"}
          </Badge>
        </div>

        <CardTitle className="text-lg font-semibold tracking-tight leading-tight">
          {interview.title}
        </CardTitle>

        {interview.description && (
          <CardDescription className="text-xs leading-relaxed line-clamp-2">
            {interview.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-0">
        {meetingState === "live" && (
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            onClick={() => navigateToCall(interview.streamCallId)}
          >
            Join Workspace
          </Button>
        )}

        {meetingState === "upcoming" && (
          <Button variant="secondary" className="w-full font-medium" disabled>
            Pending Start Time
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default MeetingCard;

"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";
import { resolveCandidateInfo, groupMeetingsByStatus } from "@/lib/coreUtils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MEETING_STATUS_MAP } from "@/constants/sessionConfig";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import FeedbackModal from "@/components/feedback/FeedbackModal";

type MeetingRecord = Doc<"interviews">;

function DashboardPage() {
  const accounts = useQuery(api.accounts.fetchAllProfiles);
  const meetings = useQuery(api.meetings.fetchMeetingsList);
  const transitionStatus = useMutation(api.meetings.changeMeetingStatus);

  const performStatusTransition = async (
    meetingId: Id<"interviews">,
    nextStatus: string
  ) => {
    try {
      await transitionStatus({ id: meetingId, status: nextStatus });
      toast.success(`Meeting status marked as ${nextStatus}`);
    } catch (err) {
      console.error("Failed to transition status:", err);
      toast.error("Failed to update status");
    }
  };

  if (!meetings || !accounts) {
    return <Loader />;
  }

  const sortedGroups = groupMeetingsByStatus(meetings);

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-8">
        <Link href="/schedule">
          <Button className="font-semibold">Schedule New Interview</Button>
        </Link>
      </div>

      <div className="space-y-8">
        {MEETING_STATUS_MAP.map(
          (category) =>
            (sortedGroups[category.id]?.length || 0) > 0 && (
              <section key={category.id} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight">{category.label}</h2>
                  <Badge variant={category.theme}>
                    {sortedGroups[category.id]?.length || 0}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedGroups[category.id]?.map((interview: MeetingRecord) => {
                    const candidate = resolveCandidateInfo(
                      accounts,
                      interview.candidateId
                    );
                    const startTimeDate = new Date(interview.startTime);

                    return (
                      <Card key={interview._id} className="hover:shadow-md transition-all border border-border">
                        <CardHeader className="p-4 border-b bg-muted/10">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 ring-1 ring-border">
                              <AvatarImage src={candidate.avatarUrl} alt={candidate.fullName} />
                              <AvatarFallback>
                                {candidate.letters}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-0.5">
                              <CardTitle className="text-base font-semibold tracking-tight">
                                {candidate.fullName}
                              </CardTitle>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {interview.title}
                              </p>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="p-4">
                          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-primary/70" />
                              {format(startTimeDate, "MMM dd, yyyy")}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-primary/70" />
                              {format(startTimeDate, "hh:mm a")}
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                          {interview.status === "completed" && (
                            <div className="flex gap-2 w-full">
                              <Button
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                                size="sm"
                                onClick={() =>
                                  performStatusTransition(
                                    interview._id,
                                    "succeeded"
                                  )
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Pass
                              </Button>
                              <Button
                                variant="destructive"
                                className="flex-1 font-medium"
                                size="sm"
                                onClick={() =>
                                  performStatusTransition(interview._id, "failed")
                                }
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Fail
                              </Button>
                            </div>
                          )}
                          <FeedbackModal interviewId={interview._id} />
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )
        )}
      </div>
    </div>
  );
}

export default DashboardPage;

import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserDisplay from "@/components/user/UserDisplay";
import { Loader2, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { AVAILABLE_HOURS } from "@/constants/sessionConfig";
import MeetingCard from "@/components/meeting/MeetingCard";

export function InterviewScheduleUI() {
  const streamClient = useStreamVideoClient();
  const { user: clerkUser } = useUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const registeredMeetings = useQuery(api.meetings.fetchMeetingsList) ?? [];
  const systemAccounts = useQuery(api.accounts.fetchAllProfiles) ?? [];
  const commitMeeting = useMutation(api.meetings.scheduleMeeting);

  const candidatesList = systemAccounts?.filter((u: any) => u.role === "candidate");
  const interviewersList = systemAccounts?.filter((u: any) => u.role === "interviewer");

  const [meetingForm, setMeetingForm] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "09:00",
    candidateId: "",
    interviewerIds: clerkUser?.id ? [clerkUser.id] : [],
  });

  const handleCreateMeeting = async () => {
    if (!streamClient || !clerkUser) return;
    if (!meetingForm.candidateId || meetingForm.interviewerIds.length === 0) {
      toast.error("Select a candidate profile and at least one interviewer.");
      return;
    }

    setSubmitting(true);

    try {
      const { title, description, date, time, candidateId, interviewerIds } = meetingForm;
      const [hours, minutes] = time.split(":");
      const finalizedDate = new Date(date);
      finalizedDate.setHours(parseInt(hours), parseInt(minutes), 0);

      const uniqueId = crypto.randomUUID();
      const call = streamClient.call("default", uniqueId);

      await call.getOrCreate({
        data: {
          starts_at: finalizedDate.toISOString(),
          custom: {
            description: title,
            additionalDetails: description,
          },
        },
      });

      await commitMeeting({
        title,
        description,
        startTime: finalizedDate.getTime(),
        status: "upcoming",
        streamCallId: uniqueId,
        candidateId,
        interviewerIds,
      });

      setModalOpen(false);
      toast.success("Interview scheduled successfully!");

      setMeetingForm({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00",
        candidateId: "",
        interviewerIds: clerkUser?.id ? [clerkUser.id] : [],
      });
    } catch (err) {
      console.error("Failed to commit schedule:", err);
      toast.error("Could not schedule the meeting. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const addInterviewerRole = (id: string) => {
    if (!meetingForm.interviewerIds.includes(id)) {
      setMeetingForm((prev) => ({
        ...prev,
        interviewerIds: [...prev.interviewerIds, id],
      }));
    }
  };

  const removeInterviewerRole = (id: string) => {
    if (id === clerkUser?.id) return;
    setMeetingForm((prev) => ({
      ...prev,
      interviewerIds: prev.interviewerIds.filter((item) => item !== id),
    }));
  };

  const activeInterviewsList = interviewersList.filter((i: any) =>
    meetingForm.interviewerIds.includes(i.clerkId)
  );

  const standbyInterviewsList = interviewersList.filter(
    (i: any) => !meetingForm.interviewerIds.includes(i.clerkId)
  );

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interviews</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage interviews</p>
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="font-semibold">Schedule Interview</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] h-[calc(100vh-200px)] overflow-auto rounded-xl border border-border">
            <DialogHeader>
              <DialogTitle className="text-base font-bold tracking-tight">Schedule Interview</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Interview title"
                  value={meetingForm.title}
                  onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Interview description"
                  value={meetingForm.description}
                  onChange={(e) => setMeetingForm({ ...meetingForm, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Candidate</label>
                <Select
                  value={meetingForm.candidateId}
                  onValueChange={(candidateId) => setMeetingForm({ ...meetingForm, candidateId })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidatesList.map((candidate: any) => (
                      <SelectItem key={candidate.clerkId} value={candidate.clerkId} className="cursor-pointer">
                        <UserDisplay user={candidate} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Interviewers</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {activeInterviewsList.map((interviewer: any) => (
                    <div
                      key={interviewer.clerkId}
                      className="inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm"
                    >
                      <UserDisplay user={interviewer} />
                      {interviewer.clerkId !== clerkUser?.id && (
                        <button
                          onClick={() => removeInterviewerRole(interviewer.clerkId)}
                          className="hover:text-destructive transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {standbyInterviewsList.length > 0 && (
                  <Select onValueChange={addInterviewerRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add interviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {standbyInterviewsList.map((interviewer: any) => (
                        <SelectItem key={interviewer.clerkId} value={interviewer.clerkId} className="cursor-pointer">
                          <UserDisplay user={interviewer} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="flex gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Calendar
                    mode="single"
                    selected={meetingForm.date}
                    onSelect={(date) => date && setMeetingForm({ ...meetingForm, date })}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border bg-card"
                  />
                </div>

                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">Time</label>
                  <Select
                    value={meetingForm.time}
                    onValueChange={(time) => setMeetingForm({ ...meetingForm, time })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_HOURS.map((time) => (
                        <SelectItem key={time} value={time} className="cursor-pointer">
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateMeeting} disabled={submitting} className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold">
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Interview"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!registeredMeetings ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : registeredMeetings.length > 0 ? (
        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {registeredMeetings.map((item: any) => (
              <MeetingCard key={item._id} interview={item} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl p-8 bg-muted/10">
          No interviews scheduled.
        </div>
      )}
    </div>
  );
}

export default InterviewScheduleUI;
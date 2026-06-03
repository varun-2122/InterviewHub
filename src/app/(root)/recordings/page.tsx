"use client";

import Loader from "@/components/common/Loader";
import RecordingCard from "@/components/recording/RecordingCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserMeetings } from "@/hooks/useUserMeetings";
import { CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

function RecordingsPage() {
  const { meetingsList, isLoading } = useUserMeetings();
  const [recordingsList, setRecordingsList] = useState<CallRecording[]>([]);

  useEffect(() => {
    const loadRecordings = async () => {
      if (!meetingsList) return;

      try {
        const queryResults = await Promise.all(
          meetingsList.map((call) => call.queryRecordings())
        );
        const resolvedList = queryResults.flatMap((res) => res.recordings);

        setRecordingsList(resolvedList);
      } catch (err) {
        console.error("Error loading call recordings:", err);
      }
    };

    loadRecordings();
  }, [meetingsList]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold tracking-tight">Recordings</h1>
      <p className="text-muted-foreground my-1">
        {recordingsList.length}{" "}
        {recordingsList.length === 1 ? "recording" : "recordings"} available
      </p>

      <ScrollArea className="h-[calc(100vh-12rem)] mt-3">
        {recordingsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
            {recordingsList.map((item) => (
              <RecordingCard key={item.end_time} recording={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
            <p className="text-xl font-medium text-muted-foreground">
              No recordings available.
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default RecordingsPage;

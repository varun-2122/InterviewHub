"use client";

import Loader from "@/components/common/Loader";
import RecordingCard from "@/components/recording/RecordingCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserMeetings } from "@/hooks/useUserMeetings";
import { CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Video, Film } from "lucide-react";

function RecordingsPage() {
  const { meetingsList, isLoading: isMeetingsLoading } = useUserMeetings();
  const [recordingsList, setRecordingsList] = useState<CallRecording[]>([]);
  const [isFetchingRecordings, setIsFetchingRecordings] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadRecordings = async () => {
      if (!meetingsList) {
        if (isMounted) setIsFetchingRecordings(false);
        return;
      }

      if (meetingsList.length === 0) {
        if (isMounted) {
          setRecordingsList([]);
          setIsFetchingRecordings(false);
        }
        return;
      }

      setIsFetchingRecordings(true);

      try {
        const results = await Promise.allSettled(
          meetingsList.map((call) => call.queryRecordings())
        );

        const fetchedRecordings: CallRecording[] = [];
        results.forEach((res) => {
          if (res.status === "fulfilled" && res.value?.recordings) {
            fetchedRecordings.push(...res.value.recordings);
          }
        });

        if (isMounted) {
          setRecordingsList(fetchedRecordings);
        }
      } catch (err) {
        console.error("Error loading call recordings:", err);
      } finally {
        if (isMounted) {
          setIsFetchingRecordings(false);
        }
      }
    };

    loadRecordings();

    return () => {
      isMounted = false;
    };
  }, [meetingsList]);

  if (isMeetingsLoading || isFetchingRecordings) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="glass-card rounded-xl p-6 border shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary tracking-tight">
            Session Recordings
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Access and replay your past interview session recordings.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full font-semibold text-xs">
          <Film className="size-4" />
          <span>{recordingsList.length} Available</span>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-14rem)]">
        {recordingsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
            {recordingsList.map((item) => (
              <RecordingCard key={item.end_time || item.filename} recording={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[350px] gap-3 border border-dashed border-border rounded-xl p-8 bg-muted/10 text-center">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Video className="size-6" />
            </div>
            <h3 className="text-lg font-bold font-heading text-foreground">
              No Recordings Found
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Session recordings will automatically appear here after an interview session is completed and recorded.
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default RecordingsPage;

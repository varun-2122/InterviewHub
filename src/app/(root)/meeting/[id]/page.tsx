"use client";

import Loader from "@/components/common/Loader";
import MeetingConsole from "@/components/meeting/MeetingConsole";
import SetupScreen from "@/components/meeting/SetupScreen";
import { useActiveMeeting } from "@/hooks/useActiveMeeting";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { useState } from "react";

function MeetingPage() {
  const { id } = useParams();
  const { isLoaded } = useUser();
  const { meetingCall, isSearching } = useActiveMeeting(id);

  const [setupFinished, setSetupFinished] = useState(false);

  if (!isLoaded || isSearching) {
    return <Loader />;
  }

  if (!meetingCall) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-2xl font-bold tracking-tight text-foreground/80">Meeting room not found</p>
      </div>
    );
  }

  return (
    <StreamCall call={meetingCall}>
      <StreamTheme>
        {!setupFinished ? (
          <SetupScreen onSetupComplete={() => setSetupFinished(true)} />
        ) : (
          <MeetingConsole />
        )}
      </StreamTheme>
    </StreamCall>
  );
}

export default MeetingPage;

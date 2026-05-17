"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

// Coordinator-only button to shut down meeting room session
export function EndCallButton() {
  const currentCall = useCall();
  const navigation = useRouter();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const changeStatus = useMutation(api.meetings.changeMeetingStatus);
  const activeMeeting = useQuery(api.meetings.fetchMeetingByCallId, {
    streamCallId: currentCall?.id || "",
  });

  if (!currentCall || !activeMeeting) {
    return null;
  }

  // Double check that the local user created the session
  const isMeetingCoordinator = localParticipant?.userId === currentCall.state.createdBy?.id;

  if (!isMeetingCoordinator) {
    return null;
  }

  const terminateCall = async () => {
    try {
      await currentCall.endCall();

      await changeStatus({
        id: activeMeeting._id,
        status: "completed",
      });

      toast.success("Meeting terminated successfully.");
      navigation.push("/");
    } catch (err) {
      console.error("Failed to shutdown current call session:", err);
      toast.error("Could not close meeting room.");
    }
  };

  return (
    <Button variant="destructive" size="sm" onClick={terminateCall} className="font-semibold text-xs">
      End Session
    </Button>
  );
}

export default EndCallButton;

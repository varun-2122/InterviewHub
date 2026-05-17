import { useEffect, useRef, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

// Fetches an active stream video call instance by its string ID.
// Uses a mounted ref to prevent stale state updates if the component
// unmounts before the async queryCalls resolves.
export const useActiveMeeting = (meetingId: string | string[]) => {
  const [meetingCall, setMeetingCall] = useState<Call>();
  const [isSearching, setIsSearching] = useState(true);
  const clientInstance = useStreamVideoClient();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!clientInstance || !meetingId) {
      setIsSearching(false);
      return;
    }

    const findActiveSession = async () => {
      try {
        const { calls } = await clientInstance.queryCalls({
          filter_conditions: { id: meetingId },
        });

        // Guard against stale updates if component unmounted during fetch
        if (!mountedRef.current) return;

        if (calls.length > 0) {
          setMeetingCall(calls[0]);
        } else {
          setMeetingCall(undefined);
        }
      } catch (err) {
        console.error("Error querying active stream call:", err);
        if (mountedRef.current) {
          setMeetingCall(undefined);
        }
      } finally {
        if (mountedRef.current) {
          setIsSearching(false);
        }
      }
    };

    findActiveSession();
  }, [clientInstance, meetingId]);

  return { meetingCall, isSearching };
};

export default useActiveMeeting;

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

// Fetches user-associated call sessions and partitions them by timeframe
export const useUserMeetings = () => {
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const videoClient = useStreamVideoClient();
  const [meetingsList, setMeetingsList] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAttendeeMeetings = async () => {
      if (!isUserLoaded) return;

      if (!clerkUser?.id || !videoClient) {
        if (isMounted) {
          setIsLoading(false);
          setMeetingsList([]);
        }
        return;
      }

      setIsLoading(true);

      try {
        const { calls } = await videoClient.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: clerkUser.id },
              { members: { $in: [clerkUser.id] } },
            ],
          },
        });

        if (isMounted) {
          setMeetingsList(calls || []);
        }
      } catch (err) {
        console.error("Error retrieving user meetings:", err);
        if (isMounted) {
          setMeetingsList([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAttendeeMeetings();

    return () => {
      isMounted = false;
    };
  }, [videoClient, clerkUser?.id, isUserLoaded]);

  const current = new Date();

  const completedMeetings = meetingsList?.filter((session: Call) => {
    const { startsAt, endedAt } = session.state;
    return (startsAt && new Date(startsAt) < current) || !!endedAt;
  });

  const upcomingMeetings = meetingsList?.filter((session: Call) => {
    const { startsAt } = session.state;
    return startsAt && new Date(startsAt) > current;
  });

  const liveMeetings = meetingsList?.filter((session: Call) => {
    const { startsAt, endedAt } = session.state;
    return startsAt && new Date(startsAt) < current && !endedAt;
  });

  return {
    meetingsList,
    completedMeetings,
    upcomingMeetings,
    liveMeetings,
    isLoading,
  };
};

export default useUserMeetings;

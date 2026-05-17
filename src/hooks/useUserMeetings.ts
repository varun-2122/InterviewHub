import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

// Fetches user-associated call sessions and partitions them by timeframe
export const useUserMeetings = () => {
  const { user: clerkUser } = useUser();
  const videoClient = useStreamVideoClient();
  const [meetingsList, setMeetingsList] = useState<Call[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAttendeeMeetings = async () => {
      if (!videoClient || !clerkUser?.id) return;

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

        setMeetingsList(calls);
      } catch (err) {
        console.error("Error retrieving user meetings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendeeMeetings();
  }, [videoClient, clerkUser?.id]);

  const current = new Date();

  // Sessions that have already finished or started in the past
  const completedMeetings = meetingsList?.filter((session: Call) => {
    const { startsAt, endedAt } = session.state;
    return (startsAt && new Date(startsAt) < current) || !!endedAt;
  });

  // Scheduled sessions set in the future
  const upcomingMeetings = meetingsList?.filter((session: Call) => {
    const { startsAt } = session.state;
    return startsAt && new Date(startsAt) > current;
  });

  // Active call rooms that are live currently
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

import { clsx, type ClassValue } from "clsx";
import { addHours, intervalToDuration, isBefore, isWithinInterval } from "date-fns";
import { twMerge } from "tailwind-merge";
import { Doc } from "../../convex/_generated/dataModel";

type MeetingRecord = Doc<"interviews">;
type UserProfile = Doc<"users">;

// Combines CSS classes cleanly using clsx and tailwind-merge
export function combineClasses(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

interface GroupedMeetings {
  succeeded?: MeetingRecord[];
  failed?: MeetingRecord[];
  completed?: MeetingRecord[];
  upcoming?: MeetingRecord[];
}

// Groups meeting list into sections based on explicit status first,
// then falls back to time-based grouping for "upcoming" status interviews.
export const groupMeetingsByStatus = (sessions: MeetingRecord[]): GroupedMeetings => {
  if (!sessions) return {};

  const currentInstant = new Date();

  return sessions.reduce<GroupedMeetings>((groups, item) => {
    // Explicit terminal statuses always win
    if (item.status === "succeeded") {
      groups.succeeded = [...(groups.succeeded || []), item];
    } else if (item.status === "failed") {
      groups.failed = [...(groups.failed || []), item];
    } else if (item.status === "completed") {
      // Explicitly marked completed by interviewer
      groups.completed = [...(groups.completed || []), item];
    } else {
      // For "upcoming" status, use time to determine actual display bucket
      const meetingTime = new Date(item.startTime);
      if (isBefore(meetingTime, currentInstant)) {
        // Past the scheduled time but not yet explicitly marked completed
        groups.completed = [...(groups.completed || []), item];
      } else {
        groups.upcoming = [...(groups.upcoming || []), item];
      }
    }

    return groups;
  }, {});
};

interface MemberDetails {
  fullName: string;
  avatarUrl: string;
  letters: string;
}

// Resolves a user's profile display fields from their Clerk ID.
// Centralizes the lookup logic previously duplicated between candidate and interviewer resolvers.
export const resolveUserInfo = (
  usersList: UserProfile[],
  clerkId: string,
  fallbackInitials = "??"
): MemberDetails => {
  const match = usersList?.find((u) => u.clerkId === clerkId);

  const letters = match?.name
    ? match.name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : fallbackInitials;

  return {
    fullName: match?.name || "Unknown User",
    avatarUrl: match?.image || "",
    letters,
  };
};

// Convenience wrappers with role-appropriate fallback initials
export const resolveCandidateInfo = (usersList: UserProfile[], clerkId: string): MemberDetails =>
  resolveUserInfo(usersList, clerkId, "CD");

export const resolveInterviewerInfo = (usersList: UserProfile[], clerkId: string): MemberDetails =>
  resolveUserInfo(usersList, clerkId, "IV");

// Computes standard formatting for timestamps of call recordings
export const calculateTimeElapsed = (startIso: string, endIso: string): string => {
  const start = new Date(startIso);
  const end = new Date(endIso);

  const parsedDuration = intervalToDuration({ start, end });

  const hours = parsedDuration.hours || 0;
  const minutes = parsedDuration.minutes || 0;
  const seconds = parsedDuration.seconds || 0;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  if (minutes > 0) {
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  return `${seconds}s`;
};

// Checks dynamic time boundaries to determine if a scheduled call is actively live.
// Terminal statuses (completed/failed/succeeded) always resolve as "completed".
export const getMeetingLiveStatus = (meeting: MeetingRecord): "completed" | "live" | "upcoming" => {
  const current = new Date();
  const start = new Date(meeting.startTime);
  const cutoff = addHours(start, 1); // 1-hour session duration window

  if (
    meeting.status === "completed" ||
    meeting.status === "failed" ||
    meeting.status === "succeeded"
  ) {
    return "completed";
  }

  if (isWithinInterval(current, { start, end: cutoff })) {
    return "live";
  }

  if (isBefore(current, start)) {
    return "upcoming";
  }

  return "completed";
};

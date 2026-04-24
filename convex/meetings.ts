import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Valid status values for interview records
const VALID_STATUSES = ["upcoming", "completed", "succeeded", "failed"] as const;

// Fetches the global registry of scheduled and historical meetings.
// Only accessible to interviewers — candidates use fetchMyMeetings instead.
export const fetchMeetingsList = query({
  handler: async (ctx) => {
    const sessionToken = await ctx.auth.getUserIdentity();
    if (!sessionToken) {
      throw new Error("Unauthorized: Access token missing or expired.");
    }

    // Scope to interviewer role only to prevent candidates reading all interview data
    const requestingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", sessionToken.subject))
      .first();

    if (!requestingUser || requestingUser.role !== "interviewer") {
      throw new Error("Forbidden: Only interviewers can access the full meeting list.");
    }

    return await ctx.db.query("interviews").collect();
  },
});

// Queries meetings assigned to the currently authenticated candidate
export const fetchMyMeetings = query({
  handler: async (ctx) => {
    const sessionToken = await ctx.auth.getUserIdentity();
    if (!sessionToken) {
      return [];
    }

    const matchedList = await ctx.db
      .query("interviews")
      .withIndex("by_candidate_id", (q) =>
        q.eq("candidateId", sessionToken.subject)
      )
      .collect();

    return matchedList ?? [];
  },
});

// Retrieves single meeting document using Stream call identifier
export const fetchMeetingByCallId = query({
  args: { streamCallId: v.string() },
  handler: async (ctx, args) => {
    if (!args.streamCallId) return null;

    return await ctx.db
      .query("interviews")
      .withIndex("by_stream_call_id", (q) =>
        q.eq("streamCallId", args.streamCallId)
      )
      .first();
  },
});

// Mutation to commit a new scheduled meeting record.
// Only interviewers can schedule meetings.
export const scheduleMeeting = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
  },
  handler: async (ctx, input) => {
    const sessionToken = await ctx.auth.getUserIdentity();
    if (!sessionToken) {
      throw new Error("Unauthorized: Session is required to schedule.");
    }

    // Verify requester is an interviewer
    const requestingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", sessionToken.subject))
      .first();

    if (!requestingUser || requestingUser.role !== "interviewer") {
      throw new Error("Forbidden: Only interviewers can schedule meetings.");
    }

    // Validate required fields
    const trimmedTitle = input.title.trim();
    if (!trimmedTitle) {
      throw new Error("Validation Error: Interview title cannot be empty.");
    }

    if (input.startTime < Date.now() - 60_000) {
      // Allow 1-minute grace window for clock skew
      throw new Error("Validation Error: Interview start time must be in the future.");
    }

    if (!input.candidateId) {
      throw new Error("Validation Error: A candidate must be selected.");
    }

    if (input.interviewerIds.length === 0) {
      throw new Error("Validation Error: At least one interviewer must be assigned.");
    }

    // Verify the candidate exists
    const candidate = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", input.candidateId))
      .first();

    if (!candidate) {
      throw new Error("Validation Error: Selected candidate does not exist.");
    }

    const { title, description, startTime, status, streamCallId, candidateId, interviewerIds } = input;

    return await ctx.db.insert("interviews", {
      title: trimmedTitle,
      description,
      startTime,
      status,
      streamCallId,
      candidateId,
      interviewerIds,
    });
  },
});

// Mutation to update status of a meeting, saving end stamp on completed.
// Only interviewers who are assigned to the meeting can change its status.
export const changeMeetingStatus = mutation({
  args: {
    id: v.id("interviews"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const sessionToken = await ctx.auth.getUserIdentity();
    if (!sessionToken) {
      throw new Error("Unauthorized: Authentication required.");
    }

    // Validate the new status is a recognized value
    if (!VALID_STATUSES.includes(args.status as typeof VALID_STATUSES[number])) {
      throw new Error(
        `Validation Error: "${args.status}" is not a valid status. Must be one of: ${VALID_STATUSES.join(", ")}`
      );
    }

    // Verify requester is an interviewer
    const requestingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", sessionToken.subject))
      .first();

    if (!requestingUser || requestingUser.role !== "interviewer") {
      throw new Error("Forbidden: Only interviewers can update meeting status.");
    }

    // Verify the meeting exists
    const meeting = await ctx.db.get(args.id);
    if (!meeting) {
      throw new Error("Not Found: Meeting does not exist.");
    }

    // Verify requester is an assigned interviewer for this meeting
    const isAssigned = meeting.interviewerIds.includes(sessionToken.subject);
    if (!isAssigned) {
      throw new Error("Forbidden: You are not assigned to this interview.");
    }

    const changes: { status: string; endTime?: number } = {
      status: args.status,
    };

    if (args.status === "completed") {
      changes.endTime = Date.now();
    }

    return await ctx.db.patch(args.id, changes);
  },
});

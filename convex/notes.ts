import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Submits a score rating and detailed commentary about a candidate's session.
// Only interviewers assigned to the interview may post evaluation notes.
export const postEvaluationNote = mutation({
  args: {
    interviewId: v.id("interviews"),
    content: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const activeSession = await ctx.auth.getUserIdentity();
    if (!activeSession) {
      throw new Error("Unauthorized: Authentication is missing.");
    }

    // Validate rating is in expected range
    if (args.rating < 1 || args.rating > 5 || !Number.isInteger(args.rating)) {
      throw new Error("Validation Error: Rating must be an integer between 1 and 5.");
    }

    // Validate content is not empty
    const trimmedContent = args.content.trim();
    if (!trimmedContent) {
      throw new Error("Validation Error: Feedback content cannot be empty.");
    }

    // Verify requester is an interviewer by role
    const requestingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", activeSession.subject))
      .first();

    if (!requestingUser || requestingUser.role !== "interviewer") {
      throw new Error("Forbidden: Only interviewers can submit evaluation notes.");
    }

    // Verify the interview exists and the requester is assigned to it
    const interview = await ctx.db.get(args.interviewId);
    if (!interview) {
      throw new Error("Not Found: The specified interview does not exist.");
    }

    const isAssigned = interview.interviewerIds.includes(activeSession.subject);
    if (!isAssigned) {
      throw new Error("Forbidden: You are not assigned as an interviewer for this session.");
    }

    const { interviewId, rating } = args;

    return await ctx.db.insert("comments", {
      interviewId,
      content: trimmedContent,
      rating,
      interviewerId: activeSession.subject,
    });
  },
});

// Retrieves historical evaluation comments posted for a specific meeting room.
// Accessible to any authenticated user (interviewers reviewing notes, candidates seeing feedback).
export const fetchEvaluationNotes = query({
  args: { interviewId: v.id("interviews") },
  handler: async (ctx, args) => {
    const sessionToken = await ctx.auth.getUserIdentity();
    if (!sessionToken) {
      return [];
    }

    if (!args.interviewId) return [];

    return await ctx.db
      .query("comments")
      .withIndex("by_interview_id", (q) =>
        q.eq("interviewId", args.interviewId)
      )
      .collect();
  },
});

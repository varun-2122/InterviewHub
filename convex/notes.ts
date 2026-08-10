import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireInterviewer } from "./lib";

// Submits a score rating and detailed commentary about a candidate's session.
// Only interviewers assigned to the interview may post evaluation notes.
export const postEvaluationNote = mutation({
  args: {
    interviewId: v.id("interviews"),
    content: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const { identity } = await requireInterviewer(ctx);

    // Validate rating is in expected range
    if (args.rating < 1 || args.rating > 5 || !Number.isInteger(args.rating)) {
      throw new Error("Validation Error: Rating must be an integer between 1 and 5.");
    }

    // Validate content is not empty
    const trimmedContent = args.content.trim();
    if (!trimmedContent) {
      throw new Error("Validation Error: Feedback content cannot be empty.");
    }

    // Verify the interview exists and the requester is assigned to it
    const interview = await ctx.db.get(args.interviewId);
    if (!interview) {
      throw new Error("Not Found: The specified interview does not exist.");
    }

    const isAssigned = interview.interviewerIds.includes(identity.subject);
    if (!isAssigned) {
      throw new Error("Forbidden: You are not assigned as an interviewer for this session.");
    }

    return await ctx.db.insert("comments", {
      interviewId: args.interviewId,
      content: trimmedContent,
      rating: args.rating,
      interviewerId: identity.subject,
    });
  },
});

// Retrieves historical evaluation comments posted for a specific meeting room.
// Accessible only to the candidate of that interview or the assigned interviewers —
// prevents any authenticated user from reading another candidate's private feedback.
export const fetchEvaluationNotes = query({
  args: { interviewId: v.id("interviews") },
  handler: async (ctx, args) => {
    const sessionToken = await ctx.auth.getUserIdentity();
    if (!sessionToken) {
      return [];
    }

    if (!args.interviewId) return [];

    // Membership check: requester must be the candidate or an assigned interviewer
    const interview = await ctx.db.get(args.interviewId);
    if (!interview) return [];

    const isCandidate = interview.candidateId === sessionToken.subject;
    const isInterviewer = interview.interviewerIds.includes(sessionToken.subject);

    if (!isCandidate && !isInterviewer) {
      throw new Error("Forbidden: You are not a participant in this interview.");
    }

    return await ctx.db
      .query("comments")
      .withIndex("by_interview_id", (q) =>
        q.eq("interviewId", args.interviewId)
      )
      .collect();
  },
});

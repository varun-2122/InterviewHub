import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Core database collections layout for managing candidate profiles, scheduled calls, and evaluator notes.
export default defineSchema({
  // Synergetic Clerk auth user records
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    role: v.union(v.literal("candidate"), v.literal("interviewer")),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  // Details regarding collaborative interview video/code sessions
  interviews: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    // Closed enum enforced at the schema level — any write with an unlisted
    // status value will be rejected by the Convex validator before reaching
    // the mutation handler.
    status: v.union(
      v.literal("upcoming"),
      v.literal("completed"),
      v.literal("succeeded"),
      v.literal("failed")
    ),
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
    aiFeedback: v.optional(v.string()),
  })
    .index("by_candidate_id", ["candidateId"])
    .index("by_stream_call_id", ["streamCallId"]),

  // Historical evaluative comments and scores created by interviewers
  comments: defineTable({
    content: v.string(),
    rating: v.number(),
    interviewerId: v.string(),
    interviewId: v.id("interviews"),
  }).index("by_interview_id", ["interviewId"]),

  // Shared real-time code editor state, keyed by Stream call ID.
  // All participants in the same call subscribe to and write to this document.
  editorState: defineTable({
    callId: v.string(),
    content: v.string(),
    language: v.string(),
    challengeId: v.string(),
    // Tracks who made the last update so clients can skip echoing their own writes
    lastUpdatedBy: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
    executionOutput: v.optional(v.string()),
  }).index("by_call_id", ["callId"]),
});

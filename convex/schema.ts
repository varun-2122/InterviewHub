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
    status: v.string(), // e.g. 'upcoming', 'completed', 'succeeded', 'failed'
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
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
});

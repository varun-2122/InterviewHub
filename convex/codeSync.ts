import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth } from "./lib";

/**
 * Retrieves the shared editor state for a call room.
 * Readable by any authenticated user — the call ID UUID acts as an
 * access token for the room itself.
 */
export const getEditorState = query({
  args: { callId: v.string() },
  handler: async (ctx, { callId }) => {
    await requireAuth(ctx);
    if (!callId) return null;

    return ctx.db
      .query("editorState")
      .withIndex("by_call_id", (q) => q.eq("callId", callId))
      .first();
  },
});

/**
 * Creates or updates the shared editor state for a call room.
 * Stores who made the last change so remote clients can identify
 * whether an incoming update came from themselves or another participant.
 */
export const upsertEditorState = mutation({
  args: {
    callId: v.string(),
    content: v.string(),
    language: v.string(),
    challengeId: v.string(),
    executionOutput: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAuth(ctx);

    const existing = await ctx.db
      .query("editorState")
      .withIndex("by_call_id", (q) => q.eq("callId", args.callId))
      .first();

    const patch = {
      content: args.content,
      language: args.language,
      challengeId: args.challengeId,
      executionOutput: args.executionOutput,
      lastUpdatedBy: identity.subject,
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, patch);
    } else {
      await ctx.db.insert("editorState", { callId: args.callId, ...patch });
    }
  },
});

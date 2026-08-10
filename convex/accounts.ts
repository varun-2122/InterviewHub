import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth, requireInterviewer } from "./lib";

// Mutation to sync profile variables from Clerk service webhook payload.
// NOTE: This is intentionally kept as a public mutation so the webhook HTTP
// action can call it. Direct client invocations can only create users with
// role:"candidate" — there is no privilege escalation path here.
export const syncUserProfile = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, input) => {
    const checkUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", input.clerkId))
      .first();

    if (checkUser) {
      return checkUser._id;
    }

    return await ctx.db.insert("users", {
      name: input.name,
      email: input.email,
      clerkId: input.clerkId,
      image: input.image,
      role: "candidate",
    });
  },
});

// Retrieves the list of user profiles registered on the portal.
// Restricted to interviewers — candidates cannot enumerate all users' emails/avatars.
export const fetchAllProfiles = query({
  handler: async (ctx) => {
    await requireInterviewer(ctx);
    return await ctx.db.query("users").collect();
  },
});

// Queries a single user's profile by their Clerk identifier.
// A user may always look up their own profile. Interviewers may look
// up any profile (needed for dashboard candidate resolution).
// Unauthenticated callers or candidates looking up other users are blocked.
export const fetchProfileByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    if (!args.clerkId) return null;

    const identity = await requireAuth(ctx);

    // Allow self-lookup (the common case — useRoleCheck uses this)
    if (identity.subject === args.clerkId) {
      return await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
        .first();
    }

    // Allow interviewers to look up any profile (for candidate resolution in dashboard)
    const requestingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (requestingUser?.role === "interviewer") {
      return await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
        .first();
    }

    // Candidates attempting to look up other users are blocked
    throw new Error("Forbidden: You may only view your own profile.");
  },
});

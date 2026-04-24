import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Mutation to sync profile variables from Clerk service webhook payload
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

// Retrieves the list of user profiles registered on the portal
export const fetchAllProfiles = query({
  handler: async (ctx) => {
    const viewerIdentity = await ctx.auth.getUserIdentity();
    if (!viewerIdentity) {
      throw new Error("Access Denied: Unauthenticated database request.");
    }

    return await ctx.db.query("users").collect();
  },
});

// Queries single user details indexed by their Clerk identifier
export const fetchProfileByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    if (!args.clerkId) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

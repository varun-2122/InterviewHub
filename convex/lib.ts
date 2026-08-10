import { QueryCtx, MutationCtx } from "./_generated/server";

/**
 * Shared authorization helpers for Convex query and mutation handlers.
 * Using these helpers ensures a consistent, safe-by-default auth pattern
 * across all functions — if you forget the check, TypeScript will remind you
 * because the return type is non-nullable.
 */

/** Requires an authenticated Clerk session. Returns the identity or throws. */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: Authentication is required.");
  }
  return identity;
}

/** Requires an authenticated session AND a matching user row in the DB. */
export async function requireUser(ctx: QueryCtx | MutationCtx) {
  const identity = await requireAuth(ctx);
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();

  if (!user) {
    throw new Error("Unauthorized: User profile not found.");
  }
  return { identity, user };
}

/**
 * Requires the caller to be an interviewer.
 * Throws a Forbidden error for candidates or unauthenticated callers.
 */
export async function requireInterviewer(ctx: QueryCtx | MutationCtx) {
  const { identity, user } = await requireUser(ctx);
  if (user.role !== "interviewer") {
    throw new Error("Forbidden: Only interviewers can perform this action.");
  }
  return { identity, user };
}

/**
 * Requires the caller to be assigned to a specific interview,
 * either as the candidate or as one of the listed interviewer IDs.
 */
export async function requireMeetingParticipant(
  ctx: QueryCtx | MutationCtx,
  meeting: { candidateId: string; interviewerIds: string[] }
) {
  const { identity, user } = await requireUser(ctx);
  const isCandidate = meeting.candidateId === identity.subject;
  const isInterviewer = meeting.interviewerIds.includes(identity.subject);

  if (!isCandidate && !isInterviewer) {
    throw new Error("Forbidden: You are not a participant in this interview.");
  }
  return { identity, user };
}

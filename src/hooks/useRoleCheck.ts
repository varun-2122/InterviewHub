import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// Validates the database role of the current Clerk-authenticated session
export const useRoleCheck = () => {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();

  // Skip the Convex query until Clerk has fully hydrated — prevents firing
  // with clerkId:"" on reload, which returns null and breaks the loading state
  const userAccount = useQuery(
    api.accounts.fetchProfileByClerkId,
    isClerkLoaded && clerkUser?.id ? { clerkId: clerkUser.id } : "skip"
  );

  const isRoleLoading = !isClerkLoaded || userAccount === undefined;

  return {
    isRoleLoading,
    isInterviewer: userAccount?.role === "interviewer",
    isCandidate: userAccount?.role === "candidate",
  };
};

export default useRoleCheck;


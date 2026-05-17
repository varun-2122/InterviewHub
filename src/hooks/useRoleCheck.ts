import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// Validates the database role of the current Clerk-authenticated session
export const useRoleCheck = () => {
  const { user: clerkUser } = useUser();

  const userAccount = useQuery(api.accounts.fetchProfileByClerkId, {
    clerkId: clerkUser?.id || "",
  });

  const isRoleLoading = userAccount === undefined;

  return {
    isRoleLoading,
    isInterviewer: userAccount?.role === "interviewer",
    isCandidate: userAccount?.role === "candidate",
  };
};

export default useRoleCheck;

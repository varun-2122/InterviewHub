"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

// Fetches an authenticated video/chat token from GetStream API
export const getStreamToken = async (): Promise<string> => {
  const clerkProfile = await currentUser();

  if (!clerkProfile) {
    throw new Error("Access Denied: Session has expired or user is unauthenticated.");
  }

  const streamInstance = new StreamClient(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.STREAM_SECRET_KEY!
  );

  return streamInstance.generateUserToken({ user_id: clerkProfile.id });
};

"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/nextjs";

const convexUrl =
  process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder.convex.cloud";

// Valid Clerk publishable key format matching auth.config.ts domain
const clerkPublishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_c3Ryb25nLWdpcmFmZmUtMzIuY2xlcmsuYWNjb3VudHMuZGV2JA";

const clientInstance = new ConvexReactClient(convexUrl);

// Wrapper provider enabling Clerk authentication and Convex data sync queries
export function BackendProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ConvexProviderWithClerk client={clientInstance} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export default BackendProvider;

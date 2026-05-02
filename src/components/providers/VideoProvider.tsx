"use client";

import { ReactNode, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { Loader } from "../common/Loader";
import { getStreamToken } from "@/actions/streamAuth";

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const [streamReady, setStreamReady] = useState(false);
  const { user: clerkUser, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (!clerkUser) {
      setStreamReady(true);
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const isApiKeyPlaceholder = !apiKey || apiKey.startsWith("Your ") || apiKey === "";

    if (isApiKeyPlaceholder) {
      console.warn("Stream API key is not configured or is a placeholder. Video functionality will be disabled.");
      setStreamReady(true);
      return;
    }

    try {
      const setupStreamClient = new StreamVideoClient({
        apiKey: apiKey,
        user: {
          id: clerkUser.id,
          name: clerkUser.fullName || clerkUser.username || clerkUser.id,
          image: clerkUser.imageUrl,
        },
        tokenProvider: getStreamToken,
      });

      setVideoClient(setupStreamClient);
      setStreamReady(true);

      return () => {
        setupStreamClient.disconnectUser();
      };
    } catch (err) {
      console.error("Failed to initialize Stream Video Client:", err);
      setStreamReady(true);
    }
  }, [clerkUser, isLoaded]);

  if (!isLoaded || !streamReady) {
    return <Loader />;
  }

  if (!videoClient) {
    return <>{children}</>;
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default VideoProvider;

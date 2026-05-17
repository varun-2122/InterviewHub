import { useRouter } from "next/navigation";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";

// Navigation shortcuts for initializing and connecting to room workspaces
export const useMeetingActions = () => {
  const routerInstance = useRouter();
  const clientConnection = useStreamVideoClient();

  // Initializes an ad-hoc session on Stream and forwards the client browser
  const startInstantCall = async () => {
    if (!clientConnection) return;

    try {
      const roomUuid = crypto.randomUUID();
      const call = clientConnection.call("default", roomUuid);

      await call.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
          custom: {
            description: "Instant Session",
          },
        },
      });

      routerInstance.push(`/meeting/${call.id}`);
      toast.success("Workspace initialized successfully!");
    } catch (err) {
      console.error("Failed to boot instant workspace call:", err);
      toast.error("Failed to spin up workspace. Try reloading.");
    }
  };

  // Navigates user directly to a pre-defined meeting channel workspace
  const navigateToCall = (roomId: string) => {
    if (!clientConnection) {
      return toast.error("Client is disconnected. Refresh and try again.");
    }
    routerInstance.push(`/meeting/${roomId}`);
  };

  return { startInstantCall, navigateToCall };
};

export default useMeetingActions;

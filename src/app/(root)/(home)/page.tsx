"use client";

import ActionButton from "@/components/dashboard/ActionButton";
import { MENU_ACTIONS } from "@/constants/sessionConfig";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import StartMeetingModal from "@/components/meeting/StartMeetingModal";
import Loader from "@/components/common/Loader";
import { Loader2 } from "lucide-react";
import MeetingCard from "@/components/meeting/MeetingCard";

export default function Home() {
  const routerInstance = useRouter();

  const { isInterviewer, isCandidate, isRoleLoading } = useRoleCheck();
  const candidateMeetings = useQuery(api.meetings.fetchMyMeetings);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState<"start" | "join">();

  const handleMenuAction = (actionTitle: string) => {
    switch (actionTitle) {
      case "New Call":
        setActionType("start");
        setModalVisible(true);
        break;
      case "Join Interview":
        setActionType("join");
        setModalVisible(true);
        break;
      default:
        routerInstance.push(`/${actionTitle.toLowerCase()}`);
    }
  };

  if (isRoleLoading) {
    return <Loader />;
  }

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <div className="rounded-lg bg-card p-6 border shadow-sm mb-10">
        <h1 className="text-4xl font-bold font-heading text-foreground">
          Welcome back!
        </h1>
        <p className="text-muted-foreground mt-2">
          {isInterviewer
            ? "Manage your interviews and review candidates effectively"
            : "Access your upcoming interviews and preparations"}
        </p>
      </div>

      {isInterviewer ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MENU_ACTIONS.map((action) => (
              <ActionButton
                key={action.title}
                item={action}
                onPress={() => handleMenuAction(action.title)}
              />
            ))}
          </div>

          <StartMeetingModal
            isOpen={modalVisible}
            onClose={() => setModalVisible(false)}
            title={actionType === "join" ? "Join Meeting" : "Start Meeting"}
            isJoinMeeting={actionType === "join"}
          />
        </>
      ) : (
        <>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold">Your Interviews</h1>
            <p className="text-muted-foreground mt-1">View and join your scheduled interviews</p>
          </div>

          <div className="mt-8">
            {candidateMeetings === undefined ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : candidateMeetings.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {candidateMeetings.map((item: any) => (
                  <MeetingCard key={item._id} interview={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl p-8 bg-muted/10">
                You have no scheduled interviews at the moment.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
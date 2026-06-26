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
import CandidateDashboard from "@/components/dashboard/CandidateDashboard";
import LandingPage from "@/components/layout/LandingPage";
import { SignedIn, SignedOut } from "@clerk/nextjs";

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

  return (
    <>
      <SignedOut>
        <LandingPage />
      </SignedOut>

      <SignedIn>
        {isRoleLoading ? (
          <Loader />
        ) : isInterviewer ? (
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="glass-card rounded-xl p-6 border shadow-sm">
              <h1 className="text-3xl font-bold font-heading text-primary">
                Welcome back, Interviewer.
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Manage your interview sessions, start live calls, and review candidate evaluations.
              </p>
            </div>

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
          </div>
        ) : (
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <CandidateDashboard meetings={candidateMeetings} />
          </div>
        )}
      </SignedIn>
    </>
  );
}
"use client";

import Loader from "@/components/common/Loader";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import InterviewScheduleUI from "./InterviewScheduleUI";

function SchedulePage() {
  const routerInstance = useRouter();
  const { isInterviewer, isCandidate, isRoleLoading } = useRoleCheck();

  // Redirect candidates via useEffect — calling router.push during render is a React anti-pattern
  useEffect(() => {
    if (!isRoleLoading && isCandidate) {
      routerInstance.push("/");
    }
  }, [isRoleLoading, isCandidate, routerInstance]);

  if (isRoleLoading) {
    return <Loader />;
  }

  if (!isInterviewer) {
    return <Loader />;
  }

  return <InterviewScheduleUI />;
}

export default SchedulePage;
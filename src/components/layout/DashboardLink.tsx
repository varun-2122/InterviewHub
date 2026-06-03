"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Compass } from "lucide-react";
import { useRoleCheck } from "@/hooks/useRoleCheck";

// Navlink button to get back to recruiter dashboard, hidden for candidates
export function DashboardLink() {
  const { isCandidate, isRoleLoading } = useRoleCheck();

  if (isCandidate || isRoleLoading) {
    return null;
  }

  return (
    <Link href="/dashboard" passHref>
      <Button className="flex items-center gap-1.5 font-medium transition-all" size="sm">
        <Compass className="size-4" />
        <span>Dashboard</span>
      </Button>
    </Link>
  );
}

export default DashboardLink;

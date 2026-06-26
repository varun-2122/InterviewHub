"use client";

import { useUser } from "@clerk/nextjs";
import { Doc } from "../../../convex/_generated/dataModel";
import { format } from "date-fns";
import { useMeetingActions } from "@/hooks/useMeetingActions";
import { Sparkles, ArrowRight, CheckCircle2, Circle, Clock, ChevronRight, Video } from "lucide-react";
import { Button } from "../ui/button";

type MeetingDocument = Doc<"interviews">;

interface CandidateDashboardProps {
  meetings: MeetingDocument[] | undefined;
}

// Full Stitch UI Candidate Dashboard matching candidate_dashboard_desktop spec
export function CandidateDashboard({ meetings }: CandidateDashboardProps) {
  const { user } = useUser();
  const { navigateToCall } = useMeetingActions();

  const firstName = user?.firstName || user?.fullName || "Candidate";

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">
          Welcome back, {firstName}.
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here is your readiness snapshot for upcoming technical screens.
        </p>
      </header>

      {/* Top Section: Technical Readiness Score Glass Card */}
      <section className="glass-card rounded-xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-bold font-heading text-primary">
              Technical Readiness Score
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Your overall algorithm and system design proficiency based on recent practice modules and mock interviews. You are currently tracking above the 80th percentile for Senior Backend roles.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <div className="bg-muted/60 px-4 py-2 rounded-lg border border-border">
                <span className="label-caps text-muted-foreground block text-[10px] mb-0.5">Algorithms</span>
                <span className="font-bold text-sm text-primary">Solid</span>
              </div>
              <div className="bg-muted/60 px-4 py-2 rounded-lg border border-border">
                <span className="label-caps text-muted-foreground block text-[10px] mb-0.5">Sys Design</span>
                <span className="font-bold text-sm text-primary">Improving</span>
              </div>
            </div>
          </div>

          {/* SVG Circular Gauge */}
          <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-muted/40"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
              />
              <circle
                className="text-secondary transition-all duration-1000 ease-out"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="currentColor"
                strokeDasharray="251.2"
                strokeDashoffset="37.68"
                strokeWidth="8"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-heading text-primary">85</span>
              <span className="label-caps text-muted-foreground text-[10px] tracking-wider">/100</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid: AI Action Plan + Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: AI Action Plan */}
        <section className="glass-card rounded-xl p-6 border-l-4 border-l-secondary">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="size-5 text-secondary" />
            <h3 className="text-base font-bold font-heading text-primary">
              AI Action Plan
            </h3>
          </div>

          <ul className="space-y-3">
            <li className="flex items-start gap-3 bg-card p-3 rounded-lg border border-border shadow-sm">
              <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-foreground">
                  Review Graph Traversal (DFS/BFS)
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Struggled on optimization during last mock interview.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 bg-card p-3 rounded-lg border border-border shadow-sm">
              <Circle className="size-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-foreground">
                  System Design: Rate Limiting
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Recommended reading before your upcoming technical screen.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 bg-card p-3 rounded-lg border border-border shadow-sm">
              <Circle className="size-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-foreground">
                  Complete Dynamic Programming Set A
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  3 problems remaining to hit weekly goal.
                </p>
              </div>
            </li>
          </ul>
        </section>

        {/* Right Column: Upcoming Interviews */}
        <section className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold font-heading text-primary">
              Upcoming Interviews
            </h3>
            <span className="text-xs text-muted-foreground font-medium">
              {meetings ? `${meetings.length} Scheduled` : "Loading..."}
            </span>
          </div>

          <div className="space-y-3">
            {meetings === undefined ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Loading assigned interviews...
              </div>
            ) : meetings.length > 0 ? (
              meetings.map((item) => {
                const startTime = new Date(item.startTime);
                const monthStr = format(startTime, "MMM");
                const dayStr = format(startTime, "dd");
                const timeRange = format(startTime, "h:mm a");

                return (
                  <div
                    key={item._id}
                    className="flex gap-4 items-center p-3 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors group cursor-pointer"
                    onClick={() => navigateToCall(item.streamCallId)}
                  >
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-lg shrink-0 font-heading">
                      <span className="text-[10px] font-bold uppercase tracking-wider">{monthStr}</span>
                      <span className="text-base font-bold leading-none">{dayStr}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="size-3.5" />
                        <span>{timeRange}</span>
                      </p>
                    </div>

                    <Button size="sm" className="gap-1.5 text-xs font-semibold">
                      <Video className="size-3.5" />
                      <span>Join</span>
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-xs text-muted-foreground border border-dashed rounded-lg p-6 bg-muted/20">
                No upcoming interviews scheduled.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Bottom Section: Recent Practice Results Table */}
      <section className="glass-card rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="text-base font-bold font-heading text-primary">
            Recent Practice Results
          </h3>
          <button className="text-xs font-semibold text-secondary flex items-center gap-1 hover:underline">
            View All <ChevronRight className="size-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b border-border label-caps text-muted-foreground">
                <th className="px-6 py-3 font-semibold">Module / Topic</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Performance</th>
                <th className="px-6 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-semibold text-foreground">Binary Tree Inversion (Hard)</td>
                <td className="px-6 py-4 text-muted-foreground">Today, 9:45 AM</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span className="font-medium text-foreground">Optimal (O(n))</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-secondary font-semibold hover:underline">Review Code</button>
                </td>
              </tr>

              <tr className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-semibold text-foreground">LRU Cache Implementation</td>
                <td className="px-6 py-4 text-muted-foreground">Yesterday</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-500" />
                    <span className="font-medium text-foreground">Sub-optimal (Time limit)</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-secondary font-semibold hover:underline">Retry</button>
                </td>
              </tr>

              <tr className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-semibold text-foreground">Mock Interview: Arrays & Strings</td>
                <td className="px-6 py-4 text-muted-foreground">Oct 10, 2023</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span className="font-medium text-foreground">Passed (Score: 92/100)</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-secondary font-semibold hover:underline">Feedback</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default CandidateDashboard;

import Link from "next/link";
import { Terminal, Code2, Video, BarChart3, ArrowRight, CheckCircle } from "lucide-react";

// Public landing page content for unauthenticated visitors.
// Design follows the Stitch "Synthetic Intelligence Recruitment Interface" spec:
// - Hero with headline + CTA
// - Feature cards: Live Coding, AI Behavioral, Readiness Score (as previews)
// - Clean, minimal, focus-first aesthetic with high contrast in dark mode
export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide">
              <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Precision Recruitment System
            </div>

            <h1 className="font-heading text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
              Master the technical interview with{" "}
              <span className="text-cyan-400">real-time collaboration.</span>
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-md">
              High-signal, low-noise assessment environments designed for top
              technical talent. Live coding, video, and structured evaluation — all in one workspace.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground text-sm font-bold px-6 py-3 rounded hover:opacity-90 transition-opacity shadow-md"
              >
                GET STARTED
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center gap-2 border border-border bg-card text-foreground text-sm font-semibold px-6 py-3 rounded hover:bg-muted transition-colors"
              >
                Sign in to your account
              </Link>
            </div>
          </div>

          {/* Right: AI Proctor Preview Card */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full max-w-sm glass-card border border-cyan-500/30 rounded-xl p-8 flex flex-col items-center gap-4 shadow-xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 size-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="size-16 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center relative">
                <BarChart3 className="size-8 text-cyan-400" />
                <span className="absolute -top-1 -right-1 size-3 rounded-full bg-cyan-400 border-2 border-background" />
              </div>
              
              <div className="text-center space-y-1">
                <p className="font-heading font-bold text-foreground text-base">AI Proctor Active</p>
                <p className="text-xs text-muted-foreground label-caps tracking-wider">Monitoring signal clarity...</p>
              </div>

              <div className="w-full bg-muted/40 border border-border rounded-lg p-3 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <CheckCircle className="size-3.5 text-cyan-400" />
                  <span>Camera feed: stable</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <CheckCircle className="size-3.5 text-cyan-400" />
                  <span>Audio input: detected</span>
                </div>
                <div className="flex items-center gap-2 text-xs pt-1 border-t border-border/50">
                  <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="label-caps text-cyan-400 font-mono text-[11px]">AI ANALYZING RESPONSE...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Cards ───────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 — Live Coding */}
          <div className="glass-card rounded-xl p-6 space-y-4 shadow-sm hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center gap-2">
              <Code2 className="size-5 text-cyan-400" />
              <h3 className="font-heading font-bold text-foreground text-lg">Live Coding</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Execute in a zero-latency sandbox. Practice algorithmic challenges
              in an environment mirroring tier-1 tech interviews.
            </p>
            {/* Code preview matching Stitch design */}
            <div className="bg-muted/50 border border-border rounded-lg p-3 font-mono text-xs space-y-1">
              <div className="text-muted-foreground text-[11px]">solution.py</div>
              <div>
                <span className="text-cyan-400 font-semibold">def</span>{" "}
                <span className="text-foreground">solve</span>
                <span className="text-muted-foreground">():</span>
              </div>
              <div className="pl-4 text-muted-foreground"># your code here</div>
              <div className="pl-4">
                <span className="text-cyan-400 font-semibold">return</span>{" "}
                <span className="text-emerald-400">True</span>
              </div>
            </div>
          </div>

          {/* Card 2 — AI Behavioral */}
          <div className="glass-card rounded-xl p-6 space-y-4 border border-cyan-500/30 shadow-sm hover:border-cyan-500/60 transition-colors">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5 text-cyan-400" />
              <h3 className="font-heading font-bold text-foreground text-lg">AI Behavioral</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get actionable feedback on pacing, tone, and structured
              communication (STAR method) powered by advanced natural language
              models.
            </p>
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex items-center gap-2">
              <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="label-caps text-xs text-cyan-400 font-semibold">AI ANALYZING RESPONSE...</span>
            </div>
          </div>

          {/* Card 3 — Readiness Score */}
          <div className="glass-card rounded-xl p-6 space-y-4 shadow-sm hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5 text-cyan-400" />
              <h3 className="font-heading font-bold text-foreground text-lg">Readiness Score</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A proprietary metric quantifying your interview probability across
              algorithms, system design, and behavioral axes.
            </p>
            <div className="flex items-center justify-center pt-2">
              <div className="w-24 h-24 rounded-xl border-2 border-cyan-400 bg-cyan-500/10 flex flex-col items-center justify-center">
                <span className="font-heading text-3xl font-extrabold text-foreground">94</span>
                <span className="label-caps text-cyan-400 text-[10px] tracking-wider mt-0.5">TARGET</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────── */}
      <section className="border-t border-border bg-muted/20 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-10">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            How InterviewHub works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Video className="size-5 text-cyan-400" />,
                step: "01",
                title: "Schedule a session",
                desc: "Interviewers create and schedule live interview sessions. Candidates receive instant access.",
              },
              {
                icon: <Code2 className="size-5 text-cyan-400" />,
                step: "02",
                title: "Code together, live",
                desc: "Candidates and interviewers share a real-time code editor alongside HD video.",
              },
              {
                icon: <BarChart3 className="size-5 text-cyan-400" />,
                step: "03",
                title: "Evaluate & decide",
                desc: "Interviewers leave structured ratings and notes. Mark outcomes with one click.",
              },
            ].map((item) => (
              <div key={item.step} className="space-y-3 text-left glass-card p-6 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="label-caps text-cyan-400 font-bold text-sm">{item.step}</span>
                  <div className="size-8 rounded bg-cyan-500/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <h3 className="font-heading font-bold text-foreground text-base">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Footer ──────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-xl mx-auto px-6 text-center space-y-6">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Ready to run better interviews?
          </h2>
          <p className="text-muted-foreground text-sm">
            Join as an interviewer to start scheduling, or sign in to continue your session.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground text-sm font-bold px-8 py-3 rounded hover:opacity-90 transition-opacity shadow-md"
          >
            GET STARTED
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Terminal className="size-3.5 text-cyan-400" />
            <span className="font-heading font-bold text-foreground">InterviewHub</span>
          </div>
          <span>Precision Recruitment System · Technical Assessment Workspace</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

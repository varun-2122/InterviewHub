# InterviewHub

> A real-time technical interview platform for structured live coding sessions.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Convex](https://img.shields.io/badge/Convex-1.24-orange?logo=convex)](https://convex.dev)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-purple?logo=clerk)](https://clerk.com)
[![Stream](https://img.shields.io/badge/Stream-Video-blue)](https://getstream.io)

---

## Overview

InterviewHub is a **two-sided technical interview platform** for companies running live coding assessments. It provides a shared workspace where interviewers and candidates can collaborate in real-time across video, audio, and a synchronized code editor — all in a single session.

**Interviewers** schedule sessions, start video rooms, set coding challenges, and leave structured evaluations. **Candidates** receive access to their assigned interviews and join when ready.

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Live Coding Workspace** | Resizable split-panel: video call (left) + Monaco code editor (right) |
| **Multi-language Support** | JavaScript, Python, and Java with per-challenge starter templates |
| **Pre-call Setup Screen** | Camera and microphone preview before entering a session |
| **Interview Scheduling** | Interviewers create sessions with date/time/candidate/co-interviewer selection |
| **Instant Call** | Start an ad-hoc session instantly without pre-scheduling |
| **Role-based Access** | Separate UX flows for `interviewer` and `candidate` roles |
| **Structured Evaluation** | Star ratings and written feedback per interview session |
| **Outcome Marking** | Pass / Fail decisions after completed interviews |
| **Recording Playback** | View and share past session recordings from Stream |
| **Dark / Light Theme** | System-aware theme toggle |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │  Next.js 14  │  │ Clerk (Auth) │  │  Stream Video SDK      │ │
│  │  App Router  │  │  UserButton  │  │  (WebRTC video/audio)  │ │
│  └──────┬───────┘  └──────┬───────┘  └────────────┬───────────┘ │
└─────────┼─────────────────┼───────────────────────┼─────────────┘
          │ Convex queries  │ JWT token             │ Token
          ▼                 ▼                       ▼
┌─────────────────┐  ┌──────────────┐  ┌───────────────────────┐
│  Convex Backend │  │ Clerk Cloud  │  │  Stream Cloud (Video) │
│  (Real-time DB) │  │  (User auth) │  │  (WebRTC + Recording) │
│                 │  │              │  └───────────────────────┘
│  • users        │  │  Webhook     │
│  • interviews   │──│──(svix)──►  │  ┌───────────────────────┐
│  • comments     │  │  user.created│  │  Next.js Server Action│
└─────────────────┘  └──────────────┘  │  /actions/streamAuth  │
                                        │  (generates Stream    │
                                        │   user tokens)        │
                                        └───────────────────────┘
```

**Key Architectural Points:**
- **Convex** serves as the real-time database and serverless backend — no separate Express/REST API layer
- **Clerk** handles all authentication; user records sync to Convex via a `user.created` webhook (using Svix signature verification)
- **Stream Video** manages WebRTC infrastructure; the Next.js server action generates user tokens to authenticate with Stream
- **No traditional REST API** — all data access is via Convex queries/mutations (auto-subscribed for real-time updates)

---

## Request Flow

```
User visits /meeting/:id
      │
      ▼
middleware.ts (clerkMiddleware)
      │ — checks session token
      │
  Authenticated? ──No──► LandingPage (sign-in prompt)
      │
     Yes
      │
      ▼
VideoProvider
  └── getStreamToken() [Server Action]
        ├── currentUser() [Clerk]
        └── StreamClient.generateUserToken()
      │
      ▼
useActiveMeeting(id)
  └── StreamClient.queryCalls({ id })
      │
      ▼
SetupScreen (camera/mic check)
      │ onSetupComplete
      ▼
MeetingConsole
  ├── Stream Video Panel (SpeakerLayout / PaginatedGridLayout)
  └── CodeWorkspace Panel (Monaco Editor + challenge selector)
```

---

## Core Workflows

### Interview Scheduling
```
Interviewer clicks "Schedule" on home dashboard
      │
      ▼
InterviewScheduleUI dialog opens
  ├── Selects candidate (from Convex users where role=candidate)
  ├── Selects co-interviewers (from Convex users where role=interviewer)
  ├── Picks date from calendar + time from 30-min slot selector
  └── Clicks "Schedule Interview"
      │
      ▼
StreamClient.call("default", uuid).getOrCreate()   ← creates Stream room
      │
      ▼
Convex: scheduleMeeting mutation                    ← persists to DB
  • title, description, startTime
  • streamCallId (links to Stream room)
  • candidateId, interviewerIds
      │
      ▼
Candidate's home page auto-updates (Convex real-time)
showing new MeetingCard with status "Scheduled"
```

### Post-Interview Evaluation
```
Interview ends: EndCallButton (interviewer only)
  │
  ├── Stream: call.endCall()
  └── Convex: changeMeetingStatus(id, "completed")
        │
        ▼
Admin Dashboard refreshes (Convex real-time)
  │
  ├── Interviewer clicks "Pass" / "Fail"
  │     └── Convex: changeMeetingStatus(id, "succeeded" | "failed")
  │
  └── Interviewer opens FeedbackModal
        ├── Views existing evaluation notes
        └── Submits new rating (1-5) + written feedback
              └── Convex: postEvaluationNote mutation
```

---

## Database Design

```
┌─────────────────────────────────────────────────────────────┐
│                         users                               │
│ _id (ConvexId)                                              │
│ clerkId       STRING   INDEX: by_clerk_id                   │
│ name          STRING                                        │
│ email         STRING                                        │
│ image         STRING?                                       │
│ role          "candidate" | "interviewer"                   │
└─────────────────────┬───────────────────────────────────────┘
                      │ candidateId / interviewerIds (Clerk IDs)
┌─────────────────────▼───────────────────────────────────────┐
│                      interviews                             │
│ _id (ConvexId)                                              │
│ title         STRING                                        │
│ description   STRING?                                       │
│ startTime     NUMBER  (Unix ms)                             │
│ endTime       NUMBER? (set when status → "completed")       │
│ status        "upcoming" | "completed" | "succeeded"        │
│               | "failed"                                    │
│ streamCallId  STRING   INDEX: by_stream_call_id             │
│ candidateId   STRING   INDEX: by_candidate_id               │
│ interviewerIds STRING[]                                     │
└─────────────────────┬───────────────────────────────────────┘
                      │ interviewId
┌─────────────────────▼───────────────────────────────────────┐
│                       comments                              │
│ _id (ConvexId)                                              │
│ interviewId   Id<"interviews">  INDEX: by_interview_id      │
│ interviewerId STRING  (Clerk user ID)                       │
│ content       STRING                                        │
│ rating        NUMBER  (1–5)                                 │
│ _creationTime NUMBER  (auto-set by Convex)                  │
└─────────────────────────────────────────────────────────────┘
```

**Note:** Users reference each other via Clerk user IDs (strings), not Convex document IDs. This is because Stream Video uses Clerk IDs as its user identifiers, so string-based references keep the system consistent across all three services.

---

## API Reference

InterviewHub uses Convex queries and mutations rather than a traditional REST API.

### Convex Queries

| Function | Auth Required | Role Required | Description |
|----------|--------------|---------------|-------------|
| `meetings.fetchMeetingsList` | ✅ | Interviewer | All interviews in the system |
| `meetings.fetchMyMeetings` | ✅ | Any | Interviews where current user is candidate |
| `meetings.fetchMeetingByCallId` | ✅ | Any | Single interview by Stream call ID |
| `accounts.fetchAllProfiles` | ✅ | Any | All registered user profiles |
| `accounts.fetchProfileByClerkId` | — | — | Single user by Clerk ID |
| `notes.fetchEvaluationNotes` | ✅ | Any | Comments for a specific interview |

### Convex Mutations

| Function | Auth Required | Role Required | Description |
|----------|--------------|---------------|-------------|
| `meetings.scheduleMeeting` | ✅ | Interviewer | Create a new scheduled interview |
| `meetings.changeMeetingStatus` | ✅ | Interviewer (assigned) | Update interview status |
| `accounts.syncUserProfile` | — | — | Upsert user record (called by webhook) |
| `notes.postEvaluationNote` | ✅ | Interviewer (assigned) | Submit feedback for an interview |

### HTTP Endpoints (Convex)

| Path | Method | Description |
|------|--------|-------------|
| `/clerk-webhook` | `POST` | Receives `user.created` events from Clerk. Verified via Svix HMAC. Calls `syncUserProfile` mutation. |

### Next.js Server Actions

| Function | Description |
|----------|-------------|
| `getStreamToken()` | Generates a Stream Video user token for the authenticated Clerk user |

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14 | React framework (App Router) |
| TypeScript | 5 | Type safety |
| Convex | 1.24 | Real-time database + serverless backend |
| Clerk | 6 | Authentication, user management |
| Stream Video React SDK | 1.17 | WebRTC video/audio, recordings |
| Monaco Editor | 4.7 | VS Code-quality code editor in browser |
| shadcn/ui | — | Radix UI primitive components |
| Tailwind CSS | 3.4 | Utility-first CSS |
| Svix | 1.65 | Webhook signature verification |
| date-fns | 2.30 | Date formatting and computation |
| react-hot-toast | 2.5 | Toast notifications |
| react-resizable-panels | 3.0 | Resizable split-panel workspace |

---

## Project Structure

```
InterviewHub/
├── convex/                     # Convex backend (serverless functions + schema)
│   ├── schema.ts               # Database schema: users, interviews, comments
│   ├── accounts.ts             # User profile queries/mutations
│   ├── meetings.ts             # Interview scheduling + status queries/mutations
│   ├── notes.ts                # Evaluation feedback queries/mutations
│   ├── webhooks.ts             # Clerk webhook handler (user.created)
│   └── auth.config.ts          # Convex ↔ Clerk auth configuration
│
├── src/
│   ├── actions/
│   │   └── streamAuth.ts       # Server action: generate Stream user token
│   │
│   ├── app/
│   │   ├── layout.tsx          # Root layout: Clerk + Convex providers, Navbar
│   │   ├── globals.css         # Design system tokens (colors, fonts, shadows)
│   │   ├── (root)/             # Authenticated app routes
│   │   │   ├── (home)/page.tsx # Home dashboard (role-branched: interviewer/candidate)
│   │   │   ├── schedule/       # Interview scheduling page (interviewer only)
│   │   │   ├── recordings/     # Session recording playback
│   │   │   └── meeting/[id]/   # Live meeting room (setup → console)
│   │   └── (admin)/
│   │       └── dashboard/      # Admin dashboard: all interviews, pass/fail, feedback
│   │
│   ├── components/
│   │   ├── common/Loader.tsx         # Full-screen loading spinner
│   │   ├── dashboard/ActionButton.tsx # Interviewer home action cards
│   │   ├── editor/CodeWorkspace.tsx  # Monaco editor + challenge selector
│   │   ├── feedback/FeedbackModal.tsx # Star rating + comment dialog
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Top navigation bar
│   │   │   ├── DashboardLink.tsx     # Interviewer-only dashboard nav link
│   │   │   └── LandingPage.tsx       # Public marketing page
│   │   ├── meeting/
│   │   │   ├── MeetingCard.tsx       # Interview card for candidate home
│   │   │   ├── MeetingConsole.tsx    # Live meeting room UI
│   │   │   ├── SetupScreen.tsx       # Pre-call camera/mic setup
│   │   │   ├── StartMeetingModal.tsx # Instant/join meeting dialog
│   │   │   └── EndCallButton.tsx     # Terminate session (interviewer only)
│   │   ├── providers/
│   │   │   ├── BackendProvider.tsx   # Clerk + Convex provider wrapper
│   │   │   └── VideoProvider.tsx     # Stream Video client provider
│   │   ├── recording/RecordingCard.tsx # Recording playback card
│   │   ├── theme/ThemeWrapper.tsx    # next-themes dark/light provider
│   │   └── user/UserDisplay.tsx      # Avatar + name display component
│   │
│   ├── constants/
│   │   └── sessionConfig.ts    # Challenge list, language config, status maps, menu actions
│   │
│   ├── hooks/
│   │   ├── useActiveMeeting.ts # Fetch a Stream call by ID
│   │   ├── useMeetingActions.ts # Start instant call / navigate to call
│   │   ├── useRoleCheck.ts     # Check current user's role from Convex
│   │   └── useUserMeetings.ts  # Fetch all Stream calls for current user
│   │
│   ├── lib/
│   │   ├── coreUtils.ts        # groupMeetingsByStatus, resolveUserInfo, getMeetingLiveStatus
│   │   └── utils.ts            # cn() helper (clsx + tailwind-merge)
│   │
│   └── middleware.ts           # Clerk auth middleware (protects all routes)
│
├── public/
│   ├── javascript.png          # Language icon for code editor selector
│   ├── python.png
│   └── java.png
│
├── .env.example                # Template for required environment variables
├── tailwind.config.ts          # Design system tokens: colors, fonts, radius, shadows
└── next.config.mjs             # Next.js configuration
```

---

## Setup

### Prerequisites

- Node.js 18+
- A [Clerk](https://clerk.com) account
- A [Convex](https://convex.dev) account
- A [Stream](https://getstream.io) account (Video product)

### 1. Clone and install

```bash
git clone https://github.com/varun-2122/InterviewHub.git
cd InterviewHub
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
# Then fill in your actual keys — see .env.example for instructions
```

### 3. Start the Convex backend

```bash
npx convex dev
# This starts a local Convex dev server and sets NEXT_PUBLIC_CONVEX_URL in .env.local
```

### 4. Configure the Clerk webhook

In your [Clerk Dashboard](https://dashboard.clerk.com):
1. Go to **Webhooks** → **Add Endpoint**
2. Set URL to: `https://<your-convex-url>/clerk-webhook`  
   *(get your Convex URL from the Convex dashboard or `.env.local`)*
3. Subscribe to the `user.created` event
4. Copy the **Signing Secret** → paste as `CLERK_WEBHOOK_SECRET` in `.env.local`

### 5. Set user roles

By default, all newly signed-up users are created with `role: "candidate"`. To grant interviewer access, update the role directly in the Convex dashboard:
1. Go to your Convex project dashboard → **Data** → `users`
2. Find the user record and set `role` to `"interviewer"`

### 6. Start the development server

```bash
npm run dev
# Open http://localhost:3000
```

---

## Configuration

All configuration is via environment variables. See [`.env.example`](./.env.example) for the complete list.

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk public key (safe for browser) |
| `CLERK_SECRET_KEY` | ✅ | Clerk secret key (server-side only) |
| `CLERK_WEBHOOK_SECRET` | ✅ | Svix signing secret for webhook verification |
| `NEXT_PUBLIC_CONVEX_URL` | ✅ | Convex deployment HTTPS URL |
| `NEXT_PUBLIC_STREAM_API_KEY` | ✅ | Stream Video public API key |
| `STREAM_SECRET_KEY` | ✅ | Stream Video secret key (server-side only) |

---

## Engineering Decisions

### Why Convex instead of a custom REST API?
Convex provides real-time query subscriptions out of the box. When an interviewer schedules a new interview, the candidate's home page updates immediately without polling — this is a core UX requirement. Building this with a traditional REST API + WebSocket layer would have required significantly more infrastructure.

### Why Clerk for authentication?
Clerk handles the full auth lifecycle (sign-up, sign-in, session management, user webhooks) with minimal configuration. The webhook integration (`user.created` → Convex `syncUserProfile`) keeps the user database in sync without custom auth logic. Stream Video also accepts Clerk user IDs directly, which simplifies token management.

### Why String-based Clerk IDs as foreign keys?
Users are referenced by their Clerk ID (`clerkId`) rather than Convex document IDs (`_id`) in the `interviews` and `comments` tables. This is intentional: Stream Video uses Clerk IDs as its user identifiers, so using Clerk IDs as the cross-system key keeps all three services consistent.

### Why Monaco Editor for the code workspace?
Monaco is the same editor that powers VS Code — it provides first-class multi-language support (syntax highlighting, IntelliSense, bracket matching) without custom implementation. The `@monaco-editor/react` wrapper handles SSR edge cases in Next.js automatically.

### Coding challenges as static config
The 3 coding challenges (Two Sum, Reverse String, Palindrome Number) are defined in `sessionConfig.ts` as static data. This was a deliberate scoping choice: the challenge set is small and well-defined for MVP. A production system would store challenges in the database with difficulty ratings and topic tags.

---

## Challenges & Solutions

### Challenge: Keeping three services in sync (Clerk, Convex, Stream)
When a user signs up via Clerk, their profile needs to exist in Convex (for role management) and Stream (for video identity). Solution: Clerk fires a `user.created` webhook to a Convex HTTP action, which upserts the user into the Convex `users` table with `role: "candidate"`. Stream identity is established lazily via the `getStreamToken` server action when the user first enters a video room.

### Challenge: Role-based UI without a backend session
The app shows different UX for interviewers vs. candidates. Since Next.js App Router can't easily access Convex on the server without additional setup, role checking is done client-side via `useRoleCheck` (which queries `accounts.fetchProfileByClerkId`). A loading state prevents flash of wrong content.

### Challenge: Linking Stream calls to Convex interviews
Stream Video calls are identified by arbitrary UUIDs on Stream's infrastructure. Convex interviews need to reference the same session. The solution: generate a `crypto.randomUUID()` when creating the interview, use it as both the Stream call ID and store it as `streamCallId` in Convex. This allows bidirectional lookup: meeting page loads the Stream call by ID, and the `EndCallButton` fetches the Convex interview by `streamCallId`.

---

## Roadmap

### ✅ Completed
- Clerk authentication (sign-in, sign-up, session management)
- User role system (candidate / interviewer)
- Real-time interview scheduling with candidate + interviewer selection
- Live video + audio via Stream WebRTC
- Resizable split-panel: video (left) + code editor (right)
- Monaco code editor with JS/Python/Java support and 3 starter challenges
- Pre-call setup screen (camera/mic toggle)
- Instant ad-hoc call (no schedule required)
- Join by meeting ID or link
- Post-interview evaluation (star rating + written feedback)
- Pass / Fail outcome marking
- Admin dashboard with all interviews grouped by status
- Session recording playback
- Dark / light theme support
- Public landing page for unauthenticated visitors
- `.env.example` with full configuration documentation

### 🚧 In Progress / Near-term
- Role assignment UI (currently requires manual Convex dashboard edit)
- More coding challenges (currently 3)

### 📌 Planned
- AI behavioral analysis (real-time STAR method feedback)
- Readiness score / candidate analytics dashboard
- Code Library section (searchable problem bank)
- Mobile-responsive bottom navigation bar
- Email notifications for scheduled interviews
- Candidate self-scheduling (request an interview slot)
- Multi-language code execution (sandbox run)

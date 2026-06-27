# Changelog

All notable changes to InterviewHub are documented here.

> **Note:** This changelog reflects what was actually built and shipped.
> Features listed in the [Roadmap](./README.md) section of the README
> are planned but not yet implemented.

---

## [Unreleased]

### Added
- Real-time synchronized code editor — editor content, language selection, and challenge
  are now synced live across all participants in a call via Convex `editorState` table
- `convex/codeSync.ts` — `getEditorState` query + `upsertEditorState` mutation with
  echo-suppression (writes from the local user are not applied back to their own editor)
- `convex/lib.ts` — shared auth helpers (`requireAuth`, `requireUser`, `requireInterviewer`,
  `requireMeetingParticipant`) used consistently across all Convex functions
- `meetings.cancelScheduledMeeting` — mutation for atomic scheduling rollback when Stream
  call creation fails after a successful Convex write
- `Live` badge on the code editor panel when sync is active
- GitHub Actions CI workflow (`.github/workflows/ci.yml`) — runs lint, typecheck, and build
  on every push/PR to main

### Fixed
- **Authorization gaps in Convex queries:**
  - `fetchAllProfiles` restricted to interviewer-only (previously any authenticated user
    could enumerate all users' emails and avatars)
  - `fetchProfileByClerkId` now requires authentication; candidates may only look up their
    own profile; interviewers may look up any profile
  - `fetchMeetingByCallId` now requires authentication (previously unauthenticated)
  - `fetchEvaluationNotes` now requires the requester to be the candidate or an assigned
    interviewer — prevents reading another candidate's private feedback
- **Atomic scheduling:** Convex `scheduleMeeting` now runs before Stream `call.getOrCreate`;
  if Convex validation fails (past date, missing candidate, etc.) no Stream call is created;
  if Stream fails after a successful Convex write, the Convex record is rolled back via
  `cancelScheduledMeeting`
- **Dashboard route guard:** `/dashboard` now redirects candidates cleanly (same pattern as
  `/schedule`) instead of throwing an unhandled Convex error with no error boundary
- **Schedule error messages:** the real Convex validation error is now surfaced in the toast
  instead of a generic "Could not schedule" fallback
- **Schema type safety:** `interviews.status` changed from `v.string()` to a closed
  `v.union(v.literal(...))` — invalid status values are now rejected at the DB layer
- **Hardcoded Clerk publishable key fallback removed:** `layout.tsx` now fails fast with a
  descriptive error if `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is missing instead of silently
  authenticating against the original project's Clerk instance
- **`/schedule` page infinite loader on reload** — fixed by skipping the Convex query until
  Clerk is fully hydrated (`isLoaded` check + `"skip"` argument)
- **Navbar logo truncation** — removed `truncate max-w-[120px]` classes so "InterviewHub"
  always renders in full

---

## What Is Actually Built

| Feature | Status |
|---------|--------|
| Clerk authentication (sign-up/in, sessions, webhooks) | ✅ Fully implemented |
| Role system (candidate / interviewer), manual promotion | ✅ Implemented |
| Interview scheduling with validation | ✅ Implemented |
| Live video + audio (Stream WebRTC) | ✅ Implemented |
| Synchronized code editor (Convex real-time) | ✅ Implemented |
| Multi-language editor (JS / Python / Java) | ✅ Implemented |
| Structured feedback — star rating + written notes | ✅ Implemented |
| Pass / Fail outcome marking | ✅ Implemented |
| Recording playback (Stream recordings API) | ✅ Implemented |
| Dark / light theme | ✅ Implemented |
| Admin dashboard (interviewer-only with route guard) | ✅ Implemented |
| Code execution / test runner | 🔴 Not implemented (planned) |
| AI behavioral analysis / STAR feedback | 🔴 Not implemented (planned) |
| In-app interviewer role promotion | 🔴 Not implemented (planned) |
| Automated test suite | 🔴 Not implemented (planned) |

### 2026-06-24 17:49 - refactor: consolidate API utility functions

### 2026-06-24 17:50 - fix: patch security headers in middleware

### 2026-06-25 18:19 - feat: add interview feedback templates

### 2026-06-27 12:54 - docs: add environment variable guide

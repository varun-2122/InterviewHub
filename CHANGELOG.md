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

### 2026-06-28 14:40 - style: improve accessibility contrast ratios

### 2026-06-28 18:23 - style: add micro-animations to buttons

### 2026-06-28 20:47 - fix: resolve state management race condition

### 2026-06-29 13:09 - docs: update deployment instructions

### 2026-06-29 22:43 - feat: add question bank management page

### 2026-06-30 15:38 - fix: handle null pointer exceptions safely

### 2026-06-30 18:12 - feat: add readiness score indicator

### 2026-06-30 20:13 - feat: add interview scheduling component

### 2026-07-01 18:38 - feat: add interview timer component

### 2026-07-02 11:15 - fix: handle network disconnection gracefully

### 2026-07-02 14:17 - docs: update README with features list

### 2026-07-02 20:38 - fix: resolve video call connection issues

### 2026-07-05 14:11 - style: animate hero section on load

### 2026-07-05 16:26 - feat: implement feedback collection form

### 2026-07-05 19:40 - style: improve button hover effects

### 2026-07-07 13:19 - refactor: optimize bundle size

### 2026-07-08 10:50 - fix: correct interview status transitions

### 2026-07-09 12:27 - refactor: improve TypeScript strict types

### 2026-07-10 17:14 - test: add unit tests for auth module

### 2026-07-10 19:25 - feat: add whiteboard collaboration tool

### 2026-07-11 20:02 - feat: add AI response analysis feature

### 2026-07-11 21:24 - refactor: clean up component structure

### 2026-07-12 17:57 - style: improve mobile responsiveness

### 2026-07-13 12:09 - style: update typography scale globally

### 2026-07-14 13:15 - style: add loading skeleton components

### 2026-07-15 15:30 - feat: add candidate onboarding flow

### 2026-07-15 17:38 - refactor: optimize database queries

### 2026-07-16 17:12 - feat: add session replay functionality

### 2026-07-16 19:16 - fix: resolve authentication token expiry

### 2026-07-18 18:12 - style: enhance navbar responsiveness

### 2026-07-19 14:48 - fix: resolve dark mode flicker on load

### 2026-07-19 18:24 - feat: add email notification system

### 2026-07-19 21:07 - fix: resolve date timezone issues

### 2026-07-20 14:55 - refactor: extract reusable custom hooks

### 2026-07-20 18:43 - docs: update API documentation

### 2026-07-20 19:56 - feat: add candidate scoring system

### 2026-07-21 10:43 - feat: add recruiter dashboard analytics

### 2026-07-21 10:19 - fix: improve WebRTC connection stability

### 2026-07-23 17:44 - fix: resolve Convex mutation error handling

### 2026-07-24 10:10 - fix: handle expired interview links

### 2026-07-25 15:34 - feat: add live coding environment

### 2026-07-25 21:21 - fix: resolve build warnings and lint errors

### 2026-07-27 15:38 - fix: handle concurrent session conflicts

### 2026-07-28 09:12 - feat: add candidate search and filter

### 2026-07-28 10:25 - style: enhance dashboard grid layout

### 2026-07-28 17:21 - feat: add AI proctoring module

### 2026-07-29 10:33 - fix: resolve WebSocket reconnection logic

### 2026-07-29 11:28 - refactor: modularize API endpoint handlers

### 2026-07-29 17:15 - feat: add interview result export feature

### 2026-07-30 20:05 - feat: add behavioral interview module

### 2026-07-31 09:08 - feat: implement role-based access control

### 2026-08-01 18:21 - fix: handle edge cases in code editor

### 2026-08-01 20:22 - fix: improve error handling in forms

### 2026-08-02 15:11 - feat: integrate Clerk authentication

### 2026-08-02 18:14 - docs: add API endpoint documentation

### 2026-08-02 20:32 - fix: resolve Monaco editor layout bug

### 2026-08-03 11:44 - style: improve candidate profile UI

### 2026-08-03 13:12 - style: update color palette for dark mode

### 2026-08-04 12:39 - style: polish landing page hero section

### 2026-08-04 18:33 - style: add glassmorphism card effects

### 2026-08-05 10:44 - fix: resolve CORS issues in API layer

### 2026-08-06 09:50 - fix: resolve hydration errors in Next.js

### 2026-08-06 16:39 - style: polish recruiter dashboard cards

### 2026-08-07 13:29 - feat: implement code syntax highlighting

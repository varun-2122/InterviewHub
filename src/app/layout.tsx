import type { Metadata } from "next";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./globals.css";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import BackendProvider from "@/components/providers/BackendProvider";
import Navbar from "@/components/layout/Navbar";
import ThemeWrapper from "@/components/theme/ThemeWrapper";
import LandingPage from "@/components/layout/LandingPage";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "InterviewHub — Technical Assessment Workspace",
  description:
    "High-signal, low-noise live coding interview platform for technical talent. " +
    "Real-time collaborative workspace with video, code editor, and structured evaluation.",
  keywords: ["technical interview", "live coding", "collaborative workspace", "recruitment platform"],
  openGraph: {
    title: "InterviewHub — Technical Assessment Workspace",
    description: "Real-time collaborative live coding interview platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BackendProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased font-sans">
          <ThemeWrapper
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Authenticated users see the app shell (navbar + content) */}
            <SignedIn>
              <div className="min-h-screen">
                <Navbar />
                <main className="px-4 sm:px-6 lg:px-8">{children}</main>
              </div>
            </SignedIn>

            {/* Unauthenticated visitors see the landing page instead of an immediate redirect */}
            <SignedOut>
              <LandingPage />
            </SignedOut>

            <Toaster
              toastOptions={{
                style: {
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: "0.875rem",
                },
              }}
            />
          </ThemeWrapper>
        </body>
      </html>
    </BackendProvider>
  );
}
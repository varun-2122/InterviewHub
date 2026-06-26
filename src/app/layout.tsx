import type { Metadata } from "next";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import BackendProvider from "@/components/providers/BackendProvider";
import Navbar from "@/components/layout/Navbar";
import ThemeWrapper from "@/components/theme/ThemeWrapper";
import { Toaster } from "react-hot-toast";

const clerkPublishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_c3Ryb25nLWdpcmFmZmUtMzIuY2xlcmsuYWNjb3VudHMuZGV2JA";

export const metadata: Metadata = {
  title: "InterviewHub — Precision Recruitment System",
  description:
    "High-signal, low-noise assessment environments designed for top technical talent. Prepare, practice, and prove your skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Material Symbols Outlined font from Google Fonts for Stitch UI icons */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          />
          {/* Google Fonts — Manrope, Inter, JetBrains Mono */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          />
        </head>
        <body className="antialiased font-sans bg-background text-foreground min-h-screen">
          <BackendProvider>
            <ThemeWrapper
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
              </div>

              <Toaster
                toastOptions={{
                  style: {
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "0.875rem",
                  },
                }}
              />
            </ThemeWrapper>
          </BackendProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
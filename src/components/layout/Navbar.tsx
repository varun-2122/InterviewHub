"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../theme/ThemeToggle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import DashboardLink from "./DashboardLink";
import { Bell, Settings, ArrowRight } from "lucide-react";

// Top Navigation bar matching Stitch UI design system — fully responsive for mobile, tablet, desktop
export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Recordings", href: "/recordings" },
  ];

  return (
    <nav className="bg-card text-foreground border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="flex h-16 items-center px-3 sm:px-6 md:px-8 max-w-7xl mx-auto justify-between gap-2 sm:gap-4">
        {/* Left: Logo & Nav links */}
        <div className="flex items-center gap-4 sm:gap-8 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-base sm:text-xl font-heading text-primary tracking-tight shrink-0"
          >
            <div className="size-7 sm:size-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-extrabold text-xs sm:text-sm shrink-0">
              IH
            </div>
            <span>InterviewHub</span>
          </Link>

          <SignedIn>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-colors pb-1 ${
                      isActive
                        ? "text-primary font-bold border-b-2 border-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </SignedIn>
        </div>

        {/* Right: Actions when Signed In */}
        <SignedIn>
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <DashboardLink />
            <button
              aria-label="Notifications"
              className="hidden sm:flex p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
            >
              <Bell className="size-4.5" />
            </button>
            <button
              aria-label="Settings"
              className="hidden sm:flex p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
            >
              <Settings className="size-4.5" />
            </button>
            <ThemeToggle />
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-8 sm:size-9 rounded-full border border-border",
                },
              }}
            />
          </div>
        </SignedIn>

        {/* Right: Actions when Signed Out */}
        <SignedOut>
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <ThemeToggle />
            <Link
              href="/sign-in"
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 sm:px-3 py-1.5 whitespace-nowrap"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-1 text-xs font-semibold bg-primary text-primary-foreground px-2.5 sm:px-4 py-1.5 sm:py-2 rounded hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
            >
              <span>Get Started</span>
              <ArrowRight className="size-3 sm:size-3.5 shrink-0" />
            </Link>
          </div>
        </SignedOut>
      </div>
    </nav>
  );
}

export default Navbar;

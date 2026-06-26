"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../theme/ThemeToggle";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import DashboardLink from "./DashboardLink";
import { Bell, Settings, ArrowRight } from "lucide-react";

// Top Navigation bar matching Stitch UI design system
export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Recordings", href: "/recordings" },
  ];

  return (
    <nav className="bg-card text-foreground border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl font-heading text-primary tracking-tight"
          >
            <div className="size-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-extrabold text-sm">
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

        <SignedIn>
          <div className="flex items-center gap-3">
            <DashboardLink />
            <button
              aria-label="Notifications"
              className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
            >
              <Bell className="size-4.5" />
            </button>
            <button
              aria-label="Settings"
              className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
            >
              <Settings className="size-4.5" />
            </button>
            <ThemeToggle />
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-9 rounded-full border border-border",
                },
              }}
            />
          </div>
        </SignedIn>

        <SignedOut>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/sign-in"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 transition-opacity shadow-sm"
            >
              Get Started
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </SignedOut>
      </div>
    </nav>
  );
}

export default Navbar;

import Link from "next/link";
import { ThemeToggle } from "../theme/ThemeToggle";
import { Terminal } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import DashboardLink from "./DashboardLink";

// Main header layout navigation bar
export function Navbar() {
  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 container mx-auto justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-xl tracking-tight font-mono hover:opacity-90 transition-opacity"
        >
          <Terminal className="size-6 text-emerald-500" />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            InterviewHub
          </span>
        </Link>

        <SignedIn>
          <div className="flex items-center space-x-3.5">
            <DashboardLink />
            <ThemeToggle />
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "size-8 rounded-full border border-border"
                }
              }}
            />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}

export default Navbar;

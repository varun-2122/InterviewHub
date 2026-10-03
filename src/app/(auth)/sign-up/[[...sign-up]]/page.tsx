import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignUpPage() {
  return (
    <div className="dark min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#030712]">
      <div className="w-full max-w-[400px]">
        {/* Unified container for perfect seamless border & shadow */}
        <div className="bg-[#090d16] border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Custom InterviewHub header — overrides Clerk's default */}
          <div className="px-8 pt-8 pb-7 text-center space-y-1.5">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="size-8 rounded bg-[#00d2fd] flex items-center justify-center text-[#090d16] font-extrabold text-sm">
                IH
              </div>
              <span
                className="font-extrabold text-white text-lg tracking-tight"
                style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
              >
                InterviewHub
              </span>
            </div>
            <h1
              className="text-xl font-bold text-white"
              style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
            >
              Create your InterviewHub account
            </h1>
            <p className="text-xs text-slate-400">
              Join the precision recruitment platform for top technical talent.
            </p>
          </div>

          <SignUp
            routing="path"
            path="/sign-up"
            appearance={{
              baseTheme: dark,
              variables: {
                colorPrimary: "#00d2fd",
                colorBackground: "transparent",
                colorInputBackground: "#111827",
                colorInputText: "#ffffff",
                colorText: "#ffffff",
                colorTextSecondary: "#9ca3af",
              },
              elements: {
                rootBox: "w-full",
                cardBox: "shadow-none border-0",
                card: "bg-transparent shadow-none border-0 rounded-none",
                header: "hidden",
                footer: "bg-transparent border-t border-slate-800",
              },
          }}
        />
        </div>
      </div>
    </div>
  );
}

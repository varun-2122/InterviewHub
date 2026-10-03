import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignInPage() {
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
              Sign in to InterviewHub
            </h1>
            <p className="text-xs text-slate-400">
              Welcome back! Please sign in to continue.
            </p>
          </div>

          <SignIn
            routing="path"
            path="/sign-in"
            appearance={{
              baseTheme: dark,
              variables: {
                colorPrimary: "#00d2fd",
                colorBackground: "#090d16",
                colorInputBackground: "#111827",
                colorInputText: "#ffffff",
                colorText: "#ffffff",
                colorTextSecondary: "#9ca3af",
              },
              elements: {
                rootBox: "w-full",
                cardBox: "shadow-none border-0 bg-transparent",
                card: "!bg-transparent !shadow-none !border-none px-6 pb-6 pt-0 rounded-none",
                header: "hidden",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "relative border border-slate-700 bg-[#111827] text-white font-medium text-xs rounded hover:bg-slate-800 transition-colors",
              dividerLine: "bg-slate-800",
              dividerText: "text-xs text-slate-400 uppercase tracking-widest",
              formFieldLabel: "text-xs font-semibold text-slate-200",
              formFieldInput:
                "bg-[#111827] border border-slate-700 rounded text-xs text-white placeholder:text-slate-500 focus:ring-1 focus:ring-[#00d2fd]",
              formButtonPrimary:
                "bg-[#182442] hover:bg-[#25355c] text-white text-xs font-bold rounded py-2.5 transition-all shadow-md border border-slate-700",
              footer: "bg-[#090d16] border-t border-slate-800",
              footerActionText: "text-xs text-slate-400",
              footerActionLink: "text-xs text-[#00d2fd] font-semibold hover:underline",
            },
          }}
        />
        </div>
      </div>
    </div>
  );
}

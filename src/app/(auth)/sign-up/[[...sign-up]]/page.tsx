import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-[480px]">
        <SignUp
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "#00d2fd",
              colorBackground: "#0f172a",
              colorInputBackground: "#1e293b",
              colorInputText: "#ffffff",
              colorText: "#ffffff",
              colorTextSecondary: "#94a3b8",
            },
            elements: {
              rootBox: "w-full",
              card: "bg-[#0f172a] border border-slate-800 shadow-2xl rounded-xl p-6",
              headerTitle: "font-heading text-xl font-bold text-white text-center",
              headerSubtitle: "text-xs text-slate-400 text-center",
              socialButtonsBlockButton:
                "border border-slate-700 bg-[#1e293b] text-white font-medium text-xs rounded hover:bg-slate-800 transition-colors",
              dividerLine: "bg-slate-800",
              dividerText: "text-xs label-caps text-slate-400 uppercase",
              formFieldLabel: "text-xs font-semibold text-slate-200",
              formFieldInput:
                "bg-[#1e293b] border border-slate-700 rounded text-xs text-white placeholder:text-slate-500 focus:ring-1 focus:ring-[#00d2fd]",
              formButtonPrimary:
                "bg-[#182442] hover:bg-[#25355c] text-white text-xs font-bold rounded py-2.5 transition-all shadow-md border border-slate-700",
              footer: "bg-[#0f172a] border-t border-slate-800",
              footerActionText: "text-xs text-slate-400",
              footerActionLink: "text-xs text-[#00d2fd] font-semibold hover:underline",
            },
          }}
        />
      </div>
    </div>
  );
}

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-[480px]">
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-card border border-border shadow-md rounded-xl p-6",
              headerTitle: "font-heading text-xl font-bold text-primary text-center",
              headerSubtitle: "text-xs text-muted-foreground text-center",
              socialButtonsBlockButton:
                "border border-border bg-card text-foreground font-medium text-xs rounded hover:bg-muted transition-colors",
              dividerLine: "bg-border",
              dividerText: "text-xs label-caps text-muted-foreground uppercase",
              formFieldLabel: "text-xs font-semibold text-foreground",
              formFieldInput:
                "bg-card border border-border rounded text-xs text-foreground focus:ring-1 focus:ring-secondary",
              formButtonPrimary:
                "bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded py-2.5 transition-all shadow-sm",
              footerActionText: "text-xs text-muted-foreground",
              footerActionLink: "text-xs text-secondary font-semibold hover:underline",
            },
          }}
        />
      </div>
    </div>
  );
}

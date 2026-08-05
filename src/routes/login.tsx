import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  return (
    <main className="grid min-h-[calc(100dvh-var(--grok-banner-h,0px))] place-items-center px-4 py-10">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-deal/15 text-deal">
            <Building2 className="size-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Sign in</h1>
            <p className="text-sm text-muted-foreground">
              North Bay Deal Finder
            </p>
          </div>
        </div>
        {authEnabled ? (
          <div className="space-y-2">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
              >
                Continue with {p.label}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Sign-in is disabled.</p>
        )}
        <Button variant="ghost" className="w-full" asChild>
          <Link to="/">Back to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}

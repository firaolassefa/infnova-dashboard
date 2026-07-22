"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, X, Moon, Sun } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuthStore } from "@/lib/store/authStore";
import { useTheme } from "@/lib/hooks/useTheme";

export default function LoginPage() {
  const router = useRouter();
  const { lastEmail } = useAuthStore();
  const { theme, toggle: toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const checkedRef = useRef(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    setMounted(true);

    if (checkedRef.current) return;
    checkedRef.current = true;

    const token = localStorage.getItem("infnova_token");
    if (token) {
      router.replace("/");
      return;
    }

    const flag = sessionStorage.getItem("session_expired");
    if (flag) {
      sessionStorage.removeItem("session_expired");
      setSessionExpired(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!sessionExpired) return;
    if (countdown <= 0) { setSessionExpired(false); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [sessionExpired, countdown]);

  // Render same on server and client until mounted
  if (!mounted) {
    return <div className="min-h-screen bg-muted/40" />;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/40 px-4 relative">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className="absolute top-4 right-4 p-2 rounded-md border bg-background text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-xl font-bold">
            I
          </div>
          <h1 className="text-2xl font-bold text-foreground">INFNOVA Dashboard</h1>
          <p className="text-sm text-muted-foreground">Sign in to manage applicants</p>
        </div>

        {sessionExpired && (
          <div role="alert" className="flex items-start gap-3 rounded-md bg-yellow-50 border border-yellow-200 p-4 dark:bg-yellow-950 dark:border-yellow-800">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0 dark:text-yellow-400" />
            <div className="flex-1 text-sm text-yellow-800 dark:text-yellow-300">
              <p className="font-semibold">Session expired</p>
              <p>Please sign in again. Closing in {countdown}s...</p>
            </div>
            <button type="button" onClick={() => setSessionExpired(false)} className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <LoginForm prefillEmail={lastEmail ?? undefined} />
        </div>
      </div>
    </main>
  );
}

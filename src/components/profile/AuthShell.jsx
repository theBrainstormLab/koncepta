import { useEffect, useState } from "react";
import { Icon } from "../Icon";

export function AuthShell() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 7000);

    return () => clearTimeout(timer);
  }, [message]);

  const handleGoogleSignIn = async () => {
    setMessage("");
    const { supabase } = await import("../../utils/supabase");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  return (
    <main className="flex min-h-[100svh] items-center justify-center px-5 py-16 sm:py-20 md:min-h-[calc(100svh-195px)]">
      {message && (
        <div
          className="
            fixed right-5 top-5 z-50
            flex max-w-[380px] items-start gap-3
            rounded-[14px]
            border border-[var(--color-border)]
            bg-[var(--color-bg)]
            px-5 py-4
            shadow-[var(--shadow-box-hover)]
          "
        >
          <Icon
            icon="ri:error-warning-line"
            width="20"
            className="mt-0.5 shrink-0"
          />

          <div className="min-w-0">
            <p className="font-[Poppins-Bold] text-sm">bruh what happened</p>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMessage("")}
            className="
              ml-2 shrink-0 cursor-pointer
              text-[var(--color-text-secondary)]
              transition hover:text-[var(--color-text)]
            "
            aria-label="Close notification"
          >
            <Icon icon="ri:close-line" width="16" />
          </button>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center">
        <div className="text-center">
          <h1
            className="
              font-[DynaPuff] text-3xl font-bold
              text-shadow-[var(--shadow-text)]
              sm:text-4xl
            "
          >
            still not logged in? come on broo....
          </h1>

          <p
            className="
              mt-4 text-sm
              text-[var(--color-text-secondary)]
              sm:text-base
            "
          >
            Sign in to write and share your own notes.
          </p>
        </div>

        <div className="mt-10 w-full max-w-[368px]">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="
              flex w-full cursor-pointer items-center justify-center gap-3
              rounded-[10px] border border-[var(--color-border)]
              bg-[var(--color-bg)] px-5 py-3 font-[Poppins-Medium] text-sm
              transition
              hover:-translate-y-[2px]
              hover:shadow-[var(--shadow-box-hover)]
            "
          >
            <Icon icon="ri:google-fill" width="20" />
            <span className="  font-[DynaPuff]">Login with google</span>
          </button>
        </div>
      </div>
    </main>
  );
}

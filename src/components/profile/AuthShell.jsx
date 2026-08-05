import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import { AuthField } from "./ProfileParts";
import { supabase } from "../../utils/supabase";

export function AuthShell({ isSignUp, setIsSignUp, setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 7000);

    return () => clearTimeout(timer);
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (isSignUp) {
      if (!username.trim()) {
        setMessage("Username is required.");
        return;
      }

      if (password !== confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.trim(),
          },
        },
      });

      if (error) {
        console.error(error);
        setMessage(error.message);
        return;
      }

      setMessage(
        "Confirmation email sent. Check your inbox before signing in.",
      );

      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      setMessage(error.message);
      return;
    }

    setIsLoggedIn(true);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const fields = [
    ...(isSignUp
      ? [
          {
            icon: "ri:user-line",
            type: "text",
            placeholder: "username",
            value: username,
            onChange: (e) => setUsername(e.target.value),
            autoComplete: "username",
            wrapperClassName: "relative",
          },
        ]
      : []),
    {
      icon: "ri:mail-line",
      type: "email",
      placeholder: "email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      autoComplete: "email",
      wrapperClassName: "relative mt-4",
    },
    {
      icon: "ri:lock-2-line",
      type: "password",
      placeholder: "password",
      value: password,
      onChange: (e) => setPassword(e.target.value),
      autoComplete: isSignUp ? "new-password" : "current-password",
      wrapperClassName: "relative mt-4",
    },
    ...(isSignUp
      ? [
          {
            icon: "ri:lock-password-line",
            type: "password",
            placeholder: "confirm password",
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
            autoComplete: "new-password",
            wrapperClassName: "relative mt-4",
          },
        ]
      : []),
  ];

  return (
    <main className="min-h-[calc(100svh-180px)] px-5 py-16 sm:py-20">
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
            icon={
              message.includes("Confirmation email")
                ? "ri:mail-check-line"
                : "ri:error-warning-line"
            }
            width="20"
            className="mt-0.5 shrink-0"
          />

          <div className="min-w-0">
            <p className="font-[Poppins-Bold] text-sm">
              {message.includes("Confirmation email")
                ? "check your inbox"
                : "something went wrong"}
            </p>

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
            {isSignUp
              ? "so you wanna join us...."
              : "still not logged in? come on broo...."}
          </h1>

          <p
            className="
              mt-4 text-sm
              text-[var(--color-text-secondary)]
              sm:text-base
            "
          >
            {isSignUp
              ? "Create an account to write and share your own notes."
              : "Sign in to write and share your own notes."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 w-full max-w-[368px]">
          {fields.map((field) => (
            <AuthField key={field.placeholder} {...field} />
          ))}

          {!isSignUp && (
            <button
              type="button"
              className="
                ml-auto mt-2 block cursor-pointer
                text-xs text-[var(--color-text-secondary)]
                underline underline-offset-4
              "
            >
              forgot password?
            </button>
          )}

          <button
            type="submit"
            className="
              group relative mx-auto mt-7 block
              cursor-pointer rounded-[10px] border
              border-[var(--color-text)]
              px-8 py-2 font-[DynaPuff] text-sm
              transition
              hover:-translate-y-[2px]
              hover:shadow-[var(--shadow-box-hover)]
            "
          >
            {isSignUp ? "sign up" : "sign in"}

            <span className="ml-2 transition group-hover:ml-3">→</span>
          </button>

          <div
            className="
              my-8 flex items-center gap-8
              text-xs text-[var(--color-text-secondary)]
            "
          >
            <span className="h-px flex-1 bg-[var(--color-border)]" />
            OR
            <span className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="
              flex h-[56px] w-full cursor-pointer
              items-center justify-center gap-3
              rounded-[14px]
              border border-[var(--color-border)]
              bg-transparent text-sm
              transition
              hover:shadow-[var(--shadow-box-hover)]
            "
          >
            <Icon icon="flat-color-icons:google" width="18" />
            continue with google
          </button>

          <p
            className="
              mt-5 text-center text-xs
              text-[var(--color-text-secondary)]
            "
          >
            {isSignUp ? (
              <>
                Already have an account?
                <button
                  type="button"
                  onClick={() => {
                    setMessage("");
                    setIsSignUp(false);
                  }}
                  className="
                    cursor-pointer pl-1
                    text-[var(--color-text)]
                    underline underline-offset-4
                  "
                >
                  sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?
                <button
                  type="button"
                  onClick={() => {
                    setMessage("");
                    setIsSignUp(true);
                  }}
                  className="
                    cursor-pointer pl-1
                    text-[var(--color-text)]
                    underline underline-offset-4
                  "
                >
                  sign up
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </main>
  );
}

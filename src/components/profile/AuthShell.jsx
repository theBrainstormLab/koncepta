import { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { AuthField } from "./ProfileParts";

export function AuthShell({ isSignUp, setIsSignUp, setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const fields = [
    {
      icon: "ri:mail-line",
      type: "email",
      placeholder: "email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      autoComplete: "email",
      wrapperClassName: "relative",
    },
    {
      icon: "ri:lock-2-line",
      type: "password",
      placeholder: "password",
      value: password,
      onChange: (e) => setPassword(e.target.value),
      autoComplete: isSignUp ? "new-password" : "current-password",
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
          },
        ]
      : []),
  ];

  return (
    <main className="min-h-[calc(100svh-180px)] px-5 py-16 sm:py-20">
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
            onClick={() => setIsLoggedIn(true)}
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
                  onClick={() => setIsSignUp(false)}
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
                  onClick={() => setIsSignUp(true)}
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

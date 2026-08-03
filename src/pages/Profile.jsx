import { useState } from "react";
import { Icon } from "@iconify-icon/react";

export default function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  if (isLoggedIn) {
    return (
      <main className="min-h-[calc(100svh-180px)] px-5 py-20">
        <div className="min-h-[60vh]" />
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100svh-180px)] px-5 py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center">
        {/* heading */}
        <div className="text-center">
          <h1 className="font-[DynaPuff] font-bold text-3xl sm:text-4xl text-shadow-[var(--shadow-text)]">
            {isSignUp
              ? "so you wanna join us...."
              : "still not logged in? come on broo...."}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[var(--color-text-secondary)]">
            {isSignUp
              ? "Don't even think twice about it."
              : "Sign in to write and share your own notes."}
          </p>
        </div>

        {/* auth */}
        <form className="mt-10 w-full max-w-[368px]">
          {/* email */}
          <div className="relative">
            <Icon
              icon="ri:mail-line"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-[var(--color-text-secondary)]"
            />

            <input
              type="email"
              placeholder="email"
              className="
                h-[56px]
                w-full
                rounded-[16px]
                border
                border-[var(--color-border)]
                bg-transparent
                pl-12
                pr-4
                text-sm
                outline-none
                transition
                placeholder:text-[var(--color-text-secondary)]
                focus:border-[var(--color-text)]
              "
            />
          </div>

          {/* password */}
          <div className="relative mt-4">
            <Icon
              icon="ri:lock-2-line"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-[var(--color-text-secondary)]"
            />

            <input
              type="password"
              placeholder="password"
              className="
                h-[56px]
                w-full
                rounded-[16px]
                border
                border-[var(--color-border)]
                bg-transparent
                pl-12
                pr-4
                text-sm
                outline-none
                transition
                placeholder:text-[var(--color-text-secondary)]
                focus:border-[var(--color-text)]
              "
            />
          </div>

          {/* confirm password */}
          {isSignUp && (
            <div className="relative mt-4">
              <Icon
                icon="ri:lock-password-line"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-[var(--color-text-secondary)]"
              />

              <input
                type="password"
                placeholder="confirm password"
                className="
                  h-[56px]
                  w-full
                  rounded-[16px]
                  border
                  border-[var(--color-border)]
                  bg-transparent
                  pl-12
                  pr-4
                  text-sm
                  outline-none
                  transition
                  placeholder:text-[var(--color-text-secondary)]
                  focus:border-[var(--color-text)]
                "
              />
            </div>
          )}

          {/* forgot password */}
          {!isSignUp && (
            <button
              type="button"
              className="
                cursor-pointer
                mt-2
                block
                ml-auto
                text-xs
                text-[var(--color-text-secondary)]
                underline
                underline-offset-4
              "
            >
              forgot password?
            </button>
          )}

          {/* sign in / sign up */}
          <button
            type="button"
            onClick={() => setIsLoggedIn(true)}
            className="
              cursor-pointer
              group
              relative
              mx-auto
              mt-7
              block
              rounded-[10px]
              border
              border-[var(--color-text)]
              px-8
              py-2
              font-[DynaPuff]
              text-sm
              transition
              hover:-translate-y-[2px]
              hover:shadow-[var(--shadow-box-hover)]
            "
          >
            {isSignUp ? "sign up" : "sign in"}
            <span className="ml-2 transition group-hover:ml-3">→</span>
          </button>

          {/* divider */}
          <div className="my-8 flex items-center gap-8 text-xs text-[var(--color-text-secondary)]">
            <span className="h-px flex-1 bg-[var(--color-border)]" />
            OR
            <span className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          {/* google */}
          <button
            type="button"
            onClick={() => setIsLoggedIn(true)}
            className="
              cursor-pointer
              flex
              h-[56px]
              w-full
              items-center
              justify-center
              gap-3
              rounded-[16px]
              border
              border-[var(--color-border)]
              bg-transparent
              text-sm
              transition
              hover:shadow-[var(--shadow-box-hover)]
            "
          >
            <Icon icon="flat-color-icons:google" width="18" />
            continue with google
          </button>

          {/* switch */}
          <p className="mt-5 text-center text-xs text-[var(--color-text-secondary)]">
            {isSignUp ? (
              <>
                Already have an account?
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="underline underline-offset-4 cursor-pointer pl-1 text-[var(--color-text)]"
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
                  className="underline underline-offset-4 cursor-pointer pl-1 text-[var(--color-text)]"
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

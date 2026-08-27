import { useEffect, useRef } from "react";

const onIdle = (cb) =>
  typeof requestIdleCallback === "function"
    ? requestIdleCallback(cb, { timeout: 2000 })
    : setTimeout(cb, 1);

export function useDeferredLoad(run, deps = []) {
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    done.current = false;

    let idleId;
    let observer;

    const trigger = () => {
      if (done.current) return;
      done.current = true;
      idleId = onIdle(() => run());
    };

    if (typeof IntersectionObserver === "function") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            trigger();
          }
        },
        { rootMargin: "200px" },
      );
      observer.observe(el);
    } else {
      trigger();
    }

    return () => {
      observer?.disconnect();
      if (typeof cancelIdleCallback === "function") cancelIdleCallback(idleId);
      else clearTimeout(idleId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

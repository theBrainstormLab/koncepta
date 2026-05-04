import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import { motion, AnimatePresence } from "framer-motion";

export default function NoteView() {
  const { state } = useLocation();
  const course = state.course;
  const index = state.i;

  const [showOverview, setShowOverview] = useState(true);
  const [showChat, setShowChat] = useState(true);

  return (
    <div className="flex gap-8">
      {/* overview */}
      <div className="flex flex-col gap-6 pt-1 mx-3">
        <div
          className="bg-[var(--color-bg-secondary)] w-9 h-9 rounded-[10px] flex items-center justify-center cursor-pointer"
          onClick={() => setShowOverview(!showOverview)}
        >
          <Icon icon="ri:menu-4-line" width="22" height="22" />
        </div>

        <AnimatePresence>
          {showOverview && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 192 }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col gap-6 overflow-hidden whitespace-nowrap"
            >
              <div className="flex flex-col gap-1.5">
                <h4 className="font-[DynaPuff] font-bold tracking-[0.04em] text-sm uppercase truncate">
                  Overview of Data structures
                </h4>
                <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text)] min-w-0">
                  <span className="shrink-0">1.</span>
                  <span className="truncate">Data type vs Data structure</span>
                </div>
                <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text)] min-w-0">
                  <span className="shrink-0">2.</span>
                  <span className="truncate">Abstract Data type (ADT)</span>
                </div>
                <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text)] min-w-0">
                  <span className="shrink-0">3.</span>
                  <span className="truncate">Definition of Data Structure</span>
                </div>
                <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text)] min-w-0">
                  <span className="shrink-0">4.</span>
                  <span className="truncate">
                    Data Structure classification...
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <h4 className="font-[DynaPuff] font-bold tracking-[0.04em] text-sm uppercase truncate">
                  Overview of Data structures
                </h4>
                <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text)] min-w-0">
                  <span className="shrink-0">1.</span>
                  <span className="truncate">Data type vs Data structure</span>
                </div>
                <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text)] min-w-0">
                  <span className="shrink-0">2.</span>
                  <span className="truncate">Abstract Data type (ADT)</span>
                </div>
                <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text)] min-w-0">
                  <span className="shrink-0">3.</span>
                  <span className="truncate">Definition of Data Structure</span>
                </div>
                <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text)] min-w-0">
                  <span className="shrink-0">4.</span>
                  <span className="truncate">
                    Data Structure classification...
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <h4 className="font-[DynaPuff] font-bold tracking-[0.04em] text-sm uppercase truncate">
                  Overview of Data structures
                </h4>
                <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text)] min-w-0">
                  <span className="shrink-0">1.</span>
                  <span className="truncate">Data type vs Data structure</span>
                </div>
                <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text)] min-w-0">
                  <span className="shrink-0">2.</span>
                  <span className="truncate">Abstract Data type (ADT)</span>
                </div>
                <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text)] min-w-0">
                  <span className="shrink-0">3.</span>
                  <span className="truncate">Definition of Data Structure</span>
                </div>
                <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text)] min-w-0">
                  <span className="shrink-0">4.</span>
                  <span className="truncate">
                    Data Structure classification...
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* main contents */}
      <div className="flex-1 mb-20">
        <h1 className="font-[DynaPuff] font-bold text-shadow-[var(--shadow-text)] text-4xl tracking-[0.05em]">
          {course.modules[index]}
        </h1>

        <div className="h-px bg-[var(--color-text)] opacity-15 mt-1"></div>

        <h3 className="tracking-[0.05em] text-2xl my-3">Overview</h3>

        <p className="tracking-[0.03em] my-3">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
          faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
          pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
          tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
          Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
          hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent
          per conubia nostra inceptos himenaeos.
        </p>
        <p className="tracking-[0.03em] my-3">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
          faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
          pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
          tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
          Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
          hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent
          per conubia nostra inceptos himenaeos.
        </p>
        <p className="tracking-[0.03em] my-3">
          Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
          faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
          pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
          tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
          Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
          hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent
          per conubia nostra inceptos himenaeos.
        </p>

        <div className="flex justify-between">
          <div className="text-[var(--color-text)] opacity-75 text-sm mt-20">
            <div className="flex">
              <Icon
                icon="ri:ball-pen-line"
                className="flex mr-1.5 items-center"
              />
              <h4>Martin Scorsese</h4>
            </div>
            <h4>Last edited: 2d ago</h4>
          </div>
          <div className="text-[var(--color-text)] opacity-75 text-sm mt-20">
            <div className="flex justify-end">
              <h4 className="flex items-end">{course.code}</h4>
              <Icon
                icon="ri:book-2-line"
                className="flex ml-1.5 items-center"
              />
            </div>
            <h4>{course.degree}</h4>
          </div>
        </div>
      </div>

      {/* chatbot */}
      <div className="flex flex-col self-start pt-1 pr-3">
        <div className="flex justify-end">
          <div
            className="bg-[var(--color-bg-secondary)] w-9 h-9 rounded-[10px] flex items-center justify-center cursor-pointer"
            onClick={() => setShowChat(!showChat)}
          >
            <Icon icon="ri:message-3-line" width="22" height="22" />
          </div>
        </div>
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 280 }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col gap-6 mt-6 bg-[var(--color-bg-secondary)] rounded-[16px] p-3 overflow-hidden"
            >
              <div className="flex items-center gap-2" style={{ width: 256 }}>
                <div className="bg-[var(--color-bg)] w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                  <Icon icon="ri:robot-2-line" width="15" height="15" />
                </div>
                <div className="min-w-0">
                  <div className="bg-[var(--color-bg)] rounded-2xl rounded-bl-none px-3 py-2 text-[12px] tracking-[0.03em]">
                    Okay, what confuses you..?
                  </div>
                </div>
              </div>
              <div
                className="flex items-center gap-2 justify-end"
                style={{ width: 256 }}
              >
                <div className="min-w-0 text-right">
                  <div className="bg-[var(--color-bg)] rounded-2xl rounded-br-none px-3 py-2 text-[12px] tracking-[0.03em]">
                    why is orange orange?
                  </div>
                </div>
                <div className="bg-[var(--color-bg)] w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                  <Icon icon="ri:user-line" width="15" height="15" />
                </div>
              </div>
              <div className="flex items-center gap-2" style={{ width: 256 }}>
                <div className="bg-[var(--color-bg)] w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                  <Icon icon="ri:robot-2-line" width="15" height="15" />
                </div>
                <div className="min-w-0">
                  <div className="bg-[var(--color-bg)] rounded-2xl rounded-bl-none px-3 py-2 text-[12px] tracking-[0.03em]">
                    i don't know
                  </div>
                </div>
              </div>
              <div
                className="bg-[var(--color-bg)] rounded-[12px] px-4 py-3"
                style={{ width: 256 }}
              >
                <input
                  type="text"
                  placeholder="what's bugging you..?"
                  className="w-full bg-transparent text-[12px] tracking-[0.03em] placeholder-[var(--color-text-placeholder)] outline-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

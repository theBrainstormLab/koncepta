import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../utils/supabase";
import Markdown from "../components/Markdown";
import NoteViewSkeleton from "../components/NoteViewSkeleton";

export default function NoteView() {
  const { state } = useLocation();
  const { course, module } = state;

  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOverview, setShowOverview] = useState(true);
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const { data, error } = await supabase
          .from("notes")
          .select(
            `
            id,
            title,
            content,
            created_at,
            updated_at,
            author:users!notes_author_id_fkey(username)
          `,
          )
          .eq("module_id", module.id);

        if (error) throw error;
        setNotes(data);
        if (data.length > 0) setSelectedNote(data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [module.id]);

  const formatDate = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "today";
    if (days === 1) return "1d ago";
    return `${days}d ago`;
  };

  const scrollToHeading = (headingText) => {
    const allHeadings = document.querySelectorAll("h1, h2");
    for (const heading of allHeadings) {
      if (heading.textContent.trim() === headingText.trim()) {
        heading.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      }
    }
  };

  return (
    <div className="flex gap-8 min-h-[100svh]">
      {/* overview */}
      <div className="flex flex-col gap-6 pt-1 mx-3 sticky top-6 h-fit">
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
              className="overflow-hidden"
            >
              {loading ? (
                <div className="flex flex-col gap-3 animate-pulse">
                  <div className="h-4 w-24 rounded bg-[var(--color-bg-secondary)]" />
                  <div className="flex flex-col gap-1.5 ml-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-3 w-20 rounded bg-[var(--color-bg-secondary)]"
                      />
                    ))}
                  </div>
                  <div className="h-4 w-28 rounded bg-[var(--color-bg-secondary)] mt-2" />
                  <div className="flex flex-col gap-1.5 ml-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-3 w-16 rounded bg-[var(--color-bg-secondary)]"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                selectedNote &&
                (() => {
                  const sections = [];
                  let current = null;

                  selectedNote.content.split("\n").forEach((line) => {
                    const trimmed = line.trim();

                    if (
                      trimmed.startsWith("# ") &&
                      !trimmed.startsWith("## ")
                    ) {
                      current = {
                        title: trimmed.slice(2),
                        items: [],
                      };
                      sections.push(current);
                    } else if (trimmed.startsWith("## ") && current) {
                      current.items.push(trimmed.slice(3));
                    }
                  });

                  return (
                    <div className="flex flex-col gap-3 whitespace-nowrap">
                      {sections.map((section, sIndex) => (
                        <div key={sIndex} className="flex flex-col">
                          <h4
                            className="font-bold text-[15px] leading-[1.3] truncate text-[var(--color-text)] hover:text-[var(--color-text-secondary)] transition-colors cursor-pointer"
                            onClick={() => scrollToHeading(section.title)}
                          >
                            {section.title}
                          </h4>

                          {section.items.map((item, i) => (
                            <div
                              key={i}
                              className="text-[12px] leading-6 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors cursor-pointer truncate ml-3"
                              onClick={() => scrollToHeading(item)}
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  );
                })()
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* main content */}
      <div className="flex-1 mb-20">
        {loading ? (
          <NoteViewSkeleton />
        ) : !selectedNote ? (
          <p className="opacity-50">No notes yet.</p>
        ) : (
          <>
            <h1 className="font-[DynaPuff] font-bold text-shadow-[var(--shadow-text)] text-4xl tracking-[0.05em]">
              {selectedNote.title}
            </h1>

            <div className="h-px bg-[var(--color-text)] opacity-15 mt-1"></div>

            <div className="my-3">
              <Markdown>{selectedNote.content}</Markdown>
            </div>

            <div className="flex justify-between">
              <div className="text-[var(--color-text)] opacity-75 text-sm mt-20">
                <div className="flex">
                  <Icon
                    icon="ri:ball-pen-line"
                    className="flex mr-1.5 items-center"
                  />
                  <h4>{selectedNote.author?.username ?? "Unknown"}</h4>
                </div>
                <h4>Last edited: {formatDate(selectedNote.updated_at)}</h4>
              </div>
              <div className="text-[var(--color-text)] opacity-75 text-sm mt-20">
                <div className="flex justify-end">
                  <h4 className="flex items-end">{course.code}</h4>
                  <Icon
                    icon="ri:book-2-line"
                    className="flex ml-1.5 items-center"
                  />
                </div>
                <h4>{course.degree?.name}</h4>
              </div>
            </div>
          </>
        )}
      </div>

      {/* chatbot */}
      <div className="flex flex-col gap-6 pt-1 mx-3 sticky top-6 h-fit">  
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

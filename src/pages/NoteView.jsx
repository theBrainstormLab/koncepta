import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../utils/supabase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


export default function NoteView() {
  const { state } = useLocation();
  const course = state?.course;
  const module = state?.module;

  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showOverview, setShowOverview] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  const [showChat, setShowChat] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  useEffect(() => {
    if (!module?.id) return;

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
        setNotes(data || []);
        if (data && data.length > 0) setSelectedNote(data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [module?.id]);

  const formatDate = (iso) => {
    if (!iso) return "";
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "today";
    if (days === 1) return "1d ago";
    return `${days}d ago`;
  };

  return (
    <div className="relative flex flex-col lg:flex-row gap-8 p-4 md:p-5 min-h-screen">
      {/* Mobile Menu Trigger */}
      <button
        type="button"
        aria-label="Toggle Navigation"
        className="lg:hidden fixed top-5 left-5 z-[1001] flex justify-center items-center bg-[var(--color-bg-secondary)] rounded-[10px] w-9 h-9 cursor-pointer"
        onClick={() => setShowOverview(!showOverview)}
      >
        <Icon icon="ri:menu-4-line" width="22" height="22" />
      </button>

      {/* Backdrop for Mobile Overview Drawer */}
      <AnimatePresence>
        {showOverview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowOverview(false)}
            className="fixed inset-0 bg-black z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Overview / Sidebar */}
      <div className="lg:static flex flex-col gap-6 pt-0 lg:pt-1 mx-0 lg:mx-3">
        {/* Desktop Toggle Button */}
        <div
          className="hidden lg:flex bg-[var(--color-bg-secondary)] w-9 h-9 rounded-[10px] items-center justify-center cursor-pointer"
          onClick={() => setShowOverview(!showOverview)}
        >
          <Icon icon="ri:menu-4-line" width="22" height="22" />
        </div>

        <AnimatePresence>
          {showOverview && (
            <motion.div
              initial={{ opacity: 0, x: -20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 192 }}
              exit={{ opacity: 0, x: -20, width: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 h-full w-64 bg-[var(--color-bg-secondary)] lg:bg-transparent p-6 lg:p-0 z-50 lg:z-auto shadow-2xl lg:shadow-none overflow-y-auto whitespace-nowrap lg:static"
            >
              {!loading && (
                <div className="flex flex-col gap-3 lg:gap-1.5 mt-16 lg:mt-0">
                  <h4 className="font-[DynaPuff] font-bold tracking-[0.04em] text-sm uppercase truncate mb-2 lg:mb-0">
                    {module?.title}
                  </h4>
                  {notes.map((note, i) => (
                    <div
                      key={note.id}
                      onClick={() => {
                        setSelectedNote(note);
                        if (window.innerWidth < 1024) setShowOverview(false);
                      }}
                      className={`group flex gap-2 text-[13px] lg:text-[12px] tracking-[0.03em] cursor-pointer px-2 py-1.5 lg:px-1 lg:py-0.5 rounded-md min-w-0 transition-colors ${
                        selectedNote?.id === note.id
                          ? "text-[var(--color-text)] font-semibold bg-black/5 lg:bg-transparent"
                          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                      }`}
                    >
                      <span className="shrink-0">{i + 1}.</span>
                      <span className="truncate">{note.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="flex-1 mb-20 mt-16 lg:mt-0 max-w-full overflow-hidden">
        {loading ? (
          <p>Loading...</p>
        ) : !selectedNote ? (
          <p className="opacity-50">No notes yet.</p>
        ) : (
          <>
            <h1 className="font-[DynaPuff] font-bold text-shadow-[var(--shadow-text)] text-2xl md:text-4xl tracking-[0.05em] break-words">
              {selectedNote.title}
            </h1>

            <div className="h-px bg-[var(--color-text)] opacity-15 mt-1"></div>


            <div className="tracking-[0.03em] my-3 prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedNote.content}
              </ReactMarkdown>

            <div className="tracking-[0.03em] my-3 whitespace-pre-wrap break-words leading-relaxed text-sm md:text-base">
              {selectedNote.content}

            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-12 md:mt-20 pt-4 border-t border-black/5">
              <div className="text-[var(--color-text)] opacity-75 text-sm">
                <div className="flex items-center">
                  <Icon icon="ri:ball-pen-line" className="mr-1.5" />
                  <h4>{selectedNote.author?.username ?? "Unknown"}</h4>
                </div>
                <h4>Last edited: {formatDate(selectedNote.updated_at)}</h4>
              </div>
              <div className="text-[var(--color-text)] opacity-75 text-sm sm:text-right">
                <div className="flex sm:justify-end items-center">
                  <h4>{course?.code}</h4>
                  <Icon icon="ri:book-2-line" className="ml-1.5" />
                </div>
                <h4>{course?.degree?.name}</h4>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Chatbot */}
      <div className="fixed bottom-5 right-5 z-50 lg:hidden">
        <button
          type="button"
          aria-label="Toggle Chat"
          className="bg-[var(--color-bg-secondary)] w-12 h-12 rounded-full flex justify-center items-center shadow-lg cursor-pointer"
          onClick={() => setShowChat(!showChat)}
        >
          <Icon icon="ri:message-3-line" width="24" height="24" />
        </button>
      </div>

      <div className="lg:static flex flex-col pt-0 lg:pt-1 lg:self-start pr-0 lg:pr-3">
        {/* Desktop Chat Toggle Button */}
        <div className="hidden lg:flex justify-end">
          <div
            className="bg-[var(--color-bg-secondary)] rounded-[10px] w-9 h-9 flex items-center justify-center cursor-pointer"
            onClick={() => setShowChat(!showChat)}
          >
            <Icon icon="ri:message-3-line" width="22" height="22" />
          </div>
        </div>

        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0, y: 20, width: 0 }}
              animate={{ opacity: 1, y: 0, width: 280 }}
              exit={{ opacity: 0, y: 20, width: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed bottom-20 right-4 lg:static lg:bottom-auto lg:right-auto z-50 lg:z-auto flex flex-col gap-4 mt-0 lg:mt-6 bg-[var(--color-bg-secondary)] rounded-[16px] p-4 shadow-2xl lg:shadow-none overflow-hidden max-w-[calc(100vw-2rem)]"
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

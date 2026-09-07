import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import { motion, AnimatePresence } from "framer-motion";
import { fetchModuleById } from "../api/modules";
import { fetchNoteByModule } from "../api/notes";
import { useTitle } from "../utils/useTitle";
import Markdown from "../components/Markdown";
import NoteViewSkeleton from "../components/NoteViewSkeleton";
import NotFound from "./NotFound";
import { askNoteAssistant } from "../api/chat";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 640;

export default function NoteView() {
  const { courseCode, moduleId } = useParams();
  const { state } = useLocation();

  // Fast path from router state -- only when it matches the URL's course
  // code. Fetched fallback covers pasted links where there is no state.
  const normalizedCode = courseCode?.toLowerCase() ?? "";
  const stateMatchesUrl =
    !!state?.module?.id &&
    typeof state.course?.code === "string" &&
    state.course.code.toLowerCase() === normalizedCode;

  const [context, setContext] = useState(stateMatchesUrl ? state : null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [showOverview, setShowOverview] = useState(!isMobile());
  const [showChat, setShowChat] = useState(!isMobile());

  const [messages, setMessages] = useState([
    { id: "1", role: "assistant", text: "Okay, what confuses you..?" },
    { id: "2", role: "user", text: "why is orange orange?" },
    { id: "3", role: "assistant", text: "i don't know" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const chatScrollContainerRef = useRef(null);

  useEffect(() => {
    if (!moduleId) return;

    async function fetchNote() {
      try {
        const data = await fetchNoteByModule(moduleId);
        setSelectedNote(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchNote();
  }, [moduleId]);

  useEffect(() => {
    let active = true;

    if (context || !moduleId) return;

    fetchModuleById(moduleId).then((data) => {
      if (!active) return;

      // Module must exist and its course code must match the URL.
      if (!data || (data.course?.code ?? "").toLowerCase() !== normalizedCode) {
        setNotFound(true);
        return;
      }

      setContext({ course: data.course, module: data });
    });

    return () => {
      active = false;
    };
  }, [context, moduleId, normalizedCode]);

  const course = context?.course;
  const module = context?.module;

  useTitle(module && course ? `${module.title} - ${course.code}` : null);

  const formatDate = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "today";
    if (days === 1) return "1d ago";
    return `${days}d ago`;
  };

  //Close overview and chatbot if touch or scroll the page only in sm
  const scrollToHeading = (headingText) => {
    const allHeadings = document.querySelectorAll("h1, h2");
    for (const heading of allHeadings) {
      if (heading.textContent.trim() === headingText.trim()) {
        heading.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      }
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      if (isMobile()) {
        setShowOverview(false);
        setShowChat(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const overviewButtonRef = useRef(null);
  const chatButtonRef = useRef(null);

  useEffect(() => {
    if (!showOverview && !showChat) return;

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;

      const fromOverview = showOverview;
      const fromChat = showChat;
      setShowOverview(false);
      setShowChat(false);

      if (fromOverview) overviewButtonRef.current?.focus();
      else if (fromChat) chatButtonRef.current?.focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showOverview, showChat]);

  const toggleOverview = (e) => {
    e.stopPropagation();
    if (isMobile()) {
      setShowChat(false);
    }
    setShowOverview((prev) => !prev);
  };
  const toggleChat = (e) => {
    e.stopPropagation();
    if (isMobile()) {
      setShowOverview(false);
    }
    setShowChat((prev) => !prev);
  };
  const handleMainContentClick = () => {
    if (isMobile()) {
      setShowOverview(false);
      setShowChat(false);
    }
  };

  useEffect(() => {
    if (showChat && chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTo({
        top: chatScrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isReplying, showChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const query = inputMessage.trim();
    if (!query || isReplying) return;

    // 1. Add user message
    const userMsg = { id: Date.now().toString(), role: "user", text: query };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputMessage("");
    setIsReplying(true);

    try {
      // 2. Call askNoteAssistant from chat.js
      const replyText = await askNoteAssistant({
        noteContent: selectedNote?.content ?? "",
        history: messages,
        question: query,
      });

      // 3. Add bot reply
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: replyText,
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text:
            error.message || "Something went wrong while fetching the answer.",
        },
      ]);
    } finally {
      setIsReplying(false);
    }
  };

  if (!courseCode || !moduleId || !UUID_RE.test(moduleId)) {
    return <NotFound />;
  }

  if (notFound) return <NotFound />;
  return (
    <div className="flex flex-col sm:flex-row gap-8 min-h-[100svh] relative px-4 sm:px-0">
      <header className="fixed top-0 left-0 right-0 h-16.5  px-4 flex items-center justify-between z-50 md:hidden"></header>
      {/* overview */}
      <div className="fixed top-5 left-5 z-50 sm:relative sm:top-6 sm:left-0 sm:z-auto sm:flex sm:flex-col sm:gap-6 sm:pt-1 sm:mx-3 sm:sticky sm:h-fit">
        <button
          type="button"
          ref={overviewButtonRef}
          aria-expanded={showOverview}
          aria-label={showOverview ? "Hide note outline" : "Show note outline"}
          className="bg-[var(--color-bg-secondary)] w-9 h-9 rounded-[10px] flex items-center justify-center cursor-pointer relative z-50 sm:static sm:z-auto"
          onClick={toggleOverview}
        >
          <Icon icon="ri:menu-4-line" width="22" height="22" />
        </button>

        <AnimatePresence>
          {showOverview && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 192 }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden fixed top-0 left-0 h-full bg-[var(--color-bg)] p-6 pt-16 shadow-2xl z-40 sm:static sm:bg-transparent sm:p-0 sm:shadow-none sm:z-auto"
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
                    <div className="flex flex-col gap-3 max-md:mt-4.5  whitespace-nowrap">
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
      <div
        className="flex-1 mb-20 pt-16 sm:pt-0"
        onClick={handleMainContentClick}
        onTouchMove={handleMainContentClick}
      >
        {loading ? (
          <NoteViewSkeleton />
        ) : !selectedNote ? (
          <p className="opacity-50">No notes yet.</p>
        ) : (
          <>
            <h1 className="font-[DynaPuff] font-bold text-shadow-[var(--shadow-text)] text-4xl tracking-[0.05em]">
              {module?.title}
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
                  <h4 className="flex items-end">{course?.code}</h4>
                  <Icon
                    icon="ri:book-2-line"
                    className="flex ml-1.5 items-center"
                  />
                </div>
                <h4>{course?.degree?.name}</h4>
              </div>
            </div>
          </>
        )}
      </div>

      {/* chatbot */}
      <div className="fixed top-5 right-5 z-50 sm:relative md:top-6 sm:right-0 sm:z-auto sm:flex sm:flex-col sm:gap-6 sm:pt-1 sm:mx-3 sm:sticky sm:h-fit">
        <div className="flex justify-end">
          <button
            type="button"
            ref={chatButtonRef}
            aria-expanded={showChat}
            aria-label={showChat ? "Hide chat panel" : "Show chat panel"}
            className="bg-[var(--color-bg-secondary)] w-9 h-9 rounded-[10px] flex items-center justify-center cursor-pointer"
            onClick={toggleChat}
          >
            <Icon icon="ri:message-3-line" width="22" height="22" />
          </button>
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
              {/* Message Scroll Container */}
              <div
                ref={chatScrollContainerRef}
                className="flex flex-col gap-6 max-h-[350px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                style={{ width: 256 }}
              >
                {messages.map((msg) =>
                  msg.role === "assistant" ? (
                    <div
                      key={msg.id}
                      className="flex items-center gap-2"
                      style={{ width: 256 }}
                    >
                      <div className="bg-[var(--color-bg)] w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                        <Icon icon="ri:robot-2-line" width="15" height="15" />
                      </div>
                      <div className="min-w-0">
                        <div className="bg-[var(--color-bg)] rounded-2xl rounded-bl-none px-3 py-2 text-[12px] tracking-[0.03em] break-words leading-relaxed">
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={msg.id}
                      className="flex items-center gap-2 justify-end"
                      style={{ width: 256 }}
                    >
                      <div className="min-w-0 text-right">
                        <div className="bg-[var(--color-bg)] rounded-2xl rounded-br-none px-3 py-2 text-[12px] tracking-[0.03em] break-words leading-relaxed">
                          {msg.text}
                        </div>
                      </div>
                      <div className="bg-[var(--color-bg)] w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                        <Icon icon="ri:user-line" width="15" height="15" />
                      </div>
                    </div>
                  ),
                )}

                {isReplying && (
                  <div
                    className="flex items-center gap-2"
                    style={{ width: 256 }}
                  >
                    <div className="bg-[var(--color-bg)] w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                      <Icon icon="ri:robot-2-line" width="15" height="15" />
                    </div>
                    <div className="min-w-0">
                      <div className="bg-[var(--color-bg)] rounded-2xl rounded-bl-none px-3 py-2 text-[12px] tracking-[0.03em] opacity-60">
                        ...
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="bg-[var(--color-bg)] rounded-[12px] px-3 py-2 flex items-center gap-2"
                style={{ width: 256 }}
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="what's bugging you..?"
                  disabled={isReplying}
                  className="flex-1 bg-transparent text-[12px] tracking-[0.03em] placeholder-[var(--color-text-placeholder)] outline-none disabled:opacity-50 min-w-0"
                />
                <button
                  type="submit"
                  disabled={isReplying || !inputMessage.trim()}
                  aria-label="Send message"
                  className="w-7 h-7 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center shrink-0 text-[var(--color-text)] opacity-80 hover:opacity-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <Icon icon="ri:arrow-right-up-line" className="w-[15px] h-[15px]" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

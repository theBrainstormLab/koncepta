import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import { supabase } from "../utils/supabase";
import { fetchCourseByCode } from "../api/courses";
import CardSkeleton from "../components/CardSkeleton";
import CardGrid from "../components/CardGrid";
import NotFound from "./NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
function Modules() {
  const { courseCode } = useParams();
  const { state } = useLocation();
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState(state ?? null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!course?.id) return;

    async function fetchModules() {
      try {
        const { data, error } = await supabase
          .from("modules")
          .select(
            'id, title, created_at, verified, notes (author:users!notes_author_id_fkey (username))')
          .eq("course_id", course.id);

        if (error) throw error;
        setModules(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchModules();
  }, [course?.id]);

  useEffect(() => {
    let active = true;

    // Fast path: course came from router state. Fetch only on pasted
    // links where there is no state.
    if (course || !courseCode) return;

    fetchCourseByCode(courseCode).then((data) => {
      if (!active) return;

      if (!data) {
        setNotFound(true);
        return;
      }

      setCourse(data);
    });

    return () => {
      active = false;
    };
  }, [course, courseCode]);

  const filtered = modules.filter((mod) =>
    mod.title.toLowerCase().includes(query.toLowerCase()),
  );

  if (!courseCode || notFound) {
    return <NotFound />;
  }

  return (
    <>
      <ScrollToTop />
    <div className="min-h-[100svh] mt-0 md:mt-10 md:min-h-[calc(100svh-235.4px)] ">
      <div className="min-h-[100svh] sm:min-h-[100svh] md:min-h-0 flex flex-col justify-center md:justify-start">
        <h1 className="text-center mt-4 sm:mt-4 md:mt-0 font-['DynaPuff'] text-[36px] font-bold tracking-[1px] text-[var(--color-text)] text-shadow-[var(--shadow-text)]">
          {course?.title ?? "loading..."}
        </h1>

        <div className="w-[454px] h-[60px] rounded-[20px] flex px-4 mx-auto border-2 border-[var(--color-border)] mt-12 mb-0 box-border max-md:w-[90%] max-md:max-w-[454px] max-md:h-[50px] max-md:mt-8 max-[480px]:h-[36px] max-[480px]:px-3 max-[480px]:mt-6 max-[480px]:rounded-[12px]">
          <span className="text-[24px] flex items-center text-[var(--color-text-secondary)]">
            <Icon icon="ri:search-2-line" />
          </span>

          <input
            type="text"
            className="text-base h-min my-auto ml-[10px] w-full focus:outline-none placeholder:text-[var(--color-text-placeholder)]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules..."
          />
        </div>
        <div className="absolute bottom-15 left-1/2 -translate-x-1/2 flex md:hidden items-center text-xs text-[var(--color-border)] font-[Poppins-Light]">
          scroll for more
          <Icon icon="ri:arrow-down-long-line" />
        </div>
      </div>

      {loading ? (
        <CardGrid>
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </CardGrid>
      ) : (
        <CardGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((mod) => (
            <div
              key={mod.id}
              className="border border-[var(--color-border)] rounded-[20px] p-[30px] transition duration-200 ease-in-out cursor-pointer box-border w-full flex flex-col hover:shadow-[var(--shadow-box-hover)] hover:-translate-y-[4px] max-md:p-5 max-[480px]:p-[15px]"
              onClick={() =>
                navigate(`/notes/${courseCode}/${mod.id}`, {
                  state: course ? { course, module: mod } : undefined,
                })
              }
            >
              <h3 className="font-medium text-[14px] font-['Poppins-Bold'] truncate m-0 w-full box-border">
                {mod.title}
              </h3>

              <div className="mb-4 flex items-center gap-1 text-[12px]">
                <Icon
                  icon={
                    mod.verified
                      ? "ri:verified-badge-line"
                      : "ri:close-circle-line"
                  }
                  width="16"
                />
                <span>{mod.verified ? "Verified" : "Not verified"}</span>
              </div>

              <div className="flex items-center text-[0.75rem] opacity-75 w-full box-border max-[480px]:text-[0.7rem]">
                <Icon icon="ri:pen-nib-line" className="mr-[7px]" />
                {mod.notes?.[0]?.author?.username ?? "Unknown"}
              </div>
            </div>
          ))}
        </CardGrid>
      )}
    </div>
    </>
  );
}

export default Modules;

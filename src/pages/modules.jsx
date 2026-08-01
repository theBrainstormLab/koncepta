import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import { supabase } from "../utils/supabase";
import CardSkeleton from "../components/CardSkeleton";
import CardGrid from "../components/CardGrid";

function Modules() {
  const [query, setQuery] = useState("");
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { state: course } = useLocation();

  useEffect(() => {
    async function fetchModules() {
      try {
        const { data, error } = await supabase
          .from("modules")
          .select("id, title, created_at")
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
  }, [course.id]);

  const filtered = modules.filter((mod) =>
    mod.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="mt-10">
      <h1 className="text-center font-['DynaPuff'] text-[36px] font-bold tracking-[1px] text-[var(--color-text)] text-shadow-[var(--shadow-text)]">
        {course.title}
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

      {loading ? (
        <CardGrid>
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </CardGrid>
      ) : (
        <CardGrid>
          {filtered.map((mod) => (
            <div
              key={mod.id}
              className="border border-[var(--color-border)] rounded-[20px] p-[30px] transition duration-200 ease-in-out cursor-pointer box-border w-full flex flex-col hover:shadow-[var(--shadow-box-hover)] hover:-translate-y-[4px] max-md:p-5 max-[480px]:p-[15px]"
              onClick={() =>
                navigate("/note-view", { state: { course, module: mod } })
              }
            >
              <h3 className="font-medium text-[14px] font-['Poppins-Bold'] truncate m-0 w-full box-border">
                {mod.title}
              </h3>

              <p className="text-[14px] mb-4 w-full box-border break-words m-0 max-[480px]:text-[13px]">
                {course.code}
              </p>

              <div className="flex items-center text-[0.75rem] opacity-75 w-full box-border max-[480px]:text-[0.7rem]">
                <Icon icon="ri:pen-nib-line" className="mr-[7px]" />
                {course.title}
              </div>
            </div>
          ))}
        </CardGrid>
      )}
    </div>
  );
}

export default Modules;

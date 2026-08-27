import { useState, useEffect } from "react";
import { Icon } from "../components/Icon";
import { useNavigate } from "react-router-dom";
import { fetchCourses } from "../api/courses";
import { useTitle } from "../utils/useTitle";
import CardSkeleton from "../components/CardSkeleton";
import CardGrid from "../components/CardGrid";

export default function Home() {
  useTitle("koncepta");
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("Computer science");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  return (
    <div className="min-h-[100svh] mt-0 md:mt-10 md:min-h-[calc(100svh-235.9px)]">
      <div className="min-h-[100svh] sm:min-h-[100svh] md:min-h-[calc(100svh-200px)] flex flex-col justify-center">
        <div>
          <div className="font-[DynaPuff] text-center font-bold pb-5 sm:text-5xl lg:text-6xl text-4xl text-shadow-[var(--shadow-text)]">
            <h1 className="pb-2">learn koncept</h1>
            <h1 className="pt-2">with us, using AI</h1>
          </div>
          <div className="md:text-base sm:text-sm text-xs text-center">
            Get the notes you were searching everywhere for.
            <br />
            Understand things faster without the panic.
          </div>

          <div className="w-[454px] h-[60px] rounded-[20px] flex px-4 mx-auto border-2 border-[var(--color-border)] my-12 box-border max-md:w-[90%] max-md:max-w-[454px] max-md:h-[50px] max-md:my-8 max-[480px]:h-[36px] max-[480px]:px-3 max-[480px]:my-6 max-[480px]:rounded-[12px]">
            <span className="text-[24px] flex items-center text-[var(--color-text-secondary)]">
              <Icon icon="ri:search-2-line" />
            </span>
            <input
              type="text"
              className="text-base h-min my-auto ml-[10px] w-full focus:outline-none placeholder:text-[var(--color-text-secondary)]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
            />
            <div className="flex cursor-pointer bg-[var(--color-bg-tertiary)] rounded-[10px] mx-auto px-2 my-3 text-sm">
              <select
                className="appearance-none cursor-pointer"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="Computer science">Computer science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Biology">Biology</option>
              </select>
              <span className="text-base flex items-center">
                <Icon icon="ri:arrow-drop-down-line" />
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-15  left-1/2 -translate-x-1/2 flex items-center text-xs text-[var(--color-border)] font-[Poppins-Light]">
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
        <CardGrid>
          {courses.map((course) => (
            <div
              key={course.id}
              className="border border-[var(--color-border)] rounded-[20px] p-[30px] transition duration-200 ease-in-out cursor-pointer box-border w-full flex flex-col hover:shadow-[var(--shadow-box-hover)] hover:-translate-y-[4px] max-md:p-5 max-[480px]:p-[15px]"
              onClick={() =>
                navigate(`/notes/${course.code}`, { state: course })
              }
            >
              <h3 className="font-medium text-[14px] font-['Poppins-Bold'] truncate m-0 w-full box-border shrink">
                {course.title}
              </h3>

              <p className="text-[14px] mb-4 w-full box-border break-words m-0 max-[480px]:text-[13px]">
                {course.code}
              </p>

              <div className="flex items-center text-[0.75rem] opacity-75 w-full box-border max-[480px]:text-[0.7rem]">
                <Icon icon="ri:book-2-line" className="mr-[7px]" />
                {course.degreeName}
              </div>
            </div>
          ))}
        </CardGrid>
      )}
    </div>
  );
}

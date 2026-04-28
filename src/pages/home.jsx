import { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("Computer science");
  const navigate = useNavigate();

  const courses = Array.from({ length: 9 }, () => ({
    title: "Data structures and algorithms",
    code: "CS3716451",
    degree: "BSc Computer science",
    modules: ["Arrays", "Linked Lists", "Stacks", "Queues", "Trees", "Graphs"],
  }));

  return (
    <div>
      <div className="font-[DynaPuff] text-center font-bold pt-22 pb-5 sm:text-5xl lg:text-6xl text-4xl text-shadow-[0_4px_4px_#fafaf826]">
        <h1 className="pb-2">learn koncept</h1>
        <h1 className="pt-2">with us, using AI</h1>
      </div>
      <div className="md:text-base sm:text-sm text-xs text-center">
        Get the notes you were searching everywhere for.
        <br />
        Understand things faster without the panic.
      </div>

      <div className="w-[454px] h-[60px] rounded-[20px] flex px-4 mx-auto border-2 border-[#fafaf880] my-12 box-border max-md:w-[90%] max-md:max-w-[454px] max-md:h-[50px] max-md:my-8 max-[480px]:h-[36px] max-[480px]:px-3 max-[480px]:my-6 max-[480px]:rounded-[12px]">
        <span className="text-[24px] flex items-center text-[#fafaf8b2]">
          <Icon icon="ri:search-2-line" />
        </span>
        <input
          type="text"
          className="text-base h-min my-auto ml-[10px] w-full focus:outline-none placeholder:text-[#6b6b6b]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
        />
        <div className="flex cursor-pointer bg-[#39393d] rounded-[10px] mx-auto px-2 my-3 text-sm">
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

      <div className="flex justify-center items-center text-xs text-[#fafaf880] my-24 font-[Poppins-Light]">
        scroll for more <Icon icon="ri:arrow-down-long-line" />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] p-[100px] gap-10 box-border max-md:px-5 max-md:py-[50px] max-md:gap-6 max-[480px]:grid-cols-1 max-[480px]:px-[10px] max-[480px]:py-[30px] max-[480px]:gap-4">
        {courses.map((course, i) => (
          <div
            key={i}
            className="border border-[#fafaf880] rounded-[20px] p-[30px] transition duration-200 ease-in-out cursor-pointer box-border w-full flex flex-col hover:shadow-[0_10px_25px_rgba(0,0,0,0.2)] hover:-translate-y-[4px] max-md:p-5 max-[480px]:p-[15px]"
            onClick={() => navigate("/modules", { state: course })}
          >
            <h3 className="font-medium text-[14px] font-['Poppins-Bold'] truncate m-0 w-full box-border shrink">
              {course.title}
            </h3>
            <p className="text-[14px] mb-4 w-full box-border break-words m-0 max-[480px]:text-[13px]">
              {course.code}
            </p>
            <div className="flex items-center text-[0.75rem] opacity-75 w-full box-border max-[480px]:text-[0.7rem]">
              <Icon icon="ri:book-2-line" className="mr-[7px]" />
              {course.degree}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

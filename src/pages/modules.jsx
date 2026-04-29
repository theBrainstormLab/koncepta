import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Icon } from "@iconify-icon/react";

function Modules() {
  const [query, setQuery] = useState("");

  const { state } = useLocation();
  const course = state;

  return (
    <div className="mt-10">
      <h1 className="text-center font-['DynaPuff'] text-[36px] font-bold tracking-[1px] text-[#FAFAF8] text-shadow-[0_4px_4px_#fafaf826]">
        {course.title}
      </h1>

      <div className="w-[454px] h-[60px] rounded-[20px] flex px-4 mx-auto border-2 border-[#fafaf880] mt-12 mb-0 box-border max-md:w-[90%] max-md:max-w-[454px] max-md:h-[50px] max-md:mt-8 max-md:mb-0 max-[480px]:h-[36px] max-[480px]:px-3 max-[480px]:mt-6 max-[480px]:mb-0 max-[480px]:rounded-[12px]">
        <span className="text-[24px] flex items-center text-[#fafaf8b2]">
          <Icon icon="ri:search-2-line" />
        </span>

        <input
          type="text"
          className="text-base h-min my-auto ml-[10px] w-full focus:outline-none placeholder:text-[#6b6b6b]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search modules..."
        />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] p-[100px] gap-10 box-border max-md:px-5 max-md:py-[50px] max-md:gap-6 max-[480px]:grid-cols-1 max-[480px]:px-[10px] max-[480px]:py-[30px] max-[480px]:gap-4">
        {course.modules
          .filter((mod) => mod.toLowerCase().includes(query.toLowerCase()))
          .map((mod, i) => (
            <div
              key={i}
              className="border border-[#fafaf880] rounded-[20px] p-[30px] transition duration-200 ease-in-out cursor-pointer box-border w-full flex flex-col hover:shadow-[0_10px_25px_rgba(0,0,0,0.2)] hover:-translate-y-[4px] max-md:p-5 max-[480px]:p-[15px]"
            >
              <h3 className="font-medium text-[14px] font-['Poppins-Bold'] truncate m-0 w-full box-border">
                {mod}
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
      </div>
    </div>
  );
}

export default Modules;

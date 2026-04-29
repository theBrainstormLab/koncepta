import { useLocation } from "react-router-dom";
import { Icon } from "@iconify-icon/react";

export default function NoteView() {
  const { state } = useLocation();
  const course = state.course;
  const index = state.i;

  console.log(state);

  return (
    <div className="grid grid-cols-[1fr_3fr_1.3fr] gap-8">
      {/* overview */}
      <div className="flex flex-col gap-6 pt-1 mx-3">
        <div className="bg-[#39393d] w-9 h-9 rounded-[10px] flex items-center justify-center cursor-pointer">
          <Icon icon="ri:menu-4-line" width="22" height="22" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h4 className="font-[DynaPuff] font-bold tracking-[0.04em] text-sm uppercase">
            Overview of Data structures
          </h4>
          <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[#FAFAF899] hover:text-white">
            <span className="shrink-0 text-[#FAFAF860] group-hover:text-white">
              1.
            </span>
            <span>Data type vs Data structure</span>
          </div>
          <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[#FAFAF899] hover:text-white">
            <span className="shrink-0 text-[#FAFAF860] group-hover:text-white">
              2.
            </span>
            <span>Abstract Data type (ADT)</span>
          </div>
          <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[#FAFAF899] hover:text-white">
            <span className="shrink-0 text-[#FAFAF860] group-hover:text-white">
              3.
            </span>
            <span>Definition of Data Structure</span>
          </div>
          <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[#FAFAF899] hover:text-white">
            <span className="shrink-0 text-[#FAFAF860] group-hover:text-white">
              4.
            </span>
            <span>Data Structure classification...</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <h4 className="font-[DynaPuff] font-bold tracking-[0.04em] text-sm uppercase">
            Overview of Data structures
          </h4>
          <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[#FAFAF899] hover:text-white">
            <span className="shrink-0 text-[#FAFAF860] group-hover:text-white">
              1.
            </span>
            <span>Data type vs Data structure</span>
          </div>
          <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[#FAFAF899] hover:text-white">
            <span className="shrink-0 text-[#FAFAF860] group-hover:text-white">
              2.
            </span>
            <span>Abstract Data type (ADT)</span>
          </div>
          <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[#FAFAF899] hover:text-white">
            <span className="shrink-0 text-[#FAFAF860] group-hover:text-white">
              3.
            </span>
            <span>Definition of Data Structure</span>
          </div>
          <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[#FAFAF899] hover:text-white">
            <span className="shrink-0 text-[#FAFAF860] group-hover:text-white">
              4.
            </span>
            <span>Data Structure classification...</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <h4 className="font-[DynaPuff] font-bold tracking-[0.04em] text-sm uppercase">
            Overview of Data structures
          </h4>
          <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[#FAFAF899] hover:text-white">
            <span className="shrink-0 text-[#FAFAF860] group-hover:text-white">
              1.
            </span>
            <span>Data type vs Data structure</span>
          </div>
          <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[#FAFAF899] hover:text-white">
            <span className="shrink-0 text-[#FAFAF860] group-hover:text-white">
              2.
            </span>
            <span>Abstract Data type (ADT)</span>
          </div>
          <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[#FAFAF899] hover:text-white">
            <span className="shrink-0 text-[#FAFAF860] group-hover:text-white">
              3.
            </span>
            <span>Definition of Data Structure</span>
          </div>
          <div className="group flex gap-2 text-[12px] tracking-[0.03em] cursor-pointer px-1 py-0.5 rounded-md text-[#FAFAF899] hover:text-white">
            <span className="shrink-0 text-[#FAFAF860] group-hover:text-white">
              4.
            </span>
            <span>Data Structure classification...</span>
          </div>
        </div>
      </div>

      {/* main contents */}
      <div className="mb-20">
        <h1 className="font-[DynaPuff] font-bold text-shadow-[0_4px_4px_#fafaf826] text-4xl tracking-[0.05em]">
          {course.modules[index]}
        </h1>

        <div className="h-px bg-[#FAFAF826] mt-1"></div>

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

        <div className="text-[#FAFAF8BF] text-sm mt-20">
          <div className="flex">
            <Icon
              icon="ri:ball-pen-line"
              className="flex mr-1.5 items-center"
            />
            <h4>Martin Scorsese</h4>
          </div>
          <h4>Last edited: 2d ago</h4>
        </div>
      </div>

      {/* chatbot */}
      <div className="bg-red-500">chatbot</div>
    </div>
  );
}

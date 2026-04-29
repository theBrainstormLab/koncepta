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
      <div className="bg-red-500">overview</div>

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
            <Icon icon="ri:ball-pen-line" className="flex mr-1.5 items-center" />
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

function About() {
  const aboutData = [
    {
      title: "who we are",
      text: `Koncepta started as a small idea between students who were tired of chasing notes across random folders, half-broken PDFs, and group chats that never stay quiet. FYUGP at Calicut University can feel confusing, with results taking their own sweet time and grading that keeps everyone guessing. In the middle of all that noise, we wanted one place that felt calm, clear, and actually helpful. That became Koncepta.`,
    },
    {
      title: "what we do",
      text: `We collect notes, explanations, and little nuggets of clarity shared by students and teachers. Then we clean them up and turn them into simple guides that feel friendly and easy to read. No heavy language, no headache, just study material that actually makes sense and feels doable, even on those tired late-night study sessions.`,
    },
    {
      title: "we're still figuring things out",
      text: `Koncepta isn’t perfect, and we’re not trying to act like it is. Some subjects might be missing, some notes might need a tweak, and that’s okay. This place grows because people pitch in. Every small correction, tiny suggestion, or shared note helps it become a little better than it was yesterday.`,
    },
    {
      title: "made better by everyone",
      text: `Koncepta works because the community does. It’s slowly turning into a space built by all of us, for all of us, one shared bit of understanding at a time.`,
    },
  ];
  return (
    <div className="h-[calc(100svh-200px)] overflow-y-scroll snap-y snap-mandatory no-scrollbar">
      {aboutData.map((section, index) => (
        <div
          key={index}
          className="h-full flex items-center justify-center snap-start"
        >
          <div className="flex flex-col flex-row items-center gap-[88px]">
            <h1 className="font-[DynaPuff] font-bold w-[407px] text-[36px] text-left text-shadow-[0_4px_4px_#fafaf826]">
              {section.title}
            </h1>

            <p className="w-[565px] text-[18px] text-left">{section.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
export default About;

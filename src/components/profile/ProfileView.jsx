import { HEADING } from "../../utils/profileConstants";
import { Page, ProfileHeader, NotesGrid } from "./ProfileParts";

// Temporary mock data.
// Replace with Supabase query later.
const notes = [
  {
    title: "Operating Systems",
    code: "CS203",
    course: "BSc Computer Science",
  },
  {
    title: "Database Management Systems",
    code: "CS202",
    course: "BSc Computer Science",
  },
  {
    title: "Data Structures and Algorithms",
    code: "CS201",
    course: "BSc Computer Science",
  },
  {
    title: "Software Project Management",
    code: "CSC3CJ201",
    course: "BSc Computer Science",
  },
];

export function ProfileView({
  username,
  editable = false,
  email,
  onCreateNote,
}) {
  return (
    <Page>
      <ProfileHeader
        username={username}
        notesCount={notes.length}
        editable={editable}
        email={email}
        onCreateNote={onCreateNote}
      />

      <div className="mt-7">
        <h2 className={`${HEADING} text-xl`}>
          {editable ? "your notes" : "notes"}
        </h2>

        <NotesGrid notes={notes} editable={editable} />
      </div>
    </Page>
  );
}

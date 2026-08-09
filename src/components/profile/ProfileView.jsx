import { HEADING } from "../../utils/profileConstants";
import { Page, ProfileHeader, NotesGrid } from "./ProfileParts";

export function ProfileView({
  username,
  notes = [],
  editable = false,
  email,
  onCreateNote,
  onLogout,
  onUsernameChange,
  usernameError,
  savingUsername,
}) {
  return (
    <Page>
      <ProfileHeader
        username={username}
        notesCount={notes.length}
        editable={editable}
        email={email}
        onCreateNote={onCreateNote}
        onLogout={onLogout}
        onUsernameChange={onUsernameChange}
        usernameError={usernameError}
        savingUsername={savingUsername}
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

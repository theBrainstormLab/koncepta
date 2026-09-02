import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { SCREENS } from "../utils/profileConstants";
import { useTitle } from "../utils/useTitle";
import { AuthShell } from "../components/profile/AuthShell";
import ProfileSkeleton from "../components/profile/ProfileSkeleton";
import { EditorView } from "../components/profile/EditorView";
import { ProfileView } from "../components/profile/ProfileView";
import { fetchCourses } from "../api/courses";
import { fetchModules, ensureModuleId } from "../api/modules";
import {
  fetchUserById,
  fetchUserByUsername,
  changeUsername,
} from "../api/users";
import {
  fetchNotesByAuthorId,
  fetchNoteById,
  fetchNoteByModuleId,
  createNote,
  updateNote,
  deleteNote,
} from "../api/notes";

export default function Profile() {
  const { username } = useParams();

  useTitle(username ?? "profile");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [screen, setScreen] = useState(SCREENS.OVERVIEW);

  const [profile, setProfile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [usernameError, setUsernameError] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);
  const [modules, setModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    let active = true;
    let subscription;

    const syncLoggedInProfile = async (sessionUser) => {
      const user = await fetchUserById(sessionUser.id);
      if (!active) return;

      const userNotes = await fetchNotesByAuthorId(sessionUser.id);
      if (!active) return;

      setProfile({
        id: sessionUser.id,
        username:
          user?.username ??
          sessionUser.user_metadata?.username ??
          sessionUser.email?.split("@")[0] ??
          "Anonymoooooose",
        email: sessionUser.email ?? "",
      });
      setNotes(userNotes);
    };

    const syncPublicProfile = async (publicUsername) => {
      const user = await fetchUserByUsername(publicUsername);
      if (!active) return;

      if (!user) {
        setProfile(null);
        setNotes([]);
        return;
      }

      const userNotes = await fetchNotesByAuthorId(user.id);
      if (!active) return;

      setProfile(user);
      setNotes(userNotes);
    };

    (async () => {
      setLoading(true);

      try {
        const { supabase } = await import("../utils/supabase");

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!active) return;

        setIsLoggedIn(!!session);

        if (username) {
          await syncPublicProfile(username);
        } else if (!session) {
          setProfile(null);
          setNotes([]);
          setScreen(SCREENS.OVERVIEW);
        } else {
          await syncLoggedInProfile(session.user);
        }

        const {
          data: { subscription: sub },
        } = supabase.auth.onAuthStateChange((event, authSession) => {
          if (username) return;

          setIsLoggedIn(!!authSession);

          if (!authSession) {
            setProfile(null);
            setNotes([]);
            setScreen(SCREENS.OVERVIEW);
            return;
          }

          if (window.location.hash) {
            window.history.replaceState(null, "", window.location.pathname);
          }

          void syncLoggedInProfile(authSession.user);
        });

        subscription = sub;
      } catch (error) {
        console.error(error);
        if (!active) return;
        setProfile(null);
        setNotes([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, [username]);

  const handleUsernameChange = async (nextUsername) => {
    if (!profile) return;

    setSavingUsername(true);
    setUsernameError("");

    const { data, error } = await changeUsername(profile.id, nextUsername);

    setSavingUsername(false);

    if (error) {
      setUsernameError(error);
      return false;
    }

    setProfile((prev) => ({ ...prev, ...data }));
    return true;
  };

  const handleOpenEditor = async () => {
    setPublishError("");
    setEditingNote(null);
    setModulesLoading(true);

    const [courseList, moduleList] =
      courses.length > 0 && modules.length > 0
        ? [courses, modules]
        : await Promise.all([fetchCourses(), fetchModules()]);

    setCourses(courseList);
    setModules(moduleList);
    setModulesLoading(false);
    setScreen(SCREENS.EDITOR);
  };

  const handleEditNote = async (note) => {
    setPublishError("");
    setModulesLoading(true);

    const [courseList, moduleList, fullNote] = await Promise.all([
      courses.length > 0 ? Promise.resolve(courses) : fetchCourses(),
      modules.length > 0 ? Promise.resolve(modules) : fetchModules(),
      fetchNoteById(note.id),
    ]);

    setCourses(courseList);
    setModules(moduleList);
    setModulesLoading(false);

    if (!fullNote) {
      setPublishError("Couldn't load that note. Try again.");
      return;
    }

    setEditingNote(fullNote);
    setScreen(SCREENS.EDITOR);
  };

  const handleDeleteNote = async (note) => {
    const confirmed = window.confirm(
      `Delete "${note.moduleTitle}"? This can't be undone.`,
    );
    if (!confirmed) return;

    const { error } = await deleteNote(note.id);

    if (error) {
      console.error(error);
      return;
    }

    const userNotes = await fetchNotesByAuthorId(profile.id);
    setNotes(userNotes);
  };

  const handlePublish = async (draft) => {
    if (!profile) return false;

    setPublishing(true);
    setPublishError("");

    const { data: moduleId, error: moduleError } = await ensureModuleId(
      draft.courseId,
      draft.moduleTitle,
    );

    if (moduleError) {
      setPublishing(false);
      setPublishError(moduleError);
      return false;
    }

    if (!draft.noteId) {
      const existing = await fetchNoteByModuleId(moduleId);

      if (existing) {
        setPublishing(false);
        setPublishError(
          "That topic already has a note. Write something new or edit your own note from your profile.",
        );
        return false;
      }
    }

    const { error } = draft.noteId
      ? await updateNote({
          noteId: draft.noteId,
          moduleId,
          content: draft.body,
        })
      : await createNote({
          authorId: profile.id,
          moduleId,
          content: draft.body,
        });

    setPublishing(false);

    if (error) {
      setPublishError(error);
      return false;
    }

    const userNotes = await fetchNotesByAuthorId(profile.id);
    setNotes(userNotes);
    setEditingNote(null);
    setScreen(SCREENS.OVERVIEW);
    return true;
  };

  const handleLogout = async () => {
    const { supabase } = await import("../utils/supabase");
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
    }
  };

  if (loading) return <ProfileSkeleton />;

  if (username) {
    return (
      <ProfileView
        username={profile?.username ?? username}
        email={profile?.email}
        notes={notes}
        editable={false}
      />
    );
  }

  if (!isLoggedIn) {
    return <AuthShell />;
  }

  if (screen === SCREENS.EDITOR) {
    return (
      <EditorView
        userId={profile?.id}
        noteId={editingNote?.id ?? null}
        initialTitle={editingNote?.title ?? ""}
        initialCourseId={editingNote?.module?.course_id ?? ""}
        initialModuleTitle={editingNote?.module?.title ?? ""}
        initialBody={editingNote?.content ?? ""}
        courses={courses}
        modules={modules}
        modulesLoading={modulesLoading}
        onBack={() => {
          setEditingNote(null);
          setScreen(SCREENS.OVERVIEW);
        }}
        onPublish={handlePublish}
        publishing={publishing}
        publishError={publishError}
      />
    );
  }

  return (
    <ProfileView
      username={profile?.username ?? "Anonymoooooose"}
      email={profile?.email}
      notes={notes}
      editable
      onCreateNote={handleOpenEditor}
      onLogout={handleLogout}
      onUsernameChange={handleUsernameChange}
      usernameError={usernameError}
      savingUsername={savingUsername}
      onEditNote={handleEditNote}
      onDeleteNote={handleDeleteNote}
    />
  );
}

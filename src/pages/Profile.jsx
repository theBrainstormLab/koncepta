import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../utils/supabase";

import { SCREENS } from "../utils/profileConstants";
import { AuthShell } from "../components/profile/AuthShell";
import { EditorView } from "../components/profile/EditorView";
import { ProfileView } from "../components/profile/ProfileView";

function mapNotes(rows) {
  return (rows ?? []).map((note) => {
    const course = note.module?.course;
    const degree = course?.degree;

    return {
      id: note.id,
      title: note.title,
      code: course?.code ?? note.module?.title ?? "—",
      course: degree?.name
        ? `${degree.name} · ${course.title}`
        : (course?.title ?? note.module?.title ?? "—"),
    };
  });
}

async function fetchNotesByAuthorId(authorId) {
  const { data, error } = await supabase
    .from("notes")
    .select(
      `
      id,
      title,
      created_at,
      module:modules (
        id,
        title,
        course:courses (
          id,
          title,
          code,
          degree:degrees (
            id,
            name
          )
        )
      )
    `,
    )
    .eq("author_id", authorId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch notes:", error);
    return [];
  }

  return mapNotes(data);
}

async function fetchUserById(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("id, username, email")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }

  return data;
}

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,50}$/;

async function changeUsername(userId, nextUsername) {
  const trimmed = nextUsername.trim();

  if (!USERNAME_PATTERN.test(trimmed)) {
    return {
      error:
        "Username must be 3-50 characters (letters, numbers, underscores only).",
    };
  }

  const { data, error } = await supabase
    .from("users")
    .update({ username: trimmed })
    .eq("id", userId)
    .select("id, username, email")
    .single();

  if (error) {
    console.error("Failed to change username:", error);

    if (error.code === "23505") {
      return { error: "That username is already taken." };
    }

    return { error: "Something went wrong. Try again." };
  }

  const { error: metaError } = await supabase.auth.updateUser({
    data: { username: trimmed },
  });

  if (metaError) {
    console.error("Failed to sync auth metadata:", metaError);
  }

  return { data };
}

async function fetchCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      title,
      code,
      degree:degrees ( id, name )
    `,
    )
    .order("code", { ascending: true });

  if (error) {
    console.error("Failed to fetch courses:", error);
    return [];
  }

  return (data ?? []).map((course) => ({
    id: course.id,
    code: course.code,
    title: course.title,
    degreeName: course.degree?.name ?? "",
  }));
}

async function fetchModules() {
  const { data, error } = await supabase
    .from("modules")
    .select(
      `
      id,
      title,
      course_id,
      course:courses (
        id,
        title,
        code,
        degree:degrees (
          id,
          name
        )
      )
    `,
    )
    .order("title", { ascending: true });

  if (error) {
    console.error("Failed to fetch modules:", error);
    return [];
  }

  return (data ?? []).map((mod) => ({
    id: mod.id,
    title: mod.title,
    courseId: mod.course_id,
    courseCode: mod.course?.code ?? "",
    courseTitle: mod.course?.title ?? "",
    degreeName: mod.course?.degree?.name ?? "",
  }));
}

async function ensureModuleId(courseId, moduleTitle) {
  const trimmed = moduleTitle.trim();

  if (!courseId) return { error: "Pick a paper first." };
  if (!trimmed) return { error: "Give the topic a name." };

  const { data: existing, error: findError } = await supabase
    .from("modules")
    .select("id")
    .eq("course_id", courseId)
    .ilike("title", trimmed)
    .maybeSingle();

  if (findError) {
    console.error("Failed to look up module:", findError);
    return { error: "Something went wrong. Try again." };
  }

  if (existing) return { data: existing.id };

  const { data: created, error: createError } = await supabase
    .from("modules")
    .insert({ course_id: courseId, title: trimmed })
    .select("id")
    .single();

  if (createError) {
    console.error("Failed to create module:", createError);
    return { error: "Couldn't create that topic. Try again." };
  }

  return { data: created.id };
}

async function fetchNoteById(noteId) {
  const { data, error } = await supabase
    .from("notes")
    .select(
      `
      id,
      title,
      content,
      module:modules ( id, title, course_id )
    `,
    )
    .eq("id", noteId)
    .single();

  if (error) {
    console.error("Failed to fetch note:", error);
    return null;
  }

  return data;
}

async function createNote({ authorId, moduleId, title, content }) {
  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle) return { error: "Give your note a title first." };
  if (!moduleId) return { error: "Pick a module for this note." };
  if (!trimmedContent) return { error: "Your note is empty." };

  const { data, error } = await supabase
    .from("notes")
    .insert({
      author_id: authorId,
      module_id: moduleId,
      title: trimmedTitle,
      content: trimmedContent,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create note:", error);
    return { error: "Couldn't publish your note. Try again." };
  }

  return { data };
}

async function updateNote({ noteId, moduleId, title, content }) {
  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle) return { error: "Give your note a title first." };
  if (!moduleId) return { error: "Pick a module for this note." };
  if (!trimmedContent) return { error: "Your note is empty." };

  const { data, error } = await supabase
    .from("notes")
    .update({
      module_id: moduleId,
      title: trimmedTitle,
      content: trimmedContent,
      updated_at: new Date().toISOString(),
    })
    .eq("id", noteId)
    .select("id")
    .single();

  if (error) {
    console.error("Failed to update note:", error);
    return { error: "Couldn't save your changes. Try again." };
  }

  return { data };
}

async function deleteNote(noteId) {
  const { error } = await supabase.from("notes").delete().eq("id", noteId);

  if (error) {
    console.error("Failed to delete note:", error);
    return { error: "Couldn't delete that note. Try again." };
  }

  return { data: true };
}

async function fetchUserByUsername(username) {
  const { data, error } = await supabase
    .from("users")
    .select("id, username, email")
    .eq("username", username)
    .single();

  if (error) {
    console.error("Failed to fetch public user:", error);
    return null;
  }

  return data;
}

export default function Profile() {
  const { username } = useParams();

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

    const syncLoggedInProfile = async (sessionUser) => {
      const user = await fetchUserById(sessionUser.id);
      if (!active) return;

      const userNotes = await fetchNotesByAuthorId(sessionUser.id);
      if (!active) return;

      setProfile(
        user ?? {
          id: sessionUser.id,
          username:
            sessionUser.user_metadata?.username ??
            sessionUser.email?.split("@")[0] ??
            "Anonymoooooose",
          email: sessionUser.email ?? "",
        },
      );
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

    const initialize = async () => {
      setLoading(true);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!active) return;

        setIsLoggedIn(!!session);

        if (username) {
          await syncPublicProfile(username);
          return;
        }

        if (!session) {
          setProfile(null);
          setNotes([]);
          setScreen(SCREENS.OVERVIEW);
          return;
        }

        await syncLoggedInProfile(session.user);
      } catch (error) {
        console.error(error);
        if (!active) return;
        setProfile(null);
        setNotes([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    void initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (username) return;

      setIsLoggedIn(!!session);

      if (!session) {
        setProfile(null);
        setNotes([]);
        setScreen(SCREENS.OVERVIEW);
        return;
      }

      void syncLoggedInProfile(session.user);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
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

    setProfile(data);
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
      `Delete "${note.title}"? This can't be undone.`,
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

    const { error } = draft.noteId
      ? await updateNote({
          noteId: draft.noteId,
          moduleId,
          title: draft.title,
          content: draft.body,
        })
      : await createNote({
          authorId: profile.id,
          moduleId,
          title: draft.title,
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
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
    }
  };

  if (loading) return null;

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
    return <AuthShell isSignUp={isSignUp} setIsSignUp={setIsSignUp} />;
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

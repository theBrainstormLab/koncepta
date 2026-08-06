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
        onBack={() => setScreen(SCREENS.OVERVIEW)}
        onSaveDraft={(draft) => console.log("draft", draft)}
        onPublish={(draft) => console.log("publish", draft)}
      />
    );
  }

  return (
    <ProfileView
      username={profile?.username ?? "Anonymoooooose"}
      email={profile?.email}
      notes={notes}
      editable
      onCreateNote={() => setScreen(SCREENS.EDITOR)}
      onLogout={handleLogout}
    />
  );
}

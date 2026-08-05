import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../utils/supabase";

import { SCREENS } from "../utils/profileConstants";
import { AuthShell } from "../components/profile/AuthShell";
import { EditorView } from "../components/profile/EditorView";
import { ProfileView } from "../components/profile/ProfileView";

export default function Profile() {
  const { username } = useParams();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [screen, setScreen] = useState(SCREENS.OVERVIEW);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
    }
  };

  // Public profile
  if (username) {
    return <ProfileView username={username} editable={false} />;
  }

  // Authentication
  if (!isLoggedIn) {
    return <AuthShell isSignUp={isSignUp} setIsSignUp={setIsSignUp} />;
  }

  // Note editor
  if (screen === SCREENS.EDITOR) {
    return (
      <EditorView
        onBack={() => setScreen(SCREENS.OVERVIEW)}
        onSaveDraft={(draft) => {
          console.log("draft", draft);
        }}
        onPublish={(draft) => {
          console.log("publish", draft);
        }}
      />
    );
  }

  // Logged-in profile
  return (
    <ProfileView
      username="shaaanuu"
      editable
      email="shaaanuu@example.com"
      onCreateNote={() => setScreen(SCREENS.EDITOR)}
      onLogout={handleLogout}
    />
  );
}

import { useState } from "react";
import { useParams } from "react-router-dom";

import { SCREENS } from "../utils/profileConstants";
import { AuthShell } from "../components/profile/AuthShell";
import { EditorView } from "../components/profile/EditorView";
import { ProfileView } from "../components/profile/ProfileView";

export default function Profile() {
  const { username } = useParams();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [screen, setScreen] = useState(SCREENS.OVERVIEW);

  // Public profile
  if (username) {
    return <ProfileView username={username} editable={false} />;
  }

  // Authentication
  if (!isLoggedIn) {
    return (
      <AuthShell
        isSignUp={isSignUp}
        setIsSignUp={setIsSignUp}
        setIsLoggedIn={setIsLoggedIn}
      />
    );
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
    />
  );
}

import { supabase } from "../utils/supabase";

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,50}$/;

export async function fetchUserById(userId) {
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

export async function fetchUserByUsername(username) {
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

export async function changeUsername(userId, nextUsername) {
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

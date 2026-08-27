function draftKey(userId) {
  return `koncepta:draft:${userId}`;
}

function loadDraft(userId) {
  if (!userId) return null;

  try {
    const raw = localStorage.getItem(draftKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Failed to read local draft:", error);
    return null;
  }
}

function clearDraft(userId) {
  if (!userId) return;

  try {
    localStorage.removeItem(draftKey(userId));
  } catch (error) {
    console.error("Failed to clear local draft:", error);
  }
}

function resolveInitialDraft(userId, isEditing) {
  return !userId || isEditing ? null : loadDraft(userId);
}

export { draftKey, loadDraft, clearDraft, resolveInitialDraft };

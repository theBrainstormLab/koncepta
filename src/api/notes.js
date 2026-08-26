import { supabase } from "../utils/supabase";

function mapNotes(rows) {
  return (rows ?? []).map((note) => {
    const course = note.module?.course;
    const degree = course?.degree;

    return {
      id: note.id,
      moduleTitle: note.module?.title ?? "—",
      code: course?.code ?? note.module?.title ?? "—",
      course: degree?.name
        ? `${degree.name} · ${course.title}`
        : (course?.title ?? note.module?.title ?? "—"),
    };
  });
}

export async function fetchNotesByAuthorId(authorId) {
  const { data, error } = await supabase
    .from("notes")
    .select(
      `
      id,
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

export async function fetchNoteById(noteId) {
  const { data, error } = await supabase
    .from("notes")
    .select(
      `
      id,
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

export async function fetchNoteByModuleId(moduleId) {
  const { data, error } = await supabase
    .from("notes")
    .select("id")
    .eq("module_id", moduleId)
    .maybeSingle();

  if (error) {
    console.error("Failed to look up note:", error);
    return null;
  }

  return data;
}

export async function createNote({ authorId, moduleId, content }) {
  const trimmedContent = content.trim();

  if (!moduleId) return { error: "Pick a module for this note." };
  if (!trimmedContent) return { error: "Your note is empty." };

  const { data, error } = await supabase
    .from("notes")
    .insert({
      author_id: authorId,
      module_id: moduleId,
      content: trimmedContent,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create note:", error);

    if (error.code === "23505") {
      return { error: "Someone just published to that topic." };
    }

    return { error: "Couldn't publish your note. Try again." };
  }

  return { data };
}

export async function updateNote({ noteId, moduleId, content }) {
  const trimmedContent = content.trim();

  if (!moduleId) return { error: "Pick a module for this note." };
  if (!trimmedContent) return { error: "Your note is empty." };

  const { data, error } = await supabase
    .from("notes")
    .update({
      module_id: moduleId,
      content: trimmedContent,
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

export async function deleteNote(noteId) {
  const { error } = await supabase.from("notes").delete().eq("id", noteId);

  if (error) {
    console.error("Failed to delete note:", error);
    return { error: "Couldn't delete that note. Try again." };
  }

  return { data: true };
}

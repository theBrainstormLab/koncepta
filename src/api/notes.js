import { supabase } from "../utils/supabase";

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

export async function fetchNotesByAuthorId(authorId) {
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

export async function fetchNoteById(noteId) {
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

export async function createNote({ authorId, moduleId, title, content }) {
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

export async function updateNote({ noteId, moduleId, title, content }) {
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

export async function deleteNote(noteId) {
  const { error } = await supabase.from("notes").delete().eq("id", noteId);

  if (error) {
    console.error("Failed to delete note:", error);
    return { error: "Couldn't delete that note. Try again." };
  }

  return { data: true };
}

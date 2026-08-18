import { supabase } from "../utils/supabase";

export async function fetchModules() {
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

// Finds an existing module (topic) under a course by name, or creates
// one if it doesn't exist yet. Case-insensitive so "arrays" and "Arrays"
// don't end up as two separate topics.
export async function ensureModuleId(courseId, moduleTitle) {
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

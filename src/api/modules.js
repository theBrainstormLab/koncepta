async function getSb() {
  const { supabase } = await import("../utils/supabase");
  return supabase;
}

export async function fetchModules() {
  const supabase = await getSb();
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
        degree:degrees ( id, name )
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

export async function fetchModuleById(moduleId) {
  const supabase = await getSb();
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
        degree:degrees ( id, name )
      )
    `,
    )
    .eq("id", moduleId)
    .single();

  if (error) {
    console.error("Failed to fetch module:", error);
    return null;
  }

  return data;
}

export async function fetchModulesByCourse(courseId) {
  const supabase = await getSb();
  const { data, error } = await supabase
    .from("modules")
    .select(
      `
      id,
      title,
      created_at,
      verified,
      notes (
        author:users!notes_author_id_fkey ( username )
      )
    `,
    )
    .eq("course_id", courseId);

  if (error) {
    console.error("Failed to fetch modules:", error);
    return [];
  }

  return data ?? [];
}

export async function ensureModuleId(courseId, moduleTitle) {
  const trimmed = moduleTitle.trim();
  if (!courseId) return { error: "Pick a paper first." };
  if (!trimmed) return { error: "Give the topic a name." };

  const supabase = await getSb();
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

  if (createError?.code === "23505") {
    const { data: raced, error: racedError } = await supabase
      .from("modules")
      .select("id")
      .eq("course_id", courseId)
      .ilike("title", trimmed)
      .maybeSingle();
    if (racedError || !raced) {
      console.error(
        "Failed to re-select module after conflict:",
        racedError ?? "not found",
      );
      return { error: "Couldn't create that topic. Try again." };
    }
    return { data: raced.id };
  }
  if (createError) {
    console.error("Failed to create module:", createError);
    return { error: "Couldn't create that topic. Try again." };
  }

  return { data: created.id };
}

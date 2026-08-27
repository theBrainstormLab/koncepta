async function getSb() {
  const { supabase } = await import("../utils/supabase");
  return supabase;
}

export async function fetchCourseByCode(code) {
  const supabase = await getSb();
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
    .ilike("code", code)
    .single();

  if (error) {
    console.error("Failed to fetch course:", error);
    return null;
  }

  return data;
}

export async function fetchCourses() {
  const supabase = await getSb();
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

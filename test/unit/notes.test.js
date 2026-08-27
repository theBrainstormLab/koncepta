import { describe, it, expect } from "vitest";
import { mapNotes } from "../../src/api/notes";

describe("mapNotes", () => {
  it("flattens nested course/degree into a readable course label", () => {
    const rows = [
      {
        id: "n1",
        module: {
          title: "Arrays",
          course: {
            title: "Data Structures",
            code: "CS201",
            degree: { name: "BSc" },
          },
        },
      },
    ];

    const [note] = mapNotes(rows);

    expect(note).toEqual({
      id: "n1",
      moduleTitle: "Arrays",
      code: "CS201",
      course: "BSc · Data Structures",
    });
  });

  it("falls back to the module title when course/degree are missing", () => {
    const [note] = mapNotes([{ id: "n2", module: { title: "Loops" } }]);

    expect(note.code).toBe("Loops");
    expect(note.course).toBe("Loops");
  });

  it("returns an empty array for null or undefined rows", () => {
    expect(mapNotes(null)).toEqual([]);
    expect(mapNotes(undefined)).toEqual([]);
  });
});

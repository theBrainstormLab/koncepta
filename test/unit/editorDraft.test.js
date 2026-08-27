import { describe, it, expect, beforeEach } from "vitest";
import {
  draftKey,
  loadDraft,
  resolveInitialDraft,
} from "../../src/components/profile/editorDraft";

describe("editor draft storage", () => {
  beforeEach(() => localStorage.clear());

  it("builds a namespaced key per user", () => {
    expect(draftKey("u1")).toBe("koncepta:draft:u1");
  });

  it("returns null without a user", () => {
    expect(loadDraft("")).toBeNull();
  });

  it("reads back a saved draft", () => {
    const draft = { courseId: "c1", moduleTitle: "Arrays", body: "hi" };
    localStorage.setItem(draftKey("u1"), JSON.stringify(draft));
    expect(loadDraft("u1")).toEqual(draft);
  });

  it("returns null on corrupt json", () => {
    localStorage.setItem(draftKey("u1"), "{not json");
    expect(loadDraft("u1")).toBeNull();
  });

  it("does not restore while editing an existing note", () => {
    localStorage.setItem(draftKey("u1"), JSON.stringify({ courseId: "c1" }));
    expect(resolveInitialDraft("u1", true)).toBeNull();
  });

  it("does not restore without a user", () => {
    expect(resolveInitialDraft("", false)).toBeNull();
  });

  it("restores a fresh draft", () => {
    const draft = { courseId: "c1", moduleTitle: "Arrays", body: "x" };
    localStorage.setItem(draftKey("u1"), JSON.stringify(draft));
    expect(resolveInitialDraft("u1", false)).toEqual(draft);
  });
});

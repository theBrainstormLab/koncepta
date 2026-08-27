import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import NoteView from "../../src/pages/NoteView";

vi.mock("../../src/utils/supabase", () => {
  const makeChain = () => {
    const chain = new Proxy(() => chain, { get: () => chain });
    return chain;
  };
  return { supabase: { from: () => makeChain() } };
});

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/notes/:courseCode/:moduleId" element={<NoteView />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("NoteView route guard", () => {
  it("renders NotFound for a non-UUID module id", () => {
    renderAt("/notes/CS201/not-a-uuid");
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders NotFound for a junk numeric module id", () => {
    renderAt("/notes/CS201/123");
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});

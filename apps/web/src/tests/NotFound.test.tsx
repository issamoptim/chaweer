import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { NotFound } from "@/app/pages/NotFound";

describe("NotFound", () => {
  it("renders the 404 page", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page introuvable")).toBeInTheDocument();
    expect(screen.getByText("Retour à l'accueil")).toBeInTheDocument();
  });
});

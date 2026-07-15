import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Home } from "@/app/pages/Home";

describe("Home", () => {
  it("renders the home page", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Chaweer")).toBeInTheDocument();
    expect(screen.getByText("Plateforme juridique marocaine")).toBeInTheDocument();
  });
});

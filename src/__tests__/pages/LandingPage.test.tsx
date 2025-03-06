import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

describe("LandingPage", () => {
  it("renders the landing page correctly", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <MemoryRouter>
          <LandingPage />
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByText(/The App to get kids off Apps!/i)).not.toBeNull();
  });
});

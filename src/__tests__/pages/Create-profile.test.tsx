import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreateProfile from "@/pages/Create-profile";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

describe("Create-profile", () => {
  it("renders the landing page correctly", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <MemoryRouter>
          <CreateProfile />
        </MemoryRouter>
      </ChakraProvider>
    );

    expect(screen.getByText(/Create Your Profile/i)).not.toBeNull();
  });
});

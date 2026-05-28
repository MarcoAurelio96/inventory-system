import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { server } from "../test/mocks/server"; 
import { http, HttpResponse } from "msw";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import React from "react";

import { ProductList } from "./product-list"; 

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={qc}>
        {children}
      </QueryClientProvider>
    );
  };
};
describe("ProductList", () => {
  it("muestra un indicador de carga mientras fetchea", () => {
    const { container } = render(<ProductList />, { wrapper: createWrapper() });
    
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("muestra los productos recibidos de la API", async () => {
    render(<ProductList />, { wrapper: createWrapper() });
    
    await waitFor(() => {
      expect(screen.getByText("Tablero roble macizo 40 mm")).toBeInTheDocument();
      expect(screen.getByText("Bisagra cazoleta 35 mm")).toBeInTheDocument();
    });
  });

  it("muestra un estado de error con un botón de reintento si falla la red", async () => {
    server.use(
      http.get('/api/products', () => HttpResponse.error())
    );

    render(<ProductList />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument(); 
      expect(screen.getByRole("button", { name: /reintentar/i })).toBeInTheDocument();
    });
  });
});
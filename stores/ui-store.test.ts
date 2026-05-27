import { renderHook, act } from "@testing-library/react";
import { useUIStore } from "./ui-store";

describe("useUIStore", () => {
  beforeEach(() => useUIStore.setState(useUIStore.getInitialState()));

  it("el estado inicial tiene searchQuery vacío y ninguna categoría seleccionada", () => {
    const { result } = renderHook(() => useUIStore());
    expect(result.current.searchQuery).toBe("");
    expect(result.current.selectedCategoryId).toBeNull();
  });

  it("resetFilters devuelve todos los filtros a sus valores iniciales", () => {
    const { result } = renderHook(() => useUIStore());
    act(() => { result.current.selectCategory("cat-maderas"); result.current.setSearchQuery("roble"); });
    act(() => { result.current.resetFilters(); });
    expect(result.current.searchQuery).toBe("");
    expect(result.current.selectedCategoryId).toBeNull();
  });
  
  it("permite cambiar el campo y el orden de ordenación (setSortBy, setSortOrder)", () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.setSortBy("price");
      result.current.setSortOrder("asc");
    });

    expect(result.current.sortBy).toBe("price");
    expect(result.current.sortOrder).toBe("asc");
  });

  it("permite abrir y cerrar el menú lateral (toggleSidebar)", () => {
    const { result } = renderHook(() => useUIStore());

    expect(result.current.sidebarOpen).toBe(true);

    act(() => {
      result.current.toggleSidebar();
    });
    expect(result.current.sidebarOpen).toBe(false);

    act(() => {
      result.current.toggleSidebar();
    });
    expect(result.current.sidebarOpen).toBe(true);
  });
});
"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/stores/ui-store";

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useUIStore();
  const [localValue, setLocalValue] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== searchQuery) {
        setSearchQuery(localValue);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localValue, setSearchQuery, searchQuery]);

  return (
    <div className="relative w-full max-w-md">
      <input
        type="search"
        placeholder="Buscar productos..."
        className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
    </div>
  );
}
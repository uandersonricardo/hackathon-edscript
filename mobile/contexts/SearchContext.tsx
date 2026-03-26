import { createContext, useContext, useState } from "react";

interface SearchContextValue {
  searchQuery: string;
  activeCategory: string | null;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string | null) => void;
  toggleCategory: (category: string) => void;
  clearFilters: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>("Cassino");

  const toggleCategory = (category: string) => {
    setActiveCategory((prev) => (prev === category ? null : category));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory(null);
  };

  return (
    <SearchContext.Provider
      value={{ searchQuery, activeCategory, setSearchQuery, setActiveCategory, toggleCategory, clearFilters }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used inside SearchProvider");
  return ctx;
}

import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState({
    price: 50000,
    brands: [],
    sort: "",
  });

  const clearFilters = () => {
    setFilters({
      price: 50000,
      brands: [],
      sort: "",
    });
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used inside FilterProvider");
  }
  return context;
};

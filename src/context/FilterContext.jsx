import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

const initialFilters = {
  price: 100000,
  brands: [],
  sortBy: "",
  attributes: {}
};

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(initialFilters);

  const clearFilters = () => setFilters(initialFilters);

  return (
    <FilterContext.Provider value={{ filters, setFilters, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export const useFilters = () => useContext(FilterContext);

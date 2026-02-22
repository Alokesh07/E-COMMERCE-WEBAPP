import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { categoriesAPI } from "../utils/api";

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState({
    price: 50000,
    brands: [],
    sort: "",
  });

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const clearFilters = () => {
    setFilters({
      price: 50000,
      brands: [],
      sort: "",
    });
  };

  // Fetch categories from backend
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const selectCategory = (category) => {
    setActiveCategory(category);
    setActiveSubcategory(null);
  };

  const selectSubcategory = (subcategory) => {
    setActiveSubcategory(subcategory);
  };

  const clearCategorySelection = () => {
    setActiveCategory(null);
    setActiveSubcategory(null);
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        clearFilters,
        categories,
        activeCategory,
        activeSubcategory,
        selectCategory,
        selectSubcategory,
        clearCategorySelection,
        loading,
        refetchCategories: fetchCategories,
      }}
    >
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

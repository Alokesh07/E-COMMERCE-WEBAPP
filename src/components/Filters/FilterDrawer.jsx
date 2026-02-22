import { useState } from "react";
import { SlidersHorizontal, ChevronRight } from "lucide-react";
import filtersData from "../../data/filters.json";
import SubFilterDrawer from "./SubFilterDrawer";
import { useFilters } from "../../context/FilterContext";

export default function FilterDrawer() {
  const [open, setOpen] = useState(false);
  const [subFilter, setSubFilter] = useState(null);

  const { filters, setFilters, clearFilters, categories, activeCategory, selectCategory } = useFilters();

  // Get category-specific filters
  const categoryKey = activeCategory?.slug;
  const categoryFilters = categoryKey
    ? filtersData[categoryKey]
    : null;

  return (
    <>
      {/* FILTER BUTTON */}
      <button
        className="btn btn-outline-dark w-100 d-flex gap-2 align-items-center"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal size={18} />
        Filters
      </button>

      {/* CATEGORIES SECTION */}
      <div className="mt-3">
        <h6 className="fw-semibold mb-2">Categories</h6>
        <div className="category-list">
          {categories.map((category) => (
            <div key={category._id} className="mb-2">
              <button
                className={`btn btn-sm w-100 text-start d-flex justify-content-between align-items-center ${
                  activeCategory?._id === category._id ? 'btn-dark' : 'btn-light'
                }`}
                onClick={() => selectCategory(category)}
              >
                <span>{category.name}</span>
                {category.subcategories?.length > 0 && (
                  <ChevronRight size={14} />
                )}
              </button>
              {/* Subcategories */}
              {activeCategory?._id === category._id && category.subcategories?.length > 0 && (
                <div className="ms-3 mt-2">
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub._id}
                      className="btn btn-sm btn-link text-start w-100 text-decoration-none text-dark"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr />

      {/* MAIN DRAWER */}
      {open && (
        <div className="offcanvas offcanvas-start show filter-slide-in">
          <div className="offcanvas-header border-bottom">
            <h5 className="fw-bold">Filters</h5>
            <button
              className="btn-close"
              onClick={() => setOpen(false)}
            />
          </div>

          <div className="offcanvas-body">
            {/* PRICE FILTER */}
            <h6 className="fw-semibold">
              Price (₹0 – ₹{filters.price})
            </h6>
            <input
              type="range"
              className="form-range mb-3"
              min={filtersData.common.price.min}
              max={filtersData.common.price.max}
              value={filters.price}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  price: Number(e.target.value),
                })
              }
            />

            {/* BRAND FILTER */}
            <h6 className="fw-semibold">Brands</h6>
            {filtersData.common.brands.map((brand) => (
              <div className="form-check" key={brand}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() =>
                    setFilters({
                      ...filters,
                      brands: filters.brands.includes(brand)
                        ? filters.brands.filter((b) => b !== brand)
                        : [...filters.brands, brand],
                    })
                  }
                />
                <label className="form-check-label">
                  {brand}
                </label>
              </div>
            ))}

            <hr />

            {/* CATEGORY-SPECIFIC FILTERS */}
            <h6 className="fw-semibold">More Filters</h6>

            {categoryFilters ? (
              Object.entries(categoryFilters).map(
                ([filterName, options]) => (
                  <button
                    key={filterName}
                    className="btn btn-light w-100 d-flex justify-content-between align-items-center mt-2"
                    onClick={() =>
                      setSubFilter({
                        title: filterName,
                        options,
                      })
                    }
                  >
                    {filterName}
                    <ChevronRight size={16} />
                  </button>
                )
              )
            ) : (
              <p className="text-muted small mt-2">
                Select a category to see more filters.
              </p>
            )}
          </div>

          {/* FOOTER ACTIONS */}
          <div className="offcanvas-footer p-3 border-top d-flex gap-2">
            <button
              className="btn btn-outline-secondary w-50"
              onClick={clearFilters}
            >
              Clear
            </button>
            <button
              className="btn btn-dark w-50"
              onClick={() => setOpen(false)}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* SUB FILTER DRAWER */}
      {subFilter && (
        <SubFilterDrawer
          data={subFilter}
          onClose={() => setSubFilter(null)}
        />
      )}
    </>
  );
}

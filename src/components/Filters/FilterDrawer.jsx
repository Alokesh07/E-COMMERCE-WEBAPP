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

  // Get brands for selected category, fallback to category.brands from DB
  const categoryBrands = activeCategory?.brands || [];
  const displayBrands = categoryBrands.length > 0 ? categoryBrands : filtersData.common.brands;

  return (
    <>
      {/* FILTER BUTTON */}
      <button
        className="btn btn-outline-dark w-100 d-flex gap-2 align-items-center"
        onClick={() => setOpen(true)}
        style={{
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          borderColor: "#667eea",
          color: "#667eea",
          fontWeight: "600"
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#667eea";
          e.target.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "transparent";
          e.target.style.color = "#667eea";
        }}
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
        <>
          <style>{`
            @keyframes slideInLeft {
              from {
                transform: translateX(-100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
            @keyframes fadeInBackdrop {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .filter-backdrop {
              animation: fadeInBackdrop 0.3s ease-out;
            }
            .filter-drawer {
              animation: slideInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .filter-range {
              transition: all 0.2s ease-out;
            }
            .filter-range:hover {
              opacity: 1;
            }
          `}</style>
          <div className="offcanvas offcanvas-start show filter-slide-in filter-backdrop" style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1040
          }}>
            <div className="filter-drawer" style={{
              position: "fixed",
              left: 0,
              top: 0,
              height: "100vh",
              width: "380px",
              background: "white",
              boxShadow: "4px 0 30px rgba(0,0,0,0.15)",
              overflowY: "auto",
              zIndex: 1050
            }}>
            <div className="offcanvas-header border-bottom" style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderBottom: "none !important",
              padding: "20px"
            }}>
              <h5 className="fw-bold" style={{ color: "white", margin: 0, fontSize: "18px" }}>
                ✨ Filters
              </h5>
              <button
                className="btn-close btn-close-white"
                onClick={() => setOpen(false)}
                style={{ filter: "invert(1)" }}
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
            {displayBrands.length > 0 ? (
              displayBrands.map((brand) => (
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
              ))
            ) : (
              <p className="text-muted small">Select a category to see brands</p>
            )}

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
          <div className="offcanvas-footer p-3 border-top d-flex gap-2" style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "380px",
            background: "white",
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            gap: "12px",
            padding: "16px"
          }}>
            <button
              className="btn btn-outline-secondary w-50"
              onClick={clearFilters}
              style={{
                transition: "all 0.2s ease-out"
              }}
            >
              Clear
            </button>
            <button
              className="btn btn-dark w-50"
              onClick={() => setOpen(false)}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                transition: "all 0.2s ease-out",
                fontWeight: "600"
              }}
            >
              Apply
            </button>
          </div>
            </div>
          </div>
        </>
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

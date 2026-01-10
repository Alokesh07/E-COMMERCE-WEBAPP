import { useState } from "react";
import { SlidersHorizontal, ChevronRight } from "lucide-react";
import filtersData from "../../data/filters.json";
import SubFilterDrawer from "./SubFilterDrawer";
import { useFilters } from "../../context/FilterContext";

export default function FilterDrawer() {
  const [open, setOpen] = useState(false);
  const [subFilter, setSubFilter] = useState(null);
  const { filters, setFilters, clearFilters } = useFilters();

  return (
    <>
      {/* FILTER BUTTON */}
      <button
        className="btn btn-outline-dark w-100 d-flex gap-2 align-items-center"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal size={18} /> Filters
      </button>

      {/* DRAWER */}
      {open && (
        <div className="offcanvas offcanvas-start show filter-slide-in">
          <div className="offcanvas-header border-bottom">
            <h5 className="fw-bold">Filters</h5>
            <button className="btn-close" onClick={() => setOpen(false)} />
          </div>

          <div className="offcanvas-body">

            {/* PRICE */}
            <h6>Price (₹0 - ₹{filters.price})</h6>
            <input
              type="range"
              className="form-range mb-3"
              min="0"
              max="100000"
              value={filters.price}
              onChange={(e) =>
                setFilters({ ...filters, price: Number(e.target.value) })
              }
            />

            {/* BRANDS */}
            <h6>Brands</h6>
            {filtersData.commonFilters.brands.map((brand) => (
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
                <label className="form-check-label">{brand}</label>
              </div>
            ))}

            <hr />

            {/* ADVANCED FILTERS */}
            <h6>More Filters</h6>
            {Object.keys(filtersData.categoryFilters.Electronics).map((key) => (
              <button
                key={key}
                className="btn btn-light w-100 d-flex justify-content-between mt-2"
                onClick={() =>
                  setSubFilter({
                    title: key,
                    options: filtersData.categoryFilters.Electronics[key]
                  })
                }
              >
                {key} <ChevronRight size={16} />
              </button>
            ))}

          </div>

          {/* FOOTER */}
          <div className="offcanvas-footer p-3 border-top d-flex gap-2">
            <button className="btn btn-outline-secondary w-50" onClick={clearFilters}>
              Clear
            </button>
            <button className="btn btn-dark w-50" onClick={() => setOpen(false)}>
              Apply
            </button>
          </div>
        </div>
      )}

      {subFilter && (
        <SubFilterDrawer data={subFilter} onClose={() => setSubFilter(null)} />
      )}
    </>
  );
}

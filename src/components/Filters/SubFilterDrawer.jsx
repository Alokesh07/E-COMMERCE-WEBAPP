import { useFilters } from "../../context/FilterContext";

export default function SubFilterDrawer({ data, onClose }) {
  const { filters, setFilters } = useFilters();

  return (
    <div className="offcanvas offcanvas-start show filter-sub-slide">
      <div className="offcanvas-header">
        <h6>{data.title}</h6>
        <button className="btn-close" onClick={onClose} />
      </div>

      <div className="offcanvas-body">
        {data.options.map((opt) => (
          <div className="form-check" key={opt}>
            <input
              className="form-check-input"
              type="checkbox"
              checked={filters.attributes[data.title]?.includes(opt)}
              onChange={() =>
                setFilters({
                  ...filters,
                  attributes: {
                    ...filters.attributes,
                    [data.title]: filters.attributes[data.title]
                      ? filters.attributes[data.title].includes(opt)
                        ? filters.attributes[data.title].filter(o => o !== opt)
                        : [...filters.attributes[data.title], opt]
                      : [opt]
                  }
                })
              }
            />
            <label className="form-check-label">{opt}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

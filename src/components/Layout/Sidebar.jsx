import FilterDrawer from "../Filters/FilterDrawer";

export default function Sidebar({ activeCategory }) {
  return (
    <aside className="col-md-2 d-none d-md-block border-end p-3">
      <FilterDrawer activeCategory={activeCategory} />
    </aside>
  );
}

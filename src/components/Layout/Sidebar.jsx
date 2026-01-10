export default function Sidebar() {
  return (
    <aside className="col-md-2 border-end d-none d-md-block">
      <div className="p-3">
        <h6 className="text-uppercase text-muted">Categories</h6>
        <ul className="nav flex-column gap-2">
          <li className="nav-item">👟 Shoes</li>
          <li className="nav-item">👕 Clothing</li>
          <li className="nav-item">🎧 Electronics</li>
          <li className="nav-item">⌚ Watches</li>
        </ul>
      </div>
    </aside>
  );
}

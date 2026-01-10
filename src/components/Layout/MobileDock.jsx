import { Link } from "react-router-dom";

export default function MobileDock() {
  return (
    <div className="d-md-none fixed-bottom bg-white border-top">
      <div className="d-flex justify-content-around py-2">
        <Link to="/" className="text-center text-dark">
          <i className="bi bi-house fs-5"></i><br />
          <small>Home</small>
        </Link>
        <Link to="/shop" className="text-center text-dark">
          <i className="bi bi-grid fs-5"></i><br />
          <small>Shop</small>
        </Link>
        <Link to="/cart" className="text-center text-dark">
          <i className="bi bi-bag fs-5"></i><br />
          <small>Cart</small>
        </Link>
      </div>
    </div>
  );
}

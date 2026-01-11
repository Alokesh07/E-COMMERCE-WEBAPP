import products from "../data/products.json";
import { useFilters } from "../context/FilterContext";

export default function Shop() {
  const { filters } = useFilters();

  const filteredProducts = products
    .filter(p => p.price <= filters.price)
    .filter(p =>
      filters.brands.length ? filters.brands.includes(p.brand) : true
    );

  return (
    <div className="row g-4">
      {filteredProducts.map(product => (
        <div className="col-md-3" key={product.id}>
          <div className="card h-100">
            <div className="card-body">
              <h6>{product.name}</h6>
              <p className="text-muted">₹{product.price}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

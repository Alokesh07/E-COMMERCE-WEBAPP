export default function OrderHistory() {
  return (
    <div className="card p-3 shadow-sm">
      <h5 className="fw-bold mb-3">Order History</h5>

      <div className="text-center text-muted">
        <img
          src="/images/empty-orders.png"
          alt=""
          width="120"
          className="mb-3"
        />
        <p>No orders yet</p>
        <small>Start shopping to see your orders here</small>
      </div>
    </div>
  );
}

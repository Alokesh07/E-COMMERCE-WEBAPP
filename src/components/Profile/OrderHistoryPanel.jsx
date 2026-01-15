export default function OrderHistoryPanel() {
  return (
    <div className="card p-4 shadow-sm text-center">
      <h4 className="fw-bold mb-3">Your Orders</h4>

      <img src="/images/empty-orders.png" alt="" width="140" className="mb-3" />

      <p className="text-muted">You haven’t placed any orders yet.</p>
      <small className="text-muted">Once you shop, they’ll appear here.</small>
    </div>
  );
}

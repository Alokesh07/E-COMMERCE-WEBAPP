import { useLocation, useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center text-center">
      <div className="alert alert-success shadow-lg p-4 rounded">
        <h3>Payment Successful 🎉</h3>
        <p>Your Order ID</p>
        <strong>{state.orderId}</strong>

        <button
          className="btn btn-primary mt-3"
          onClick={() =>
            navigate(`/order-tracking/${state.orderId}`)
          }
        >
          Track Order
        </button>
      </div>
    </div>
  );
}

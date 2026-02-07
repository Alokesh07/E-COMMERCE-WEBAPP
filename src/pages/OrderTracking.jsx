import { useLocation } from "react-router-dom";

export default function OrderTracking() {
  const { state } = useLocation();

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="spinner-border text-primary mb-4" />
      <h4>Order Confirmed 🎉</h4>
      <p>Your Order ID</p>
      <strong>{state?.orderId}</strong>
    </div>
  );
}

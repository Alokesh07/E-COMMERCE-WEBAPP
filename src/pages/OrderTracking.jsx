import { useParams } from "react-router-dom";
import { getOrderById } from "../utils/orderService";

const STATUS_FLOW = [
  "PLACED",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export default function OrderTracking() {
  const { orderId } = useParams();
  const order = getOrderById(orderId);

  return (
    <div className="container py-5">
      <h3>Tracking Order</h3>
      <p>Order ID: {orderId}</p>

      <ul className="list-group mt-4">
        {STATUS_FLOW.map((status, i) => (
          <li
            key={status}
            className={`list-group-item ${
              STATUS_FLOW.indexOf(order.status) >= i
                ? "list-group-item-success"
                : ""
            }`}
          >
            {status.replaceAll("_", " ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

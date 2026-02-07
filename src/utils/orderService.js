export const saveOrder = (userId, order) => {
  const orders = JSON.parse(localStorage.getItem("orders")) || {};
  orders[userId] = [...(orders[userId] || []), order];
  localStorage.setItem("orders", JSON.stringify(orders));
};

export const getUserOrders = (userId) => {
  const orders = JSON.parse(localStorage.getItem("orders")) || {};
  return orders[userId] || [];
};

export const getOrderById = (orderId) => {
  const orders = JSON.parse(localStorage.getItem("orders")) || {};
  for (const userOrders of Object.values(orders)) {
    const found = userOrders.find((o) => o.id === orderId);
    if (found) return found;
  }
  return null;
};

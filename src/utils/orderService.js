// Save order to localStorage
export const saveOrder = (userId, order) => {
  // Support both old format (object with userId keys) and new format (array)
  const existingOrders = localStorage.getItem("orders");
  
  if (existingOrders) {
    try {
      const parsed = JSON.parse(existingOrders);
      // Check if it's the old format (object with userId keys)
      if (!Array.isArray(parsed)) {
        // Old format - convert to new array format
        const orders = Object.values(parsed).flat();
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));
      } else {
        // New array format
        parsed.push(order);
        localStorage.setItem("orders", JSON.stringify(parsed));
      }
    } catch {
      // If parsing fails, start fresh with array
      localStorage.setItem("orders", JSON.stringify([order]));
    }
  } else {
    localStorage.setItem("orders", JSON.stringify([order]));
  }
};

// Get all orders (supports both formats)
export const getAllOrders = () => {
  const orders = localStorage.getItem("orders");
  if (!orders) return [];
  
  try {
    const parsed = JSON.parse(orders);
    // If it's an object (old format), convert to array
    if (!Array.isArray(parsed)) {
      return Object.values(parsed).flat();
    }
    return parsed;
  } catch {
    return [];
  }
};

// Get user orders
export const getUserOrders = (userId) => {
  const orders = getAllOrders();
  return orders.filter(order => order.userId === userId);
};

// Get order by ID (searches all orders)
export const getOrderById = (orderId) => {
  const orders = getAllOrders();
  return orders.find((o) => o.id === orderId) || null;
};

// Update order status
export const updateOrderStatus = (orderId, status) => {
  const orders = getAllOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index !== -1) {
    orders[index].status = status;
    localStorage.setItem("orders", JSON.stringify(orders));
    return true;
  }
  return false;
};

// Delete order
export const deleteOrder = (orderId) => {
  const orders = getAllOrders();
  const filtered = orders.filter(o => o.id !== orderId);
  localStorage.setItem("orders", JSON.stringify(filtered));
};

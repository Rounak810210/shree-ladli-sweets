const ORDERS_KEY = "shree_ladli_orders";

export const getOrders = () => {
  try {
    const storedOrders = localStorage.getItem(ORDERS_KEY);

    if (!storedOrders) {
      return [];
    }

    return JSON.parse(storedOrders);
  } catch (error) {
    console.error("Error reading orders:", error);
    return [];
  }
};

export const saveOrders = (orders) => {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    // Tell other pages/components that orders changed
    window.dispatchEvent(new Event("ordersUpdated"));
  } catch (error) {
    console.error("Error saving orders:", error);
  }
};

export const updateOrderStatus = (orderId, newStatus) => {
  const orders = getOrders();

  const updatedOrders = orders.map((order) => {
    if (order.id === orderId || order.orderId === orderId) {
      return {
        ...order,
        status: newStatus,
      };
    }

    return order;
  });

  saveOrders(updatedOrders);

  return updatedOrders;
};

export const getOrderStats = () => {
  const orders = getOrders();

  return {
    total: orders.length,

    pending: orders.filter(
      (order) => order.status?.toLowerCase() === "pending"
    ).length,

    preparing: orders.filter(
      (order) => order.status?.toLowerCase() === "preparing"
    ).length,

    ready: orders.filter(
      (order) => order.status?.toLowerCase() === "ready"
    ).length,

    completed: orders.filter(
      (order) => order.status?.toLowerCase() === "completed"
    ).length,

    revenue: orders
      .filter(
        (order) => order.status?.toLowerCase() === "completed"
      )
      .reduce((total, order) => {
        return total + Number(order.total || 0);
      }, 0),
  };
};
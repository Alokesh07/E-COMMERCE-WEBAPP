const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API
export const authAPI = {
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getCurrentUser: () => apiCall('/auth/me'),
  updateProfile: (updates) => apiCall('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),
  addAddress: (address) => apiCall('/auth/addresses', {
    method: 'POST',
    body: JSON.stringify(address),
  }),
  updateAddress: (addressId, address) => apiCall(`/auth/addresses/${addressId}`, {
    method: 'PUT',
    body: JSON.stringify(address),
  }),
  deleteAddress: (addressId) => apiCall(`/auth/addresses/${addressId}`, {
    method: 'DELETE',
  }),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/products${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiCall(`/products/${id}`),
  getCategories: () => apiCall('/products/categories'),
  getBrands: () => apiCall('/products/brands'),
  // Admin
  getAllAdmin: () => apiCall('/products/admin/all'),
  create: (product) => apiCall('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  update: (id, product) => apiCall(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }),
  delete: (id) => apiCall(`/products/${id}`, {
    method: 'DELETE',
  }),
  seed: () => apiCall('/products/seed', { method: 'POST' }),
};

// Categories API
export const categoriesAPI = {
  getAll: () => apiCall('/categories'),
  getBySlug: (slug) => apiCall(`/categories/${slug}`),
  seed: () => apiCall('/categories/seed', { method: 'POST' }),
  // Admin
  getAllAdmin: () => apiCall('/categories/admin/all'),
  create: (categoryData) => apiCall('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  }),
  update: (id, categoryData) => apiCall(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  }),
  delete: (id) => apiCall(`/categories/${id}`, {
    method: 'DELETE',
  }),
  addSubcategory: (id, subcategoryData) => apiCall(`/categories/${id}/subcategories`, {
    method: 'POST',
    body: JSON.stringify(subcategoryData),
  }),
  removeSubcategory: (id, subcategoryId) => apiCall(`/categories/${id}/subcategories/${subcategoryId}`, {
    method: 'DELETE',
  }),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => apiCall('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  getMyOrders: () => apiCall('/orders/my-orders'),
  getById: (id) => apiCall(`/orders/${id}`),
  getByOrderId: (orderId) => apiCall(`/orders/track/${orderId}`),
  cancel: (id, reason) => apiCall(`/orders/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),
  // Admin
  getAllAdmin: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/orders/admin/all${query ? `?${query}` : ''}`);
  },
  updateStatus: (id, status) => apiCall(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  getStats: () => apiCall('/orders/admin/stats'),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => apiCall('/notifications'),
  getUnreadCount: () => apiCall('/notifications/unread-count'),
  markAsRead: (id) => apiCall(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllAsRead: () => apiCall('/notifications/read-all', { method: 'PUT' }),
  delete: (id) => apiCall(`/notifications/${id}`, { method: 'DELETE' }),
  // Admin
  getAllAdmin: () => apiCall('/notifications/admin/all'),
};

// Cards API
export const cardsAPI = {
  getAll: () => apiCall('/cards'),
  add: (cardData) => apiCall('/cards', {
    method: 'POST',
    body: JSON.stringify(cardData),
  }),
  update: (id, cardData) => apiCall(`/cards/${id}`, {
    method: 'PUT',
    body: JSON.stringify(cardData),
  }),
  delete: (id) => apiCall(`/cards/${id}`, { method: 'DELETE' }),
  setDefault: (id) => apiCall(`/cards/${id}/default`, { method: 'PUT' }),
};

// Admin API
export const adminAPI = {
  login: (credentials) => apiCall('/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getStats: () => apiCall('/admin/stats'),
  getUsers: () => apiCall('/admin/users'),
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/admin/orders${query ? `?${query}` : ''}`);
  },
  getProducts: () => apiCall('/admin/products'),
  createProduct: (product) => apiCall('/admin/products', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  updateProduct: (id, product) => apiCall(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  }),
  deleteProduct: (id) => apiCall(`/admin/products/${id}`, { method: 'DELETE' }),
  updateOrderStatus: (id, status) => apiCall(`/admin/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  deleteOrder: (id) => apiCall(`/admin/orders/${id}`, { method: 'DELETE' }),
};

export default {
  auth: authAPI,
  products: productsAPI,
  categories: categoriesAPI,
  orders: ordersAPI,
  notifications: notificationsAPI,
  cards: cardsAPI,
  admin: adminAPI,
};

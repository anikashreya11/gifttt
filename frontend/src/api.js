import { products } from './data/products';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('giftbloom_token');

const readStore = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (_error) {
    return fallback;
  }
};

const writeStore = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
};

const findProduct = (id) => products.find((product) => product.id === Number(id));

const enrichCartItem = (item) => {
  const product = findProduct(item.product_id || item.id);
  return {
    cartId: item.cartId || item.id || Date.now(),
    id: product?.id || item.id || item.product_id,
    product_id: product?.id || item.product_id || item.id,
    name: item.name || product?.name || 'Gift item',
    price: Number(item.price || product?.price || item.unitPrice || 0),
    image: item.image || product?.image || '',
    quantity: Number(item.quantity || 1),
    personalization: item.personalization || {}
  };
};

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    return {
      success: response.ok,
      ...data
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Unable to reach API'
    };
  }
};

const localCart = () => readStore('giftbloom_cart', []).map(enrichCartItem);
const saveCart = (items) => writeStore('giftbloom_cart', items.map(enrichCartItem));

const api = {
  get: async (endpoint) => {
    if (endpoint.startsWith('/products/')) {
      const id = endpoint.split('/').pop();
      const product = findProduct(id);
      return {
        success: !!product,
        data: { product },
        product
      };
    }

    return request(endpoint);
  },

  signup: async (data) => {
    const response = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    return response.success ? response : { ...response, success: false };
  },

  login: (data) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  forgotPassword: async () => ({
    success: true,
    message: 'Password reset instructions sent'
  }),

  getProfile: async () => {
    const response = await request('/auth/profile');
    if (response.success) return response;

    return {
      success: true,
      user: readStore('giftbloom_user', null)
    };
  },

  updateProfile: async (data) => {
    const current = readStore('giftbloom_user', {});
    const user = writeStore('giftbloom_user', { ...current, ...data });
    return { success: true, user };
  },

  getProducts: async (params = {}) => {
    let items = [...products];
    if (params.search) {
      const query = String(params.search).toLowerCase();
      items = items.filter((product) => {
        return product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.keywords.some((keyword) => keyword.toLowerCase().includes(query));
      });
    }
    if (params.category) items = items.filter((product) => product.category === params.category);
    if (params.occasion) items = items.filter((product) => product.occasion === params.occasion);
    return { success: true, items, products: items };
  },

  getProduct: async (id) => {
    const product = findProduct(id);
    return { success: !!product, product };
  },

  getCart: async () => ({
    success: true,
    items: localCart()
  }),

  addToCart: async (data) => {
    const items = localCart();
    const cartItem = enrichCartItem({
      ...data,
      cartId: Date.now()
    });
    saveCart([...items, cartItem]);
    return { success: true, item: cartItem };
  },

  updateCart: async ({ cart_id, quantity }) => {
    const updated = localCart().map((item) => (
      item.cartId === cart_id ? { ...item, quantity: Number(quantity) } : item
    ));
    saveCart(updated);
    return { success: true, items: updated };
  },

  removeFromCart: async (id) => {
    const updated = localCart().filter((item) => item.cartId !== id);
    saveCart(updated);
    return { success: true, items: updated };
  },

  clearCart: async () => {
    saveCart([]);
    return { success: true };
  },

  createOrder: async (data) => {
    const orders = readStore('giftbloom_orders', []);
    const order = {
      ...data,
      order_id: Date.now(),
      order_number: `GB${Date.now().toString().slice(-8)}`,
      status: 'Placed',
      created_at: new Date().toISOString()
    };
    writeStore('giftbloom_orders', [order, ...orders]);
    return { success: true, ...order };
  },

  getOrders: async () => ({
    success: true,
    orders: readStore('giftbloom_orders', [])
  }),

  getOrder: async (id) => {
    const order = readStore('giftbloom_orders', []).find((item) => String(item.order_id) === String(id));
    return { success: !!order, order };
  },

  getAddresses: async () => ({
    success: true,
    addresses: readStore('giftbloom_addresses', [])
  }),

  addAddress: async (data) => {
    const addresses = readStore('giftbloom_addresses', []);
    const address = { ...data, id: Date.now() };
    writeStore('giftbloom_addresses', [...addresses, address]);
    return { success: true, id: address.id, address };
  },

  updateAddress: async (id, data) => {
    const addresses = readStore('giftbloom_addresses', []);
    const updated = addresses.map((address) => String(address.id) === String(id) ? { ...address, ...data } : address);
    writeStore('giftbloom_addresses', updated);
    return { success: true };
  },

  deleteAddress: async (id) => {
    const updated = readStore('giftbloom_addresses', []).filter((address) => String(address.id) !== String(id));
    writeStore('giftbloom_addresses', updated);
    return { success: true };
  },

  getWishlist: async () => ({
    success: true,
    items: readStore('giftbloom_wishlist', [])
  }),

  checkWishlist: async () => ({ success: true, exists: false }),
  addToWishlist: async (product_id) => {
    const wishlist = readStore('giftbloom_wishlist', []);
    writeStore('giftbloom_wishlist', [...wishlist, product_id]);
    return { success: true };
  },
  removeFromWishlist: async (id) => {
    writeStore('giftbloom_wishlist', readStore('giftbloom_wishlist', []).filter((item) => item !== id));
    return { success: true };
  },

  getReminders: async () => ({
    success: true,
    reminders: readStore('giftbloom_reminders', [])
  }),

  addReminder: async (data) => {
    const reminders = readStore('giftbloom_reminders', []);
    writeStore('giftbloom_reminders', [{ ...data, id: Date.now() }, ...reminders]);
    return { success: true };
  },

  deleteReminder: async (id) => {
    writeStore('giftbloom_reminders', readStore('giftbloom_reminders', []).filter((item) => item.id !== id));
    return { success: true };
  },

  getNotifications: async () => ({
    success: true,
    notifications: readStore('giftbloom_notifications', [])
  }),

  markAsRead: async () => ({ success: true }),
  markAllRead: async () => ({ success: true }),
  deleteNotification: async () => ({ success: true }),

  createPaymentOrder: async (amount, order_db_id) => ({
    success: true,
    key_id: 'demo_key',
    order: {
      id: `demo_${Date.now()}`,
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      order_db_id
    }
  }),

  verifyPayment: async () => ({ success: true }),

  validateCoupon: async (code, amount) => {
    const normalized = String(code).trim().toUpperCase();
    const rate = normalized === 'WELCOME20' ? 0.2 : normalized === 'BLOOM10' ? 0.1 : 0;
    if (!rate) return { success: false, message: 'Invalid coupon code' };

    return {
      success: true,
      discount_amount: Math.round(Number(amount) * rate)
    };
  }
};

export { api };
export default api;

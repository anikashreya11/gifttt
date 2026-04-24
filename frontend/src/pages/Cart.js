import React, { useState, useEffect } from 'react';
import '../styles/Cart.css';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!localStorage.getItem('giftbloom_token');

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        const res = await api.getCart();
        if (res.success && res.items) {
          setCartItems(res.items.map(item => ({
            cartId: item.id,
            id: item.product_id,
            name: item.name,
            price: parseFloat(item.price),
            image: item.image,
            quantity: item.quantity,
            personalization: typeof item.personalization === 'string' ? JSON.parse(item.personalization || '{}') : (item.personalization || {}),
          })));
        }
      } else {
  const localCart = JSON.parse(localStorage.getItem('giftbloom_cart') || '[]');

  const updatedCart = await Promise.all(
    localCart.map(async (item) => {
      try {
        const res = await api.get(`/products/${item.product_id}`);

        return {
          cartId: item.cartId,
          id: item.product_id,
          name: res.data.product.name,
          price: parseFloat(res.data.product.price),
          image: res.data.product.image,
          quantity: item.quantity,
          personalization: item.personalization || {},
        };
      } catch (err) {
        console.error("Product fetch failed", err);
        return null;
      }
    })
  );

  setCartItems(updatedCart.filter(Boolean));
}
    } catch (e) {
      console.error('Cart load error:', e);
      const localCart = JSON.parse(localStorage.getItem('giftbloom_cart') || '[]');
      setCartItems(localCart);
    }
    setLoading(false);
  };

  const removeItem = async (cartId) => {
    try {
      if (isLoggedIn) {
        await api.removeFromCart(cartId);
      } else {
        const updated = cartItems.filter(item => item.cartId !== cartId);
        localStorage.setItem('giftbloom_cart', JSON.stringify(updated));
      }
      setCartItems(prev => prev.filter(item => item.cartId !== cartId));
    } catch (e) { console.error(e); }
  };

  const updateQuantity = async (cartId, qty) => {
    if (qty < 1) return;
    try {
      if (isLoggedIn) {
        await api.updateCart({ cart_id: cartId, quantity: qty });
      } else {
        const updated = cartItems.map(item => item.cartId === cartId ? { ...item, quantity: qty } : item);
        localStorage.setItem('giftbloom_cart', JSON.stringify(updated));
      }
      setCartItems(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity: qty } : item));
    } catch (e) { console.error(e); }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1), 0);
  const delivery = subtotal > 500 ? 0 : 99;
  const total = subtotal + delivery;

  if (loading) return (
    <div className="cart-empty">
      <p style={{ color: '#888' }}>Loading your cart...</p>
    </div>
  );

  if (cartItems.length === 0) return (
    <div className="cart-empty">
      <FiShoppingBag className="cart-empty-icon" />
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added anything yet</p>
      <button className="btn-shop-now" onClick={() => navigate('/explore')}>
        Explore Gifts <FiArrowRight />
      </button>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="cart-header">
        <p className="section-label">YOUR CART</p>
        <h1>Shopping Cart</h1>
        <p className="cart-sub">{cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your cart</p>
      </div>
      <div className="cart-body">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.cartId} className="cart-item">
              <div className="cart-item-img" onClick={() => navigate(`/product/${item.id}`)}>
                <img src={item.image} alt={item.name} />
              </div>
              <div className="cart-item-info">
                <p className="cart-item-name">{item.name}</p>
                {item.personalization?.recipientName && (
                  <p className="cart-item-personalized">
                    For: {item.personalization.recipientName}
                    {item.personalization.senderName ? ` • From: ${item.personalization.senderName}` : ''}
                  </p>
                )}
                {item.personalization?.message && (
                  <p className="cart-item-message">"{item.personalization.message.slice(0, 60)}{item.personalization.message.length > 60 ? '...' : ''}"</p>
                )}
                <p className="cart-item-price">&#8377;{parseFloat(item.price).toLocaleString()}</p>
              </div>
              <div className="cart-item-actions">
                <div className="quantity-control">
                  <button onClick={() => updateQuantity(item.cartId, (item.quantity || 1) - 1)}>−</button>
                  <span>{item.quantity || 1}</span>
                  <button onClick={() => updateQuantity(item.cartId, (item.quantity || 1) + 1)}>+</button>
                </div>
                <p className="cart-item-total">&#8377;{(parseFloat(item.price) * (item.quantity || 1)).toLocaleString()}</p>
                <button className="cart-remove-btn" onClick={() => removeItem(item.cartId)}><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <p className="cart-summary-title">Order Summary</p>
          <div className="cart-summary-row"><span>Subtotal</span><span>&#8377;{subtotal.toLocaleString()}</span></div>
          <div className="cart-summary-row"><span>Delivery</span><span>{delivery === 0 ? <span className="free-tag">FREE</span> : `₹${delivery}`}</span></div>
          {delivery > 0 && <p className="free-delivery-note">Add &#8377;{500 - subtotal} more for free delivery</p>}
          <div className="cart-summary-divider" />
          <div className="cart-summary-row total"><span>Total</span><span>&#8377;{total.toLocaleString()}</span></div>
          <button className="btn-checkout" onClick={() => navigate(isLoggedIn ? '/delivery' : '/login?redirect=delivery')}>
            Proceed to Checkout →
          </button>
          <button className="btn-continue-shopping" onClick={() => navigate('/explore')}>Continue Shopping</button>
          <div className="cart-trust">
            <p>Secure checkout</p>
            <p>Safe packaging</p>
            <p>Easy returns</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;

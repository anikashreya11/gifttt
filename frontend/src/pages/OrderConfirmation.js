import React, { useEffect, useState } from 'react';
import '../styles/OrderConfirmation.css';
import { FiCheck, FiPackage, FiMapPin, FiClock, FiBell, FiHome, FiCopy } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function OrderConfirmation() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [order, setOrder] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
    const lastOrder = localStorage.getItem('giftbloom_last_order');
    if (lastOrder) {
      setOrder(JSON.parse(lastOrder));
    }
  }, []);

  const copyOrderId = () => {
    if (order?.order_number) {
      navigator.clipboard.writeText(order.order_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const estimatedDate = order?.delivery_date
    ? new Date(order.delivery_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
    : (() => {
      const d = new Date();
      d.setDate(d.getDate() + 4);
      return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
    })();

  const trackingSteps = [
    { label: 'Order Placed', time: 'Just now', done: true, active: true },
    { label: 'Being Prepared', time: 'In 2-4 hours', done: false, active: false },
    { label: 'Out for Delivery', time: estimatedDate, done: false, active: false },
    { label: 'Delivered', time: 'Expected ' + estimatedDate, done: false, active: false },
  ];

  return (
    <div className="confirmation-page">

      {/* Hero */}
      <div className={`confirmation-hero ${animate ? 'animate' : ''}`}>
        <div className="success-circle">
          <div className="success-ring r1" />
          <div className="success-ring r2" />
          <div className="success-ring r3" />
          <div className="success-icon"><FiCheck size={32} /></div>
        </div>
        <h1>Order Placed Successfully!</h1>
        <p>Your gift is being prepared with love and will be on its way soon</p>
        {order?.order_number && (
          <div className="order-id-badge" onClick={copyOrderId} style={{ cursor: 'pointer' }}>
            Order ID: <strong>{order.order_number}</strong>
            <span className="copy-icon">{copied ? <FiCheck size={12} /> : <FiCopy size={12} />}</span>
          </div>
        )}
        <p style={{ fontSize: '12px', color: '#bbb', marginTop: '8px' }}>
          Click to copy order ID
        </p>
      </div>

      <div className="confirmation-body">
        <div className="confirmation-main">

          {/* Tracking */}
          <div className="confirmation-section">
            <h3>Order Tracking</h3>
            <div className="tracking-steps">
              {trackingSteps.map((step, i) => (
                <div key={step.label} className="tracking-step">
                  <div className="tracking-left">
                    <div className={`tracking-icon ${step.done ? 'done' : ''} ${step.active ? 'active' : ''}`}>
                      {step.done || step.active ? <FiCheck size={16} /> : i + 1}
                    </div>
                    {i < trackingSteps.length - 1 && <div className={`tracking-line ${step.done ? 'done' : ''}`} />}
                  </div>
                  <div className="tracking-info">
                    <p className={`tracking-label ${step.active ? 'active' : ''} ${step.done ? 'done' : ''}`}>{step.label}</p>
                    <span className="tracking-time">{step.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          {order && (
            <div className="confirmation-section">
              <h3>Order Summary</h3>
              {order.items?.slice(0, 3).map((item, i) => (
                <div key={i} className="gift-summary-card">
                  <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                  <div className="gift-summary-info">
                    <p className="gift-summary-name">{item.name}</p>
                    {item.personalization?.recipientName && (
                      <p className="gift-summary-template">For: {item.personalization.recipientName}</p>
                    )}
                    {item.personalization?.message && (
                      <p className="gift-summary-message">"{item.personalization.message.slice(0, 60)}{item.personalization.message.length > 60 ? '...' : ''}"</p>
                    )}
                  </div>
                  <p className="gift-summary-price">&#8377;{(parseFloat(item.price) * (item.quantity || 1)).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}

          {/* Delivery Details */}
          {order?.delivery_address && (
            <div className="confirmation-section">
              <h3>Delivery Details</h3>
              <div className="delivery-details-card">
                <div className="delivery-detail-row">
                  <FiMapPin className="detail-icon" />
                  <div>
                    <p className="detail-label">Delivering to</p>
                    <p className="detail-value">{order.delivery_address.name}</p>
                    <p className="detail-value">{order.delivery_address.flat}, {order.delivery_address.area}</p>
                    <p className="detail-value">{order.delivery_address.city}, {order.delivery_address.state} — {order.delivery_address.pincode}</p>
                  </div>
                </div>
                <div className="delivery-detail-row">
                  <FiClock className="detail-icon" />
                  <div>
                    <p className="detail-label">Expected Delivery</p>
                    <p className="detail-value">{estimatedDate}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reminder */}
          <div className="confirmation-section reminder-confirmation">
            <div className="reminder-conf-icon"><FiBell size={20} /></div>
            <div className="reminder-conf-content">
              <h4>Smart Reminder Active</h4>
              <p>We'll remind you before this occasion next year so you never miss it again.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="confirmation-actions">
            <button className="btn-track" onClick={() => navigate('/dashboard')}>
              <FiPackage size={15} /> Track Order
            </button>
            <button className="btn-home" onClick={() => navigate('/')}>
              <FiHome size={15} /> Back to Home
            </button>
          </div>

        </div>

        {/* Right Panel */}
        <div className="confirmation-summary">

          {order && (
            <div className="conf-summary-card">
              <p className="conf-summary-title">Payment Summary</p>
              <div className="conf-price-row"><span>Subtotal</span><span>&#8377;{parseFloat(order.total || 0).toLocaleString()}</span></div>
              <div className="conf-price-row"><span>Delivery</span><span className="free-tag">FREE</span></div>
              <div className="conf-price-divider" />
              <div className="conf-price-row total"><span>Total Paid</span><span>&#8377;{parseFloat(order.total || 0).toLocaleString()}</span></div>
              <div className="conf-payment-method">
                <p>Paid via {order.payment_method || 'Online'}</p>
              </div>
            </div>
          )}

          <div className="conf-summary-card">
            <p className="conf-summary-title">Need Help?</p>
            <div className="help-options">
              <button className="help-btn" onClick={() => window.open('tel:+919876543210')}>Call Support</button>
              <button className="help-btn" onClick={() => navigate('/about')}>Contact Us</button>
              <button className="help-btn" onClick={() => window.open('mailto:hello@giftbloom.in')}>Email Support</button>
            </div>
          </div>

          <div className="conf-summary-card referral-card">
            <p className="referral-title">Share Giftbloom</p>
            <p className="referral-desc">Share with friends and get ₹100 off your next order!</p>
            <button className="referral-btn" onClick={() => {
              navigator.clipboard.writeText(`Check out Giftbloom for amazing personalized gifts! ${window.location.origin}`);
              alert('Referral link copied!');
            }}>
              Copy Referral Link
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
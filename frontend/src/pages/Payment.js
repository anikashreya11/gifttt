import React, { useState, useEffect } from 'react';
import '../styles/Payment.css';
import { FiCreditCard, FiSmartphone, FiGlobe, FiShoppingBag, FiTag, FiCheck, FiLock, FiChevronDown, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const banks = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'IndusInd Bank', 'Yes Bank'];

const wallets = [
  { id: 'paytm', name: 'Paytm', color: '#00BAF2' },
  { id: 'phonepe', name: 'PhonePe', color: '#5F259F' },
  { id: 'amazonpay', name: 'Amazon Pay', color: '#FF9900' },
  { id: 'mobikwik', name: 'MobiKwik', color: '#1B5299' },
];

function formatCardNumber(value) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

function Payment() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [showCvv, setShowCvv] = useState(false);
  const [cardErrors, setCardErrors] = useState({});
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [deliveryData, setDeliveryData] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login?redirect=payment'); return; }
    const delivery = localStorage.getItem('giftbloom_delivery');
    if (!delivery) { navigate('/delivery'); return; }
    setDeliveryData(JSON.parse(delivery));
    loadCart();
  }, [isLoggedIn]);

  const loadCart = async () => {
    const res = await api.getCart();
    if (res.success && res.items?.length) {
      setCartItems(res.items.map(item => ({ ...item, price: parseFloat(item.price) })));
    } else {
      const local = JSON.parse(localStorage.getItem('giftbloom_cart') || '[]');
      if (local.length === 0) { navigate('/cart'); return; }
      setCartItems(local);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1), 0);
  const deliveryCharge = deliveryData?.deliveryType === 'express' ? 99 : (subtotal >= 500 ? 0 : 49);
  const total = subtotal + deliveryCharge - couponDiscount;

  const handleCoupon = async () => {
    if (!coupon.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await api.validateCoupon(coupon, subtotal);
      if (res.success) {
        setCouponApplied(true);
        setCouponDiscount(res.discount_amount);
        setCouponError('');
      } else {
        setCouponError(res.message || 'Invalid coupon code');
        setCouponApplied(false);
        setCouponDiscount(0);
      }
    } catch (e) {
      setCouponError('Could not validate coupon. Try again.');
    }
    setCouponLoading(false);
  };

  const validatePayment = () => {
    if (selectedMethod === 'upi') {
      if (!upiId.trim()) { setUpiError('Please enter your UPI ID'); return false; }
      if (!upiId.includes('@')) { setUpiError('Please enter a valid UPI ID (e.g. name@upi)'); return false; }
      setUpiError('');
    }
    if (selectedMethod === 'card') {
      const e = {};
      if (cardNumber.replace(/\s/g, '').length < 16) e.number = 'Please enter a valid 16-digit card number';
      if (!cardName.trim()) e.name = 'Please enter the name on card';
      if (cardExpiry.length < 5) e.expiry = 'Please enter valid expiry date (MM/YY)';
      if (cardCvv.length < 3) e.cvv = 'Please enter valid CVV';
      setCardErrors(e);
      if (Object.keys(e).length > 0) return false;
    }
    if (selectedMethod === 'netbanking' && !selectedBank) {
      setPaymentError('Please select your bank'); return false;
    }
    if (selectedMethod === 'wallet' && !selectedWallet) {
      setPaymentError('Please select a wallet'); return false;
    }
    setPaymentError('');
    return true;
  };

const handlePlaceOrder = async () => {
  if (!validatePayment()) return;
  setPlacing(true);
  setPaymentError('');

  try {
    // Step 1: Build order items
    const items = cartItems.map(item => ({
      product_id: item.product_id || item.id,
      name: item.name,
      image: item.image || '',
      quantity: item.quantity || 1,
      price: parseFloat(item.price),
      personalization: typeof item.personalization === 'string'
        ? JSON.parse(item.personalization || '{}')
        : (item.personalization || {}),
    }));

    // Step 2: Create order in database FIRST (pending payment)
    const orderData = {
      items,
      delivery_address: deliveryData.address,
      delivery_date: deliveryData.deliveryDate,
      delivery_slot: deliveryData.deliverySlot,
      delivery_type: deliveryData.deliveryType,
      surprise_delivery: deliveryData.surpriseDelivery,
      special_instructions: deliveryData.specialInstructions,
      payment_method: selectedMethod.toUpperCase(),
      subtotal,
      delivery_charge: deliveryCharge,
      discount: couponDiscount,
      total,
      coupon_code: couponApplied ? coupon.toUpperCase() : null,
    };

    const orderRes = await api.createOrder(orderData);
    if (!orderRes.success) {
      setPaymentError(orderRes.message || 'Failed to create order. Please try again.');
      setPlacing(false);
      return;
    }

    const { order_id, order_number } = orderRes;

    // Step 3: Create Razorpay payment order
    const paymentOrderRes = await api.createPaymentOrder(total, order_id);
    if (!paymentOrderRes.success) {
      setPaymentError(paymentOrderRes.message || 'Payment initiation failed. Please try again.');
      setPlacing(false);
      return;
    }

    const { order: razorpayOrder, key_id } = paymentOrderRes;

    // Step 4: Open Razorpay checkout
    const options = {
      key: key_id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'Giftbloom',
      description: `Order #${order_number}`,
      order_id: razorpayOrder.id,
      prefill: {
        name: deliveryData.address?.name || '',
        contact: deliveryData.address?.phone || '',
      },
      notes: {
        order_db_id: order_id,
        order_number: order_number,
      },
      theme: {
        color: '#1a1a1a',
      },
      handler: async function (response) {
        // Step 5: Verify payment after success
        try {
          const verifyRes = await api.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            order_db_id: order_id,
          });

          if (verifyRes.success) {
            // Clear data and go to confirmation
            localStorage.removeItem('giftbloom_delivery');
            localStorage.removeItem('giftbloom_cart');
            localStorage.setItem('giftbloom_last_order', JSON.stringify({
              order_number,
              order_id,
              total,
              items,
              delivery_address: deliveryData.address,
              delivery_date: deliveryData.deliveryDate,
              payment_method: selectedMethod.toUpperCase(),
            }));
            navigate('/order-confirmation');
          } else {
            setPaymentError('Payment verification failed. If money was deducted, contact support with your order ID: ' + order_number);
            setPlacing(false);
          }
        } catch (err) {
          console.error('Verify error:', err);
          setPaymentError('Verification error. Please contact support with order ID: ' + order_number);
          setPlacing(false);
        }
      },
      modal: {
        ondismiss: function () {
          setPaymentError('Payment was cancelled. Your order is saved — you can retry payment from your dashboard.');
          setPlacing(false);
        },
        escape: true,
        backdropclose: false,
      },
    };

    if (!window.Razorpay) {
      localStorage.removeItem('giftbloom_delivery');
      localStorage.removeItem('giftbloom_cart');
      localStorage.setItem('giftbloom_last_order', JSON.stringify({
        order_number,
        order_id,
        total,
        items,
        delivery_address: deliveryData.address,
        delivery_date: deliveryData.deliveryDate,
        payment_method: selectedMethod.toUpperCase(),
      }));
      navigate('/order-confirmation');
      return;
    }

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
      setPaymentError('Payment failed: ' + (response.error?.description || 'Unknown error. Please try again.'));
      setPlacing(false);
    });

    rzp.open();

  } catch (e) {
    console.error('Place order error:', e);
    setPaymentError('Something went wrong. Please try again.');
    setPlacing(false);
  }
};;

  const getCardType = () => {
    const num = cardNumber.replace(/\s/g, '');
    if (num.startsWith('4')) return 'VISA';
    if (num.startsWith('5')) return 'MC';
    if (num.startsWith('6')) return 'RuPay';
    return '';
  };

  return (
    <div className="payment-page">

      <div className="payment-header">
        <p className="section-label">FINAL STEP</p>
        <h1>Payment</h1>
        <p className="payment-sub">Choose your payment method and complete your order</p>
      </div>

      {/* Progress */}
      <div className="checkout-progress">
        <div className="checkout-step done"><div className="cp-dot"><FiCheck size={12} /></div><span>Cart</span></div>
        <div className="checkout-line done" />
        <div className="checkout-step done"><div className="cp-dot"><FiCheck size={12} /></div><span>Delivery</span></div>
        <div className="checkout-line done" />
        <div className="checkout-step active"><div className="cp-dot">3</div><span>Payment</span></div>
        <div className="checkout-line" />
        <div className="checkout-step"><div className="cp-dot">4</div><span>Confirm</span></div>
      </div>

      <div className="payment-body">
        <div className="payment-main">

          {/* Back */}
          <button className="back-btn-payment" onClick={() => navigate('/delivery')}>
            <FiArrowLeft size={14} /> Back to Delivery
          </button>

          {/* Payment Methods */}
          <div className="payment-methods">
            {[
              { id: 'upi', label: 'UPI', icon: <FiSmartphone /> },
              { id: 'card', label: 'Card', icon: <FiCreditCard /> },
              { id: 'netbanking', label: 'Net Banking', icon: <FiGlobe /> },
              { id: 'wallet', label: 'Wallet', icon: <FiShoppingBag /> },
            ].map(m => (
              <button key={m.id} className={`method-tab ${selectedMethod === m.id ? 'active' : ''}`} onClick={() => { setSelectedMethod(m.id); setPaymentError(''); }}>
                {m.icon}<span>{m.label}</span>
              </button>
            ))}
          </div>

          <div className="payment-panel">

            {/* UPI */}
            {selectedMethod === 'upi' && (
              <div className="payment-section">
                <h3>Pay via UPI</h3>
                <p className="payment-section-sub">Enter your UPI ID to pay instantly</p>
                <div className="payment-field">
                  <label>UPI ID <span className="req">*</span></label>
                  <div className={`payment-input-wrap ${upiError ? 'error' : ''}`}>
                    <input
                      type="text"
                      placeholder="yourname@paytm / yourname@okicici"
                      value={upiId}
                      onChange={e => { setUpiId(e.target.value); setUpiError(''); }}
                    />
                    {upiId.includes('@') && !upiError && <span className="upi-verified"><FiCheck size={12} /> Valid format</span>}
                  </div>
                  {upiError && <p className="field-error-msg"><FiAlertCircle size={11} /> {upiError}</p>}
                  <p className="field-hint">Examples: 9876543210@paytm, name@okaxis, name@ybl</p>
                </div>

                <div className="upi-apps-grid">
                  {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                    <div key={app} className="upi-app-pill">{app}</div>
                  ))}
                </div>
              </div>
            )}

            {/* CARD */}
            {selectedMethod === 'card' && (
              <div className="payment-section">
                <h3>Credit / Debit Card</h3>
                <p className="payment-section-sub">Visa, Mastercard, RuPay accepted</p>

                <div className="card-preview">
                  <div className="card-preview-inner">
                    <div className="card-chip" />
                    <p className="card-preview-number">{cardNumber || '•••• •••• •••• ••••'}</p>
                    <div className="card-preview-bottom">
                      <div><p className="card-preview-label">Card Holder</p><p className="card-preview-value">{cardName || 'YOUR NAME'}</p></div>
                      <div><p className="card-preview-label">Expires</p><p className="card-preview-value">{cardExpiry || 'MM/YY'}</p></div>
                      <div className="card-type-badge">{getCardType()}</div>
                    </div>
                  </div>
                </div>

                <div className="payment-field">
                  <label>Card Number <span className="req">*</span></label>
                  <div className={`payment-input-wrap ${cardErrors.number ? 'error' : ''}`}>
                    <FiCreditCard className="payment-input-icon" />
                    <input type="text" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={e => { setCardNumber(formatCardNumber(e.target.value)); setCardErrors(p => ({ ...p, number: '' })); }} maxLength={19} />
                  </div>
                  {cardErrors.number && <p className="field-error-msg">{cardErrors.number}</p>}
                </div>

                <div className="payment-field">
                  <label>Name on Card <span className="req">*</span></label>
                  <div className={`payment-input-wrap ${cardErrors.name ? 'error' : ''}`}>
                    <input type="text" placeholder="As printed on card" value={cardName} onChange={e => { setCardName(e.target.value.toUpperCase()); setCardErrors(p => ({ ...p, name: '' })); }} />
                  </div>
                  {cardErrors.name && <p className="field-error-msg">{cardErrors.name}</p>}
                </div>

                <div className="card-row">
                  <div className="payment-field">
                    <label>Expiry Date <span className="req">*</span></label>
                    <div className={`payment-input-wrap ${cardErrors.expiry ? 'error' : ''}`}>
                      <input type="text" placeholder="MM/YY" value={cardExpiry} onChange={e => { setCardExpiry(formatExpiry(e.target.value)); setCardErrors(p => ({ ...p, expiry: '' })); }} maxLength={5} />
                    </div>
                    {cardErrors.expiry && <p className="field-error-msg">{cardErrors.expiry}</p>}
                  </div>
                  <div className="payment-field">
                    <label>CVV <span className="req">*</span></label>
                    <div className={`payment-input-wrap ${cardErrors.cvv ? 'error' : ''}`}>
                      <input type={showCvv ? 'text' : 'password'} placeholder="•••" value={cardCvv} onChange={e => { setCardCvv(e.target.value.replace(/\D/, '').slice(0, 4)); setCardErrors(p => ({ ...p, cvv: '' })); }} maxLength={4} />
                      <button className="cvv-toggle" type="button" onClick={() => setShowCvv(!showCvv)}>{showCvv ? 'Hide' : 'Show'}</button>
                    </div>
                    {cardErrors.cvv && <p className="field-error-msg">{cardErrors.cvv}</p>}
                    <p className="field-hint">3 digits on back of card (4 for Amex)</p>
                  </div>
                </div>
              </div>
            )}

            {/* NET BANKING */}
            {selectedMethod === 'netbanking' && (
              <div className="payment-section">
                <h3>Net Banking</h3>
                <p className="payment-section-sub">Select your bank to proceed</p>
                <div className="bank-grid">
                  {banks.slice(0, 6).map(bank => (
                    <div key={bank} className={`bank-card ${selectedBank === bank ? 'active' : ''}`} onClick={() => { setSelectedBank(bank); setPaymentError(''); }}>
                      <div className="bank-icon">{bank.charAt(0)}</div>
                      <p>{bank.split(' ')[0]}</p>
                      {selectedBank === bank && <FiCheck className="bank-check" />}
                    </div>
                  ))}
                </div>
                <div className="payment-field" style={{ marginTop: '16px' }}>
                  <label>Or select from all banks</label>
                  <div className="select-wrap">
                    <select className="plain-select" value={selectedBank} onChange={e => { setSelectedBank(e.target.value); setPaymentError(''); }}>
                      <option value="">All Banks</option>
                      {banks.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <FiChevronDown className="select-icon" />
                  </div>
                </div>
              </div>
            )}

            {/* WALLETS */}
            {selectedMethod === 'wallet' && (
              <div className="payment-section">
                <h3>Pay via Wallet</h3>
                <p className="payment-section-sub">Use your digital wallet balance</p>
                <div className="wallet-list">
                  {wallets.map(w => (
                    <div key={w.id} className={`wallet-card ${selectedWallet === w.id ? 'active' : ''}`} onClick={() => { setSelectedWallet(w.id); setPaymentError(''); }}>
                      <div className="wallet-radio">{selectedWallet === w.id && <div className="radio-dot" />}</div>
                      <div className="wallet-icon" style={{ backgroundColor: w.color + '20', color: w.color }}>{w.name.charAt(0)}</div>
                      <p className="wallet-name">{w.name}</p>
                      {selectedWallet === w.id && <span className="wallet-selected"><FiCheck size={12} /> Selected</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Coupon */}
          <div className="coupon-section">
            <div className="coupon-header">
              <FiTag className="coupon-icon" />
              <p>Have a coupon code?</p>
            </div>
            <div className="coupon-input-row">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponError(''); setCouponApplied(false); setCouponDiscount(0); }}
                className="coupon-input"
                disabled={couponApplied}
              />
              <button
                className={`coupon-btn ${couponApplied ? 'applied' : ''}`}
                onClick={handleCoupon}
                disabled={couponApplied || couponLoading || !coupon.trim()}
              >
                {couponLoading ? '...' : couponApplied ? <><FiCheck size={13} /> Applied</> : 'Apply'}
              </button>
            </div>
            {couponError && <p className="coupon-error"><FiAlertCircle size={12} /> {couponError}</p>}
            {couponApplied && <p className="coupon-success"><FiCheck size={12} /> &#8377;{couponDiscount} discount applied!</p>}
            <p className="coupon-hint">Try: <strong>BLOOM10</strong> (10% off), <strong>WELCOME20</strong> (20% off)</p>
          </div>

          {/* Error */}
          {paymentError && (
            <div className="payment-error-box">
              <FiAlertCircle size={14} />
              {paymentError}
            </div>
          )}

          {/* Place Order */}
          <button
            className={`btn-place-order ${placing ? 'loading' : ''}`}
            onClick={handlePlaceOrder}
            disabled={placing}
          >
            {placing ? (
              <span>Processing your order...</span>
            ) : (
              <><FiLock size={15} /> Pay &#8377;{total.toLocaleString()} & Place Order</>
            )}
          </button>

          <p className="payment-security-note">
            <FiLock size={12} /> Your payment is 256-bit SSL encrypted and 100% secure
          </p>

        </div>

        {/* Right Summary */}
        <div className="payment-summary">
          <p className="filter-label">Order Summary</p>

          <div className="summary-card">
            {cartItems.slice(0, 3).map((item, i) => (
              <div key={i} className="summary-item-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: i < Math.min(cartItems.length, 3) - 1 ? '12px' : 0 }}>
                <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', margin: '0 0 2px' }}>{item.name}</p>
                  <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>Qty: {item.quantity || 1}</p>
                </div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap' }}>&#8377;{(parseFloat(item.price) * (item.quantity || 1)).toLocaleString()}</p>
              </div>
            ))}
            {cartItems.length > 3 && <p style={{ fontSize: '12px', color: '#888', textAlign: 'center', marginTop: '8px' }}>+{cartItems.length - 3} more items</p>}
          </div>

          <div className="summary-card">
            <div className="summary-price-row"><span>Subtotal</span><span>&#8377;{subtotal.toLocaleString()}</span></div>
            <div className="summary-price-row"><span>Delivery</span><span>{deliveryCharge === 0 ? <span className="free-label">FREE</span> : `₹${deliveryCharge}`}</span></div>
            {couponApplied && <div className="summary-price-row" style={{ color: '#3B6D11' }}><span>Discount</span><span>− &#8377;{couponDiscount}</span></div>}
            <div className="summary-divider" />
            <div className="summary-price-row total"><span>Total Payable</span><span>&#8377;{total.toLocaleString()}</span></div>
          </div>

          {deliveryData && (
            <div className="summary-card">
              <p className="summary-info-label">Delivering to</p>
              <p className="summary-info-value">{deliveryData.address?.name}</p>
              <p className="summary-info-value" style={{ fontSize: '12px', color: '#888', fontWeight: 400 }}>{deliveryData.address?.city}, {deliveryData.address?.pincode}</p>
              <p className="summary-info-label" style={{ marginTop: '12px' }}>Delivery Date</p>
              <p className="summary-info-value">{deliveryData.deliveryDate ? new Date(deliveryData.deliveryDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) : '—'}</p>
            </div>
          )}

          <div className="trust-badges">
            {[{ icon: <FiLock size={16} />, text: 'Secure Payment' }, { icon: <FiCheck size={16} />, text: 'Easy Returns' }, { icon: <FiShoppingBag size={16} />, text: 'Safe Packaging' }].map((b, i) => (
              <div key={i} className="trust-badge"><span>{b.icon}</span><p>{b.text}</p></div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Payment;

import React, { useState, useEffect } from 'react';
import '../styles/Delivery.css';
import { FiMapPin, FiPhone, FiUser, FiPlus, FiCheck, FiBell, FiAlertCircle, FiChevronDown, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const timeSlots = [
  { id: 1, label: 'Morning', time: '9:00 AM – 12:00 PM' },
  { id: 2, label: 'Afternoon', time: '12:00 PM – 4:00 PM' },
  { id: 3, label: 'Evening', time: '4:00 PM – 8:00 PM' },
];

const indianStates = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry'];

const serviceablePincodes = ['560034', '560066', '560001', '560002', '400001', '400051', '110001', '600001', '500001', '700001', '380001', '411001', '302001', '226001'];

function Delivery() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [deliveryType, setDeliveryType] = useState('standard');
  const [selectedSlot, setSelectedSlot] = useState(timeSlots[0]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [surpriseDelivery, setSurpriseDelivery] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [occasionDate, setOccasionDate] = useState('');
  const [reminderTiming, setReminderTiming] = useState('1week');
  const [pincodeStatus, setPincodeStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const [newAddress, setNewAddress] = useState({
    tag: 'Home', name: '', phone: '', flat: '', area: '', city: '', state: '', pincode: ''
  });

  const today = new Date().toISOString().split('T')[0];
  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + (deliveryType === 'express' ? 1 : 3));
    return d.toISOString().split('T')[0];
  })();
  const maxDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split('T')[0];
  })();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login?redirect=delivery');
      return;
    }
    loadData();
  }, [isLoggedIn]);

  const loadData = async () => {
    setLoadingAddresses(true);
    const [addrRes, cartRes] = await Promise.all([
      api.getAddresses(),
      api.getCart(),
    ]);
    if (addrRes.success && addrRes.addresses?.length) {
      setSavedAddresses(addrRes.addresses);
      const def = addrRes.addresses.find(a => a.is_default) || addrRes.addresses[0];
      setSelectedAddress(def);
    } else {
      setAddingNew(true);
    }
    if (cartRes.success) {
      setCartItems(cartRes.items || []);
    } else {
      const local = JSON.parse(localStorage.getItem('giftbloom_cart') || '[]');
      setCartItems(local);
    }
    setLoadingAddresses(false);
  };

  const checkPincode = (pin) => {
    if (pin.length === 6) {
      setPincodeStatus('checking');
      setTimeout(() => {
        setPincodeStatus(serviceablePincodes.includes(pin) ? 'valid' : 'invalid');
      }, 800);
    } else {
      setPincodeStatus('idle');
    }
  };

  const handleNewAddressChange = (key, value) => {
    setNewAddress(prev => ({ ...prev, [key]: value }));
    if (key === 'pincode') checkPincode(value);
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const validateNewAddress = () => {
    const e = {};
    if (!newAddress.name.trim()) e.name = 'Name is required';
    if (!newAddress.phone || newAddress.phone.length !== 10) e.phone = 'Valid 10-digit phone required';
    if (!newAddress.flat.trim()) e.flat = 'Address is required';
    if (!newAddress.area.trim()) e.area = 'Area is required';
    if (!newAddress.city.trim()) e.city = 'City is required';
    if (!newAddress.state) e.state = 'State is required';
    if (!newAddress.pincode || newAddress.pincode.length !== 6) e.pincode = 'Valid 6-digit pincode required';
    if (pincodeStatus === 'invalid') e.pincode = 'We do not deliver to this pincode yet';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveNewAddress = async () => {
    if (!validateNewAddress()) return;
    const res = await api.addAddress({ ...newAddress, is_default: savedAddresses.length === 0 });
    if (res.success) {
      const newAddr = { ...newAddress, id: res.id };
      setSavedAddresses(prev => [...prev, newAddr]);
      setSelectedAddress(newAddr);
      setAddingNew(false);
      setNewAddress({ tag: 'Home', name: '', phone: '', flat: '', area: '', city: '', state: '', pincode: '' });
      setPincodeStatus('idle');
    }
  };

  const deleteAddress = async (id) => {
    await api.deleteAddress(id);
    const updated = savedAddresses.filter(a => a.id !== id);
    setSavedAddresses(updated);
    if (selectedAddress?.id === id) {
      setSelectedAddress(updated[0] || null);
      if (updated.length === 0) setAddingNew(true);
    }
  };

  const validateProceed = () => {
    const e = {};
    if (!selectedAddress && !addingNew) e.address = 'Please select a delivery address';
    if (!deliveryDate) e.date = 'Please select a delivery date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleProceed = async () => {
    if (!validateProceed()) return;
    if (reminderEnabled && occasionDate) {
      await api.addReminder({
        occasion_name: 'Special Occasion',
        occasion_date: occasionDate,
        reminder_timing: reminderTiming,
      });
    }
    const deliveryData = {
      address: selectedAddress,
      deliveryDate,
      deliverySlot: `${selectedSlot.label} (${selectedSlot.time})`,
      deliveryType,
      surpriseDelivery,
      specialInstructions,
    };
    localStorage.setItem('giftbloom_delivery', JSON.stringify(deliveryData));
    navigate('/payment');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price || 0) * (item.quantity || 1), 0);
  const deliveryCharge = deliveryType === 'express' ? 99 : (subtotal >= 500 ? 0 : 49);
  const total = subtotal + deliveryCharge;

  if (loadingAddresses) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <p style={{ color: '#888' }}>Loading delivery details...</p>
    </div>
  );

  return (
    <div className="delivery-page">

      {/* Header */}
      <div className="delivery-header">
        <p className="section-label">ALMOST THERE</p>
        <h1>Delivery Details</h1>
        <p className="delivery-sub">Tell us where and when to deliver your gift</p>
      </div>

      {/* Progress Bar */}
      <div className="checkout-progress">
        <div className="checkout-step done"><div className="cp-dot"><FiCheck size={12} /></div><span>Cart</span></div>
        <div className="checkout-line done" />
        <div className="checkout-step active"><div className="cp-dot">2</div><span>Delivery</span></div>
        <div className="checkout-line" />
        <div className="checkout-step"><div className="cp-dot">3</div><span>Payment</span></div>
        <div className="checkout-line" />
        <div className="checkout-step"><div className="cp-dot">4</div><span>Confirm</span></div>
      </div>

      <div className="delivery-body">
        <div className="delivery-main">

          {/* SECTION 1 — ADDRESS */}
          <div className="delivery-section">
            <div className="section-header">
              <div className="section-number">1</div>
              <h3>Delivery Address</h3>
            </div>

            {errors.address && (
              <div className="field-error"><FiAlertCircle size={13} /> {errors.address}</div>
            )}

            {!addingNew && savedAddresses.length > 0 && (
              <div className="address-list">
                {savedAddresses.map(addr => (
                  <div
                    key={addr.id}
                    className={`address-card ${selectedAddress?.id === addr.id ? 'active' : ''}`}
                    onClick={() => setSelectedAddress(addr)}
                  >
                    <div className="address-card-left">
                      <div className={`address-radio ${selectedAddress?.id === addr.id ? 'active' : ''}`}>
                        {selectedAddress?.id === addr.id && <div className="radio-dot" />}
                      </div>
                      <div className="address-details">
                        <div className="address-tag-row">
                          <span className="address-tag">{addr.tag}</span>
                          <span className="address-name">{addr.name}</span>
                          {addr.is_default && <span className="default-badge">Default</span>}
                        </div>
                        <p className="address-line">{addr.flat}, {addr.area}</p>
                        <p className="address-line">{addr.city}, {addr.state} — {addr.pincode}</p>
                        <p className="address-phone"><FiPhone size={11} /> {addr.phone}</p>
                      </div>
                    </div>
                    <div className="address-card-right">
                      {selectedAddress?.id === addr.id && <span className="address-selected-badge"><FiCheck size={12} /> Selected</span>}
                      <button className="addr-delete-btn" onClick={e => { e.stopPropagation(); deleteAddress(addr.id); }}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                <button className="add-address-btn" onClick={() => setAddingNew(true)}>
                  <FiPlus size={14} /> Add New Address
                </button>
              </div>
            )}

            {addingNew && (
              <div className="new-address-form">
                {savedAddresses.length > 0 && (
                  <button className="back-to-saved" onClick={() => { setAddingNew(false); setErrors({}); }}>
                    ← Back to saved addresses
                  </button>
                )}

                <div className="form-row">
                  <div className="tag-selector">
                    {['Home', 'Office', 'Other'].map(tag => (
                      <button key={tag} className={`tag-btn ${newAddress.tag === tag ? 'active' : ''}`} onClick={() => handleNewAddressChange('tag', tag)}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-row two-col">
                  <div className="form-field">
                    <label>Full Name <span className="req">*</span></label>
                    <div className={`field-wrap ${errors.name ? 'error' : ''}`}>
                      <FiUser className="field-icon" />
                      <input type="text" placeholder="Recipient's full name" value={newAddress.name} onChange={e => handleNewAddressChange('name', e.target.value)} />
                    </div>
                    {errors.name && <p className="field-error-msg">{errors.name}</p>}
                  </div>
                  <div className="form-field">
                    <label>Phone Number <span className="req">*</span></label>
                    <div className={`field-wrap ${errors.phone ? 'error' : ''}`}>
                      <FiPhone className="field-icon" />
                      <input type="tel" placeholder="10-digit number" value={newAddress.phone} onChange={e => handleNewAddressChange('phone', e.target.value.replace(/\D/, '').slice(0, 10))} />
                    </div>
                    {errors.phone && <p className="field-error-msg">{errors.phone}</p>}
                  </div>
                </div>

                <div className="form-field">
                  <label>Flat / House No., Building Name <span className="req">*</span></label>
                  <input type="text" className={`plain-input ${errors.flat ? 'error' : ''}`} placeholder="e.g. 12A, Sunshine Apartments" value={newAddress.flat} onChange={e => handleNewAddressChange('flat', e.target.value)} />
                  {errors.flat && <p className="field-error-msg">{errors.flat}</p>}
                </div>

                <div className="form-field">
                  <label>Street, Area, Landmark <span className="req">*</span></label>
                  <input type="text" className={`plain-input ${errors.area ? 'error' : ''}`} placeholder="e.g. MG Road, Near Central Mall" value={newAddress.area} onChange={e => handleNewAddressChange('area', e.target.value)} />
                  {errors.area && <p className="field-error-msg">{errors.area}</p>}
                </div>

                <div className="form-row two-col">
                  <div className="form-field">
                    <label>City <span className="req">*</span></label>
                    <input type="text" className={`plain-input ${errors.city ? 'error' : ''}`} placeholder="City" value={newAddress.city} onChange={e => handleNewAddressChange('city', e.target.value)} />
                    {errors.city && <p className="field-error-msg">{errors.city}</p>}
                  </div>
                  <div className="form-field">
                    <label>State <span className="req">*</span></label>
                    <div className="select-wrap">
                      <select className={`plain-select ${errors.state ? 'error' : ''}`} value={newAddress.state} onChange={e => handleNewAddressChange('state', e.target.value)}>
                        <option value="">Select State</option>
                        {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <FiChevronDown className="select-icon" />
                    </div>
                    {errors.state && <p className="field-error-msg">{errors.state}</p>}
                  </div>
                </div>

                <div className="form-field">
                  <label>Pincode <span className="req">*</span></label>
                  <div className="pincode-wrap">
                    <input type="text" className={`plain-input ${errors.pincode ? 'error' : ''}`} placeholder="6-digit pincode" value={newAddress.pincode} maxLength={6} onChange={e => handleNewAddressChange('pincode', e.target.value.replace(/\D/, ''))} />
                    {pincodeStatus === 'checking' && <span className="pincode-status checking">Checking...</span>}
                    {pincodeStatus === 'valid' && <span className="pincode-status valid"><FiCheck size={12} /> Delivery available</span>}
                    {pincodeStatus === 'invalid' && <span className="pincode-status invalid"><FiAlertCircle size={12} /> Not serviceable yet</span>}
                  </div>
                  {errors.pincode && <p className="field-error-msg">{errors.pincode}</p>}
                </div>

                <div className="form-actions">
                  {savedAddresses.length > 0 && (
                    <button className="btn-cancel" onClick={() => { setAddingNew(false); setErrors({}); }}>Cancel</button>
                  )}
                  <button className="btn-save-address" onClick={saveNewAddress}>Save Address</button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2 — DATE & TIME */}
          <div className="delivery-section">
            <div className="section-header">
              <div className="section-number">2</div>
              <h3>Delivery Date & Time</h3>
            </div>

            <div className="delivery-type-row">
              <div className={`delivery-type-card ${deliveryType === 'standard' ? 'active' : ''}`} onClick={() => { setDeliveryType('standard'); setDeliveryDate(''); }}>
                <div className="type-radio">{deliveryType === 'standard' && <div className="radio-dot" />}</div>
                <div>
                  <p className="type-label">Standard Delivery</p>
                  <p className="type-desc">3–5 business days</p>
                </div>
                <span className={`type-price ${subtotal >= 500 ? 'free' : ''}`}>{subtotal >= 500 ? 'FREE' : '₹49'}</span>
              </div>
              <div className={`delivery-type-card ${deliveryType === 'express' ? 'active' : ''}`} onClick={() => { setDeliveryType('express'); setDeliveryDate(''); }}>
                <div className="type-radio">{deliveryType === 'express' && <div className="radio-dot" />}</div>
                <div>
                  <p className="type-label">Express Delivery</p>
                  <p className="type-desc">Next business day</p>
                </div>
                <span className="type-price">+₹99</span>
              </div>
            </div>

            <div className="form-field" style={{ marginTop: '20px' }}>
              <label>Choose Delivery Date <span className="req">*</span></label>
              <p className="delivery-date-hint">
                {deliveryType === 'express' ? 'Express: Available from tomorrow onwards' : 'Standard: Available from 3 days onwards'}
              </p>
              <input
                type="date"
                className={`plain-input date-input ${errors.date ? 'error' : ''}`}
                min={minDate}
                max={maxDate}
                value={deliveryDate}
                onChange={e => { setDeliveryDate(e.target.value); setErrors(prev => ({ ...prev, date: '' })); }}
              />
              {errors.date && <p className="field-error-msg">{errors.date}</p>}
            </div>

            <div className="form-field" style={{ marginTop: '16px' }}>
              <label>Preferred Time Slot</label>
              <div className="time-slots">
                {timeSlots.map(slot => (
                  <div key={slot.id} className={`time-slot ${selectedSlot.id === slot.id ? 'active' : ''}`} onClick={() => setSelectedSlot(slot)}>
                    <p className="slot-label">{slot.label}</p>
                    <p className="slot-time">{slot.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3 — GIFT OPTIONS */}
          <div className="delivery-section">
            <div className="section-header">
              <div className="section-number">3</div>
              <h3>Gift Options</h3>
            </div>

            <div className="toggle-row">
              <div className="toggle-info">
                <p className="toggle-title">Surprise Delivery</p>
                <p className="toggle-desc">Don't reveal the sender's name to the recipient</p>
              </div>
              <div className={`toggle-switch ${surpriseDelivery ? 'active' : ''}`} onClick={() => setSurpriseDelivery(!surpriseDelivery)}>
                <div className="toggle-thumb" />
              </div>
            </div>

            <div className="form-field" style={{ marginTop: '20px' }}>
              <label>Special Instructions <span className="optional">(Optional)</span></label>
              <textarea
                className="plain-textarea"
                placeholder="e.g. Please handle with care, Leave at the door, Call before delivery..."
                value={specialInstructions}
                onChange={e => setSpecialInstructions(e.target.value)}
                maxLength={200}
              />
              <p className="char-count">{specialInstructions.length}/200</p>
            </div>
          </div>

          {/* SECTION 4 — SMART REMINDER */}
          <div className="delivery-section">
            <div className="section-header">
              <div className="section-number">4</div>
              <h3>Smart Reminder</h3>
              <span className="section-badge">New</span>
            </div>

            <div className="reminder-box">
              <div className="reminder-icon-wrap"><FiBell size={20} /></div>
              <div className="reminder-content">
                <p className="reminder-title">Never miss this occasion again</p>
                <p className="reminder-desc">We'll remind you next year before this special date</p>
              </div>
              <div className={`toggle-switch ${reminderEnabled ? 'active' : ''}`} onClick={() => setReminderEnabled(!reminderEnabled)}>
                <div className="toggle-thumb" />
              </div>
            </div>

            {reminderEnabled && (
              <div className="reminder-options">
                <div className="form-field">
                  <label>Occasion Date</label>
                  <input type="date" className="plain-input" value={occasionDate} onChange={e => setOccasionDate(e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Remind Me</label>
                  <div className="reminder-timing">
                    {[{ value: '1week', label: '1 week before' }, { value: '3days', label: '3 days before' }, { value: 'both', label: 'Both' }].map(opt => (
                      <button key={opt.value} className={`timing-btn ${reminderTiming === opt.value ? 'active' : ''}`} onClick={() => setReminderTiming(opt.value)}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button className="btn-proceed" onClick={handleProceed}>
            Continue to Payment →
          </button>

        </div>

        {/* Right Summary */}
        <div className="delivery-summary">
          <p className="filter-label">Order Summary</p>

          <div className="summary-items-list">
            {cartItems.slice(0, 3).map((item, i) => (
              <div key={i} className="summary-item-row">
                <img src={item.image} alt={item.name} className="summary-item-img" />
                <div className="summary-item-info">
                  <p className="summary-item-name">{item.name}</p>
                  <p className="summary-item-qty">Qty: {item.quantity || 1}</p>
                </div>
                <p className="summary-item-price">&#8377;{(parseFloat(item.price) * (item.quantity || 1)).toLocaleString()}</p>
              </div>
            ))}
            {cartItems.length > 3 && <p className="summary-more">+{cartItems.length - 3} more items</p>}
          </div>

          {selectedAddress && (
            <div className="summary-address">
              <p className="summary-label">Delivering to</p>
              <div className="summary-address-box">
                <FiMapPin size={14} className="summary-map-icon" />
                <div>
                  <p className="summary-address-name">{selectedAddress.name}</p>
                  <p className="summary-address-line">{selectedAddress.flat}, {selectedAddress.area}</p>
                  <p className="summary-address-line">{selectedAddress.city} — {selectedAddress.pincode}</p>
                </div>
              </div>
            </div>
          )}

          {deliveryDate && (
            <div className="summary-delivery-info">
              <p className="summary-label">Expected Delivery</p>
              <p className="summary-value">{new Date(deliveryDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              <p className="summary-value" style={{ fontSize: '12px', color: '#888' }}>{selectedSlot.label} · {selectedSlot.time}</p>
            </div>
          )}

          <div className="summary-price-box">
            <div className="summary-price-row"><span>Subtotal</span><span>&#8377;{subtotal.toLocaleString()}</span></div>
            <div className="summary-price-row">
              <span>Delivery</span>
              <span>{deliveryCharge === 0 ? <span className="free-tag">FREE</span> : `₹${deliveryCharge}`}</span>
            </div>
            <div className="summary-price-divider" />
            <div className="summary-price-row total"><span>Total</span><span>&#8377;{total.toLocaleString()}</span></div>
          </div>

          <div className="security-badge">
            <FiCheck size={14} />
            <p>100% secure & encrypted checkout</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Delivery;
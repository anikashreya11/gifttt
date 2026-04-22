import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { FiPackage, FiHeart, FiMapPin, FiBell, FiUser, FiGift, FiChevronRight, FiCheck, FiClock, FiEdit2, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const tabs = [
  { id: 'orders', label: 'My Orders', icon: <FiPackage /> },
  { id: 'wishlist', label: 'Wishlist', icon: <FiHeart /> },
  { id: 'reminders', label: 'Reminders', icon: <FiBell /> },
  { id: 'addresses', label: 'Addresses', icon: <FiMapPin /> },
  { id: 'profile', label: 'Profile', icon: <FiUser /> },
];

const statusColor = { 'delivered': '#3B6D11', 'placed': '#185FA5', 'preparing': '#BA7517', 'out_for_delivery': '#534AB7', 'cancelled': '#e24b4a' };
const statusBg = { 'delivered': '#EAF3DE', 'placed': '#E6F1FB', 'preparing': '#FFFBF0', 'out_for_delivery': '#EEEDFE', 'cancelled': '#FCEBEB' };
const statusLabel = { 'delivered': 'Delivered', 'placed': 'Order Placed', 'preparing': 'Preparing', 'out_for_delivery': 'Out for Delivery', 'cancelled': 'Cancelled' };

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [saveMsg, setSaveMsg] = useState('');

  const token = localStorage.getItem('giftbloom_token');
  const localUser = localStorage.getItem('giftbloom_user');
  const user = localUser ? JSON.parse(localUser) : null;

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [ordersRes, wishlistRes, remindersRes, addressesRes, profileRes] = await Promise.all([
        api.getOrders(),
        api.getWishlist(),
        api.getReminders(),
        api.getAddresses(),
        api.getProfile(),
      ]);
      if (ordersRes.success) setOrders(ordersRes.orders || []);
      if (wishlistRes.success) setWishlist(wishlistRes.items || []);
      if (remindersRes.success) setReminders(remindersRes.reminders || []);
      if (addressesRes.success) setAddresses(addressesRes.addresses || []);
      if (profileRes.success) {
        setProfile(profileRes.user);
        setProfileForm({ name: profileRes.user.name, phone: profileRes.user.phone || '' });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    const res = await api.updateProfile(profileForm);
    if (res.success) {
      setSaveMsg('Profile updated!');
      const updated = { ...user, name: profileForm.name };
      localStorage.setItem('giftbloom_user', JSON.stringify(updated));
      setTimeout(() => setSaveMsg(''), 3000);
      setEditProfile(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    await api.deleteAddress(id);
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const handleRemoveWishlist = async (productId) => {
    await api.removeFromWishlist(productId);
    setWishlist(prev => prev.filter(w => w.product_id !== productId));
  };

  const handleDeleteReminder = async (id) => {
    await api.deleteReminder(id);
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const displayName = profile?.name || user?.name || 'User';
  const displayEmail = profile?.email || user?.email || '';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <p style={{ color: '#888', fontSize: '15px' }}>Loading your account...</p>
    </div>
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-user">
          <div className="dashboard-avatar">{initials}</div>
          <div>
            <h1>Welcome back, {displayName.split(' ')[0]}!</h1>
            <p>{displayEmail} &bull; Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '2026'}</p>
          </div>
        </div>
        <div className="dashboard-stats">
          <div className="stat-card"><p className="stat-number">{orders.length}</p><p className="stat-label">Orders</p></div>
          <div className="stat-card"><p className="stat-number">{wishlist.length}</p><p className="stat-label">Wishlist</p></div>
          <div className="stat-card"><p className="stat-number">{reminders.length}</p><p className="stat-label">Reminders</p></div>
        </div>
      </div>

      <div className="dashboard-body">
        <div className="dashboard-sidebar">
          {tabs.map(tab => (
            <button key={tab.id} className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              {tab.icon}<span>{tab.label}</span><FiChevronRight className="tab-arrow" />
            </button>
          ))}
        </div>

        <div className="dashboard-content">

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <div>
              <h2>My Orders</h2>
              <p className="content-sub">Track and manage your gift orders</p>
              {orders.length === 0 ? (
                <div className="empty-state">
                  <FiPackage size={48} color="#e0e0e0" />
                  <p>No orders yet</p>
                  <button className="btn-empty" onClick={() => navigate('/explore')}>Start Shopping</button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-card-left">
                        <div className="order-icon"><FiGift /></div>
                        <div className="order-info">
                          <p className="order-name">Order #{order.order_number}</p>
                          <p className="order-meta">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          <p className="order-id">{order.items?.length || 0} item(s)</p>
                        </div>
                      </div>
                      <div className="order-card-right">
                        <span className="order-status" style={{ color: statusColor[order.status], backgroundColor: statusBg[order.status] }}>
                          {order.status === 'delivered' ? <FiCheck /> : <FiClock />}
                          {statusLabel[order.status] || order.status}
                        </span>
                        <p className="order-price">&#8377;{parseFloat(order.total).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WISHLIST */}
          {activeTab === 'wishlist' && (
            <div>
              <h2>My Wishlist</h2>
              <p className="content-sub">Gifts you've saved for later</p>
              {wishlist.length === 0 ? (
                <div className="empty-state">
                  <FiHeart size={48} color="#e0e0e0" />
                  <p>Your wishlist is empty</p>
                  <button className="btn-empty" onClick={() => navigate('/explore')}>Explore Gifts</button>
                </div>
              ) : (
                <div className="wishlist-grid">
                  {wishlist.map(item => (
                    <div key={item.id} className="wishlist-card">
                      <div className="wishlist-img">
                        <img src={item.image} alt={item.name} />
                        <button className="wishlist-remove" onClick={() => handleRemoveWishlist(item.product_id)}>
                          <FiX size={12} />
                        </button>
                      </div>
                      <div className="wishlist-info">
                        <p className="wishlist-name">{item.name}</p>
                        <p className="wishlist-price">&#8377;{parseFloat(item.price).toLocaleString()}</p>
                        <button className="btn-wishlist-order" onClick={() => navigate(`/product/${item.product_id}`)}>
                          View & Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* REMINDERS */}
          {activeTab === 'reminders' && (
            <div>
              <h2>Smart Reminders</h2>
              <p className="content-sub">Never miss a special occasion again</p>
              {reminders.length === 0 ? (
                <div className="empty-state">
                  <FiBell size={48} color="#e0e0e0" />
                  <p>No reminders set</p>
                  <p style={{ fontSize: '13px', color: '#aaa' }}>Reminders are set automatically when you place an order</p>
                </div>
              ) : (
                <div className="reminders-list">
                  {reminders.map(r => {
                    const daysLeft = Math.ceil((new Date(r.occasion_date) - new Date()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={r.id} className="reminder-card">
                        <div className="reminder-card-left">
                          <div className="reminder-bell-icon"><FiBell /></div>
                          <div>
                            <p className="reminder-name">{r.occasion_name}</p>
                            <p className="reminder-date">{new Date(r.occasion_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })} &bull; Remind {r.reminder_timing}</p>
                          </div>
                        </div>
                        <div className="reminder-card-right">
                          <div className="days-left-badge">
                            <p className="days-number">{daysLeft > 0 ? daysLeft : 0}</p>
                            <p className="days-label">days left</p>
                          </div>
                          <button className="btn-reminder-gift" onClick={() => navigate('/explore')}>
                            <FiGift /> Send Gift
                          </button>
                          <button className="btn-reminder-delete" onClick={() => handleDeleteReminder(r.id)}>
                            <FiX />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ADDRESSES */}
          {activeTab === 'addresses' && (
            <div>
              <h2>Saved Addresses</h2>
              <p className="content-sub">Manage your delivery addresses</p>
              {addresses.length === 0 ? (
                <div className="empty-state">
                  <FiMapPin size={48} color="#e0e0e0" />
                  <p>No saved addresses</p>
                  <p style={{ fontSize: '13px', color: '#aaa' }}>Addresses are saved when you place an order</p>
                </div>
              ) : (
                <div className="addresses-list">
                  {addresses.map(addr => (
                    <div key={addr.id} className="address-card-dash">
                      <div className="address-card-dash-left">
                        <span className="address-tag-dash">{addr.tag}</span>
                        <div>
                          <p className="address-name-dash">{addr.name}</p>
                          <p className="address-text">{addr.flat}, {addr.area}</p>
                          <p className="address-text">{addr.city}, {addr.state} — {addr.pincode}</p>
                          <p className="address-text">{addr.phone}</p>
                        </div>
                      </div>
                      <div className="address-actions">
                        <button className="btn-address-delete" onClick={() => handleDeleteAddress(addr.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div>
              <h2>My Profile</h2>
              <p className="content-sub">Manage your personal information</p>
              <div className="profile-form">
                <div className="profile-avatar-section">
                  <div className="profile-avatar-large">{initials}</div>
                  {!editProfile && (
                    <button className="btn-change-photo" onClick={() => setEditProfile(true)}>
                      <FiEdit2 size={13} /> Edit Profile
                    </button>
                  )}
                </div>
                <div className="profile-fields">
                  {editProfile ? (
                    <>
                      <div className="profile-field-row">
                        <div className="profile-field">
                          <label>Full Name</label>
                          <input type="text" value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} className="profile-input" />
                        </div>
                        <div className="profile-field">
                          <label>Phone Number</label>
                          <input type="tel" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} className="profile-input" />
                        </div>
                      </div>
                      <div className="profile-field-row">
                        <div className="profile-field">
                          <label>Email Address</label>
                          <input type="email" value={profile?.email || ''} disabled className="profile-input" style={{ opacity: 0.6 }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn-save-profile" onClick={handleSaveProfile}>Save Changes</button>
                        <button className="btn-cancel-profile" onClick={() => setEditProfile(false)}>Cancel</button>
                      </div>
                      {saveMsg && <p style={{ color: '#3B6D11', fontSize: '13px', marginTop: '8px' }}>{saveMsg}</p>}
                    </>
                  ) : (
                    <div className="profile-view">
                      <div className="profile-view-row"><span>Name</span><strong>{profile?.name}</strong></div>
                      <div className="profile-view-row"><span>Email</span><strong>{profile?.email}</strong></div>
                      <div className="profile-view-row"><span>Phone</span><strong>{profile?.phone || 'Not added'}</strong></div>
                      <div className="profile-view-row"><span>Member Since</span><strong>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</strong></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;

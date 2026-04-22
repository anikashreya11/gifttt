import React, { useState, useEffect } from 'react';
import '../styles/AdminDashboard.css';
import { FiPackage, FiDollarSign, FiTruck, FiCheck, FiClock, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const statusColors = {
  placed: { color: '#185FA5', bg: '#E6F1FB', label: 'New Order' },
  preparing: { color: '#BA7517', bg: '#FFFBF0', label: 'Preparing' },
  out_for_delivery: { color: '#534AB7', bg: '#EEEDFE', label: 'Out for Delivery' },
  delivered: { color: '#3B6D11', bg: '#EAF3DE', label: 'Delivered' },
  cancelled: { color: '#e24b4a', bg: '#FCEBEB', label: 'Cancelled' },
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const token = localStorage.getItem('giftbloom_token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const url = `${BASE_URL}/orders/admin/all?status=${filter}&limit=50`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        setStats(data.stats || null);
      } else {
        alert('Access denied. Admin only.');
        navigate('/');
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`${BASE_URL}/orders/admin/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder?.id === orderId) setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (e) { console.error(e); }
    setUpdating(false);
  };

  return (
    <div className="admin-page">

      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>Giftbloom Admin</h1>
          <p>Owner Dashboard — Manage all orders</p>
        </div>
        <button className="admin-refresh" onClick={loadOrders}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon blue"><FiPackage /></div>
            <div>
              <p className="admin-stat-number">{stats.total_orders || 0}</p>
              <p className="admin-stat-label">Total Orders</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon green"><FiDollarSign /></div>
            <div>
              <p className="admin-stat-number">&#8377;{parseFloat(stats.total_revenue || 0).toLocaleString()}</p>
              <p className="admin-stat-label">Total Revenue</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon orange"><FiClock /></div>
            <div>
              <p className="admin-stat-number">{stats.new_orders || 0}</p>
              <p className="admin-stat-label">New Orders</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon purple"><FiTruck /></div>
            <div>
              <p className="admin-stat-number">{stats.preparing || 0}</p>
              <p className="admin-stat-label">Preparing</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon teal"><FiCheck /></div>
            <div>
              <p className="admin-stat-number">{stats.delivered || 0}</p>
              <p className="admin-stat-label">Delivered</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="admin-filters">
        {['all', 'placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(f => (
          <button
            key={f}
            className={`admin-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All Orders' : statusColors[f]?.label || f}
          </button>
        ))}
      </div>

      <div className="admin-body">

        {/* Orders List */}
        <div className={`admin-orders-list ${selectedOrder ? 'with-detail' : ''}`}>
          {loading ? (
            <div className="admin-loading"><p>Loading orders...</p></div>
          ) : orders.length === 0 ? (
            <div className="admin-empty"><FiPackage size={40} color="#e0e0e0" /><p>No orders found</p></div>
          ) : (
            orders.map(order => (
              <div
                key={order.id}
                className={`admin-order-card ${selectedOrder?.id === order.id ? 'selected' : ''}`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="admin-order-top">
                  <div>
                    <p className="admin-order-number">#{order.order_number}</p>
                    <p className="admin-order-customer">{order.customer_name} • {order.customer_phone || order.customer_email}</p>
                  </div>
                  <span
                    className="admin-order-status"
                    style={{ color: statusColors[order.status]?.color, backgroundColor: statusColors[order.status]?.bg }}
                  >
                    {statusColors[order.status]?.label || order.status}
                  </span>
                </div>
                <div className="admin-order-bottom">
                  <p>{order.item_count} item(s) • &#8377;{parseFloat(order.total).toLocaleString()}</p>
                  <p>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Detail */}
        {selectedOrder && (
          <div className="admin-order-detail">
            <div className="admin-detail-header">
              <div>
                <h2>Order #{selectedOrder.order_number}</h2>
                <p>{new Date(selectedOrder.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <button className="admin-close-detail" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            {/* Customer Info */}
            <div className="admin-detail-section">
              <h3>Customer Details</h3>
              <div className="admin-detail-row"><span>Name</span><strong>{selectedOrder.customer_name}</strong></div>
              <div className="admin-detail-row"><span>Email</span><strong>{selectedOrder.customer_email}</strong></div>
              <div className="admin-detail-row"><span>Phone</span><strong>{selectedOrder.customer_phone || 'Not provided'}</strong></div>
            </div>

            {/* Delivery Address */}
            <div className="admin-detail-section">
              <h3>Delivery Address</h3>
              {selectedOrder.delivery_address && (
                <>
                  <div className="admin-detail-row"><span>Name</span><strong>{selectedOrder.delivery_address.name}</strong></div>
                  <div className="admin-detail-row"><span>Phone</span><strong>{selectedOrder.delivery_address.phone}</strong></div>
                  <div className="admin-detail-row"><span>Address</span><strong>{selectedOrder.delivery_address.flat}, {selectedOrder.delivery_address.area}</strong></div>
                  <div className="admin-detail-row"><span>City</span><strong>{selectedOrder.delivery_address.city}, {selectedOrder.delivery_address.state} — {selectedOrder.delivery_address.pincode}</strong></div>
                </>
              )}
              <div className="admin-detail-row"><span>Delivery Date</span><strong>{selectedOrder.delivery_date ? new Date(selectedOrder.delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not specified'}</strong></div>
              <div className="admin-detail-row"><span>Time Slot</span><strong>{selectedOrder.delivery_slot || 'Any time'}</strong></div>
              <div className="admin-detail-row"><span>Type</span><strong>{selectedOrder.delivery_type === 'express' ? 'Express Delivery' : 'Standard Delivery'}</strong></div>
              {selectedOrder.surprise_delivery && <div className="admin-detail-row"><span>Surprise</span><strong>Yes — Don't reveal sender</strong></div>}
              {selectedOrder.special_instructions && <div className="admin-detail-row"><span>Instructions</span><strong>{selectedOrder.special_instructions}</strong></div>}
            </div>

            {/* Items */}
            <div className="admin-detail-section">
              <h3>Order Items</h3>
              {selectedOrder.items?.map((item, i) => (
                <div key={i} className="admin-item-card">
                  <img src={item.product_image} alt={item.product_name} className="admin-item-img" />
                  <div className="admin-item-info">
                    <p className="admin-item-name">{item.product_name}</p>
                    <p className="admin-item-qty">Qty: {item.quantity} × &#8377;{parseFloat(item.price).toLocaleString()}</p>
                    {item.personalization?.recipientName && <p className="admin-item-personal">For: {item.personalization.recipientName}</p>}
                    {item.personalization?.senderName && <p className="admin-item-personal">From: {item.personalization.senderName}</p>}
                    {item.personalization?.message && <p className="admin-item-message">"{item.personalization.message}"</p>}
                  </div>
                  <p className="admin-item-total">&#8377;{(parseFloat(item.price) * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Payment */}
            <div className="admin-detail-section">
              <h3>Payment Details</h3>
              <div className="admin-detail-row"><span>Method</span><strong>{selectedOrder.payment_method}</strong></div>
              <div className="admin-detail-row"><span>Status</span><strong style={{ color: selectedOrder.payment_status === 'paid' ? '#3B6D11' : '#e24b4a' }}>{selectedOrder.payment_status?.toUpperCase()}</strong></div>
              <div className="admin-detail-row"><span>Subtotal</span><strong>&#8377;{parseFloat(selectedOrder.subtotal).toLocaleString()}</strong></div>
              {parseFloat(selectedOrder.discount) > 0 && <div className="admin-detail-row"><span>Discount</span><strong>− &#8377;{parseFloat(selectedOrder.discount).toLocaleString()}</strong></div>}
              <div className="admin-detail-row"><span>Delivery</span><strong>{parseFloat(selectedOrder.delivery_charge) === 0 ? 'FREE' : `₹${selectedOrder.delivery_charge}`}</strong></div>
              <div className="admin-detail-row total"><span>Total</span><strong>&#8377;{parseFloat(selectedOrder.total).toLocaleString()}</strong></div>
            </div>

            {/* Update Status */}
            <div className="admin-detail-section">
              <h3>Update Order Status</h3>
              <p className="admin-status-note">Current: <span style={{ color: statusColors[selectedOrder.status]?.color, fontWeight: 600 }}>{statusColors[selectedOrder.status]?.label}</span></p>
              <div className="admin-status-buttons">
                {selectedOrder.status === 'placed' && (
                  <button className="admin-status-btn preparing" onClick={() => updateStatus(selectedOrder.id, 'preparing')} disabled={updating}>
                    {updating ? 'Updating...' : 'Mark as Preparing'}
                  </button>
                )}
                {selectedOrder.status === 'preparing' && (
                  <button className="admin-status-btn delivery" onClick={() => updateStatus(selectedOrder.id, 'out_for_delivery')} disabled={updating}>
                    {updating ? 'Updating...' : 'Mark as Out for Delivery'}
                  </button>
                )}
                {selectedOrder.status === 'out_for_delivery' && (
                  <button className="admin-status-btn delivered" onClick={() => updateStatus(selectedOrder.id, 'delivered')} disabled={updating}>
                    {updating ? 'Updating...' : 'Mark as Delivered'}
                  </button>
                )}
                {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                  <button className="admin-status-btn cancel" onClick={() => updateStatus(selectedOrder.id, 'cancelled')} disabled={updating}>
                    Cancel Order
                  </button>
                )}
                {(selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled') && (
                  <p style={{ fontSize: '13px', color: '#888' }}>This order is {selectedOrder.status}. No further actions needed.</p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

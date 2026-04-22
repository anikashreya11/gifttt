import React, { useState } from 'react';
import '../styles/Notifications.css';
import { FiBell, FiPackage, FiGift, FiHeart, FiCheck, FiTrash2 } from 'react-icons/fi';

const allNotifications = [
  {
    id: 1, type: 'reminder', read: false,
    title: "Sarah's Birthday is in 7 days! 🎂",
    message: "Don't forget to send a gift for Sarah's birthday on July 15th. Order now for on-time delivery!",
    time: '2 hours ago',
    action: 'Send a Gift',
  },
  {
    id: 2, type: 'order', read: false,
    title: 'Your order is out for delivery! 🚚',
    message: 'Order #GB098342 is on its way. Expected delivery today between 9AM–12PM.',
    time: '5 hours ago',
    action: 'Track Order',
  },
  {
    id: 3, type: 'promo', read: true,
    title: "Valentine's Day is around the corner 💝",
    message: "Show your love with a personalized gift. Use code LOVE15 for 15% off on all Valentine's gifts!",
    time: '1 day ago',
    action: 'Explore Gifts',
  },
  {
    id: 4, type: 'order', read: true,
    title: 'Order delivered successfully! ✅',
    message: 'Order #GB104521 has been delivered. We hope your loved one enjoyed the gift!',
    time: '3 days ago',
    action: 'Rate Experience',
  },
  {
    id: 5, type: 'reminder', read: true,
    title: "Wedding Anniversary reminder set! 🔔",
    message: "We'll remind you 3 days before your wedding anniversary on August 22nd.",
    time: '5 days ago',
    action: null,
  },
  {
    id: 6, type: 'promo', read: true,
    title: 'New arrivals just dropped! 🎁',
    message: 'Check out our latest collection of premium hampers and personalized gifts. Fresh designs added!',
    time: '1 week ago',
    action: 'Explore Now',
  },
  {
    id: 7, type: 'order', read: true,
    title: 'Order confirmed! 🎉',
    message: 'Your order #GB087231 for Aromatherapy Gift Set has been confirmed and is being prepared.',
    time: '2 weeks ago',
    action: 'View Order',
  },
];

const typeConfig = {
  reminder: { icon: <FiBell />, color: '#e8709a', bg: '#FFF0F5' },
  order: { icon: <FiPackage />, color: '#185FA5', bg: '#E6F1FB' },
  promo: { icon: <FiGift />, color: '#BA7517', bg: '#FFFBF0' },
};

function Notifications() {
  const [notifications, setNotifications] = useState(allNotifications);
  const [filter, setFilter] = useState('all');

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'reminders') return n.type === 'reminder';
    if (filter === 'orders') return n.type === 'order';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-page">

      {/* Header */}
      <div className="notifications-header">
        <div className="notif-header-left">
          <p className="section-label">YOUR UPDATES</p>
          <h1>Notifications</h1>
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} unread</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button className="btn-mark-all" onClick={markAllRead}>
            <FiCheck /> Mark all as read
          </button>
        )}
      </div>

      <div className="notifications-body">

        {/* Filter Tabs */}
        <div className="notif-filters">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'orders', label: 'Orders' },
            { id: 'reminders', label: 'Reminders' },
          ].map(f => (
            <button
              key={f.id}
              className={`notif-filter-btn ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              {f.id === 'unread' && unreadCount > 0 && (
                <span className="filter-count">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {filtered.length === 0 ? (
            <div className="notif-empty">
              <FiBell className="notif-empty-icon" />
              <p>No notifications here</p>
              <span>You're all caught up! 🎉</span>
            </div>
          ) : (
            filtered.map(notif => (
              <div
                key={notif.id}
                className={`notif-card ${!notif.read ? 'unread' : ''}`}
                onClick={() => markRead(notif.id)}
              >
                <div
                  className="notif-icon"
                  style={{
                    backgroundColor: typeConfig[notif.type].bg,
                    color: typeConfig[notif.type].color,
                  }}
                >
                  {typeConfig[notif.type].icon}
                </div>

                <div className="notif-content">
                  <div className="notif-top-row">
                    <p className="notif-title">{notif.title}</p>
                    {!notif.read && <div className="unread-dot" />}
                  </div>
                  <p className="notif-message">{notif.message}</p>
                  <div className="notif-bottom-row">
                    <span className="notif-time">{notif.time}</span>
                    {notif.action && (
                      <button className="notif-action-btn">{notif.action} →</button>
                    )}
                  </div>
                </div>

                <button
                  className="notif-delete"
                  onClick={e => { e.stopPropagation(); deleteNotification(notif.id); }}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default Notifications;
import { useState, useEffect } from 'react';
import { Bell, X, Check, Trash2, Package, ShoppingCart, AlertCircle } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function NotificationPanel({ isOpen, onClose }) {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, unreadCount } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'order_placed':
      case 'order_confirmed':
      case 'order_packed':
      case 'order_shipped':
      case 'order_delivered':
        return <Package size={18} className="text-primary" />;
      case 'order_cancelled':
        return <AlertCircle size={18} className="text-danger" />;
      case 'payment_received':
        return <ShoppingCart size={18} className="text-success" />;
      default:
        return <Bell size={18} />;
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = now - notifDate;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return notifDate.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <h5 className="m-0 d-flex align-items-center gap-2">
          <Bell size={20} />
          Notifications
          {unreadCount > 0 && (
            <span className="badge bg-danger">{unreadCount}</span>
          )}
        </h5>
        <div className="d-flex gap-2">
          {unreadCount > 0 && (
            <button className="btn btn-sm btn-link" onClick={markAllAsRead}>
              <Check size={16} /> Mark all read
            </button>
          )}
          <button className="btn btn-sm btn-link" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <Bell size={32} className="mb-2" />
            <p className="m-0">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              onClick={() => markAsRead(notification._id)}
            >
              <div className="notification-icon">
                {getIcon(notification.type)}
              </div>
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">{formatTime(notification.createdAt)}</div>
              </div>
              <button
                className="btn btn-sm btn-link text-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification._id);
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

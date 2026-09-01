import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4000 }) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    const newToast = { id, title, message, type, duration };

    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const notifySuccess = useCallback((title, message) => addToast({ title, message, type: 'success' }), [addToast]);
  const notifyError = useCallback((title, message) => addToast({ title, message, type: 'error' }), [addToast]);
  const notifyInfo = useCallback((title, message) => addToast({ title, message, type: 'info' }), [addToast]);
  const notifyWarning = useCallback((title, message) => addToast({ title, message, type: 'warning' }), [addToast]);

  return (
    <NotificationContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      notifySuccess,
      notifyError,
      notifyInfo,
      notifyWarning
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

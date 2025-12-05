import { createContext, useContext } from "react";
import { notification } from "antd";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  const showNotification = (type, message, description, duration = 4.5) => {
    api[type]({
      message,
      description,
      duration: duration, // Duration in seconds (default 4.5)
    });
  };

  return (
    <NotificationContext.Provider value={showNotification}>
      {contextHolder} {/* 🔥 Ensure notifications work */}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

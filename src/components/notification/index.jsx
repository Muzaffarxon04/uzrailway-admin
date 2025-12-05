import { createContext, useContext } from "react";
import { notification } from "antd";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  const showNotification = (type, message, description) => {
    api[type]({
      message,
      description,
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

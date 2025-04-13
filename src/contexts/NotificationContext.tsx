
import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "error" | "warning" | "emergency";
  timestamp: Date;
  read: boolean;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (title: string, message: string, type: "info" | "success" | "error" | "warning" | "emergency") => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
  unreadCount: number;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    title: string,
    message: string,
    type: "info" | "success" | "error" | "warning" | "emergency"
  ) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show toast for the notification with different styling based on type
    if (type === "emergency") {
      toast(title, {
        description: message,
        action: {
          label: "View",
          onClick: () => markAsRead(newNotification.id),
        },
        className: "bg-emergency text-white border-2 border-emergency",
        duration: 10000, // 10 seconds for emergency notifications
      });
      
      // Play alarm sound for emergency notifications
      const audio = new Audio("/emergency-alert.mp3");
      audio.play().catch(error => console.error("Could not play alert sound:", error));
    } else {
      toast(title, {
        description: message,
        action: {
          label: "View",
          onClick: () => markAsRead(newNotification.id),
        },
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        clearNotifications,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

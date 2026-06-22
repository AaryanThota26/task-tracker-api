import { createContext, useContext, useState, useCallback, useMemo } from "react";

const NotificationContext = createContext(null);

let _id = 0;
function nextId() {
  return `notif_${Date.now()}_${++_id}`;
}

export function NotificationProvider({ children }) {
  const [items, setItems] = useState(() => [
    {
      id: nextId(),
      type: "welcome",
      title: "Welcome to Task Tracker",
      message: "New Lumina Focus UI is now live. Explore the new dark theme dashboard.",
      time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false,
    },
    {
      id: nextId(),
      type: "update",
      title: "System Update",
      message: "Priority levels and due dates are now supported for all tasks.",
      time: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      read: false,
    },
    {
      id: nextId(),
      type: "reminder",
      title: "Quick Tip",
      message: 'Use the search bar or press "New Task" to create your first task.',
      time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      read: true,
    },
  ]);

  const unreadCount = useMemo(
    () => items.filter((n) => !n.read).length,
    [items]
  );

  const addNotification = useCallback(({ type = "info", title, message }) => {
    setItems((prev) => [
      {
        id: nextId(),
        type,
        title,
        message,
        time: new Date().toISOString(),
        read: false,
      },
      ...prev.slice(0, 49),
    ]);
  }, []);

  const markRead = useCallback((id) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ items, unreadCount, addNotification, markRead, markAllRead, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}

import { useState, useRef, useEffect } from "react";
import { useSearch } from "../context/SearchContext";
import { useNotifications } from "../context/NotificationContext";

export default function TopBar({ title, onMenuClick, isMobile, isTablet }) {
  const { query, setQuery } = useSearch();
  const { items, unreadCount, markRead, markAllRead, removeNotification } =
    useNotifications();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const typeIcon = (type) => {
    if (type === "welcome") return "rocket_launch";
    if (type === "update") return "update";
    if (type === "reminder") return "tips_and_updates";
    if (type === "success") return "check_circle";
    if (type === "error") return "error";
    return "notifications";
  };

  const typeColor = (type) => {
    if (type === "welcome") return "text-primary";
    if (type === "update") return "text-secondary";
    if (type === "reminder") return "text-amber-400";
    if (type === "success") return "text-emerald-400";
    if (type === "error") return "text-error";
    return "text-primary";
  };

  const timeAgo = (iso) => {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <header className="w-full sticky top-0 z-40 backdrop-blur-md bg-surface/30 border-b border-white/10 flex items-center justify-between px-4 md:px-gutter-desktop py-4">
      <div className="flex items-center gap-3 md:gap-6 min-w-0">
        {isMobile && (
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-white/5 transition-colors"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        )}
        <h2 className="text-headline-md md:text-headline-lg font-black text-on-surface truncate">{title}</h2>
      </div>
      <div className="flex items-center gap-3 md:gap-6 ml-2">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-surface-container-high/50 border border-white/10 rounded-full pl-10 pr-4 py-2 text-body-sm w-32 sm:w-44 md:w-64 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-300"
            placeholder="Search tasks..."
          />
        </div>
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={panelRef}>
            <button
              onClick={() => setOpen(!open)}
              className="relative p-2 text-on-surface-variant hover:text-primary transition-all rounded-full hover:bg-white/5"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 bg-primary rounded-full border border-surface text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-3 w-64 sm:w-72 md:w-80 max-w-[calc(100vw-2rem)] bg-surface-container-high/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in origin-top-right z-50">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                  <h3 className="text-label-md font-bold text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-primary text-[11px] uppercase tracking-wider font-semibold hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="px-5 py-8 text-center text-on-surface-variant text-body-sm">
                      <span className="material-symbols-outlined text-3xl mb-2 text-on-surface-variant/50">
                        notifications_off
                      </span>
                      <p>No notifications</p>
                    </div>
                  ) : (
                    items.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`group px-5 py-4 flex gap-3 cursor-pointer transition-all hover:bg-white/5 border-b border-white/5 ${
                          !n.read ? "bg-white/[0.03]" : ""
                        }`}
                      >
                        <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center ${typeColor(n.type)}`}>
                          <span className="material-symbols-outlined text-[18px]">{typeIcon(n.type)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-body-sm truncate ${!n.read ? "text-white font-medium" : "text-on-surface-variant"}`}>
                              {n.title}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(n.id);
                              }}
                              className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-on-surface-variant hover:text-error transition-opacity"
                            >
                              <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                          </div>
                          <p className="text-[13px] text-on-surface-variant mt-0.5 line-clamp-2">{n.message}</p>
                          <p className="text-[11px] text-on-surface-variant/60 mt-1">{timeAgo(n.time)}</p>
                        </div>
                        {!n.read && (
                          <div className="mt-1.5 w-2 h-2 bg-primary rounded-full shrink-0" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {user?.picture && (
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 cursor-pointer">
              <img
                src={user.picture}
                alt="avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

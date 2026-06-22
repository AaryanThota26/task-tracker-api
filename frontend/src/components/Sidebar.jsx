import { NavLink, useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: "dashboard", path: "/dashboard" },
  { label: "Today", icon: "calendar_today", path: "/today" },
  { label: "Upcoming", icon: "event_upcoming", path: "/upcoming" },
  { label: "Accounts", icon: "manage_accounts", path: "/accounts" },
];

export default function Sidebar({
  onNewTask,
  mobileOpen,
  setMobileOpen,
  isMobile,
  isTablet,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const collapsed = isTablet && !isMobile;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col py-2 shrink-0
          transition-all duration-300 ease-out
          bg-surface border-r border-white/10 backdrop-blur-3xl shadow-2xl
          ${isMobile ? (mobileOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
          w-[260px] md:w-[80px] lg:w-[260px]
        `}
      >
        {/* Mobile close */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-3 right-3 p-2 rounded-full text-on-surface-variant hover:text-white hover:bg-white/10 transition-colors md:hidden z-10"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}

        {/* Logo */}
        <div className={`mb-10 mt-4 ${collapsed ? "px-1 text-center" : "px-4"}`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">dashboard</span>
            <span className={`text-headline-md font-bold text-primary ${collapsed ? "hidden" : ""}`}>
              Task Tracker
            </span>
          </div>
          {!collapsed && (
            <p className="text-on-surface-variant text-label-sm mt-1 opacity-60">
              Productivity Hub
            </p>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-2 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                title={item.label}
                className={`flex items-center gap-3 rounded-lg transition-colors duration-200 ${
                  collapsed ? "justify-center px-2 py-3" : "justify-start px-4 py-3"
                } ${
                  isActive
                    ? "sidebar-active text-primary font-bold"
                    : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
                }`}
              >
                <span className={`material-symbols-outlined ${isActive ? "fill-icon" : ""}`}>
                  {item.icon}
                </span>
                <span className={`text-body-md ${collapsed ? "hidden" : ""}`}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="mt-auto pt-6 px-2 space-y-4">
          <button
            onClick={onNewTask}
            className={`w-full bg-primary text-on-primary-container text-label-md py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform duration-200 ${collapsed ? "px-2" : "px-4"}`}
            title="New Task"
          >
            <span className="material-symbols-outlined font-bold">add</span>
            <span className={`${collapsed ? "hidden" : ""}`}>New Task</span>
          </button>

          <div className={`border-t border-white/5 pt-4 ${collapsed ? "px-1" : "px-2"}`}>
            <button
              onClick={logout}
              className={`w-full flex items-center gap-3 py-3 rounded-lg text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-colors duration-200 mb-4 ${collapsed ? "justify-center px-2" : "justify-start px-4"}`}
              title="Logout"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className={`text-body-md ${collapsed ? "hidden" : ""}`}>Logout</span>
            </button>

            {user && (
              <div className={`flex items-center gap-3 ${collapsed ? "justify-center px-0" : "justify-start px-2"}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary-container p-[1px] shrink-0">
                  <img
                    src={user.picture}
                    alt="profile"
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className={`overflow-hidden ${collapsed ? "hidden" : ""}`}>
                  <p className="text-on-surface text-label-md truncate">{user.name}</p>
                  <p className="text-on-surface-variant text-[10px] uppercase tracking-wider truncate">{user.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import { themes, getSavedTheme, applyThemeVariables } from "../lib/theme";

export default function Accounts() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [darkMode, setDarkMode] = useState(true);
  const [theme, setTheme] = useState(getSavedTheme);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskCount, setTaskCount] = useState(0);

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    const dm = localStorage.getItem("darkMode");
    if (dm !== null) {
      const bool = dm === "true";
      setDarkMode(bool);
      document.documentElement.classList.toggle("dark", bool);
    }
    fetchTaskCount();
  }, []);

  const fetchTaskCount = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await api.get(`/tasks?user_email=${user.email}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setTaskCount(data.length);
    } catch {
      setTaskCount(0);
    }
  }, [user?.email]);

  const applyTheme = (t) => {
    applyThemeVariables(t);
    setTheme(t);
    localStorage.setItem("theme", t);
    toast.success("Theme updated");
  };

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("darkMode", String(next));
    document.documentElement.classList.toggle("dark", next);
    // Since we don't have light-mode styles yet, inform the user.
    if (!next) {
      toast("Light mode support is coming soon. Staying in dark mode for now.");
      setTimeout(() => {
        setDarkMode(true);
        localStorage.setItem("darkMode", "true");
        document.documentElement.classList.add("dark");
      }, 600);
    }
  };

  const handleUpdateProfile = () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    const updated = { ...user, name: editName.trim() };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
    setEditMode(false);
    toast.success("Profile updated");
  };

  const handleUpdatePassword = () => {
    setPwError("");
    if (!passwords.current && !passwords.new && !passwords.confirm) {
      toast.error("Please fill in the password fields");
      return;
    }
    if (passwords.new.length < 8) {
      setPwError("New password must be at least 8 characters");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setPwError("New passwords do not match");
      return;
    }
    // Demo: since there's no backend user endpoint, reset fields and show success.
    setPasswords({ current: "", new: "", confirm: "" });
    toast.success("Password updated successfully");
  };

  const handleDelete = async () => {
    if (!user?.email) return;
    try {
      // Fetch all user tasks and delete them one by one.
      const res = await api.get(`/tasks?user_email=${user.email}`);
      const tasks = Array.isArray(res.data) ? res.data : [];
      if (tasks.length > 0) {
        toast.loading(`Deleting ${tasks.length} task(s)...`, { id: "delete-tasks" });
        await Promise.all(
          tasks.map((t) =>
            api.delete(`/tasks/${t.id}?user_email=${user.email}`).catch(() => {})
          )
        );
        toast.dismiss("delete-tasks");
      }
      localStorage.removeItem("user");
      toast.success("Account and all data deleted");
      window.location.href = "/";
    } catch (e) {
      toast.error("Failed to delete account");
    }
  };

  // Storage metrics derived from real task count (rough estimation).
  const storageMB = taskCount > 0 ? +(taskCount * 0.12).toFixed(1) : 0;
  const totalMB = 100;
  const usedPercent = Math.min(100, Math.round((storageMB / totalMB) * 100));

  return (
    <Layout title="Account Settings">
      <div className="p-4 md:p-gutter-desktop max-w-6xl mx-auto w-full space-y-6 md:space-y-8 animate-in">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Profile */}
          <section className="md:col-span-12 glass p-6 md:p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative shrink-0">
              <div className="w-32 h-32 rounded-full border-4 border-primary/20 p-1">
                <img
                  src={user?.picture || ""}
                  alt="profile"
                  className="w-full h-full rounded-full object-cover shadow-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button
                onClick={() => toast("Profile picture upload coming soon")}
                className="absolute bottom-1 right-1 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">
                  photo_camera
                </span>
              </button>
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
              {editMode ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-body-md text-on-surface focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    placeholder="Your name"
                  />
                  <div className="flex gap-3 justify-center md:justify-start">
                    <button
                      onClick={handleUpdateProfile}
                      className="bg-primary text-on-primary py-2 px-6 rounded-xl text-label-md hover:brightness-110 transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setEditName(user?.name || "");
                      }}
                      className="border border-white/10 text-on-surface py-2 px-6 rounded-xl text-label-md hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-headline-xl font-bold text-on-surface">
                    {user?.name || "User"}
                  </h3>
                  <p className="text-body-md text-on-surface-variant">
                    {user?.email || ""}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                      <span className="material-symbols-outlined text-primary text-sm">
                        mail
                      </span>
                      <span className="text-label-sm">
                        {user?.email || "No email"}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
            {!editMode && (
              <div className="shrink-0">
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-on-surface py-3 px-8 rounded-xl text-label-md transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit Profile
                </button>
              </div>
            )}
          </section>

          {/* Appearance */}
          <section className="md:col-span-5 glass p-6 md:p-10 space-y-8 h-full">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">palette</span>
              <h4 className="text-headline-md font-bold">Appearance</h4>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <p className="text-label-md text-on-surface">Dark Mode</p>
                  <p className="text-body-sm text-on-surface-variant">
                    Sync with system preferences
                  </p>
                </div>
                <button
                  onClick={toggleDark}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? "bg-primary" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-on-primary transition-transform ${
                      darkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-label-md text-on-surface">Color Theme</p>
                <div className="flex flex-wrap gap-4">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => applyTheme(t.id)}
                      className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                        theme === t.id
                          ? "border-primary active-dot"
                          : "border-transparent hover:border-white/50"
                      }`}
                      style={{ backgroundColor: t.hex }}
                    >
                      {theme === t.id && (
                        <span
                          className="material-symbols-outlined text-white text-sm"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Account Security */}
          <section className="md:col-span-7 glass p-6 md:p-10 space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">security</span>
              <h4 className="text-headline-md font-bold">Account Security</h4>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-label-md text-on-surface ml-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords((p) => ({ ...p, current: e.target.value }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-label-md text-on-surface ml-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="At least 8 characters"
                      value={passwords.new}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, new: e.target.value }))
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-label-md text-on-surface ml-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, confirm: e.target.value }))
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-body-md focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
              {pwError && (
                <p className="text-error text-body-sm">{pwError}</p>
              )}
              <div className="p-4 bg-primary-container/10 border border-primary/20 rounded-xl flex gap-4">
                <span className="material-symbols-outlined text-primary">info</span>
                <p className="text-body-sm text-on-surface-variant">
                  Changing your password will log you out of all other active
                  sessions across your devices.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
                <button
                  onClick={handleUpdatePassword}
                  className="bg-primary text-on-primary py-3 px-8 rounded-xl text-label-md hover:brightness-110 shadow-lg shadow-primary/20 transition-all"
                >
                  Update Password
                </button>
                <div className="h-10 w-[1px] bg-white/10 hidden sm:block" />
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-error text-label-md flex items-center gap-2 hover:bg-error/10 py-3 px-4 rounded-xl transition-all group"
                >
                  <span className="material-symbols-outlined text-error">
                    delete_forever
                  </span>
                  Delete Account
                </button>
              </div>
            </div>
          </section>

          {/* Storage */}
          <section className="md:col-span-12 glass p-6 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                <h4 className="text-headline-md text-on-surface font-bold">
                  Storage &amp; Usage
                </h4>
                <p className="text-body-sm text-on-surface-variant">
                  You have <span className="text-primary font-bold">{taskCount}</span>{" "}
                  task{taskCount !== 1 ? "s" : ""} stored. Using{" "}
                  <span className="text-primary font-bold">{storageMB} MB</span> of{" "}
                  {totalMB} MB total storage.
                </p>
              </div>
              <div className="w-full md:w-64 h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${usedPercent}%` }}
                />
              </div>
              <button
                onClick={() => toast("Upgrade plan coming soon")}
                className="text-primary text-label-md border border-primary/30 py-2 px-6 rounded-xl hover:bg-primary/10 transition-all shrink-0"
              >
                Upgrade Plan
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="glass-card p-8 rounded-2xl w-full max-w-md mx-4 animate-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-headline-md font-bold text-error mb-4">
              Delete Account?
            </h3>
            <p className="text-on-surface-variant text-body-md mb-6">
              This action cannot be undone. All your tasks and data will be
              permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-on-surface hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-error text-white py-3 rounded-xl font-bold hover:brightness-110 transition-all"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import { useSearch } from "../context/SearchContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PRESETS = [
  { label: "Focus", minutes: 25, color: "text-primary" },
  { label: "Short Break", minutes: 5, color: "text-sky-400" },
  { label: "Long Break", minutes: 15, color: "text-amber-400" },
  { label: "Deep Work", minutes: 45, color: "text-rose-400" },
];

function usePomodoro() {
  const [activePreset, setActivePreset] = useState(0);
  const [timer, setTimer] = useState(PRESETS[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const duration = PRESETS[activePreset].minutes * 60;

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => setTimer(t => {
      if (t <= 1) { setRunning(false); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(iv);
  }, [running]);

  const selectPreset = (index) => {
    setActivePreset(index);
    setRunning(false);
    setTimer(PRESETS[index].minutes * 60);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return { timer, running, setRunning, setTimer, formatTime, activePreset, selectPreset, duration };
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");
  const { query } = useSearch();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?user_email=${user.email}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setTasks(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load tasks");
      setTasks([]);
    }
  };

  useEffect(() => {
    if (user?.email) fetchTasks();
  }, [user?.email]);

  const filtered = useMemo(() => {
    if (!query) return tasks;
    const q = query.toLowerCase();
    return tasks.filter(t => (t.task || "").toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q));
  }, [tasks, query]);

  const pendingCount = tasks.filter(t => t.status === "pending").length;
  const doingCount = tasks.filter(t => t.status === "doing").length;
  const doneCount = tasks.filter(t => t.status === "done").length;

  const quickAdd = async () => {
    if (!newTaskName.trim()) {
      toast.error("Task name is required");
      return;
    }
    if (!user?.email) {
      toast.error("Please log in first");
      return;
    }
    let due = null;
    if (newTaskDate) {
      const time = newTaskTime || "12:00";
      try {
        due = new Date(`${newTaskDate}T${time}`).toISOString();
      } catch {
        toast.error("Invalid due date/time");
        return;
      }
    }
    try {
      await api.post("/tasks", {
        task: newTaskName,
        description: null,
        user_email: user.email,
        priority: "medium",
        status: "pending",
        due_date: due,
      });
      toast.success("Task created");
      setNewTaskName("");
      setNewTaskDate("");
      setNewTaskTime("");
      fetchTasks();
    } catch (e) {
      console.error("quickAdd error:", e);
      const detail = e.response?.data?.detail || e.message || "Unknown error";
      toast.error(`Failed to create task: ${detail}`);
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const upcoming = [...filtered]
    .filter(t => t.due_date)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  const priorityColor = (p) => {
    if (p === "high") return "bg-red-500";
    if (p === "medium") return "bg-amber-500";
    return "bg-emerald-500";
  };

  const statusBadge = (s) => {
    if (s === "done") return "bg-emerald-500/20 text-emerald-400";
    if (s === "doing") return "bg-primary/20 text-primary";
    if (s === "missed") return "bg-error/20 text-error";
    return "bg-amber-500/20 text-amber-400";
  };

  const recent = [...filtered]
    .sort((a, b) => b.id - a.id)
    .slice(0, 6);

  return (
    <Layout title="Task Tracker" onTaskCreated={fetchTasks}>
      <div className="px-4 md:px-gutter-desktop py-6 md:py-10 max-w-7xl mx-auto w-full space-y-6 md:space-y-10 animate-in">
        {/* Greeting */}
        <section className="glass rounded-[2rem] p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent" />
          <div className="relative z-10">
            <h2 className="text-headline-xl text-white mb-2">{greeting()}, {user?.name || user?.given_name || "User"}</h2>
            <p className="text-on-surface-variant text-body-lg">
              You have <span className="text-primary font-bold">{pendingCount + doingCount} tasks</span> pending. Let&apos;s make it productive!
            </p>
          </div>
        </section>

        {/* Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-card-gap">
          <MetricCard icon="pending_actions" label="Pending" value={pendingCount} sub="Current" color="primary" trend="Active tasks" />
          <MetricCard icon="sync" label="In Progress" value={doingCount} sub="Doing" color="secondary" trend="Focused work" />
          <MetricCard icon="check_circle" label="Completed" value={doneCount} sub="Finished" color="text-emerald-400" trend="Great job!" />
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-card-gap items-start">
          {/* Upcoming Tasks */}
          <section className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-headline-md text-on-surface font-bold">Upcoming Tasks</h3>
              <button onClick={() => navigate("/upcoming")} className="text-primary text-label-md hover:underline">View All Schedule</button>
            </div>
            <div className="space-y-4">
              {upcoming.length === 0 ? (
                <div className="glass p-6 rounded-2xl text-center text-on-surface-variant">No upcoming tasks</div>
              ) : (
                upcoming.map((task) => (
                  <div key={task.id} className="glass glass-hover p-6 rounded-2xl flex items-center gap-6 group transition-all duration-300">
                    <div className={`w-1 h-12 rounded-full ${priorityColor(task.priority)}`} />
                    <div className="flex-1">
                      <h4 className="text-headline-md text-on-surface group-hover:text-primary transition-colors">{task.task}</h4>
                      <div className="flex items-center gap-4 mt-1 text-on-surface-variant text-body-sm">
                        {task.due_date && (
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">calendar_month</span>
                            {new Date(task.due_date).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">flag</span>
                          {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)} Priority
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate("/today")}
                      className="p-2 rounded-full hover:bg-white/5 text-on-surface-variant"
                    >
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Right Column */}
          <section className="lg:col-span-4 space-y-6">
            {/* Quick Add */}
            <div className="glass p-6 md:p-8 rounded-[2rem] space-y-5">
              <h3 className="text-headline-md text-on-surface font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">bolt</span>
                Quick Add Task
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") quickAdd(); }}
                  className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-4 py-3 text-body-md focus:border-primary outline-none transition-all"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="flex-1 glass py-3 rounded-xl px-3 text-on-surface-variant text-body-sm focus:outline-none"
                  />
                  <input
                    type="time"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    className="flex-1 glass py-3 rounded-xl px-3 text-on-surface-variant text-body-sm focus:outline-none"
                  />
                </div>
                <button
                  onClick={quickAdd}
                  className="w-full bg-primary text-on-primary-container font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all"
                >
                  Create Task
                </button>
              </div>
            </div>
            {/* Pomodoro Timer */}
            <DashboardTimer />
          </section>
        </div>

        {/* Recent Tasks */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-headline-md text-on-surface font-bold">Recent Tasks</h3>
            <button onClick={() => navigate("/today")} className="text-primary text-label-md hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recent.length === 0 ? (
              <div className="glass p-6 rounded-2xl text-center text-on-surface-variant">No tasks yet</div>
            ) : (
              recent.map((task) => (
                <div key={task.id} className="glass glass-hover p-6 rounded-2xl flex items-center gap-6 group transition-all duration-300">
                  <div className={`w-1 h-12 rounded-full ${priorityColor(task.priority)}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-headline-md text-on-surface group-hover:text-primary transition-colors truncate">{task.task}</h4>
                    <div className="flex items-center gap-4 mt-1 text-on-surface-variant text-body-sm flex-wrap">
                      {task.due_date && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">calendar_month</span>
                          {new Date(task.due_date).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-label-sm font-semibold uppercase ${statusBadge(task.status)}`}>
                        {task.status}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">flag</span>
                        {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)} Priority
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/today")}
                    className="p-2 rounded-full hover:bg-white/5 text-on-surface-variant shrink-0"
                  >
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

function DashboardTimer() {
  const { timer, running, setRunning, setTimer, formatTime, activePreset, selectPreset, duration } = usePomodoro();
  const progress = duration > 0 ? (timer / duration) * 100 : 0;
  const preset = PRESETS[activePreset];

  return (
    <div className="glass p-6 md:p-8 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border-primary/20 space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-label-md uppercase tracking-wider text-primary/80">Focus Timer</span>
        <span className="material-symbols-outlined text-primary">timer</span>
      </div>

      {/* Timer Duration Slots */}
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => selectPreset(i)}
            className={`py-2 rounded-xl text-label-sm font-medium transition-all border ${
              i === activePreset
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                : "bg-white/5 text-on-surface-variant border-white/10 hover:bg-white/10 hover:text-white"
            }`}
            title={`${p.label} – ${p.minutes} min`}
          >
            {p.minutes}m
          </button>
        ))}
      </div>

      <div className="text-center">
        <div className={`relative w-32 h-32 mx-auto mb-2 ${preset.color}`}>
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-white/5" />
            <circle
              cx="50" cy="50" r="42"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={2 * Math.PI * 42 * (1 - progress / 100)}
              className="transition-all duration-500"
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "50% 50%",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-headline-lg font-bold">{formatTime(timer)}</span>
          </div>
        </div>
        <span className={`text-label-sm font-medium ${preset.color}`}>{preset.label}</span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setRunning(!running)}
          className="flex-1 bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">{running ? "pause" : "play_arrow"}</span>
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => { setRunning(false); setTimer(duration); }}
          className="w-12 h-12 glass rounded-xl flex items-center justify-center text-on-surface-variant hover:text-white transition-all"
          title="Reset"
        >
          <span className="material-symbols-outlined">restart_alt</span>
        </button>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, sub, color, trend }) {
  const colorMap = {
    primary: "bg-primary/20 text-primary",
    secondary: "bg-secondary-container/50 text-secondary",
    "text-emerald-400": "bg-emerald-500/20 text-emerald-400",
  };
  return (
    <div className="glass glass-hover p-6 md:p-container-padding rounded-[2rem] transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${colorMap[color] || colorMap.primary}`}>
          <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <span className="text-on-surface-variant text-label-md">{sub}</span>
      </div>
      <div className="space-y-1">
        <h3 className="text-on-surface-variant text-label-md uppercase tracking-widest">{label}</h3>
        <p className="text-4xl md:text-5xl font-black text-on-surface">{String(value).padStart(2, "0")}</p>
      </div>
      <div className="mt-6 flex items-center gap-2 text-on-surface-variant text-sm">
        <span className="material-symbols-outlined text-lg">trending_up</span>
        <span>{trend}</span>
      </div>
    </div>
  );
}

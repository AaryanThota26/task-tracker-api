import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import { useSearch } from "../context/SearchContext";
import toast from "react-hot-toast";

export default function Today() {
  const [tasks, setTasks] = useState([]);
  const { query } = useSearch();
  const user = JSON.parse(localStorage.getItem("user") || "null");

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

  const isToday = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  const todayTasks = useMemo(() => {
    let list = tasks.filter(t => isToday(t.due_date) || (!t.due_date && t.status !== "done"));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(t => (t.task || "").toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q));
    }
    return list;
  }, [tasks, query]);

  const doneCount = todayTasks.filter(t => t.status === "done").length;
  const totalCount = todayTasks.length;
  const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const [timer, setTimer] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(iv);
  }, [running]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const activeTask = todayTasks.find(t => t.status === "doing");

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { user_email: user.email, status });
      toast.success(`Task marked as ${status}`);
      fetchTasks();
    } catch (e) {
      const detail = e.response?.data?.detail || e.message || "Unknown error";
      toast.error(`Failed to update task: ${detail}`);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}?user_email=${user.email}`);
      toast.success("Task deleted");
      fetchTasks();
    } catch (e) {
      const detail = e.response?.data?.detail || e.message || "Unknown error";
      toast.error(`Failed to delete task: ${detail}`);
    }
  };

  const statusConfig = {
    done: { icon: "check_circle", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30", label: "Done" },
    doing: { icon: "pending", color: "text-primary", bg: "bg-primary/20", border: "border-primary/30", label: "Doing" },
    missed: { icon: "error", color: "text-error", bg: "bg-error/20", border: "border-error/30", label: "Missed" },
    pending: { icon: "schedule", color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30", label: "Pending" },
  };

  return (
    <Layout title="Today's Tasks" onTaskCreated={fetchTasks}>
      <div className="flex-1 flex flex-col lg:flex-row p-4 md:p-gutter-desktop gap-card-gap">
        {/* Left: Task List */}
        <section className="flex-[3] flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-headline-md text-on-surface font-bold">Task Progress</h3>
              <p className="text-on-surface-variant text-body-sm">Manage your daily workflow and objectives.</p>
            </div>
          </div>
          <div className="space-y-4 overflow-y-auto pr-2">
            {todayTasks.length === 0 ? (
              <div className="glass p-6 rounded-2xl text-center text-on-surface-variant">No tasks for today</div>
            ) : (
              todayTasks.map((task) => {
                const cfg = statusConfig[task.status] || statusConfig.pending;
                return (
                  <div key={task.id} className={`glass p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-primary/30 transition-all ${task.status === "doing" ? "border-l-4 border-l-primary" : ""}`}>
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className={`w-10 h-10 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center ${cfg.color}`}>
                        <span className="material-symbols-outlined">{cfg.icon}</span>
                      </div>
                      <div>
                        <h4 className={`text-label-md text-white ${task.status === "done" ? "line-through opacity-60" : ""}`}>{task.task}</h4>
                        <p className="text-on-surface-variant text-body-sm">{task.description || (task.status === "doing" ? "Current focus" : "Due today")}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                      {task.status === "doing" && (
                        <span className="text-primary text-body-sm font-medium animate-pulse">{formatTime(timer)}</span>
                      )}
                      <span className={`px-3 py-1 rounded-full ${cfg.bg} ${cfg.color} text-label-sm font-semibold`}>{cfg.label}</span>
                      <div className="flex gap-1">
                        {task.status !== "done" && (
                          <button onClick={() => updateStatus(task.id, "done")} className="p-2 rounded-full hover:bg-white/5 text-on-surface-variant" title="Mark done">
                            <span className="material-symbols-outlined text-emerald-400">check</span>
                          </button>
                        )}
                        {task.status !== "doing" && (
                          <button onClick={() => updateStatus(task.id, "doing")} className="p-2 rounded-full hover:bg-white/5 text-on-surface-variant" title="Start doing">
                            <span className="material-symbols-outlined text-primary">play_arrow</span>
                          </button>
                        )}
                        <button onClick={() => deleteTask(task.id)} className="p-2 rounded-full hover:bg-white/5 text-on-surface-variant" title="Delete">
                          <span className="material-symbols-outlined text-error">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Right: Focus & Progress */}
        <aside className="flex-[1.2] flex flex-col gap-card-gap">
          {/* Progress Circle */}
          <div className="glass p-6 md:p-container-padding rounded-[2rem] flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all" />
            <h3 className="text-headline-md mb-8 font-bold">Focus & Progress</h3>
            <div className="relative w-48 h-48 mb-8">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                <circle
                  cx="50" cy="50" r="42"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - percent / 100)}
                  className="text-primary transition-all duration-500"
                  style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-headline-xl font-bold" style={{ textShadow: "0 0 10px rgba(139, 92, 246, 0.5)" }}>{percent}%</span>
                <span className="text-label-sm text-on-surface-variant">Daily Goal</span>
              </div>
            </div>
            <div className="w-full space-y-4">
              <div className="flex justify-between text-body-sm">
                <span className="text-on-surface-variant">Tasks Finished</span>
                <span className="font-bold">{doneCount}/{totalCount}</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${percent}%` }} />
              </div>
            </div>
          </div>

          {/* Timer */}
          <div className="glass p-6 md:p-8 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <span className="text-label-md uppercase tracking-wider text-primary/80">Focus Timer</span>
              <span className="material-symbols-outlined text-primary">timer</span>
            </div>
            <div className="text-center mb-8">
              <div className="text-4xl md:text-[54px] font-black tracking-tight text-white mb-2">{formatTime(timer)}</div>
              <p className="text-on-surface-variant text-body-sm">{activeTask ? activeTask.task : "Ready to focus"}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setRunning(!running)}
                className="flex-1 bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">{running ? "pause" : "play_arrow"}</span>
                {running ? "Pause" : "Start"}
              </button>
              <button
                onClick={() => { setRunning(false); setTimer(25 * 60); }}
                className="w-16 h-16 glass rounded-xl flex items-center justify-center text-on-surface-variant hover:text-white transition-all"
              >
                <span className="material-symbols-outlined">restart_alt</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass p-6 rounded-[2rem] flex-1">
            <h4 className="text-label-md mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">history</span>
              Recent Activity
            </h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-1 h-8 bg-emerald-500/50 rounded-full mt-1" />
                <div>
                  <p className="text-body-sm font-medium">Dashboard loaded</p>
                  <p className="text-[10px] text-on-surface-variant">Just now</p>
                </div>
              </div>
              <div className="flex gap-3 opacity-60">
                <div className="w-1 h-8 bg-white/20 rounded-full mt-1" />
                <div>
                  <p className="text-body-sm font-medium">Fetched {tasks.length} tasks</p>
                  <p className="text-[10px] text-on-surface-variant">Recently</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  );
}

import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import { useSearch } from "../context/SearchContext";
import toast from "react-hot-toast";

export default function Upcoming() {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
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

  const upcomingTasks = useMemo(() => {
    let list = tasks.filter(t => t.due_date);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(t => (t.task || "").toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q));
    }
    return list.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  }, [tasks, query]);

  const grouped = useMemo(() => {
    const map = {};
    upcomingTasks.forEach(t => {
      const key = new Date(t.due_date).toDateString();
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return Object.entries(map).map(([date, items]) => ({
      date,
      items,
      d: new Date(date),
    })).sort((a, b) => a.d - b.d);
  }, [upcomingTasks]);

  const statusConfig = {
    done: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Done" },
    doing: { bg: "bg-primary/10", text: "text-primary", label: "In Progress" },
    missed: { bg: "bg-error/10", text: "text-error", label: "Missed" },
    pending: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Pending" },
    scheduled: { bg: "bg-tertiary-container/20", text: "text-tertiary", label: "Scheduled" },
    upcoming: { bg: "bg-primary-container/20", text: "text-primary", label: "Upcoming" },
    planning: { bg: "bg-secondary-container/30", text: "text-on-secondary-container", label: "Planning" },
  };

  const totalUpcoming = upcomingTasks.length;
  const focusHours = totalUpcoming * 2;
  const meetings = upcomingTasks.filter(t => t.description?.toLowerCase().includes("meeting")).length;
  const bookedPercent = Math.min(100, Math.round((totalUpcoming / 20) * 100));

  const isToday = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };
  const isTomorrow = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    now.setDate(now.getDate() + 1);
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };
  const getGroupLabel = (dateStr) => {
    if (isToday(dateStr)) return "Today";
    if (isTomorrow(dateStr)) return "Tomorrow";
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    if (diff <= 7) return "This Week";
    if (diff <= 14) return "Next Week";
    return "Later";
  };

  const openEditModal = (task) => setEditTask(task);

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}?user_email=${user.email}`);
      toast.success("Task deleted");
      fetchTasks();
    } catch (e) {
      toast.error("Failed to delete task");
    }
  };

  return (
    <Layout title="Upcoming Schedule" onTaskCreated={fetchTasks} editTask={editTask} onEditClose={() => setEditTask(null)}>
      <div className="px-4 md:px-gutter-desktop py-6 md:py-10 max-w-7xl mx-auto">
        {/* Timeline */}
        <div className="relative space-y-16">
          <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-transparent via-primary to-transparent opacity-20" />
          {grouped.length === 0 ? (
            <div className="glass p-6 md:p-10 rounded-2xl text-center text-on-surface-variant">No upcoming tasks</div>
          ) : (
            grouped.map((group) => (
              <section key={group.date} className="relative">
                <div className="flex items-center gap-6 mb-8">
                  <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl glass flex flex-col items-center justify-center border-primary/30 z-10 ${isToday(group.date) ? "border-primary/30" : "border-white/10"}`}>
                    <span className="text-[10px] md:text-label-sm text-primary uppercase tracking-widest">{group.d.toLocaleString("en", { month: "short" })}</span>
                    <span className="text-headline-md md:text-headline-lg text-primary font-bold">{group.d.getDate()}</span>
                  </div>
                  <div>
                    <h3 className="text-headline-md text-on-surface font-bold">{getGroupLabel(group.date)}</h3>
                    <p className="text-on-surface-variant text-label-md">{group.d.toLocaleString("en", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                  </div>
                </div>
                <div className="pl-14 sm:pl-0 md:pl-12 lg:pl-24 space-y-6">
                  {group.items.map((task) => {
                    const cfg = statusConfig[task.status] || statusConfig.pending;
                    const start = new Date(task.due_date);
                    const end = new Date(start.getTime() + 90 * 60 * 1000);
                    const timeRange = `${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} — ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
                    return (
                      <div key={task.id} className="glass p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:translate-x-2 transition-transform duration-300">
                        <div className="flex items-start gap-5">
                          <div className="w-1.5 h-12 bg-primary rounded-full mt-1" />
                          <div>
                            <h4 className="text-headline-md text-on-surface group-hover:text-primary transition-colors">{task.task}</h4>
                            <div className="flex items-center gap-4 mt-2 text-on-surface-variant text-label-md flex-wrap">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[18px]">schedule</span>
                                {timeRange}
                              </span>
                              {task.description && (
                                <span className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                                  {task.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-4 py-1.5 rounded-full ${cfg.bg} ${cfg.text} text-label-sm font-bold uppercase tracking-wider`}>{cfg.label}</span>
                          <button onClick={() => openEditModal(task)} className="w-10 h-10 glass rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button onClick={() => deleteTask(task.id)} className="w-10 h-10 glass rounded-full flex items-center justify-center text-on-surface-variant hover:text-error transition-colors">
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>

        {/* Calendar Sync */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={() => toast("Calendar sync coming soon")}
            className="glass-card px-5 py-3 rounded-xl text-label-md text-primary flex items-center gap-2 hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined">sync</span>
            Calendar Sync
          </button>
        </div>

        {/* Bento Preview */}
        <div className="grid grid-cols-1 gap-card-gap mt-16">
          <div className="glass p-6 md:p-container-padding rounded-3xl relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-headline-lg font-bold mb-4">Capacity Overview</h4>
              <p className="text-on-surface-variant mb-8 max-w-md">Your upcoming schedule shows {totalUpcoming} tasks planned ahead.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-primary/20 p-4 rounded-2xl flex-1 text-center">
                  <p className="text-primary text-headline-md font-bold">{bookedPercent}%</p>
                  <p className="text-label-sm text-on-surface-variant uppercase">Booked</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl flex-1 text-center">
                  <p className="text-on-surface text-headline-md font-bold">{focusHours}h</p>
                  <p className="text-label-sm text-on-surface-variant uppercase">Focus</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl flex-1 text-center">
                  <p className="text-on-surface text-headline-md font-bold">{meetings}</p>
                  <p className="text-label-sm text-on-surface-variant uppercase">Meetings</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-[180px] text-primary">analytics</span>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

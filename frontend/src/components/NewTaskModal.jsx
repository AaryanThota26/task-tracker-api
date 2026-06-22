import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function NewTaskModal({ onClose, onCreated }) {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    try {
      await api.post("/tasks", {
        task,
        description: description || null,
        user_email: user.email,
        priority,
        status,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
      });
      toast.success("Task created");
      setTask("");
      setDescription("");
      setPriority("medium");
      setStatus("pending");
      setDueDate("");
      onCreated();
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail || err.message || "Unknown error";
      toast.error(`Failed to create task: ${detail}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card p-8 rounded-2xl w-full max-w-lg mx-4 animate-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-headline-md font-bold text-on-surface">New Task</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-label-sm text-on-surface-variant uppercase ml-1">Task Name</label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-4 py-3 text-body-md focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all mt-1"
              placeholder="What needs to be done?"
              required
            />
          </div>
          <div>
            <label className="text-label-sm text-on-surface-variant uppercase ml-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-4 py-3 text-body-md focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all mt-1"
              placeholder="Optional details..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-label-sm text-on-surface-variant uppercase ml-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-4 py-3 text-body-md focus:border-primary outline-none mt-1"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-label-sm text-on-surface-variant uppercase ml-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-4 py-3 text-body-md focus:border-primary outline-none mt-1"
              >
                <option value="pending">Pending</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
                <option value="missed">Missed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-label-sm text-on-surface-variant uppercase ml-1">Due Date</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-surface-container-lowest border border-white/10 rounded-xl px-4 py-3 text-body-md focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all mt-1"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-on-primary-container font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all mt-2"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../services/api";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 

  const navigate = useNavigate();
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );
  

  if (!user) {
     return <Navigate to="/" />;
  }

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get(
      `/tasks?user_email=${user.email}`
      );
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (user?.email) {
      fetchTasks();
    }
  }, [user?.email]);



  const createTask = async () => {
    if (!newTask.trim()) return;

    try {
      await api.post("/tasks", {
      task: newTask,
      user_email: user.email,
      });

      toast.success("Task created");

      setNewTask("");
      await fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create task");

    }
  };

  const deleteTask = async (id) => {
  try {
    await api.delete(
    `/tasks/${id}?user_email=${user.email}`
    );
    toast.success("Task deleted");
    await fetchTasks();
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete task");

  }
};
  const updateTask = async (id) => {
  try {
    await api.put(`/tasks/${id}`, {
      task: editText,
      user_email: user.email,
    });

    toast.success("Task updated");

    setEditingId(null);
    setEditText("");
    await fetchTasks();
  } catch (error) {
    console.error(error);
    toast.error("Failed to update task");
  }
};
const filteredTasks = tasks.filter((task) =>
  task.task.toLowerCase().includes(searchTerm.toLowerCase())
  
);
  return (
    <div className="min-h-screen bg-slate-100">

  {/* Navbar */}
  <nav className="bg-white shadow">
    <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">
        Task Tracker
      </h1>

<div className="flex items-center gap-3">

{user?.picture && (
  <img
    src={user.picture}
    alt="profile"
    className="w-10 h-10 rounded-full"
  />
)}

  <span className="font-medium">
    {user?.name}
  </span>

  <button
    onClick={logout}
    className="bg-red-500 text-white px-4 py-2 rounded-xl"
  >
    Logout
  </button>

</div>
    </div>
  </nav>

  <div className="max-w-6xl mx-auto p-8">

    {/* Welcome */}
    <h2 className="text-4xl font-bold mb-8">
      Welcome {user?.name || user?.email} 👋
    </h2>

    {/* Stats */}
    <div className="grid md:grid-cols-3 gap-6 mb-8">

      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-500">Total Tasks</p>
        <h3 className="text-4xl font-bold">
          {tasks.length}
        </h3>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-500">Active Tasks</p>
        <h3 className="text-4xl font-bold">
          {tasks.length}
        </h3>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-gray-500">Completed</p>
        <h3 className="text-4xl font-bold">
          0
        </h3>
      </div>

    </div>

    {/* Create Task */}
    <div className="bg-white p-6 rounded-2xl shadow mb-8">

      <h3 className="text-xl font-semibold mb-4">
        Create New Task
      </h3>

      <div className="flex gap-3">

        <input
          type="text"
          placeholder="Enter task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 border rounded-xl px-4 py-3"
        />

        <button
          onClick={createTask}
          className="bg-blue-600 text-white px-6 rounded-xl hover:bg-blue-700"
        >
          Add Task
        </button>

      </div>

    </div>

    {/* Search */}
    <div className="mb-6">

      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-white border rounded-xl px-4 py-3 shadow"
      />

    </div>

    {/* Tasks */}
    <div className="space-y-4">

  {filteredTasks.length === 0 ? (

    <div className="bg-white rounded-2xl shadow p-8 text-center">

      <h3 className="text-xl font-semibold">
        No tasks found 🚀
      </h3>

      <p className="text-gray-500 mt-2">
        Create a task or try a different search.
      </p>

    </div>

  ) : (

    filteredTasks.map((task) => (
      <div
        key={task.id}
        className="bg-white rounded-2xl shadow p-5"
      >

        {editingId === task.id ? (
          <div className="flex gap-3">

            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1 border rounded-xl px-4 py-2"
            />

            <button
              onClick={() => updateTask(task.id)}
              className="bg-green-600 text-white px-5 rounded-xl"
            >
              Save
            </button>

          </div>
        ) : (
          <>
            <h3 className="text-xl font-semibold">
              {task.task}
            </h3>

            <p className="text-gray-500 mb-4">
              Task ID: {task.id}
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => {
                  setEditingId(task.id);
                  setEditText(task.task);
                }}
                className="bg-yellow-500 text-white px-4 py-2 rounded-xl"
              >
                Edit
              </button>

              <button
                onClick={() => deleteTask(task.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                Delete
              </button>

            </div>
          </>
        )}

      </div>
    ))

  )}

</div>

  </div>
</div>
  );
}

export default Dashboard;
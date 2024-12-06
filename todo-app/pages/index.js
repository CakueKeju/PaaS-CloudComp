import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  // State untuk menyimpan task
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Ambil task dari API saat pertama kali load halaman
  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    };

    fetchTasks();
  }, []);

  // Menambahkan task baru
  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!newTask) return;

    // Kirim data task baru ke API untuk ditambahkan
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: newTask }),
    });

    if (res.ok) {
      const newTaskData = await res.json();
      setTasks([...tasks, newTaskData]);
      setNewTask('');
    }
  };

  // Menandai task sebagai selesai (pindah ke history)
  const handleMarkAsCompleted = async (id) => {
    const res = await fetch('/api/complete', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      const updatedTask = await res.json();

      // Update state tasks untuk memindahkan task ke history
      setTasks(
        tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } else {
      console.error('Failed to mark task as completed');
    }
  };

  // Menghapus task
  const handleDeleteTask = async (id) => {
    const res = await fetch('/api/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setTasks(tasks.filter((task) => task.id !== id));
    } else {
      console.error('Failed to delete task');
    }
  };

  // Menyaring task yang sudah selesai (History Tasks)
  const activeTasks = tasks.filter((task) => !task.completed);
  const historyTasks = tasks.filter((task) => task.completed);

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <Head>
        <title>To-Do List</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
      </Head>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-header text-center bg-primary text-white">
                <h1 className="h4">To-Do List</h1>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddTask} className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Add a new task"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn btn-primary">
                      Add
                    </button>
                  </div>
                </form>

                {/* Active Tasks */}
                <div className="mb-4">
                  <h5>Active Tasks</h5>
                  <ul className="list-group">
                    {activeTasks.map((task) => (
                      <li
                        key={task.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span>{task.task}</span>
                        <div>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleMarkAsCompleted(task.id)}
                          >
                            Selesai
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* History Tasks */}
                <div>
                  <h5>History Tasks</h5>
                  <ul className="list-group">
                    {historyTasks.map((task) => (
                      <li
                        key={task.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span>{task.task}</span>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Clear All Button */}
                <button
                  onClick={() => setTasks([])} // Clear all tasks in state
                  className="btn btn-danger w-100 mt-3"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"
      ></script>
    </div>
  );
}

import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // active | history

  // Fetch tasks on component mount
  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  // Handle adding a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const res = await fetch('/api/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: newTask }),
    });

    if (res.ok) {
      const task = await res.json();
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  // Handle marking task as completed
  const handleMarkAsCompleted = async (id) => {
    const res = await fetch('/api/complete', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      const updatedTask = await res.json();
      setTasks(
        tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );

      // Pindahkan ke tab History
      if (activeTab === 'active') {
        setActiveTab('history');
      }
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (id) => {
    const res = await fetch('/api/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  // Filter tasks based on activeTab
  const filteredTasks =
    activeTab === 'active'
      ? tasks.filter((task) => !task.completed)
      : tasks.filter((task) => task.completed);

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

                {/* Tabs for switching between Active and History */}
                <ul className="nav nav-tabs mb-3">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'active' ? 'active' : ''}`}
                      onClick={() => setActiveTab('active')}
                    >
                      Active Tasks
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                      onClick={() => setActiveTab('history')}
                    >
                      History
                    </button>
                  </li>
                </ul>

                <ul id="tasks" className="list-group mb-3">
                  {filteredTasks.map((task) => (
                    <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{task.task}</span>
                      <div>
                        {activeTab === 'active' && (
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleMarkAsCompleted(task.id)}
                          >
                            Selesai
                          </button>
                        )}
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

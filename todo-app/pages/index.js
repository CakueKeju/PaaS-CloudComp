// pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

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

  // Handle clearing all tasks
  const handleDeleteAll = async () => {
    for (const task of tasks) {
      await fetch('/api/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id }),
      });
    }
    setTasks([]);
  };

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
                <ul id="tasks" className="list-group mb-3">
                  {tasks.map((task) => (
                    <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {task.task}
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={async () => {
                          await fetch('/api/delete', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: task.id }),
                          });
                          setTasks(tasks.filter((t) => t.id !== task.id));
                        }}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={handleDeleteAll} 
                  className="btn btn-danger w-100"
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

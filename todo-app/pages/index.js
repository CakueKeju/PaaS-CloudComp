import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await fetch('/api/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: newTask }),
      });

      if (response.ok) {
        fetchTasks();
        setNewTask('');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await fetch('/api/delete', {
        method: 'POST',
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting tasks:', error);
    }
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
                  {tasks.map((task, index) => (
                    <li key={index} className="list-group-item">
                      {task}
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
export default function handler(req, res) {
    if (req.method === 'POST') {
      const { task } = req.body;
      
      // Import tasks array from tasks.js
      const tasksModule = require('./tasks');
      
      if (task && task.trim() !== '') {
        tasksModule.tasks.push(task);
        res.status(200).json({ message: 'Task added successfully' });
      } else {
        res.status(400).json({ message: 'Task cannot be empty' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
export default function handler(req, res) {
    if (req.method === 'POST') {
      // Import tasks array from tasks.js
      const tasksModule = require('./tasks');
      
      // Clear all tasks
      tasksModule.tasks = [];
      
      res.status(200).json({ message: 'All tasks deleted successfully' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
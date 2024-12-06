let tasks = [];

export default function handler(req, res) {
  if (req.method === 'PUT') {
    const { id } = req.body;

    // Temukan task yang ingin diperbarui
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Tandai task sebagai completed
    tasks[taskIndex].completed = true;

    // Kirimkan task yang diperbarui sebagai response
    res.status(200).json(tasks[taskIndex]);
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

let tasks = [];

export default function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.body;
    tasks = tasks.filter((task) => task.id !== id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

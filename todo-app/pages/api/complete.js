let tasks = [];

export default function handler(req, res) {
  if (req.method === 'PUT') {
    const { id } = req.body;

    tasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: true } : task
    );

    const updatedTask = tasks.find((task) => task.id === id);
    res.status(200).json(updatedTask);
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

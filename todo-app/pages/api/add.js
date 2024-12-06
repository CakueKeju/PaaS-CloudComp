let tasks = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { task } = req.body;
    const newTask = { id: Date.now(), task, completed: false };
    tasks.push(newTask);
    res.status(201).json(newTask);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

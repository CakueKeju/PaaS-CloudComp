let tasks = []; // Array untuk menyimpan semua task

export default function handler(req, res) {
  if (req.method === 'PUT') {
    const { id } = req.body;

    // Cari task berdasarkan ID
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Tandai task sebagai selesai
    tasks[taskIndex].completed = true;

    // Kirim task yang diperbarui ke client
    res.status(200).json(tasks[taskIndex]);
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

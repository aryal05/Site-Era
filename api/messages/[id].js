import connectDB from '../lib/db.js';
import Message from '../models/Message.js';

export default async function handler(req, res) {
  await connectDB();

  const { method, query: { id } } = req;

  switch (method) {
    case 'GET':
      try {
        const message = await Message.findById(id);
        if (!message) {
          return res.status(404).json({ error: 'Message not found' });
        }
        return res.status(200).json(message);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'PUT':
      try {
        const message = await Message.findByIdAndUpdate(
          id,
          req.body,
          { new: true }
        );
        if (!message) {
          return res.status(404).json({ error: 'Message not found' });
        }
        return res.status(200).json(message);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'DELETE':
      try {
        const message = await Message.findByIdAndDelete(id);
        if (!message) {
          return res.status(404).json({ error: 'Message not found' });
        }
        return res.status(200).json({ message: 'Message deleted' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

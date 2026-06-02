import connectDB from './lib/db.js';
import Message from './models/Message.js';

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { read, limit = 50 } = req.query;
        let query = {};
        
        if (read !== undefined) query.read = read === 'true';
        
        const messages = await Message.find(query)
          .sort({ createdAt: -1 })
          .limit(parseInt(limit));
        
        return res.status(200).json(messages);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'POST':
      try {
        const message = new Message(req.body);
        await message.save();
        return res.status(201).json(message);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

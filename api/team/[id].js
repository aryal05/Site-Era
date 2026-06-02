import connectDB from '../lib/db.js';
import Team from '../models/Team.js';

export default async function handler(req, res) {
  await connectDB();

  const { method, query: { id } } = req;

  switch (method) {
    case 'GET':
      try {
        const member = await Team.findById(id);
        if (!member) {
          return res.status(404).json({ error: 'Team member not found' });
        }
        return res.status(200).json(member);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'PUT':
      try {
        const member = await Team.findByIdAndUpdate(
          id,
          { ...req.body, updatedAt: new Date() },
          { new: true }
        );
        if (!member) {
          return res.status(404).json({ error: 'Team member not found' });
        }
        return res.status(200).json(member);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'DELETE':
      try {
        const member = await Team.findByIdAndDelete(id);
        if (!member) {
          return res.status(404).json({ error: 'Team member not found' });
        }
        return res.status(200).json({ message: 'Team member deleted' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

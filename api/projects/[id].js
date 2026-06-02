import connectDB from '../lib/db.js';
import Project from '../models/Project.js';

export default async function handler(req, res) {
  await connectDB();

  const { method, query: { id } } = req;

  switch (method) {
    case 'GET':
      try {
        const project = await Project.findById(id);
        if (!project) {
          return res.status(404).json({ error: 'Project not found' });
        }
        return res.status(200).json(project);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'PUT':
      try {
        const project = await Project.findByIdAndUpdate(
          id,
          { ...req.body, updatedAt: new Date() },
          { new: true }
        );
        if (!project) {
          return res.status(404).json({ error: 'Project not found' });
        }
        return res.status(200).json(project);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'DELETE':
      try {
        const project = await Project.findByIdAndDelete(id);
        if (!project) {
          return res.status(404).json({ error: 'Project not found' });
        }
        return res.status(200).json({ message: 'Project deleted' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

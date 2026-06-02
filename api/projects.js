import connectDB from './lib/db.js';
import Project from './models/Project.js';

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { featured, category, limit = 50 } = req.query;
        let query = {};
        
        if (featured === 'true') query.featured = true;
        if (category) query.category = category;
        
        const projects = await Project.find(query)
          .sort({ createdAt: -1 })
          .limit(parseInt(limit));
        
        return res.status(200).json(projects);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'POST':
      try {
        const project = new Project(req.body);
        await project.save();
        return res.status(201).json(project);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

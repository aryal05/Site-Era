import connectDB from '../lib/db.js';
import Blog from '../models/Blog.js';

export default async function handler(req, res) {
  await connectDB();

  const { method, query: { slug } } = req;

  switch (method) {
    case 'GET':
      try {
        const post = await Blog.findOne({ slug });
        if (!post) {
          return res.status(404).json({ error: 'Blog post not found' });
        }
        return res.status(200).json(post);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'PUT':
      try {
        const post = await Blog.findOneAndUpdate(
          { slug },
          { ...req.body, updatedAt: new Date() },
          { new: true }
        );
        if (!post) {
          return res.status(404).json({ error: 'Blog post not found' });
        }
        return res.status(200).json(post);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'DELETE':
      try {
        const post = await Blog.findOneAndDelete({ slug });
        if (!post) {
          return res.status(404).json({ error: 'Blog post not found' });
        }
        return res.status(200).json({ message: 'Blog post deleted' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

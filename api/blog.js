import connectDB from './lib/db.js';
import Blog from './models/Blog.js';

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { published, category, limit = 50 } = req.query;
        let query = {};
        
        if (published === 'true') query.published = true;
        if (category) query.category = category;
        
        const posts = await Blog.find(query)
          .sort({ createdAt: -1 })
          .limit(parseInt(limit));
        
        return res.status(200).json(posts);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'POST':
      try {
        const post = new Blog(req.body);
        await post.save();
        return res.status(201).json(post);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

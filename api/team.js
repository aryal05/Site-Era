import connectDB from './lib/db.js';
import Team from './models/Team.js';

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { active, limit = 50 } = req.query;
        let query = {};
        
        if (active === 'true') query.active = true;
        
        const team = await Team.find(query)
          .sort({ order: 1 })
          .limit(parseInt(limit));
        
        return res.status(200).json(team);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'POST':
      try {
        const member = new Team(req.body);
        await member.save();
        return res.status(201).json(member);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

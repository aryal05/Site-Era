import connectDB from './lib/db.js';
import Service from './models/Service.js';

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { featured, limit = 50 } = req.query;
        let query = {};
        
        if (featured === 'true') query.featured = true;
        
        const services = await Service.find(query)
          .sort({ order: 1 })
          .limit(parseInt(limit));
        
        return res.status(200).json(services);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'POST':
      try {
        const service = new Service(req.body);
        await service.save();
        return res.status(201).json(service);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

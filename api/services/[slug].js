import connectDB from '../lib/db.js';
import Service from '../models/Service.js';

export default async function handler(req, res) {
  await connectDB();

  const { method, query: { slug } } = req;

  switch (method) {
    case 'GET':
      try {
        const service = await Service.findOne({ slug });
        if (!service) {
          return res.status(404).json({ error: 'Service not found' });
        }
        return res.status(200).json(service);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'PUT':
      try {
        const service = await Service.findOneAndUpdate(
          { slug },
          { ...req.body, updatedAt: new Date() },
          { new: true }
        );
        if (!service) {
          return res.status(404).json({ error: 'Service not found' });
        }
        return res.status(200).json(service);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'DELETE':
      try {
        const service = await Service.findOneAndDelete({ slug });
        if (!service) {
          return res.status(404).json({ error: 'Service not found' });
        }
        return res.status(200).json({ message: 'Service deleted' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

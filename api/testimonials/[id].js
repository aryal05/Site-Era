import connectDB from '../lib/db.js';
import Testimonial from '../models/Testimonial.js';

export default async function handler(req, res) {
  await connectDB();

  const { method, query: { id } } = req;

  switch (method) {
    case 'GET':
      try {
        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
          return res.status(404).json({ error: 'Testimonial not found' });
        }
        return res.status(200).json(testimonial);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'PUT':
      try {
        const testimonial = await Testimonial.findByIdAndUpdate(
          id,
          { ...req.body, updatedAt: new Date() },
          { new: true }
        );
        if (!testimonial) {
          return res.status(404).json({ error: 'Testimonial not found' });
        }
        return res.status(200).json(testimonial);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'DELETE':
      try {
        const testimonial = await Testimonial.findByIdAndDelete(id);
        if (!testimonial) {
          return res.status(404).json({ error: 'Testimonial not found' });
        }
        return res.status(200).json({ message: 'Testimonial deleted' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

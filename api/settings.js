import connectDB from './lib/db.js';
import Settings from './models/Settings.js';

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        let settings = await Settings.findOne();
        
        if (!settings) {
          // Create default settings if none exist
          settings = new Settings({
            siteName: 'Site Era',
            tagline: 'Premium Web & Mobile App Development Company',
            email: 'contact@siteera.com',
            hero: {
              title: 'Transform Your Digital Presence',
              subtitle: 'Premium Web & Mobile App Development',
              description: 'We craft exceptional digital experiences that drive results',
              ctaText: 'Start Your Project',
              ctaLink: '/contact'
            }
          });
          await settings.save();
        }
        
        return res.status(200).json(settings);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'PUT':
      try {
        let settings = await Settings.findOne();
        
        if (!settings) {
          settings = new Settings({ ...req.body, updatedAt: new Date() });
          await settings.save();
        } else {
          settings = await Settings.findOneAndUpdate(
            {},
            { ...req.body, updatedAt: new Date() },
            { new: true }
          );
        }
        
        return res.status(200).json(settings);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

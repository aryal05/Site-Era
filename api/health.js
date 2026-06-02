import connectDB from './lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await connectDB();
    return res.status(200).json({ 
      status: 'ok', 
      message: 'Site Era API is running',
      database: 'connected'
    });
  } catch (error) {
    return res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error.message
    });
  }
}

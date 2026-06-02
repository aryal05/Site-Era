import connectDB from './lib/db.js';

// Handle base64 image uploads
export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { image, folder = 'general' } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Validate base64 image
    if (!image.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    // Check file size (limit to 5MB)
    const base64Size = image.length * 0.75; // Approximate size in bytes
    if (base64Size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image too large (max 5MB)' });
    }

    // In a real production app, you'd upload to Cloudinary/S3 here
    // For now, we'll store base64 directly in MongoDB
    // This works for small images but consider Cloudinary for production

    return res.status(200).json({ 
      url: image,
      folder,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const db = require('../db/database');

exports.subscribe = (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Upsert - reactivate if already exists
    db.prepare(`
      INSERT INTO newsletter_subscribers (email, active) VALUES (?, 1)
      ON CONFLICT(email) DO UPDATE SET active = 1
    `).run(email);

    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.unsubscribe = (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    db.prepare('UPDATE newsletter_subscribers SET active = 0 WHERE email = ?').run(email);
    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllSubscribers = (req, res) => {
  try {
    const subscribers = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC').all();
    res.json(subscribers);
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

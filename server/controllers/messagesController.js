const db = require('../db/database');

exports.createMessage = (req, res) => {
  try {
    const { name, email, phone, service, budget, message, source } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const result = db.prepare(`
      INSERT INTO messages (name, email, phone, service, budget, message, source)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, email, phone, service, budget, message, source);

    res.status(201).json({
      message: 'Message sent successfully',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllMessages = (req, res) => {
  try {
    const messages = db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all();
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateMessageStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    db.prepare('UPDATE messages SET status = ? WHERE id = ?').run(status, id);
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteMessage = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM messages WHERE id = ?').run(id);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

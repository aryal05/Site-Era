const db = require('../db/database');

exports.getAllTestimonials = (req, res) => {
  try {
    const { active } = req.query;
    let query = 'SELECT * FROM testimonials WHERE 1=1';
    const params = [];

    if (active !== undefined) {
      query += ' AND active = ?';
      params.push(active === 'true' ? 1 : 0);
    }

    query += ' ORDER BY created_at DESC';

    const testimonials = db.prepare(query).all(...params);
    res.json(testimonials);
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createTestimonial = (req, res) => {
  try {
    const { name, title, company, avatar_url, quote, stars, active } = req.body;

    if (!name || !quote) {
      return res.status(400).json({ error: 'Name and quote are required' });
    }

    const result = db.prepare(`
      INSERT INTO testimonials (name, title, company, avatar_url, quote, stars, active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, title, company, avatar_url, quote, stars || 5, active !== undefined ? (active ? 1 : 0) : 1);

    res.status(201).json({
      message: 'Testimonial created successfully',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateTestimonial = (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, company, avatar_url, quote, stars, active } = req.body;

    db.prepare(`
      UPDATE testimonials 
      SET name = ?, title = ?, company = ?, avatar_url = ?, quote = ?, stars = ?, active = ?
      WHERE id = ?
    `).run(name, title, company, avatar_url, quote, stars, active ? 1 : 0, id);

    res.json({ message: 'Testimonial updated successfully' });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteTestimonial = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM testimonials WHERE id = ?').run(id);
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

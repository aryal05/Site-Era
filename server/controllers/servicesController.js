const db = require('../db/database');

const parseJsonFields = (service) => {
  if (!service) return null;
  return {
    ...service,
    features: service.features ? JSON.parse(service.features) : [],
    technologies: service.technologies ? JSON.parse(service.technologies) : [],
    process_steps: service.process_steps ? JSON.parse(service.process_steps) : [],
    pricing: service.pricing ? JSON.parse(service.pricing) : []
  };
};

exports.getAllServices = (req, res) => {
  try {
    const { visible } = req.query;
    let query = 'SELECT * FROM services WHERE 1=1';
    const params = [];

    if (visible !== undefined) {
      query += ' AND visible = ?';
      params.push(visible === 'true' ? 1 : 0);
    }

    query += ' ORDER BY sort_order ASC, created_at DESC';

    const services = db.prepare(query).all(...params);
    const parsed = services.map(parseJsonFields);

    res.json(parsed);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getServiceBySlug = (req, res) => {
  try {
    const { slug } = req.params;
    const service = db.prepare('SELECT * FROM services WHERE slug = ?').get(slug);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(parseJsonFields(service));
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createService = (req, res) => {
  try {
    const { title, slug, description, icon, tagline, features, technologies, process_steps, pricing, sort_order, visible } = req.body;

    if (!title || !slug) {
      return res.status(400).json({ error: 'Title and slug are required' });
    }

    const result = db.prepare(`
      INSERT INTO services (title, slug, description, icon, tagline, features, technologies, process_steps, pricing, sort_order, visible)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title, slug, description, icon || 'Code', tagline,
      JSON.stringify(features || []),
      JSON.stringify(technologies || []),
      JSON.stringify(process_steps || []),
      JSON.stringify(pricing || []),
      sort_order || 0,
      visible !== undefined ? (visible ? 1 : 0) : 1
    );

    res.status(201).json({
      message: 'Service created successfully',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Create service error:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Service with this slug already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateService = (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, description, icon, tagline, features, technologies, process_steps, pricing, sort_order, visible } = req.body;

    db.prepare(`
      UPDATE services 
      SET title = ?, slug = ?, description = ?, icon = ?, tagline = ?, features = ?, technologies = ?, process_steps = ?, pricing = ?, sort_order = ?, visible = ?
      WHERE id = ?
    `).run(
      title, slug, description, icon, tagline,
      features ? JSON.stringify(features) : null,
      technologies ? JSON.stringify(technologies) : null,
      process_steps ? JSON.stringify(process_steps) : null,
      pricing ? JSON.stringify(pricing) : null,
      sort_order || 0,
      visible ? 1 : 0,
      id
    );

    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('Update service error:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Service with this slug already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteService = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM services WHERE id = ?').run(id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const db = require('../db/database');

exports.getAllProjects = (req, res) => {
  try {
    const { category, featured } = req.query;
    let query = 'SELECT * FROM projects WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (featured) {
      query += ' AND featured = ?';
      params.push(featured === 'true' ? 1 : 0);
    }

    query += ' ORDER BY sort_order ASC, created_at DESC';

    const projects = db.prepare(query).all(...params);
    
    // Parse tech_stack JSON
    const parsedProjects = projects.map(p => ({
      ...p,
      tech_stack: p.tech_stack ? JSON.parse(p.tech_stack) : []
    }));

    res.json(parsedProjects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getProjectById = (req, res) => {
  try {
    const { id } = req.params;
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.tech_stack = project.tech_stack ? JSON.parse(project.tech_stack) : [];
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getProjectBySlug = (req, res) => {
  try {
    const { slug } = req.params;
    const project = db.prepare('SELECT * FROM projects WHERE slug = ?').get(slug);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    project.tech_stack = project.tech_stack ? JSON.parse(project.tech_stack) : [];
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createProject = (req, res) => {
  try {
    const { title, slug, category, description, tech_stack, image_url, live_url, github_url, featured } = req.body;

    if (!title || !slug || !category) {
      return res.status(400).json({ error: 'Title, slug, and category are required' });
    }

    const techStackJson = JSON.stringify(tech_stack || []);

    const result = db.prepare(`
      INSERT INTO projects (title, slug, category, description, tech_stack, image_url, live_url, github_url, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, slug, category, description, techStackJson, image_url, live_url, github_url, featured ? 1 : 0);

    res.status(201).json({
      message: 'Project created successfully',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Create project error:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Project with this slug already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateProject = (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, category, description, tech_stack, image_url, live_url, github_url, featured, sort_order } = req.body;

    const techStackJson = tech_stack ? JSON.stringify(tech_stack) : null;

    db.prepare(`
      UPDATE projects 
      SET title = ?, slug = ?, category = ?, description = ?, tech_stack = ?, 
          image_url = ?, live_url = ?, github_url = ?, featured = ?, sort_order = ?
      WHERE id = ?
    `).run(title, slug, category, description, techStackJson, image_url, live_url, github_url, featured ? 1 : 0, sort_order || 0, id);

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Update project error:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Project with this slug already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteProject = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

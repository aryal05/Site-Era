const db = require('../db/database');

exports.getAllMembers = (req, res) => {
  try {
    const { visible } = req.query;
    let query = 'SELECT * FROM team_members WHERE 1=1';
    const params = [];

    if (visible !== undefined) {
      query += ' AND visible = ?';
      params.push(visible === 'true' ? 1 : 0);
    }

    query += ' ORDER BY sort_order ASC, created_at DESC';

    const members = db.prepare(query).all(...params);
    const parsed = members.map(m => ({
      ...m,
      social_links: m.social_links ? JSON.parse(m.social_links) : {}
    }));

    res.json(parsed);
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createMember = (req, res) => {
  try {
    const { name, role, bio, avatar_url, social_links, sort_order, visible } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const result = db.prepare(`
      INSERT INTO team_members (name, role, bio, avatar_url, social_links, sort_order, visible)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      name, role, bio, avatar_url,
      JSON.stringify(social_links || {}),
      sort_order || 0,
      visible !== undefined ? (visible ? 1 : 0) : 1
    );

    res.status(201).json({
      message: 'Team member created successfully',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateMember = (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, bio, avatar_url, social_links, sort_order, visible } = req.body;

    db.prepare(`
      UPDATE team_members 
      SET name = ?, role = ?, bio = ?, avatar_url = ?, social_links = ?, sort_order = ?, visible = ?
      WHERE id = ?
    `).run(
      name, role, bio, avatar_url,
      social_links ? JSON.stringify(social_links) : null,
      sort_order || 0,
      visible ? 1 : 0,
      id
    );

    res.json({ message: 'Team member updated successfully' });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteMember = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM team_members WHERE id = ?').run(id);
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

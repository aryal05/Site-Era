const db = require('../db/database');

exports.getAllPosts = (req, res) => {
  try {
    const { published, category } = req.query;
    let query = 'SELECT * FROM blog_posts WHERE 1=1';
    const params = [];

    if (published !== undefined) {
      query += ' AND published = ?';
      params.push(published === 'true' ? 1 : 0);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const posts = db.prepare(query).all(...params);
    
    // Parse tags JSON
    const parsedPosts = posts.map(p => ({
      ...p,
      tags: p.tags ? JSON.parse(p.tags) : []
    }));

    res.json(parsedPosts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getPostBySlug = (req, res) => {
  try {
    const { slug } = req.params;
    const post = db.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(slug);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.tags = post.tags ? JSON.parse(post.tags) : [];
    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createPost = (req, res) => {
  try {
    const { title, slug, category, thumbnail, content, excerpt, meta_description, tags, published, author } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug, and content are required' });
    }

    const tagsJson = JSON.stringify(tags || []);

    const result = db.prepare(`
      INSERT INTO blog_posts (title, slug, category, thumbnail, content, excerpt, meta_description, tags, published, author)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, slug, category, thumbnail, content, excerpt, meta_description, tagsJson, published ? 1 : 0, author || 'Site Era Team');

    res.status(201).json({
      message: 'Post created successfully',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Create post error:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Post with this slug already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updatePost = (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, category, thumbnail, content, excerpt, meta_description, tags, published, author } = req.body;

    const tagsJson = tags ? JSON.stringify(tags) : null;

    db.prepare(`
      UPDATE blog_posts 
      SET title = ?, slug = ?, category = ?, thumbnail = ?, content = ?, 
          excerpt = ?, meta_description = ?, tags = ?, published = ?, author = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, slug, category, thumbnail, content, excerpt, meta_description, tagsJson, published ? 1 : 0, author, id);

    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Update post error:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Post with this slug already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deletePost = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

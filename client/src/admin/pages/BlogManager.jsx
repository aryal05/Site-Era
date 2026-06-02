import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Search, Eye, EyeOff } from 'lucide-react';
import api from '../../utils/api';

const BlogManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' or 'edit'
  const [editingPost, setEditingPost] = useState(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = { title: '', slug: '', category: 'Technology', thumbnail: '', content: '', excerpt: '', meta_description: '', tags: '', published: false, author: 'Site Era Team' };
  const [form, setForm] = useState(emptyForm);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPosts = async () => {
    try {
      const res = await api.get('/blog');
      setPosts(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tags: typeof form.tags === 'string' ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : form.tags,
      };
      if (editingPost) {
        await api.put(`/blog/${editingPost.id}`, payload);
        showToast('Post updated');
      } else {
        await api.post('/blog', payload);
        showToast('Post created');
      }
      setView('list');
      setEditingPost(null);
      setForm(emptyForm);
      fetchPosts();
    } catch (err) {
      showToast(err.response?.data?.error || 'Error', 'error');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setForm({
      ...post,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
      published: !!post.published,
    });
    setView('edit');
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/blog/${id}`);
      showToast('Post deleted');
      fetchPosts();
      setDeleteConfirm(null);
    } catch (err) { showToast('Error deleting', 'error'); }
  };

  const filtered = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="text-center py-20 text-platinum-400">Loading blog posts...</div>;

  // Edit View
  if (view === 'edit') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <AnimatePresence>
          {toast && (
            <motion.div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg font-medium text-sm ${toast.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>{toast.msg}</motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-white">{editingPost ? 'Edit Post' : 'New Post'}</h2>
          <button onClick={() => { setView('list'); setEditingPost(null); setForm(emptyForm); }}
            className="text-platinum-400 hover:text-white transition-colors">← Back to List</button>
        </div>
        <form onSubmit={handleSubmit} className="card-luxury p-8 rounded-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-platinum-300 mb-1 block">Title *</label>
              <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: editingPost ? form.slug : generateSlug(e.target.value) })}
                className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-sm text-platinum-300 mb-1 block">Slug *</label>
              <input type="text" required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-platinum-300 mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none">
                <option>Technology</option><option>Design</option><option>Business</option><option>Development</option><option>News</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-platinum-300 mb-1 block">Author</label>
              <input type="text" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })}
                className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 py-3 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 rounded accent-royal-500" />
                <span className="text-sm text-platinum-300">Published</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm text-platinum-300 mb-1 block">Thumbnail URL</label>
            <input type="url" value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })}
              className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm text-platinum-300 mb-1 block">Excerpt</label>
            <textarea rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none resize-none" />
          </div>
          <div>
            <label className="text-sm text-platinum-300 mb-1 block">Content * (HTML supported)</label>
            <textarea rows={12} required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
              className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none resize-none font-mono text-sm" />
          </div>
          <div>
            <label className="text-sm text-platinum-300 mb-1 block">Tags (comma-separated)</label>
            <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
              placeholder="React, Web Development, Tips"
              className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white placeholder-platinum-500 focus:border-royal-500 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm text-platinum-300 mb-1 block">Meta Description</label>
            <input type="text" value={form.meta_description} onChange={e => setForm({ ...form, meta_description: e.target.value })}
              className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => { setView('list'); setEditingPost(null); setForm(emptyForm); }} className="flex-1 py-3 rounded-lg border border-royal-500/30 text-white font-semibold hover:bg-luxury-100 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 btn-luxury text-white py-3 rounded-lg font-semibold">{editingPost ? 'Update' : 'Publish'}</button>
          </div>
        </form>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && (
          <motion.div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg font-medium text-sm ${toast.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>{toast.msg}</motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-platinum-400" size={18} />
          <input type="text" placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white placeholder-platinum-500 focus:border-royal-500 focus:outline-none" />
        </div>
        <button onClick={() => { setEditingPost(null); setForm(emptyForm); setView('edit'); }}
          className="btn-luxury text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
          <Plus size={18} /> New Post
        </button>
      </div>

      <div className="card-luxury rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-royal-500/20">
                <th className="text-left p-4 text-xs font-semibold text-platinum-400 uppercase">Post</th>
                <th className="text-left p-4 text-xs font-semibold text-platinum-400 uppercase hidden md:table-cell">Category</th>
                <th className="text-center p-4 text-xs font-semibold text-platinum-400 uppercase">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-platinum-400 uppercase hidden lg:table-cell">Date</th>
                <th className="text-right p-4 text-xs font-semibold text-platinum-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id} className="border-b border-royal-500/10 hover:bg-luxury-100 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {post.thumbnail && <img src={post.thumbnail} alt="" className="w-16 h-10 rounded-lg object-cover hidden sm:block" />}
                      <div>
                        <div className="font-semibold text-white text-sm">{post.title}</div>
                        <div className="text-xs text-platinum-400">by {post.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-xs px-3 py-1 rounded-full bg-royal-500/20 text-royal-400">{post.category}</span>
                  </td>
                  <td className="p-4 text-center">
                    {post.published ? (
                      <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400"><Eye size={12} /> Published</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gold-500/20 text-gold-400"><EyeOff size={12} /> Draft</span>
                    )}
                  </td>
                  <td className="p-4 hidden lg:table-cell text-sm text-platinum-400">{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(post)} className="p-2 text-platinum-400 hover:text-royal-400 transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => setDeleteConfirm(post.id)} className="p-2 text-platinum-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-platinum-400">No posts found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="glass-luxury p-8 rounded-2xl max-w-md w-full" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h3 className="text-xl font-display font-bold text-white mb-4">Delete Post?</h3>
              <p className="text-platinum-300 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-lg border border-royal-500/30 text-white font-semibold hover:bg-luxury-100 transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 rounded-lg bg-red-500/20 text-red-400 font-semibold hover:bg-red-500/30 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogManager;

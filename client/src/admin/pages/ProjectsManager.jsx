import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Search, Star, ExternalLink, Github } from 'lucide-react';
import api from '../../utils/api';

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = { title: '', slug: '', category: 'web', description: '', tech_stack: '', image_url: '', live_url: '', github_url: '', featured: false, sort_order: 0 };
  const [form, setForm] = useState(emptyForm);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tech_stack: typeof form.tech_stack === 'string' ? form.tech_stack.split(',').map(s => s.trim()).filter(Boolean) : form.tech_stack,
      };
      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, payload);
        showToast('Project updated successfully');
      } else {
        await api.post('/projects', payload);
        showToast('Project created successfully');
      }
      setShowModal(false);
      setEditingProject(null);
      setForm(emptyForm);
      fetchProjects();
    } catch (err) {
      showToast(err.response?.data?.error || 'Error saving project', 'error');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setForm({
      ...project,
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : project.tech_stack || '',
      featured: !!project.featured,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      showToast('Project deleted');
      fetchProjects();
      setDeleteConfirm(null);
    } catch (err) {
      showToast('Error deleting project', 'error');
    }
  };

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center py-20 text-platinum-400">Loading projects...</div>;

  return (
    <div className="space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg font-medium text-sm ${toast.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
          >{toast.msg}</motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-platinum-400" size={18} />
          <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white placeholder-platinum-500 focus:border-royal-500 focus:outline-none transition-colors" />
        </div>
        <button onClick={() => { setEditingProject(null); setForm(emptyForm); setShowModal(true); }}
          className="btn-luxury text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
          <Plus size={18} /> Add Project
        </button>
      </div>

      {/* Table */}
      <div className="card-luxury rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-royal-500/20">
                <th className="text-left p-4 text-xs font-semibold text-platinum-400 uppercase">Project</th>
                <th className="text-left p-4 text-xs font-semibold text-platinum-400 uppercase hidden md:table-cell">Category</th>
                <th className="text-left p-4 text-xs font-semibold text-platinum-400 uppercase hidden lg:table-cell">Tech</th>
                <th className="text-center p-4 text-xs font-semibold text-platinum-400 uppercase">Featured</th>
                <th className="text-right p-4 text-xs font-semibold text-platinum-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => (
                <tr key={project.id} className="border-b border-royal-500/10 hover:bg-luxury-100 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {project.image_url && <img src={project.image_url} alt="" className="w-12 h-12 rounded-lg object-cover hidden sm:block" />}
                      <div>
                        <div className="font-semibold text-white text-sm">{project.title}</div>
                        <div className="text-xs text-platinum-400">{project.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-xs px-3 py-1 rounded-full bg-royal-500/20 text-royal-400 capitalize">{project.category}</span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {(project.tech_stack || []).slice(0, 3).map((t, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded bg-luxury-100 text-platinum-300">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {project.featured ? <Star size={16} className="text-gold-500 fill-gold-500 mx-auto" /> : <Star size={16} className="text-platinum-600 mx-auto" />}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {project.live_url && <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-2 text-platinum-400 hover:text-royal-400 transition-colors"><ExternalLink size={16} /></a>}
                      <button onClick={() => handleEdit(project)} className="p-2 text-platinum-400 hover:text-royal-400 transition-colors"><Pencil size={16} /></button>
                      <button onClick={() => setDeleteConfirm(project.id)} className="p-2 text-platinum-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-platinum-400">No projects found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="glass-luxury p-8 rounded-2xl max-w-md w-full" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h3 className="text-xl font-display font-bold text-white mb-4">Delete Project?</h3>
              <p className="text-platinum-300 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-lg border border-royal-500/30 text-white font-semibold hover:bg-luxury-100 transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 rounded-lg bg-red-500/20 text-red-400 font-semibold hover:bg-red-500/30 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="glass-luxury p-8 rounded-2xl max-w-2xl w-full my-8" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold text-white">{editingProject ? 'Edit Project' : 'New Project'}</h3>
                <button onClick={() => setShowModal(false)} className="text-platinum-400 hover:text-white transition-colors"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-platinum-300 mb-1 block">Title *</label>
                    <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: editingProject ? form.slug : generateSlug(e.target.value) })}
                      className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm text-platinum-300 mb-1 block">Slug *</label>
                    <input type="text" required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                      className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-platinum-300 mb-1 block">Category *</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none">
                      <option value="web">Web</option>
                      <option value="mobile">Mobile</option>
                      <option value="ecommerce">E-Commerce</option>
                      <option value="design">Design</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-platinum-300 mb-1 block">Sort Order</label>
                    <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-platinum-300 mb-1 block">Description</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="text-sm text-platinum-300 mb-1 block">Tech Stack (comma-separated)</label>
                  <input type="text" value={form.tech_stack} onChange={e => setForm({ ...form, tech_stack: e.target.value })}
                    placeholder="React, Node.js, PostgreSQL"
                    className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white placeholder-platinum-500 focus:border-royal-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm text-platinum-300 mb-1 block">Image URL</label>
                  <input type="url" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })}
                    className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-platinum-300 mb-1 block">Live URL</label>
                    <input type="url" value={form.live_url} onChange={e => setForm({ ...form, live_url: e.target.value })}
                      className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm text-platinum-300 mb-1 block">GitHub URL</label>
                    <input type="url" value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })}
                      className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 rounded accent-royal-500" />
                  <label htmlFor="featured" className="text-sm text-platinum-300">Featured Project</label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-lg border border-royal-500/30 text-white font-semibold hover:bg-luxury-100 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 btn-luxury text-white py-3 rounded-lg font-semibold">{editingProject ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsManager;

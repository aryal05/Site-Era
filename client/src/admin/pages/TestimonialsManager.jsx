import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react';
import api from '../../utils/api';

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = { name: '', title: '', company: '', avatar_url: '', quote: '', stars: 5, active: true };
  const [form, setForm] = useState(emptyForm);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try { const res = await api.get('/testimonials'); setTestimonials(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/testimonials/${editing.id}`, form);
        showToast('Testimonial updated');
      } else {
        await api.post('/testimonials', form);
        showToast('Testimonial created');
      }
      setShowModal(false); setEditing(null); setForm(emptyForm); fetchData();
    } catch (err) { showToast('Error saving', 'error'); }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({ ...item, active: !!item.active });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/testimonials/${id}`); showToast('Deleted'); fetchData(); setDeleteConfirm(null); }
    catch (err) { showToast('Error', 'error'); }
  };

  if (loading) return <div className="text-center py-20 text-platinum-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && (
          <motion.div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg font-medium text-sm ${toast.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>{toast.msg}</motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-white">{testimonials.length} Testimonials</h2>
        <button onClick={() => { setEditing(null); setForm(emptyForm); setShowModal(true); }}
          className="btn-luxury text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <motion.div key={t.id} className="card-luxury p-6 rounded-xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-royal-500/20 flex items-center justify-center text-royal-400 font-bold">{t.name[0]}</div>
                )}
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-platinum-400">{t.title}, {t.company}</div>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${t.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {t.active ? 'Active' : 'Hidden'}
              </span>
            </div>
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={i < t.stars ? 'text-gold-500 fill-gold-500' : 'text-platinum-600'} />
              ))}
            </div>
            <p className="text-platinum-300 text-sm line-clamp-3 mb-4">"{t.quote}"</p>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(t)} className="flex-1 py-2 text-xs rounded-lg border border-royal-500/30 text-royal-400 hover:bg-royal-500/10 transition-colors">Edit</button>
              <button onClick={() => setDeleteConfirm(t.id)} className="flex-1 py-2 text-xs rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">Delete</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="glass-luxury p-8 rounded-2xl max-w-md w-full" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h3 className="text-xl font-display font-bold text-white mb-4">Delete Testimonial?</h3>
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
          <motion.div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="glass-luxury p-8 rounded-2xl max-w-lg w-full" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold text-white">{editing ? 'Edit' : 'New'} Testimonial</h3>
                <button onClick={() => setShowModal(false)} className="text-platinum-400 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-platinum-300 mb-1 block">Name *</label>
                    <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm text-platinum-300 mb-1 block">Title</label>
                    <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                      className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-platinum-300 mb-1 block">Company</label>
                    <input type="text" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                      className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-sm text-platinum-300 mb-1 block">Avatar URL</label>
                    <input type="url" value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })}
                      className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-platinum-300 mb-1 block">Quote *</label>
                  <textarea rows={4} required value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })}
                    className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-platinum-300 mb-1 block">Stars</label>
                    <select value={form.stars} onChange={e => setForm({ ...form, stars: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none">
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-3 py-3 cursor-pointer">
                      <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 rounded accent-royal-500" />
                      <span className="text-sm text-platinum-300">Active (visible on site)</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-lg border border-royal-500/30 text-white font-semibold hover:bg-luxury-100 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 btn-luxury text-white py-3 rounded-lg font-semibold">{editing ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestimonialsManager;

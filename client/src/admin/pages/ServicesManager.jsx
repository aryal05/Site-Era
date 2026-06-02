import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Eye, EyeOff, GripVertical } from 'lucide-react';
import api from '../../utils/api';

const ServicesManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = {
    title: '', slug: '', description: '', icon: 'Code', tagline: '',
    features: [{ title: '', description: '' }],
    technologies: '',
    process_steps: [{ number: '01', title: '', description: '' }],
    pricing: [
      { name: 'Basic', price: '', features: [''] },
      { name: 'Professional', price: '', features: [''], popular: true },
      { name: 'Enterprise', price: 'Custom', features: [''] }
    ],
    sort_order: 0, visible: true
  };
  const [form, setForm] = useState(emptyForm);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchServices = async () => {
    try { const res = await api.get('/services'); setServices(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        technologies: typeof form.technologies === 'string' ? form.technologies.split(',').map(s => s.trim()).filter(Boolean) : form.technologies,
      };
      if (editing) {
        await api.put(`/services/${editing.id}`, payload);
        showToast('Service updated');
      } else {
        await api.post('/services', payload);
        showToast('Service created');
      }
      setShowModal(false); setEditing(null); setForm(emptyForm); fetchServices();
    } catch (err) { showToast(err.response?.data?.error || 'Error', 'error'); }
  };

  const handleEdit = (svc) => {
    setEditing(svc);
    setForm({
      ...svc,
      technologies: Array.isArray(svc.technologies) ? svc.technologies.join(', ') : svc.technologies || '',
      features: svc.features?.length ? svc.features : [{ title: '', description: '' }],
      process_steps: svc.process_steps?.length ? svc.process_steps : [{ number: '01', title: '', description: '' }],
      pricing: svc.pricing?.length ? svc.pricing : emptyForm.pricing,
      visible: !!svc.visible,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/services/${id}`); showToast('Deleted'); fetchServices(); setDeleteConfirm(null); }
    catch (err) { showToast('Error', 'error'); }
  };

  // Dynamic list helpers
  const addFeature = () => setForm({ ...form, features: [...form.features, { title: '', description: '' }] });
  const removeFeature = (i) => setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) });
  const updateFeature = (i, field, val) => {
    const updated = [...form.features];
    updated[i] = { ...updated[i], [field]: val };
    setForm({ ...form, features: updated });
  };

  const addStep = () => setForm({ ...form, process_steps: [...form.process_steps, { number: String(form.process_steps.length + 1).padStart(2, '0'), title: '', description: '' }] });
  const removeStep = (i) => setForm({ ...form, process_steps: form.process_steps.filter((_, idx) => idx !== i) });
  const updateStep = (i, field, val) => {
    const updated = [...form.process_steps];
    updated[i] = { ...updated[i], [field]: val };
    setForm({ ...form, process_steps: updated });
  };

  const updatePricingFeature = (tierIdx, featIdx, val) => {
    const updated = [...form.pricing];
    updated[tierIdx] = { ...updated[tierIdx], features: [...updated[tierIdx].features] };
    updated[tierIdx].features[featIdx] = val;
    setForm({ ...form, pricing: updated });
  };
  const addPricingFeature = (tierIdx) => {
    const updated = [...form.pricing];
    updated[tierIdx] = { ...updated[tierIdx], features: [...updated[tierIdx].features, ''] };
    setForm({ ...form, pricing: updated });
  };
  const removePricingFeature = (tierIdx, featIdx) => {
    const updated = [...form.pricing];
    updated[tierIdx] = { ...updated[tierIdx], features: updated[tierIdx].features.filter((_, i) => i !== featIdx) };
    setForm({ ...form, pricing: updated });
  };

  const iconOptions = ['Code', 'Smartphone', 'Palette', 'ShoppingCart', 'Database', 'Sparkles', 'Globe', 'Layers', 'Zap', 'Shield'];

  if (loading) return <div className="text-center py-20 text-platinum-400">Loading services...</div>;

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && (
          <motion.div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg font-medium text-sm ${toast.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>{toast.msg}</motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-white">{services.length} Services</h2>
        <button onClick={() => { setEditing(null); setForm(emptyForm); setShowModal(true); }}
          className="btn-luxury text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
          <Plus size={18} /> Add Service
        </button>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <motion.div key={svc.id} className="card-luxury p-6 rounded-xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-white">{svc.title}</h3>
                <p className="text-xs text-platinum-400 mt-1">/{svc.slug}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${svc.visible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {svc.visible ? 'Visible' : 'Hidden'}
              </span>
            </div>
            <p className="text-sm text-platinum-300 line-clamp-2 mb-3">{svc.tagline}</p>
            <div className="flex gap-1 flex-wrap mb-4">
              {(svc.technologies || []).slice(0, 4).map((t, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded bg-royal-500/10 text-royal-400">{t}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(svc)} className="flex-1 py-2 text-xs rounded-lg border border-royal-500/30 text-royal-400 hover:bg-royal-500/10 transition-colors">Edit</button>
              <button onClick={() => setDeleteConfirm(svc.id)} className="flex-1 py-2 text-xs rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">Delete</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="glass-luxury p-8 rounded-2xl max-w-md w-full" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h3 className="text-xl font-display font-bold text-white mb-4">Delete Service?</h3>
              <p className="text-platinum-300 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-lg border border-royal-500/30 text-white font-semibold hover:bg-luxury-100 transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 rounded-lg bg-red-500/20 text-red-400 font-semibold hover:bg-red-500/30 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal - Full Page Overlay for complexity */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="max-w-4xl mx-auto my-8 p-4">
              <motion.div className="glass-luxury p-8 rounded-2xl" initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-display font-bold text-white">{editing ? 'Edit' : 'New'} Service</h3>
                  <button onClick={() => setShowModal(false)} className="text-platinum-400 hover:text-white"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gold-500 uppercase tracking-wider">Basic Info</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-platinum-300 mb-1 block">Title *</label>
                        <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : generateSlug(e.target.value) })}
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
                        <label className="text-sm text-platinum-300 mb-1 block">Icon</label>
                        <select value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}
                          className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none">
                          {iconOptions.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-platinum-300 mb-1 block">Sort Order</label>
                        <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-3 py-3 cursor-pointer">
                          <input type="checkbox" checked={form.visible} onChange={e => setForm({ ...form, visible: e.target.checked })} className="w-4 h-4 rounded accent-royal-500" />
                          <span className="text-sm text-platinum-300">Visible on site</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-platinum-300 mb-1 block">Tagline</label>
                      <input type="text" value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })}
                        className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-sm text-platinum-300 mb-1 block">Description</label>
                      <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                        className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none resize-none" />
                    </div>
                    <div>
                      <label className="text-sm text-platinum-300 mb-1 block">Technologies (comma-separated)</label>
                      <input type="text" value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })}
                        className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gold-500 uppercase tracking-wider">Features</h4>
                      <button type="button" onClick={addFeature} className="text-xs text-royal-400 hover:text-royal-300">+ Add Feature</button>
                    </div>
                    {form.features.map((f, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <input type="text" placeholder="Feature title" value={f.title} onChange={e => updateFeature(i, 'title', e.target.value)}
                            className="px-3 py-2 bg-luxury-100 border border-royal-500/20 rounded-lg text-white text-sm focus:border-royal-500 focus:outline-none" />
                          <input type="text" placeholder="Description" value={f.description} onChange={e => updateFeature(i, 'description', e.target.value)}
                            className="px-3 py-2 bg-luxury-100 border border-royal-500/20 rounded-lg text-white text-sm focus:border-royal-500 focus:outline-none" />
                        </div>
                        {form.features.length > 1 && (
                          <button type="button" onClick={() => removeFeature(i)} className="p-2 text-red-400 hover:text-red-300"><X size={16} /></button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Process Steps */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gold-500 uppercase tracking-wider">Process Steps</h4>
                      <button type="button" onClick={addStep} className="text-xs text-royal-400 hover:text-royal-300">+ Add Step</button>
                    </div>
                    {form.process_steps.map((s, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <span className="text-sm font-bold text-platinum-400 mt-2 w-8">{s.number || String(i+1).padStart(2, '0')}</span>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <input type="text" placeholder="Step title" value={s.title} onChange={e => updateStep(i, 'title', e.target.value)}
                            className="px-3 py-2 bg-luxury-100 border border-royal-500/20 rounded-lg text-white text-sm focus:border-royal-500 focus:outline-none" />
                          <input type="text" placeholder="Description" value={s.description} onChange={e => updateStep(i, 'description', e.target.value)}
                            className="px-3 py-2 bg-luxury-100 border border-royal-500/20 rounded-lg text-white text-sm focus:border-royal-500 focus:outline-none" />
                        </div>
                        {form.process_steps.length > 1 && (
                          <button type="button" onClick={() => removeStep(i)} className="p-2 text-red-400 hover:text-red-300"><X size={16} /></button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pricing Tiers */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gold-500 uppercase tracking-wider">Pricing Tiers</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {form.pricing.map((tier, ti) => (
                        <div key={ti} className="card-luxury p-4 rounded-lg space-y-3">
                          <input type="text" placeholder="Tier name" value={tier.name} onChange={e => {
                            const updated = [...form.pricing]; updated[ti] = { ...updated[ti], name: e.target.value }; setForm({ ...form, pricing: updated });
                          }} className="w-full px-3 py-2 bg-luxury-100 border border-royal-500/20 rounded-lg text-white text-sm focus:border-royal-500 focus:outline-none" />
                          <input type="text" placeholder="Price (e.g., NPR 50,000)" value={tier.price} onChange={e => {
                            const updated = [...form.pricing]; updated[ti] = { ...updated[ti], price: e.target.value }; setForm({ ...form, pricing: updated });
                          }} className="w-full px-3 py-2 bg-luxury-100 border border-royal-500/20 rounded-lg text-white text-sm focus:border-royal-500 focus:outline-none" />
                          <div className="space-y-2">
                            {tier.features.map((f, fi) => (
                              <div key={fi} className="flex gap-1">
                                <input type="text" placeholder="Feature" value={f} onChange={e => updatePricingFeature(ti, fi, e.target.value)}
                                  className="flex-1 px-3 py-1.5 bg-luxury-100 border border-royal-500/20 rounded text-white text-xs focus:border-royal-500 focus:outline-none" />
                                {tier.features.length > 1 && (
                                  <button type="button" onClick={() => removePricingFeature(ti, fi)} className="text-red-400 px-1"><X size={12} /></button>
                                )}
                              </div>
                            ))}
                            <button type="button" onClick={() => addPricingFeature(ti)} className="text-xs text-royal-400 hover:text-royal-300">+ Feature</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-lg border border-royal-500/30 text-white font-semibold hover:bg-luxury-100 transition-colors">Cancel</button>
                    <button type="submit" className="flex-1 btn-luxury text-white py-3 rounded-lg font-semibold">{editing ? 'Update' : 'Create'}</button>
                  </div>
                </form>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServicesManager;

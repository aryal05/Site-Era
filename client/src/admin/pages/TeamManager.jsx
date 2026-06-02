import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Linkedin, Github, Twitter } from 'lucide-react';
import api from '../../utils/api';

const TeamManager = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = { name: '', role: '', bio: '', avatar_url: '', social_links: { linkedin: '', github: '', twitter: '' }, sort_order: 0, visible: true };
  const [form, setForm] = useState(emptyForm);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMembers = async () => {
    try { const res = await api.get('/team'); setMembers(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/team/${editing.id}`, form);
        showToast('Member updated');
      } else {
        await api.post('/team', form);
        showToast('Member added');
      }
      setShowModal(false); setEditing(null); setForm(emptyForm); fetchMembers();
    } catch (err) { showToast('Error saving', 'error'); }
  };

  const handleEdit = (member) => {
    setEditing(member);
    setForm({
      ...member,
      social_links: member.social_links || { linkedin: '', github: '', twitter: '' },
      visible: !!member.visible,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/team/${id}`); showToast('Deleted'); fetchMembers(); setDeleteConfirm(null); }
    catch (err) { showToast('Error', 'error'); }
  };

  if (loading) return <div className="text-center py-20 text-platinum-400">Loading team...</div>;

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && (
          <motion.div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg font-medium text-sm ${toast.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>{toast.msg}</motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold text-white">{members.length} Team Members</h2>
        <button onClick={() => { setEditing(null); setForm(emptyForm); setShowModal(true); }}
          className="btn-luxury text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2">
          <Plus size={18} /> Add Member
        </button>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {members.map((m) => (
          <motion.div key={m.id} className="card-luxury p-6 rounded-xl text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {m.avatar_url ? (
              <img src={m.avatar_url} alt={m.name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover ring-2 ring-royal-500/30" />
            ) : (
              <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-royal-500 to-gold-500 flex items-center justify-center text-white text-2xl font-bold">
                {m.name[0]}
              </div>
            )}
            <h3 className="font-semibold text-white mb-1">{m.name}</h3>
            <p className="text-xs text-royal-400 mb-2">{m.role}</p>
            <p className="text-xs text-platinum-400 line-clamp-2 mb-3">{m.bio}</p>
            <div className="flex justify-center gap-2 mb-4">
              {m.social_links?.linkedin && <a href={m.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-platinum-400 hover:text-royal-400 transition-colors"><Linkedin size={14} /></a>}
              {m.social_links?.github && <a href={m.social_links.github} target="_blank" rel="noopener noreferrer" className="text-platinum-400 hover:text-white transition-colors"><Github size={14} /></a>}
              {m.social_links?.twitter && <a href={m.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-platinum-400 hover:text-royal-400 transition-colors"><Twitter size={14} /></a>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(m)} className="flex-1 py-2 text-xs rounded-lg border border-royal-500/30 text-royal-400 hover:bg-royal-500/10 transition-colors">Edit</button>
              <button onClick={() => setDeleteConfirm(m.id)} className="flex-1 py-2 text-xs rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">Delete</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="glass-luxury p-8 rounded-2xl max-w-md w-full" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h3 className="text-xl font-display font-bold text-white mb-4">Remove Team Member?</h3>
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
          <motion.div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="glass-luxury p-8 rounded-2xl max-w-lg w-full my-8" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold text-white">{editing ? 'Edit' : 'Add'} Team Member</h3>
                <button onClick={() => setShowModal(false)} className="text-platinum-400 hover:text-white"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-platinum-300 mb-1 block">Name *</label>
                  <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm text-platinum-300 mb-1 block">Role</label>
                  <input type="text" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm text-platinum-300 mb-1 block">Bio</label>
                  <textarea rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                    className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="text-sm text-platinum-300 mb-1 block">Avatar URL</label>
                  <input type="url" value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })}
                    className="w-full px-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white focus:border-royal-500 focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-platinum-300 block">Social Links</label>
                  <div className="flex items-center gap-2">
                    <Linkedin size={16} className="text-platinum-400 shrink-0" />
                    <input type="url" placeholder="LinkedIn URL" value={form.social_links?.linkedin || ''} onChange={e => setForm({ ...form, social_links: { ...form.social_links, linkedin: e.target.value } })}
                      className="flex-1 px-3 py-2 bg-luxury-100 border border-royal-500/20 rounded-lg text-white text-sm focus:border-royal-500 focus:outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Github size={16} className="text-platinum-400 shrink-0" />
                    <input type="url" placeholder="GitHub URL" value={form.social_links?.github || ''} onChange={e => setForm({ ...form, social_links: { ...form.social_links, github: e.target.value } })}
                      className="flex-1 px-3 py-2 bg-luxury-100 border border-royal-500/20 rounded-lg text-white text-sm focus:border-royal-500 focus:outline-none" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Twitter size={16} className="text-platinum-400 shrink-0" />
                    <input type="url" placeholder="Twitter URL" value={form.social_links?.twitter || ''} onChange={e => setForm({ ...form, social_links: { ...form.social_links, twitter: e.target.value } })}
                      className="flex-1 px-3 py-2 bg-luxury-100 border border-royal-500/20 rounded-lg text-white text-sm focus:border-royal-500 focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-lg border border-royal-500/30 text-white font-semibold hover:bg-luxury-100 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 btn-luxury text-white py-3 rounded-lg font-semibold">{editing ? 'Update' : 'Add'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamManager;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Mail, MailOpen, Reply, ChevronDown, ChevronUp, X } from 'lucide-react';
import api from '../../utils/api';

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMessages = async () => {
    try { const res = await api.get('/messages'); setMessages(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/messages/${id}/status`, { status });
      showToast(`Marked as ${status}`);
      fetchMessages();
    } catch (err) { showToast('Error updating status', 'error'); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/messages/${id}`); showToast('Message deleted'); fetchMessages(); setDeleteConfirm(null); }
    catch (err) { showToast('Error deleting', 'error'); }
  };

  const filtered = messages.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    (m.message || '').toLowerCase().includes(search.toLowerCase())
  );

  const statusColors = {
    new: 'bg-emerald-500/20 text-emerald-400',
    read: 'bg-gold-500/20 text-gold-400',
    replied: 'bg-royal-500/20 text-royal-400',
  };

  if (loading) return <div className="text-center py-20 text-platinum-400">Loading messages...</div>;

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && (
          <motion.div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg font-medium text-sm ${toast.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>{toast.msg}</motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-display font-bold text-white">{messages.length} Messages</h2>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
            {messages.filter(m => m.status === 'new').length} New
          </span>
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-platinum-400" size={18} />
          <input type="text" placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white placeholder-platinum-500 focus:border-royal-500 focus:outline-none" />
        </div>
      </div>

      {/* Messages List */}
      <div className="card-luxury rounded-xl overflow-hidden divide-y divide-royal-500/10">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-platinum-400">No messages found</div>
        ) : (
          filtered.map((msg) => (
            <div key={msg.id} className="hover:bg-luxury-100/50 transition-colors">
              {/* Message Header - Clickable */}
              <div
                className="p-4 flex items-center gap-4 cursor-pointer"
                onClick={() => {
                  setExpanded(expanded === msg.id ? null : msg.id);
                  if (msg.status === 'new') updateStatus(msg.id, 'read');
                }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.status === 'new' ? 'bg-emerald-500/20' : 'bg-luxury-100'}`}>
                  {msg.status === 'new' ? <Mail size={18} className="text-emerald-400" /> : <MailOpen size={18} className="text-platinum-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`font-semibold text-sm ${msg.status === 'new' ? 'text-white' : 'text-platinum-300'}`}>{msg.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[msg.status] || statusColors.new}`}>{msg.status}</span>
                  </div>
                  <div className="text-xs text-platinum-400">{msg.email} {msg.service ? `• ${msg.service}` : ''}</div>
                  {expanded !== msg.id && <div className="text-sm text-platinum-400 truncate mt-1">{msg.message}</div>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-platinum-500 hidden sm:block">{new Date(msg.created_at).toLocaleDateString()}</span>
                  {expanded === msg.id ? <ChevronUp size={16} className="text-platinum-400" /> : <ChevronDown size={16} className="text-platinum-400" />}
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expanded === msg.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pl-18">
                      <div className="glass-luxury p-4 rounded-lg mb-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-xs">
                          <div><span className="text-platinum-500">Name:</span> <span className="text-white ml-1">{msg.name}</span></div>
                          <div><span className="text-platinum-500">Email:</span> <span className="text-white ml-1">{msg.email}</span></div>
                          <div><span className="text-platinum-500">Phone:</span> <span className="text-white ml-1">{msg.phone || 'N/A'}</span></div>
                          <div><span className="text-platinum-500">Budget:</span> <span className="text-white ml-1">{msg.budget || 'N/A'}</span></div>
                        </div>
                        <p className="text-platinum-300 text-sm whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(msg.id, 'read')}
                          className="px-4 py-2 text-xs rounded-lg border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 transition-colors inline-flex items-center gap-1">
                          <MailOpen size={14} /> Mark Read
                        </button>
                        <button onClick={() => updateStatus(msg.id, 'replied')}
                          className="px-4 py-2 text-xs rounded-lg border border-royal-500/30 text-royal-400 hover:bg-royal-500/10 transition-colors inline-flex items-center gap-1">
                          <Reply size={14} /> Mark Replied
                        </button>
                        <button onClick={() => setDeleteConfirm(msg.id)}
                          className="px-4 py-2 text-xs rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors inline-flex items-center gap-1 ml-auto">
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="glass-luxury p-8 rounded-2xl max-w-md w-full" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <h3 className="text-xl font-display font-bold text-white mb-4">Delete Message?</h3>
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

export default MessagesManager;

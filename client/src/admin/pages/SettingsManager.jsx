import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Github } from 'lucide-react';
import api from '../../utils/api';

const SettingsManager = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        // API returns {key: value, ...} object directly
        setSettings(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', settings);
      showToast('Settings saved successfully');
    } catch (err) {
      showToast('Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-platinum-400">Loading settings...</div>;

  const settingsGroups = [
    {
      title: 'Contact Information',
      icon: Phone,
      fields: [
        { key: 'phone', label: 'Phone Number', icon: Phone, placeholder: '+977-9762454572' },
        { key: 'email', label: 'Email Address', icon: Mail, placeholder: 'hello@siteera.com.np' },
        { key: 'address', label: 'Address', icon: MapPin, placeholder: 'Kathmandu, Nepal' },
      ]
    },
    {
      title: 'Social Media Links',
      icon: Linkedin,
      fields: [
        { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/...' },
        { key: 'twitter', label: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/...' },
        { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/...' },
        { key: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/...' },
      ]
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <AnimatePresence>
        {toast && (
          <motion.div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg font-medium text-sm ${toast.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>{toast.msg}</motion.div>
        )}
      </AnimatePresence>

      {settingsGroups.map((group) => (
        <motion.div key={group.title} className="card-luxury p-6 rounded-xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-royal-500/20 flex items-center justify-center">
              <group.icon size={20} className="text-royal-400" />
            </div>
            <h3 className="text-lg font-display font-bold text-white">{group.title}</h3>
          </div>
          <div className="space-y-4">
            {group.fields.map((field) => (
              <div key={field.key}>
                <label className="text-sm text-platinum-300 mb-1 block">{field.label}</label>
                <div className="relative">
                  <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 text-platinum-500" size={16} />
                  <input
                    type="text"
                    value={settings[field.key] || ''}
                    onChange={e => setSettings({ ...settings, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full pl-10 pr-4 py-3 bg-luxury-100 border border-royal-500/20 rounded-lg text-white placeholder-platinum-500 focus:border-royal-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-luxury text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default SettingsManager;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, FileText, MessageSquareQuote, Mail, TrendingUp, Eye } from 'lucide-react';
import api from '../../utils/api';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    className="card-luxury p-6 rounded-xl"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <TrendingUp size={16} className="text-emerald-500" />
    </div>
    <div className="text-3xl font-display font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-platinum-400">{label}</div>
  </motion.div>
);

const DashboardHome = () => {
  const [stats, setStats] = useState({ projects: 0, blogs: 0, testimonials: 0, messages: 0 });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, blogsRes, testimonialsRes, messagesRes] = await Promise.all([
          api.get('/projects'),
          api.get('/blog'),
          api.get('/testimonials'),
          api.get('/messages')
        ]);
        setStats({
          projects: projectsRes.data.length,
          blogs: blogsRes.data.length,
          testimonials: testimonialsRes.data.length,
          messages: messagesRes.data.length
        });
        setRecentMessages(messagesRes.data.slice(0, 5));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-20 text-platinum-400">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FolderKanban} label="Total Projects" value={stats.projects} color="bg-royal-500/20" />
        <StatCard icon={FileText} label="Blog Posts" value={stats.blogs} color="bg-emerald-500/20" />
        <StatCard icon={MessageSquareQuote} label="Testimonials" value={stats.testimonials} color="bg-gold-500/20" />
        <StatCard icon={Mail} label="Messages" value={stats.messages} color="bg-red-500/20" />
      </div>

      {/* Recent Messages */}
      <div className="card-luxury rounded-xl overflow-hidden">
        <div className="p-6 border-b border-royal-500/20 flex items-center justify-between">
          <h2 className="text-lg font-display font-bold text-white">Recent Messages</h2>
          <a href="/admin/dashboard/messages" className="text-sm text-royal-400 hover:text-royal-300 transition-colors">View All →</a>
        </div>
        <div className="divide-y divide-royal-500/10">
          {recentMessages.length === 0 ? (
            <div className="p-6 text-center text-platinum-400">No messages yet</div>
          ) : (
            recentMessages.map((msg) => (
              <div key={msg.id} className="p-4 hover:bg-luxury-100 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white text-sm">{msg.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    msg.status === 'new' ? 'bg-emerald-500/20 text-emerald-400' :
                    msg.status === 'read' ? 'bg-gold-500/20 text-gold-400' :
                    'bg-royal-500/20 text-royal-400'
                  }`}>{msg.status}</span>
                </div>
                <div className="text-xs text-platinum-400 mb-1">{msg.email}</div>
                <div className="text-sm text-platinum-300 line-clamp-2">{msg.message}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a href="/admin/dashboard/projects" className="card-luxury p-6 rounded-xl hover:border-royal-500/50 transition-all text-center group">
          <FolderKanban className="mx-auto mb-3 text-royal-400 group-hover:scale-110 transition-transform" size={32} />
          <span className="text-white font-semibold">Manage Projects</span>
        </a>
        <a href="/admin/dashboard/blog" className="card-luxury p-6 rounded-xl hover:border-royal-500/50 transition-all text-center group">
          <FileText className="mx-auto mb-3 text-emerald-400 group-hover:scale-110 transition-transform" size={32} />
          <span className="text-white font-semibold">Write Blog Post</span>
        </a>
        <a href="/admin/dashboard/services" className="card-luxury p-6 rounded-xl hover:border-royal-500/50 transition-all text-center group">
          <Eye className="mx-auto mb-3 text-gold-400 group-hover:scale-110 transition-transform" size={32} />
          <span className="text-white font-semibold">Manage Services</span>
        </a>
      </div>
    </div>
  );
};

export default DashboardHome;

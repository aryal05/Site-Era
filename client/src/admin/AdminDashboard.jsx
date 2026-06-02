import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, FileText, MessageSquare, Star,
  Settings, LogOut, Plus, Edit, Trash2, Eye, Search, Filter,
  TrendingUp, Users, Mail, Award, X, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalMessages: 0,
    totalTestimonials: 0,
    totalBlogPosts: 0
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/admin');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [projectsRes, messagesRes, testimonialsRes, blogRes] = await Promise.all([
        api.get('/projects'),
        api.get('/messages'),
        api.get('/testimonials'),
        api.get('/blog')
      ]);

      setProjects(projectsRes.data);
      setMessages(messagesRes.data);
      setTestimonials(testimonialsRes.data);
      setBlogPosts(blogRes.data);

      setStats({
        totalProjects: projectsRes.data.length,
        totalMessages: messagesRes.data.length,
        totalTestimonials: testimonialsRes.data.length,
        totalBlogPosts: blogRes.data.length
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedItem(null);
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await api.delete(`/${type}/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete item');
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-luxury p-6 rounded-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-full bg-${color}-500/10 flex items-center justify-center`}>
          <Icon className={`text-${color}-500`} size={24} />
        </div>
        <TrendingUp className="text-emerald-500" size={20} />
      </div>
      <div className="text-3xl font-display font-bold gradient-luxury mb-1">{value}</div>
      <div className="text-platinum-400 text-sm">{title}</div>
    </motion.div>
  );

  const Sidebar = () => (
    <div className="w-64 bg-luxury-50 border-r border-royal-500/20 h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-royal-500/20">
        <h1 className="text-2xl font-display font-bold">
          <span className="gradient-royal">SITE</span>
          <span className="text-white"> ERA</span>
        </h1>
        <p className="text-platinum-400 text-sm mt-1">Admin Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {[
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'projects', icon: FolderKanban, label: 'Projects' },
          { id: 'blog', icon: FileText, label: 'Blog Posts' },
          { id: 'messages', icon: MessageSquare, label: 'Messages' },
          { id: 'testimonials', icon: Star, label: 'Testimonials' },
          { id: 'settings', icon: Settings, label: 'Settings' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id
                ? 'bg-royal-500/10 text-royal-400 border border-royal-500/30'
                : 'text-platinum-300 hover:bg-luxury-100 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-display font-semibold">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-royal-500/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-royal flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1">
            <div className="text-white font-display font-semibold text-sm">{user?.name || 'Admin'}</div>
            <div className="text-platinum-400 text-xs">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/30"
        >
          <LogOut size={18} />
          <span className="font-display font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FolderKanban} title="Total Projects" value={stats.totalProjects} color="royal" />
        <StatCard icon={MessageSquare} title="Messages" value={stats.totalMessages} color="gold" />
        <StatCard icon={Star} title="Testimonials" value={stats.totalTestimonials} color="emerald" />
        <StatCard icon={FileText} title="Blog Posts" value={stats.totalBlogPosts} color="royal" />
      </div>

      {/* Recent Messages */}
      <div className="card-luxury p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-white">Recent Messages</h2>
          <button
            onClick={() => setActiveTab('messages')}
            className="text-royal-400 hover:text-royal-300 text-sm font-semibold"
          >
            View All →
          </button>
        </div>
        <div className="space-y-4">
          {messages.slice(0, 5).map((message) => (
            <div key={message.id} className="glass-luxury p-4 rounded-lg border border-royal-500/20">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-white font-display font-semibold">{message.name}</div>
                  <div className="text-platinum-400 text-sm">{message.email}</div>
                </div>
                <div className="text-platinum-400 text-xs">
                  {new Date(message.created_at).toLocaleDateString()}
                </div>
              </div>
              <p className="text-platinum-300 text-sm line-clamp-2">{message.message}</p>
              {message.service && (
                <span className="inline-block mt-2 text-xs bg-royal-500/10 text-royal-400 px-2 py-1 rounded">
                  {message.service}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ProjectsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-bold text-white">Projects</h2>
        <button
          onClick={() => openModal('project')}
          className="btn-luxury text-white px-6 py-3 rounded-full font-display font-semibold flex items-center gap-2"
        >
          <Plus size={20} />
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="card-luxury p-6 rounded-xl group">
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-display font-bold text-white mb-2">{project.title}</h3>
            <p className="text-platinum-300 text-sm mb-4 line-clamp-2">{project.description}</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-royal-500/10 text-royal-400 px-2 py-1 rounded">
                {project.category}
              </span>
              {project.featured === 1 && (
                <span className="text-xs bg-gold-500/10 text-gold-400 px-2 py-1 rounded">
                  Featured
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openModal('project', project)}
                className="flex-1 bg-royal-500/10 text-royal-400 px-4 py-2 rounded-lg hover:bg-royal-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => handleDelete('projects', project.id)}
                className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MessagesView = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-bold text-white">Messages</h2>
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="card-luxury p-6 rounded-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xl font-display font-bold text-white">{message.name}</div>
                <div className="text-platinum-400">{message.email}</div>
                {message.phone && (
                  <div className="text-platinum-400 text-sm">{message.phone}</div>
                )}
              </div>
              <div className="text-right">
                <div className="text-platinum-400 text-sm">
                  {new Date(message.created_at).toLocaleDateString()}
                </div>
                {message.service && (
                  <span className="inline-block mt-2 text-xs bg-royal-500/10 text-royal-400 px-2 py-1 rounded">
                    {message.service}
                  </span>
                )}
              </div>
            </div>
            <p className="text-platinum-300 mb-4">{message.message}</p>
            {message.budget && (
              <div className="text-sm text-platinum-400">
                Budget: <span className="text-gold-500 font-semibold">{message.budget}</span>
              </div>
            )}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => handleDelete('messages', message.id)}
                className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TestimonialsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-bold text-white">Testimonials</h2>
        <button
          onClick={() => openModal('testimonial')}
          className="btn-luxury text-white px-6 py-3 rounded-full font-display font-semibold flex items-center gap-2"
        >
          <Plus size={20} />
          Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="card-luxury p-6 rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={testimonial.avatar_url}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <div className="text-lg font-display font-bold text-white">{testimonial.name}</div>
                <div className="text-platinum-400 text-sm">{testimonial.title}</div>
                <div className="text-platinum-400 text-sm">{testimonial.company}</div>
              </div>
            </div>
            <p className="text-platinum-300 mb-4">"{testimonial.quote}"</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <Star key={i} className="text-gold-500 fill-gold-500" size={16} />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal('testimonial', testimonial)}
                  className="bg-royal-500/10 text-royal-400 px-3 py-2 rounded-lg hover:bg-royal-500/20 transition-all"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete('testimonials', testimonial.id)}
                  className="bg-red-500/10 text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const BlogView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-bold text-white">Blog Posts</h2>
        <button
          onClick={() => openModal('blog')}
          className="btn-luxury text-white px-6 py-3 rounded-full font-display font-semibold flex items-center gap-2"
        >
          <Plus size={20} />
          Add Post
        </button>
      </div>

      <div className="space-y-4">
        {blogPosts.map((post) => (
          <div key={post.id} className="card-luxury p-6 rounded-xl flex gap-6">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-48 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-xl font-display font-bold text-white mb-2">{post.title}</h3>
              <p className="text-platinum-300 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-platinum-400">
                <span>{post.author}</span>
                <span>•</span>
                <span>{new Date(post.published_at).toLocaleDateString()}</span>
                <span>•</span>
                <span className="text-royal-400">{post.category}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => openModal('blog', post)}
                className="bg-royal-500/10 text-royal-400 px-4 py-2 rounded-lg hover:bg-royal-500/20 transition-all flex items-center gap-2"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => handleDelete('blog', post.id)}
                className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      
      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'projects' && 'Projects'}
            {activeTab === 'blog' && 'Blog Posts'}
            {activeTab === 'messages' && 'Messages'}
            {activeTab === 'testimonials' && 'Testimonials'}
            {activeTab === 'settings' && 'Settings'}
          </h1>
          <p className="text-platinum-400">
            Welcome back, {user?.name || 'Admin'}! Here's what's happening today.
          </p>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'projects' && <ProjectsView />}
        {activeTab === 'messages' && <MessagesView />}
        {activeTab === 'testimonials' && <TestimonialsView />}
        {activeTab === 'blog' && <BlogView />}
        {activeTab === 'settings' && (
          <div className="card-luxury p-8 rounded-xl">
            <h2 className="text-2xl font-display font-bold text-white mb-4">Settings</h2>
            <p className="text-platinum-300">Settings panel coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

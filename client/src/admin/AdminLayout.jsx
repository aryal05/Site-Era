import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, FileText, MessageSquareQuote,
  Mail, Layers, Users, Settings, LogOut, Menu, X, ChevronRight
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/admin/dashboard/projects', icon: FolderKanban },
    { name: 'Blog Posts', path: '/admin/dashboard/blog', icon: FileText },
    { name: 'Testimonials', path: '/admin/dashboard/testimonials', icon: MessageSquareQuote },
    { name: 'Messages', path: '/admin/dashboard/messages', icon: Mail },
    { name: 'Services', path: '/admin/dashboard/services', icon: Layers },
    { name: 'Team', path: '/admin/dashboard/team', icon: Users },
    { name: 'Settings', path: '/admin/dashboard/settings', icon: Settings },
  ];

  const currentPage = navItems.find(item => location.pathname === item.path)?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-black flex">
      {/* Desktop Sidebar */}
      <motion.aside
        className={`hidden md:flex flex-col fixed top-0 left-0 h-full bg-luxury-50 border-r border-royal-500/20 z-40 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-royal-500/20 flex items-center justify-between">
          {sidebarOpen && (
            <Link to="/" className="text-xl font-display font-bold">
              <span className="gradient-royal">SITE</span>
              <span className="text-white"> ERA</span>
            </Link>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-platinum-400 hover:text-white transition-colors">
            <Menu size={20} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 mx-2 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-royal-500/20 text-royal-400 border-l-2 border-royal-500'
                    : 'text-platinum-400 hover:text-white hover:bg-luxury-100'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-royal-400' : 'text-platinum-400 group-hover:text-white'} />
                {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-royal-500/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 h-full w-64 bg-luxury-50 border-r border-royal-500/20 z-50 md:hidden"
              initial={{ x: -264 }}
              animate={{ x: 0 }}
              exit={{ x: -264 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="p-6 border-b border-royal-500/20 flex items-center justify-between">
                <span className="text-xl font-display font-bold">
                  <span className="gradient-royal">SITE</span>
                  <span className="text-white"> ERA</span>
                </span>
                <button onClick={() => setMobileSidebarOpen(false)} className="text-platinum-400">
                  <X size={20} />
                </button>
              </div>
              <nav className="py-4">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-6 py-3 mx-2 rounded-lg transition-all ${
                        isActive ? 'bg-royal-500/20 text-royal-400' : 'text-platinum-400 hover:text-white hover:bg-luxury-100'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-royal-500/20">
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                  <LogOut size={20} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass-luxury border-b border-royal-500/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileSidebarOpen(true)} className="md:hidden text-white">
                <Menu size={24} />
              </button>
              <div>
                <h1 className="text-xl font-display font-bold text-white">{currentPage}</h1>
                <div className="flex items-center gap-1 text-xs text-platinum-400">
                  <span>Admin</span>
                  <ChevronRight size={12} />
                  <span className="text-royal-400">{currentPage}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-platinum-400 hover:text-royal-400 transition-colors">
                View Site →
              </Link>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-royal-500 to-gold-500 flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

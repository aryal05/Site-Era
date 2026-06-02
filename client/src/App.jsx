import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import CursorFollower from './components/ui/CursorFollower';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollProgress from './components/layout/ScrollProgress';
import ScrollToTop from './components/layout/ScrollToTop';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminLogin = lazy(() => import('./admin/AdminLogin'));

// Admin panel pages
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const DashboardHome = lazy(() => import('./admin/pages/DashboardHome'));
const ProjectsManager = lazy(() => import('./admin/pages/ProjectsManager'));
const BlogManager = lazy(() => import('./admin/pages/BlogManager'));
const TestimonialsManager = lazy(() => import('./admin/pages/TestimonialsManager'));
const MessagesManager = lazy(() => import('./admin/pages/MessagesManager'));
const ServicesManager = lazy(() => import('./admin/pages/ServicesManager'));
const TeamManager = lazy(() => import('./admin/pages/TeamManager'));
const SettingsManager = lazy(() => import('./admin/pages/SettingsManager'));

// Loading component
const Loading = () => (
  <div className="loading-screen">
    <div className="text-4xl font-display text-accent">Loading...</div>
  </div>
);

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <CursorFollower />
      <ScrollProgress />
      <div className="grain-overlay" />
      
      <Routes>
        {/* Public routes with Navbar and Footer */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/services/:slug" element={<ServiceDetail />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/portfolio/:id" element={<ProjectDetail />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <Footer />
            </>
          }
        />

        {/* Admin Login */}
        <Route
          path="/admin"
          element={
            <Suspense fallback={<Loading />}>
              <AdminLogin />
            </Suspense>
          }
        />

        {/* Admin Dashboard with nested routes */}
        <Route
          path="/admin/dashboard/*"
          element={
            <Suspense fallback={<Loading />}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="blog" element={<BlogManager />} />
          <Route path="testimonials" element={<TestimonialsManager />} />
          <Route path="messages" element={<MessagesManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="team" element={<TeamManager />} />
          <Route path="settings" element={<SettingsManager />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

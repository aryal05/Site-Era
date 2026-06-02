import connectDB from './lib/db.js';
import Project from './models/Project.js';
import Service from './models/Service.js';
import Blog from './models/Blog.js';
import Team from './models/Team.js';
import Testimonial from './models/Testimonial.js';
import Settings from './models/Settings.js';
import User from './models/User.js';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Clear existing data
    await Promise.all([
      Project.deleteMany({}),
      Service.deleteMany({}),
      Blog.deleteMany({}),
      Team.deleteMany({}),
      Testimonial.deleteMany({}),
      Settings.deleteMany({}),
      User.deleteMany({})
    ]);

    // Create Admin User
    const admin = new User({
      username: 'admin',
      password: 'admin123'
    });
    await admin.save();

    // Create Settings
    const settings = new Settings({
      siteName: 'Site Era',
      tagline: 'Premium Web & Mobile App Development',
      description: 'We transform ideas into exceptional digital experiences',
      email: 'contact@siteera.com',
      phone: '+1 (555) 123-4567',
      address: '123 Tech Street, San Francisco, CA 94102',
      social: {
        facebook: 'https://facebook.com/siteera',
        twitter: 'https://twitter.com/siteera',
        instagram: 'https://instagram.com/siteera',
        linkedin: 'https://linkedin.com/company/siteera',
        github: 'https://github.com/siteera'
      },
      hero: {
        title: 'Transform Your Digital Presence',
        subtitle: 'Premium Web & Mobile App Development',
        description: 'We craft exceptional digital experiences that drive results and help businesses grow in the digital age.',
        ctaText: 'Start Your Project',
        ctaLink: '/contact'
      },
      about: {
        title: 'Who We Are',
        description: 'Site Era is a full-service digital agency specializing in web and mobile application development. With over 5 years of experience, we have helped 50+ businesses transform their digital presence.',
        stats: [
          { label: 'Projects Completed', value: '150+', icon: 'briefcase' },
          { label: 'Happy Clients', value: '50+', icon: 'users' },
          { label: 'Team Members', value: '12', icon: 'user' },
          { label: 'Years Experience', value: '5+', icon: 'calendar' }
        ]
      },
      cta: {
        title: 'Ready to Start Your Project?',
        description: 'Let us help you turn your ideas into reality. Get a free consultation today.',
        buttonText: 'Get Free Consultation'
      },
      footer: {
        copyright: '© 2024 Site Era. All rights reserved.',
        description: 'Premium web and mobile app development company helping businesses grow digitally.'
      }
    });
    await settings.save();

    // Create Services
    const services = await Service.create([
      {
        title: 'Web Development',
        slug: 'web-development',
        shortDescription: 'Custom websites built with modern technologies',
        description: 'We build fast, responsive, and scalable web applications using the latest technologies. From simple landing pages to complex web applications, we deliver exceptional results.',
        icon: 'globe',
        features: [
          { title: 'Custom Design', description: 'Unique designs tailored to your brand', icon: 'palette' },
          { title: 'Responsive', description: 'Works perfectly on all devices', icon: 'smartphone' },
          { title: 'SEO Optimized', description: 'Built for search engine visibility', icon: 'search' },
          { title: 'Fast Performance', description: 'Optimized for speed and performance', icon: 'zap' }
        ],
        process: [
          { step: 1, title: 'Discovery', description: 'Understanding your requirements' },
          { step: 2, title: 'Design', description: 'Creating beautiful mockups' },
          { step: 3, title: 'Development', description: 'Building your application' },
          { step: 4, title: 'Launch', description: 'Deploying to production' }
        ],
        technologies: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS'],
        pricing: {
          basic: { name: 'Starter', price: '$2,999', features: ['5 Pages', 'Responsive Design', 'Basic SEO', '1 Month Support'] },
          standard: { name: 'Business', price: '$5,999', features: ['10 Pages', 'CMS Integration', 'Advanced SEO', '3 Months Support', 'Analytics Setup'] },
          premium: { name: 'Enterprise', price: '$9,999+', features: ['Unlimited Pages', 'Custom Features', 'E-commerce', '6 Months Support', 'Priority Support'] }
        },
        faq: [
          { question: 'How long does it take?', answer: 'Typically 2-8 weeks depending on complexity.' },
          { question: 'Do you provide hosting?', answer: 'Yes, we can recommend and set up hosting for you.' }
        ],
        featured: true,
        order: 1
      },
      {
        title: 'Mobile App Development',
        slug: 'mobile-app-development',
        shortDescription: 'Native and cross-platform mobile apps',
        description: 'We create beautiful, high-performance mobile applications for iOS and Android using React Native and Flutter.',
        icon: 'smartphone',
        features: [
          { title: 'Cross-Platform', description: 'One codebase, both platforms', icon: 'layers' },
          { title: 'Native Performance', description: 'Smooth 60fps animations', icon: 'activity' },
          { title: 'Offline Support', description: 'Works without internet', icon: 'wifi-off' }
        ],
        technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
        featured: true,
        order: 2
      },
      {
        title: 'UI/UX Design',
        slug: 'ui-ux-design',
        shortDescription: 'Beautiful and intuitive user interfaces',
        description: 'We design user-centered interfaces that are both beautiful and functional, ensuring great user experiences.',
        icon: 'pen-tool',
        featured: true,
        order: 3
      },
      {
        title: 'Digital Marketing',
        slug: 'digital-marketing',
        shortDescription: 'Grow your online presence',
        description: 'Comprehensive digital marketing services including SEO, social media marketing, and paid advertising.',
        icon: 'trending-up',
        order: 4
      },
      {
        title: 'E-commerce Solutions',
        slug: 'ecommerce-solutions',
        shortDescription: 'Online stores that convert',
        description: 'Custom e-commerce solutions built with Shopify, WooCommerce, or custom platforms.',
        icon: 'shopping-cart',
        order: 5
      },
      {
        title: 'Cloud Solutions',
        slug: 'cloud-solutions',
        shortDescription: 'Scalable cloud infrastructure',
        description: 'Cloud architecture, migration, and management services using AWS, Azure, or Google Cloud.',
        icon: 'cloud',
        order: 6
      }
    ]);

    // Create Projects
    const projects = await Project.create([
      {
        title: 'E-commerce Platform Redesign',
        slug: 'ecommerce-platform-redesign',
        description: 'Complete redesign of a major e-commerce platform resulting in 40% increase in conversions.',
        fullDescription: 'We completely redesigned the user experience of a major e-commerce platform, implementing a modern design system, optimizing the checkout process, and improving site performance. The result was a 40% increase in conversions and 25% reduction in cart abandonment.',
        category: 'Web Development',
        image: '',
        gallery: [],
        technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Redis'],
        client: 'Fashion Retail Co.',
        duration: '3 months',
        link: 'https://example.com',
        featured: true,
        order: 1,
        status: 'completed'
      },
      {
        title: 'Fitness Tracking Mobile App',
        slug: 'fitness-tracking-app',
        description: 'Cross-platform mobile app for tracking workouts and nutrition with social features.',
        fullDescription: 'A comprehensive fitness tracking application built with React Native. Features include workout logging, nutrition tracking, progress photos, social sharing, and integration with wearable devices.',
        category: 'Mobile App',
        technologies: ['React Native', 'Firebase', 'HealthKit', 'Google Fit'],
        client: 'FitLife Inc.',
        duration: '4 months',
        featured: true,
        order: 2,
        status: 'completed'
      },
      {
        title: 'Real Estate Listing Platform',
        slug: 'real-estate-platform',
        description: 'Property listing and management platform with virtual tours and mortgage calculators.',
        category: 'Web Development',
        technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
        featured: true,
        order: 3,
        status: 'completed'
      },
      {
        title: 'Healthcare Dashboard',
        slug: 'healthcare-dashboard',
        description: 'HIPAA-compliant patient management dashboard for healthcare providers.',
        category: 'Web Development',
        technologies: ['React', 'TypeScript', 'Python', 'PostgreSQL'],
        order: 4,
        status: 'completed'
      },
      {
        title: 'Food Delivery App',
        slug: 'food-delivery-app',
        description: 'On-demand food delivery application with real-time tracking.',
        category: 'Mobile App',
        technologies: ['Flutter', 'Firebase', 'Google Maps API'],
        order: 5,
        status: 'in-progress'
      },
      {
        title: 'Fintech Trading Platform',
        slug: 'fintech-trading-platform',
        description: 'Real-time stock trading platform with advanced charting and analytics.',
        category: 'Web Development',
        technologies: ['Next.js', 'WebSocket', 'D3.js', 'Node.js'],
        order: 6,
        status: 'completed'
      }
    ]);

    // Create Team
    const team = await Team.create([
      {
        name: 'Rajat Aryal',
        role: 'Founder & CEO',
        shortBio: 'Visionary leader with 10+ years in tech',
        bio: 'Rajat founded Site Era with a vision to help businesses succeed digitally. With over a decade of experience in software development and business strategy, he leads the company towards innovation and excellence.',
        skills: [
          { name: 'Strategic Planning', level: 95 },
          { name: 'Team Leadership', level: 90 },
          { name: 'Business Development', level: 85 }
        ],
        social: { linkedin: '#', twitter: '#', github: '#' },
        featured: true,
        order: 1,
        active: true
      },
      {
        name: 'Sarah Chen',
        role: 'Lead Designer',
        shortBio: 'Award-winning UI/UX designer',
        bio: 'Sarah brings creativity and user-centered design principles to every project. Her designs have won multiple awards and have been featured in design publications.',
        skills: [
          { name: 'UI Design', level: 98 },
          { name: 'UX Research', level: 90 },
          { name: 'Prototyping', level: 95 }
        ],
        social: { linkedin: '#', twitter: '#', dribbble: '#' },
        featured: true,
        order: 2,
        active: true
      },
      {
        name: 'Michael Rodriguez',
        role: 'Senior Developer',
        shortBio: 'Full-stack expert and tech lead',
        bio: 'Michael is a full-stack developer with expertise in modern web technologies. He leads the development team and ensures code quality and best practices.',
        skills: [
          { name: 'React/Next.js', level: 95 },
          { name: 'Node.js', level: 90 },
          { name: 'Database Design', level: 85 }
        ],
        social: { linkedin: '#', github: '#' },
        featured: true,
        order: 3,
        active: true
      },
      {
        name: 'Emily Watson',
        role: 'Project Manager',
        shortBio: 'Certified PMP with 8 years experience',
        bio: 'Emily ensures projects are delivered on time and within budget. Her excellent communication skills keep clients informed and teams aligned.',
        skills: [
          { name: 'Project Management', level: 95 },
          { name: 'Agile/Scrum', level: 90 },
          { name: 'Client Relations', level: 92 }
        ],
        social: { linkedin: '#' },
        order: 4,
        active: true
      }
    ]);

    // Create Testimonials
    const testimonials = await Testimonial.create([
      {
        name: 'John Davidson',
        role: 'CEO',
        company: 'TechStart Inc.',
        content: 'Site Era transformed our outdated website into a modern, high-converting platform. Their attention to detail and technical expertise exceeded our expectations.',
        rating: 5,
        featured: true,
        order: 1
      },
      {
        name: 'Amanda Liu',
        role: 'Marketing Director',
        company: 'GrowthLabs',
        content: 'Working with Site Era was a game-changer for our business. They delivered our mobile app on time and it has received amazing feedback from our users.',
        rating: 5,
        featured: true,
        order: 2
      },
      {
        name: 'Robert Taylor',
        role: 'Founder',
        company: 'ShopLocal',
        content: 'The e-commerce platform Site Era built for us increased our online sales by 200%. Professional team, excellent communication, outstanding results.',
        rating: 5,
        featured: true,
        order: 3
      }
    ]);

    // Create Blog Posts
    const blog = await Blog.create([
      {
        title: 'The Future of Web Development in 2024',
        slug: 'future-of-web-development-2024',
        excerpt: 'Explore the latest trends shaping the future of web development including AI integration, WebAssembly, and edge computing.',
        content: '<p>The web development landscape is constantly evolving...</p>',
        author: { name: 'Michael Rodriguez', bio: 'Senior Developer at Site Era' },
        category: 'Technology',
        tags: ['Web Development', 'Trends', 'AI', '2024'],
        readTime: '5 min',
        published: true,
        featured: true
      },
      {
        title: 'Why Your Business Needs a Mobile App',
        slug: 'why-business-needs-mobile-app',
        excerpt: 'Mobile apps are no longer optional. Learn how a mobile app can transform your customer engagement and boost revenue.',
        content: '<p>In today\'s mobile-first world...</p>',
        author: { name: 'Rajat Aryal', bio: 'Founder & CEO at Site Era' },
        category: 'Business',
        tags: ['Mobile App', 'Business Growth', 'Digital Strategy'],
        readTime: '4 min',
        published: true
      },
      {
        title: 'UI/UX Design Principles That Convert',
        slug: 'ui-ux-design-principles-that-convert',
        excerpt: 'Discover the design principles that turn visitors into customers. From color psychology to micro-interactions.',
        content: '<p>Good design is invisible...</p>',
        author: { name: 'Sarah Chen', bio: 'Lead Designer at Site Era' },
        category: 'Design',
        tags: ['UI/UX', 'Conversion', 'Design Principles'],
        readTime: '6 min',
        published: true
      }
    ]);

    return res.status(200).json({
      message: 'Database seeded successfully!',
      data: {
        admin: { username: 'admin', password: 'admin123' },
        services: services.length,
        projects: projects.length,
        team: team.length,
        testimonials: testimonials.length,
        blog: blog.length,
        settings: 'Created'
      }
    });
  } catch (error) {
    console.error('Seed error:', error);
    return res.status(500).json({ error: error.message });
  }
}

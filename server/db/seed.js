const db = require('./database');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const seed = async () => {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  const adminExists = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(process.env.ADMIN_EMAIL);
  
  if (!adminExists) {
    db.prepare('INSERT INTO admin_users (email, password) VALUES (?, ?)').run(
      process.env.ADMIN_EMAIL,
      hashedPassword
    );
    console.log('✅ Admin user created');
  }

  // Seed projects
  const projects = [
    {
      title: 'NepalPay Dashboard',
      slug: 'nepalpay-dashboard',
      category: 'web',
      description: 'A comprehensive fintech web application for digital payments and financial management in Nepal.',
      tech_stack: JSON.stringify(['React', 'Node.js', 'PostgreSQL', 'Stripe']),
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      live_url: 'https://nepalpay.example.com',
      github_url: '',
      client: 'NepalPay Financial Services Pvt. Ltd.',
      challenge: 'NepalPay needed a modern, secure platform to handle thousands of daily transactions while providing an intuitive interface for users of all technical levels. The system needed to integrate with multiple payment gateways and comply with strict financial regulations.',
      solution: 'We developed a robust React-based dashboard with real-time transaction monitoring, advanced security features including 2FA and encryption, and seamless integration with local payment gateways like eSewa and Khalti. The backend uses Node.js with PostgreSQL for reliable data handling.',
      results: 'The platform now processes 10,000+ daily transactions with 99.9% uptime. User satisfaction increased by 87%, and transaction processing time decreased from 45 seconds to under 5 seconds. The company saved NPR 2M annually in manual processing costs.',
      featured: 1,
      sort_order: 1
    },
    {
      title: 'ShopKo Mobile',
      slug: 'shopko-mobile',
      category: 'mobile',
      description: 'E-commerce mobile app for iOS and Android with seamless shopping experience.',
      tech_stack: JSON.stringify(['React Native', 'Stripe', 'Firebase', 'Redux']),
      image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      live_url: '',
      github_url: '',
      client: 'ShopKo Retail Pvt. Ltd.',
      challenge: 'ShopKo wanted to expand from their web platform to mobile, requiring a native app experience that would work seamlessly on both iOS and Android. They needed offline cart functionality, push notifications, and integration with their existing inventory system.',
      solution: 'Built using React Native for cross-platform compatibility, we created a beautiful, performant app with offline-first architecture using Redux Persist. Integrated Firebase for real-time inventory updates and push notifications. Payment processing through Stripe and local Nepali payment gateways.',
      results: 'App launched with 50K+ downloads in first month. Mobile sales increased by 230% within 3 months. Average order value increased by 45% due to improved UX. App Store rating: 4.8/5 stars with 2000+ reviews.',
      featured: 1,
      sort_order: 2
    },
    {
      title: 'TrekNepal',
      slug: 'treknepal',
      category: 'web',
      description: 'Tourism booking platform connecting travelers with authentic Nepali experiences.',
      tech_stack: JSON.stringify(['Next.js', 'MongoDB', 'Tailwind CSS', 'Stripe']),
      image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
      live_url: 'https://treknepal.example.com',
      github_url: '',
      client: 'TrekNepal Adventures',
      challenge: 'TrekNepal needed a modern booking platform to replace their outdated system. They required multi-language support (English, Nepali, Chinese), real-time availability tracking for 500+ tours, and integration with multiple payment processors to serve international clients.',
      solution: 'Developed with Next.js for SEO optimization and fast page loads. Implemented MongoDB for flexible data storage and real-time availability tracking. Added i18n for multi-language support, integrated Stripe for international payments and Khalti for domestic payments. Built admin panel for tour operators to manage bookings.',
      results: 'Bookings increased by 340% in first 6 months. International bookings grew from 20% to 65% of total revenue. Average booking time reduced from 15 minutes to 3 minutes. Platform now handles 1000+ bookings monthly.',
      featured: 1,
      sort_order: 3
    },
    {
      title: 'MedConnect',
      slug: 'medconnect',
      category: 'mobile',
      description: 'Healthcare appointment booking app connecting patients with doctors.',
      tech_stack: JSON.stringify(['Flutter', 'Firebase', 'Node.js', 'Socket.io']),
      image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      live_url: '',
      github_url: '',
      client: 'MedConnect Healthcare Network',
      challenge: 'Healthcare providers needed a HIPAA-compliant telemedicine solution that would allow patients to book appointments, access medical records, and conduct video consultations. The system needed to work reliably in areas with poor internet connectivity.',
      solution: 'Built native mobile app using Flutter for optimal performance on both platforms. Implemented end-to-end encryption for patient data, integrated WebRTC for video consultations, and used Socket.io for real-time notifications. Offline mode allows viewing past prescriptions without internet.',
      results: 'App serves 20+ hospitals and 500+ doctors. Processed 15,000+ consultations in first year. Patient wait times reduced by 70%. Doctor utilization increased by 55%. Won "Best Healthcare App 2023" award in Nepal.',
      featured: 1,
      sort_order: 4
    },
    {
      title: 'CloudERP',
      slug: 'clouderp',
      category: 'web',
      description: 'Enterprise resource planning system for modern businesses.',
      tech_stack: JSON.stringify(['Vue.js', 'Laravel', 'MySQL', 'Redis']),
      image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      live_url: 'https://clouderp.example.com',
      github_url: '',
      client: 'Multi-Industry Clients',
      challenge: 'SMEs in Nepal lacked affordable, customizable ERP solutions. They needed a system to manage inventory, accounting, HR, and sales in one platform, with the flexibility to adapt to different business types.',
      solution: 'Developed modular ERP system using Vue.js frontend and Laravel backend. Created plugin architecture allowing custom modules. Integrated with popular Nepali accounting software and tax systems. Built role-based access control with granular permissions.',
      results: 'Deployed to 50+ businesses across manufacturing, retail, and services sectors. Clients report 40% reduction in administrative overhead. Inventory accuracy improved from 75% to 98%. System processes NPR 500M+ in transactions monthly.',
      featured: 0,
      sort_order: 5
    },
    {
      title: 'FoodRush',
      slug: 'foodrush',
      category: 'mobile',
      description: 'Food delivery platform with real-time tracking and seamless ordering.',
      tech_stack: JSON.stringify(['React Native', 'Node.js', 'Socket.io', 'MongoDB']),
      image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      live_url: '',
      github_url: '',
      client: 'FoodRush Delivery Services',
      challenge: 'Entering competitive food delivery market required differentiation through superior user experience, real-time tracking, and efficient delivery routing. System needed to handle peak loads of 1000+ concurrent orders.',
      solution: 'Built three interconnected apps (Customer, Delivery Partner, Restaurant) using React Native. Implemented Google Maps API for real-time tracking and optimal route calculation. Used Socket.io for live order updates. MongoDB for flexible menu management across diverse restaurants.',
      results: 'Partnered with 200+ restaurants in Kathmandu valley. Processes 5000+ daily orders. Average delivery time: 28 minutes (industry best). Customer retention rate: 78%. Delivery partners earn 35% more than competitors.',
      featured: 0,
      sort_order: 6
    },
    {
      title: 'EduLearn Platform',
      slug: 'edulearn-platform',
      category: 'web',
      description: 'Online learning management system for schools and coaching centers.',
      tech_stack: JSON.stringify(['React', 'Django', 'PostgreSQL', 'AWS']),
      image_url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800',
      live_url: 'https://edulearn.example.com',
      github_url: '',
      client: 'Multiple Educational Institutions',
      challenge: 'Educational institutions needed a comprehensive LMS for online classes, assignments, exams, and progress tracking during and post-pandemic. Required support for live classes with 500+ concurrent students.',
      solution: 'Developed scalable LMS using React and Django. Integrated Zoom API for live classes, built custom video player for recorded content. Created automated grading system for MCQ exams. Implemented analytics dashboard for teachers and parents.',
      results: 'Adopted by 25 schools and 50+ coaching centers. Serves 10,000+ students. 95% attendance rate for online classes. Teachers report 60% time savings on grading. Student performance tracking improved parent engagement by 80%.',
      featured: 0,
      sort_order: 7
    },
    {
      title: 'AgriMarket',
      slug: 'agrimarket',
      category: 'mobile',
      description: 'Marketplace connecting farmers directly with buyers, eliminating middlemen.',
      tech_stack: JSON.stringify(['Flutter', 'Node.js', 'PostgreSQL', 'Redis']),
      image_url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
      live_url: '',
      github_url: '',
      client: 'AgriMarket Nepal',
      challenge: 'Farmers in rural Nepal struggled with pricing transparency and market access. App needed to work in low-connectivity areas, support local languages, and handle seasonal demand spikes. Payment system needed to accommodate farmers unfamiliar with digital payments.',
      solution: 'Built Flutter app with extensive offline capabilities. Multi-language support (Nepali, Maithili, Bhojpuri). Integrated SMS-based OTP for farmers without smartphones. Created simple video-based product listing. Implemented escrow payment system for buyer/seller protection.',
      results: 'Onboarded 5,000+ farmers from 40 districts. Farmers income increased by 35% by eliminating middlemen. Processed NPR 50M+ in transactions. Featured in national agriculture policy as model digital solution.',
      featured: 0,
      sort_order: 8
    },
    {
      title: 'RealEstate Pro',
      slug: 'realestate-pro',
      category: 'web',
      description: 'Property listing and management platform for real estate agencies.',
      tech_stack: JSON.stringify(['Next.js', 'Express', 'MongoDB', 'Cloudinary']),
      image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
      live_url: 'https://realestatepro.example.com',
      github_url: '',
      client: 'Nepal Realty Network',
      challenge: 'Real estate agencies needed modern platform to showcase properties with virtual tours, mortgage calculators, and lead management. Required integration with property valuation APIs and mapping services.',
      solution: 'Built with Next.js for SEO-optimized property pages. Integrated 360° virtual tour capability using Matterport. Implemented advanced search with filters for location, price, amenities. Built CRM for agents to manage leads and follow-ups. Cloudinary for optimized image delivery.',
      results: 'Platform hosts 5,000+ property listings. 200+ registered agencies. Generates 3,000+ qualified leads monthly. Average time-to-sale reduced from 90 to 45 days. Virtual tours increased property inquiries by 150%.',
      featured: 0,
      sort_order: 9
    },
    {
      title: 'FitLife Tracker',
      slug: 'fitlife-tracker',
      category: 'mobile',
      description: 'Fitness and wellness app with workout tracking and meal planning.',
      tech_stack: JSON.stringify(['React Native', 'Firebase', 'TensorFlow', 'HealthKit']),
      image_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
      live_url: '',
      github_url: '',
      client: 'FitLife Wellness Center',
      challenge: 'Gyms needed an app to provide value beyond physical facilities. Required workout tracking, meal planning, progress photos, and social features. Needed integration with wearables and health apps.',
      solution: 'Built React Native app with AI-powered workout recommendations using TensorFlow Lite. Integrated HealthKit (iOS) and Google Fit (Android) for health data. Implemented social features for motivation and challenges. Built nutrition database of Nepali foods.',
      results: 'Downloaded by 30,000+ users. Gym membership retention increased from 60% to 85%. Users spend avg 25 minutes daily in app. Featured as "App of the Day" on App Store. 4.9★ rating with 5,000+ reviews.',
      featured: 0,
      sort_order: 10
    },
    {
      title: 'EventHub Nepal',
      slug: 'eventhub-nepal',
      category: 'web',
      description: 'Event management and ticketing platform for concerts, festivals, and conferences.',
      tech_stack: JSON.stringify(['React', 'Node.js', 'MongoDB', 'Stripe', 'SendGrid']),
      image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
      live_url: 'https://eventhub.example.com',
      github_url: '',
      client: 'EventHub Pvt. Ltd.',
      challenge: 'Event organizers lacked integrated platform for ticketing, marketing, and attendee management. Needed QR-based check-in system, dynamic pricing, and anti-fraud measures for high-demand events.',
      solution: 'Developed comprehensive event platform with React frontend and Node.js backend. Implemented QR code generation and validation for contactless check-in. Built dynamic pricing engine for early-bird and last-minute sales. Integrated email marketing for attendees.',
      results: 'Powered 500+ events including major music festivals. Sold 100,000+ tickets worth NPR 150M+. Eliminated ticket fraud with QR validation. Organizers report 70% time savings in event management. Platform fee competitive with international alternatives.',
      featured: 0,
      sort_order: 11
    },
    {
      title: 'NepalStock Tracker',
      slug: 'nepalstock-tracker',
      category: 'mobile',
      description: 'Real-time stock market tracking and portfolio management for NEPSE.',
      tech_stack: JSON.stringify(['Flutter', 'Python', 'Redis', 'WebSocket']),
      image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
      live_url: '',
      github_url: '',
      client: 'Independent Project / Public Use',
      challenge: 'Investors lacked real-time NEPSE stock data in mobile format. Needed live price updates, portfolio tracking, technical analysis tools, and price alerts. Had to scrape data from limited official sources.',
      solution: 'Built Flutter app with Python backend scraping NEPSE data. Implemented WebSocket for real-time price updates. Used Redis for caching to handle 10,000+ concurrent users. Created custom charting library for technical analysis. Push notifications for price alerts.',
      results: 'Most popular stock tracking app in Nepal with 50,000+ active users. Processes 1M+ API requests daily. Featured in major Nepali financial news outlets. Users report making better investment decisions with real-time data. Monetized through premium features.',
      featured: 0,
      sort_order: 12
    }
  ];

  projects.forEach(project => {
    const exists = db.prepare('SELECT * FROM projects WHERE slug = ?').get(project.slug);
    if (!exists) {
      db.prepare(`
        INSERT INTO projects (title, slug, category, description, tech_stack, image_url, live_url, github_url, client, challenge, solution, results, featured, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        project.title,
        project.slug,
        project.category,
        project.description,
        project.tech_stack,
        project.image_url,
        project.live_url,
        project.github_url,
        project.client,
        project.challenge,
        project.solution,
        project.results,
        project.featured,
        project.sort_order
      );
    }
  });
  console.log('✅ Projects seeded');

  // Seed testimonials
  const testimonials = [
    {
      name: 'Rajesh Sharma',
      title: 'CEO',
      company: 'TrekNepal Pvt. Ltd.',
      avatar_url: 'https://i.pravatar.cc/150?img=12',
      quote: 'Site Era transformed our entire online presence. The attention to detail and speed of delivery was unlike any agency we\'ve worked with.',
      stars: 5,
      active: 1
    },
    {
      name: 'Priya Thapa',
      title: 'Founder',
      company: 'ShopKo',
      avatar_url: 'https://i.pravatar.cc/150?img=45',
      quote: 'Working with Rajat and his team was a game-changer for our business. They delivered a mobile app that exceeded all our expectations.',
      stars: 5,
      active: 1
    },
    {
      name: 'Amit Gurung',
      title: 'CTO',
      company: 'NepalPay',
      avatar_url: 'https://i.pravatar.cc/150?img=33',
      quote: 'The technical expertise and professionalism of Site Era is unmatched. They built a complex fintech platform that handles thousands of transactions daily.',
      stars: 5,
      active: 1
    }
  ];

  testimonials.forEach(testimonial => {
    const exists = db.prepare('SELECT * FROM testimonials WHERE name = ? AND company = ?').get(testimonial.name, testimonial.company);
    if (!exists) {
      db.prepare(`
        INSERT INTO testimonials (name, title, company, avatar_url, quote, stars, active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        testimonial.name,
        testimonial.title,
        testimonial.company,
        testimonial.avatar_url,
        testimonial.quote,
        testimonial.stars,
        testimonial.active
      );
    }
  });
  console.log('✅ Testimonials seeded');

  // Seed settings
  const settings = [
    { key: 'phone', value: '+977-9762454572' },
    { key: 'email', value: 'hello@siteera.com.np' },
    { key: 'address', value: 'Kathmandu, Bagmati Province, Nepal' },
    { key: 'facebook', value: 'https://facebook.com/siteera' },
    { key: 'twitter', value: 'https://twitter.com/siteera' },
    { key: 'linkedin', value: 'https://linkedin.com/company/siteera' },
    { key: 'github', value: 'https://github.com/siteera' }
  ];

  settings.forEach(setting => {
    const exists = db.prepare('SELECT * FROM settings WHERE key = ?').get(setting.key);
    if (!exists) {
      db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run(setting.key, setting.value);
    }
  });
  console.log('✅ Settings seeded');

  // Seed blog posts
  const blogPosts = [
    {
      title: 'The Future of Web Development in Nepal',
      slug: 'future-of-web-development-nepal',
      category: 'Technology',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      content: '<h2>Introduction</h2><p>The web development landscape in Nepal is rapidly evolving...</p><h2>Key Trends</h2><p>Modern frameworks like React and Next.js are becoming increasingly popular...</p>',
      excerpt: 'Exploring the emerging trends and opportunities in Nepal\'s web development industry.',
      meta_description: 'Discover the future of web development in Nepal with insights on modern frameworks, tools, and opportunities.',
      tags: JSON.stringify(['Web Development', 'Nepal', 'Technology']),
      published: 1,
      author: 'Rajat Aryal'
    },
    {
      title: '10 Essential UI/UX Principles for Modern Apps',
      slug: '10-essential-ui-ux-principles',
      category: 'Design',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      content: '<h2>1. User-Centered Design</h2><p>Always put your users first...</p><h2>2. Consistency</h2><p>Maintain consistent design patterns...</p>',
      excerpt: 'Learn the fundamental principles that make great user experiences.',
      meta_description: 'Master the essential UI/UX principles for creating modern, user-friendly applications.',
      tags: JSON.stringify(['UI/UX', 'Design', 'Best Practices']),
      published: 1,
      author: 'Site Era Team'
    }
  ];

  blogPosts.forEach(post => {
    const exists = db.prepare('SELECT * FROM blog_posts WHERE slug = ?').get(post.slug);
    if (!exists) {
      db.prepare(`
        INSERT INTO blog_posts (title, slug, category, thumbnail, content, excerpt, meta_description, tags, published, author)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        post.title,
        post.slug,
        post.category,
        post.thumbnail,
        post.content,
        post.excerpt,
        post.meta_description,
        post.tags,
        post.published,
        post.author
      );
    }
  });
  console.log('✅ Blog posts seeded');

  // Seed services
  const services = [
    {
      title: 'Web Development',
      slug: 'web-development',
      description: 'We build lightning-fast, SEO-optimized websites and web applications that convert visitors into customers. From simple landing pages to complex enterprise solutions.',
      icon: 'Code',
      tagline: 'Powerful, Scalable Web Applications',
      features: JSON.stringify([
        { title: 'Custom Web Applications', description: 'Tailored solutions built from scratch' },
        { title: 'Progressive Web Apps', description: 'App-like experience in the browser' },
        { title: 'E-Commerce Platforms', description: 'Full online store solutions' },
        { title: 'CMS Integration', description: 'Easy content management' },
        { title: 'API Development', description: 'Robust backend services' },
        { title: 'Performance Optimization', description: 'Lightning-fast load times' }
      ]),
      technologies: JSON.stringify(['React', 'Next.js', 'Vue.js', 'Node.js', 'Laravel', 'Django', 'PostgreSQL', 'MongoDB']),
      process_steps: JSON.stringify([
        { number: '01', title: 'Discovery', description: 'Understanding your goals, audience, and requirements' },
        { number: '02', title: 'Planning', description: 'Creating wireframes, architecture, and project timeline' },
        { number: '03', title: 'Design', description: 'Crafting beautiful, user-centered interfaces' },
        { number: '04', title: 'Development', description: 'Building with clean code and best practices' },
        { number: '05', title: 'Testing', description: 'Rigorous QA across devices and browsers' },
        { number: '06', title: 'Launch', description: 'Deployment, monitoring, and optimization' }
      ]),
      pricing: JSON.stringify([
        { name: 'Basic', price: 'NPR 50,000', features: ['5-10 Pages', 'Responsive Design', 'Contact Form', 'Basic SEO', '1 Month Support'] },
        { name: 'Professional', price: 'NPR 150,000', features: ['15-25 Pages', 'Custom Design', 'CMS Integration', 'Advanced SEO', 'E-Commerce Ready', '3 Months Support'], popular: true },
        { name: 'Enterprise', price: 'Custom', features: ['Unlimited Pages', 'Custom Features', 'API Integration', 'Performance Optimization', 'Dedicated Support', '12 Months Support'] }
      ]),
      sort_order: 1, visible: 1
    },
    {
      title: 'Mobile App Development',
      slug: 'mobile-app-development',
      description: 'Create stunning mobile experiences for iOS and Android. We build apps that users love, with smooth animations, intuitive interfaces, and robust functionality.',
      icon: 'Smartphone',
      tagline: 'Native & Cross-Platform Excellence',
      features: JSON.stringify([
        { title: 'iOS & Android Apps', description: 'Native performance on both platforms' },
        { title: 'Cross-Platform Development', description: 'One codebase, multiple platforms' },
        { title: 'App Store Optimization', description: 'Maximize visibility and downloads' },
        { title: 'Push Notifications', description: 'Engage users with timely alerts' },
        { title: 'Offline Functionality', description: 'Works without internet connection' },
        { title: 'App Maintenance', description: 'Regular updates and bug fixes' }
      ]),
      technologies: JSON.stringify(['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'AWS Amplify']),
      process_steps: JSON.stringify([
        { number: '01', title: 'Concept', description: 'Defining app features and user flows' },
        { number: '02', title: 'Design', description: 'Creating pixel-perfect UI/UX' },
        { number: '03', title: 'Development', description: 'Building native or cross-platform apps' },
        { number: '04', title: 'Testing', description: 'Comprehensive testing on real devices' },
        { number: '05', title: 'Deployment', description: 'App Store and Play Store submission' },
        { number: '06', title: 'Support', description: 'Updates, bug fixes, and new features' }
      ]),
      pricing: JSON.stringify([
        { name: 'Basic', price: 'NPR 100,000', features: ['Single Platform', 'Basic Features', 'Standard UI', '1 Month Support'] },
        { name: 'Professional', price: 'NPR 300,000', features: ['iOS & Android', 'Advanced Features', 'Custom Design', 'Push Notifications', '3 Months Support'], popular: true },
        { name: 'Enterprise', price: 'Custom', features: ['Complex Features', 'Backend Integration', 'Real-time Features', 'Dedicated Team', '12 Months Support'] }
      ]),
      sort_order: 2, visible: 1
    },
    {
      title: 'UI/UX Design',
      slug: 'ui-ux-design',
      description: 'We create interfaces that are not just beautiful, but intuitive and conversion-focused. Every pixel serves a purpose, every interaction delights users.',
      icon: 'Palette',
      tagline: 'Beautiful, User-Centered Design',
      features: JSON.stringify([
        { title: 'User Research & Analysis', description: 'Deep understanding of your target audience' },
        { title: 'Wireframing & Prototyping', description: 'Interactive mockups before development' },
        { title: 'Visual Design', description: 'Stunning, on-brand visual interfaces' },
        { title: 'Design Systems', description: 'Consistent, scalable design components' },
        { title: 'Usability Testing', description: 'Validated with real users' },
        { title: 'Brand Identity', description: 'Complete brand visual language' }
      ]),
      technologies: JSON.stringify(['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Principle', 'Framer']),
      process_steps: JSON.stringify([
        { number: '01', title: 'Research', description: 'Understanding users and competitors' },
        { number: '02', title: 'Wireframes', description: 'Creating low-fidelity layouts' },
        { number: '03', title: 'Prototypes', description: 'Building interactive mockups' },
        { number: '04', title: 'Visual Design', description: 'Applying colors, typography, and branding' },
        { number: '05', title: 'Testing', description: 'Validating with real users' },
        { number: '06', title: 'Handoff', description: 'Delivering assets to developers' }
      ]),
      pricing: JSON.stringify([
        { name: 'Basic', price: 'NPR 30,000', features: ['5-10 Screens', 'Basic Wireframes', 'Visual Design', 'Design Files'] },
        { name: 'Professional', price: 'NPR 80,000', features: ['15-25 Screens', 'Interactive Prototypes', 'Design System', 'User Testing', 'Revisions'], popular: true },
        { name: 'Enterprise', price: 'Custom', features: ['Unlimited Screens', 'Complete Design System', 'User Research', 'Ongoing Support', 'Brand Guidelines'] }
      ]),
      sort_order: 3, visible: 1
    },
    {
      title: 'E-Commerce Solutions',
      slug: 'ecommerce',
      description: 'Complete e-commerce solutions that drive sales. From product catalogs to payment gateways, we handle everything to get your store online and profitable.',
      icon: 'ShoppingCart',
      tagline: 'Sell More, Grow Faster',
      features: JSON.stringify([
        { title: 'Custom Online Stores', description: 'Unique, branded shopping experiences' },
        { title: 'Payment Gateway Integration', description: 'eSewa, Khalti, Stripe, PayPal' },
        { title: 'Inventory Management', description: 'Track stock in real-time' },
        { title: 'Order Tracking', description: 'Real-time order status updates' },
        { title: 'Multi-vendor Support', description: 'Run your own marketplace' },
        { title: 'Analytics & Reporting', description: 'Data-driven decisions' }
      ]),
      technologies: JSON.stringify(['Shopify', 'WooCommerce', 'Magento', 'Custom Solutions', 'Stripe', 'eSewa']),
      process_steps: JSON.stringify([
        { number: '01', title: 'Planning', description: 'Defining store structure and features' },
        { number: '02', title: 'Design', description: 'Creating conversion-focused layouts' },
        { number: '03', title: 'Development', description: 'Building secure, scalable stores' },
        { number: '04', title: 'Integration', description: 'Connecting payments and shipping' },
        { number: '05', title: 'Testing', description: 'Ensuring smooth checkout experience' },
        { number: '06', title: 'Launch', description: 'Going live with marketing support' }
      ]),
      pricing: JSON.stringify([
        { name: 'Basic', price: 'NPR 80,000', features: ['Up to 50 Products', 'Payment Gateway', 'Basic Design', 'Mobile Responsive', '1 Month Support'] },
        { name: 'Professional', price: 'NPR 200,000', features: ['Unlimited Products', 'Custom Design', 'Inventory Management', 'Email Marketing', '3 Months Support'], popular: true },
        { name: 'Enterprise', price: 'Custom', features: ['Multi-vendor', 'Advanced Features', 'Custom Integrations', 'Dedicated Support', '12 Months Support'] }
      ]),
      sort_order: 4, visible: 1
    },
    {
      title: 'API & Backend Development',
      slug: 'api-development',
      description: 'Build the backbone of your digital products. We create secure, scalable APIs and backend systems that power your applications reliably.',
      icon: 'Database',
      tagline: 'Robust, Scalable Infrastructure',
      features: JSON.stringify([
        { title: 'RESTful API Development', description: 'Clean, well-documented REST APIs' },
        { title: 'GraphQL APIs', description: 'Flexible, efficient data querying' },
        { title: 'Microservices Architecture', description: 'Scalable, modular systems' },
        { title: 'Database Design', description: 'Optimized data structures' },
        { title: 'Cloud Infrastructure', description: 'AWS, GCP, Azure deployment' },
        { title: 'DevOps & CI/CD', description: 'Automated testing and deployment' }
      ]),
      technologies: JSON.stringify(['Node.js', 'Python', 'Go', 'PostgreSQL', 'MongoDB', 'Redis', 'AWS', 'Docker']),
      process_steps: JSON.stringify([
        { number: '01', title: 'Architecture', description: 'Designing scalable system architecture' },
        { number: '02', title: 'Development', description: 'Building robust APIs and services' },
        { number: '03', title: 'Database', description: 'Optimizing data storage and retrieval' },
        { number: '04', title: 'Testing', description: 'Comprehensive API testing' },
        { number: '05', title: 'Deployment', description: 'Cloud deployment and configuration' },
        { number: '06', title: 'Monitoring', description: 'Ongoing performance monitoring' }
      ]),
      pricing: JSON.stringify([
        { name: 'Basic', price: 'NPR 60,000', features: ['Simple API', 'Basic Database', 'Documentation', '1 Month Support'] },
        { name: 'Professional', price: 'NPR 180,000', features: ['Complex APIs', 'Microservices', 'Cloud Deployment', 'CI/CD Pipeline', '3 Months Support'], popular: true },
        { name: 'Enterprise', price: 'Custom', features: ['Enterprise Architecture', 'High Availability', 'Advanced Security', 'Dedicated Team', '12 Months Support'] }
      ]),
      sort_order: 5, visible: 1
    },
    {
      title: 'Digital Branding',
      slug: 'digital-branding',
      description: 'Create a memorable brand identity that resonates with your audience. From logos to complete brand guidelines, we help you make a lasting impression.',
      icon: 'Sparkles',
      tagline: 'Stand Out, Be Remembered',
      features: JSON.stringify([
        { title: 'Logo Design', description: 'Unique, memorable brand marks' },
        { title: 'Brand Identity', description: 'Complete visual language' },
        { title: 'Style Guides', description: 'Consistent brand application' },
        { title: 'Marketing Collateral', description: 'Print and digital materials' },
        { title: 'Social Media Assets', description: 'Platform-optimized graphics' },
        { title: 'Brand Strategy', description: 'Positioning and messaging' }
      ]),
      technologies: JSON.stringify(['Adobe Illustrator', 'Photoshop', 'After Effects', 'Figma', 'InDesign']),
      process_steps: JSON.stringify([
        { number: '01', title: 'Discovery', description: 'Understanding your brand values and audience' },
        { number: '02', title: 'Research', description: 'Analyzing competitors and market trends' },
        { number: '03', title: 'Concepts', description: 'Creating initial design directions' },
        { number: '04', title: 'Refinement', description: 'Perfecting the chosen direction' },
        { number: '05', title: 'Guidelines', description: 'Creating comprehensive brand guidelines' },
        { number: '06', title: 'Delivery', description: 'Providing all brand assets' }
      ]),
      pricing: JSON.stringify([
        { name: 'Basic', price: 'NPR 25,000', features: ['Logo Design', 'Color Palette', 'Typography', 'Basic Guidelines'] },
        { name: 'Professional', price: 'NPR 70,000', features: ['Complete Brand Identity', 'Style Guide', 'Marketing Materials', 'Social Media Kit', 'Revisions'], popular: true },
        { name: 'Enterprise', price: 'Custom', features: ['Full Brand Strategy', 'Complete Guidelines', 'Marketing Campaigns', 'Ongoing Support', 'Brand Consultation'] }
      ]),
      sort_order: 6, visible: 1
    }
  ];

  services.forEach(service => {
    const exists = db.prepare('SELECT * FROM services WHERE slug = ?').get(service.slug);
    if (!exists) {
      db.prepare(`
        INSERT INTO services (title, slug, description, icon, tagline, features, technologies, process_steps, pricing, sort_order, visible)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        service.title, service.slug, service.description, service.icon, service.tagline,
        service.features, service.technologies, service.process_steps, service.pricing,
        service.sort_order, service.visible
      );
    }
  });
  console.log('✅ Services seeded');

  // Seed team members
  const teamMembers = [
    {
      name: 'Rajat Aryal',
      role: 'Founder & CEO, Full-Stack Developer',
      bio: 'With over 9 years of experience in full-stack development, Rajat leads Site Era with a vision to transform Nepal\'s digital landscape.',
      avatar_url: 'https://i.pravatar.cc/300?img=12',
      social_links: JSON.stringify({ linkedin: 'https://linkedin.com/in/rajataryal', github: 'https://github.com/rajataryal', twitter: 'https://twitter.com/rajataryal' }),
      sort_order: 1, visible: 1
    },
    {
      name: 'Priya Sharma',
      role: 'Lead UI/UX Designer',
      bio: 'Priya brings creativity and user empathy to every project, crafting beautiful interfaces that delight users and drive conversions.',
      avatar_url: 'https://i.pravatar.cc/300?img=45',
      social_links: JSON.stringify({ linkedin: 'https://linkedin.com/in/priyasharma', github: '', twitter: '' }),
      sort_order: 2, visible: 1
    },
    {
      name: 'Amit Gurung',
      role: 'Mobile App Lead',
      bio: 'Amit specializes in cross-platform mobile development, building performant apps that users love on both iOS and Android.',
      avatar_url: 'https://i.pravatar.cc/300?img=33',
      social_links: JSON.stringify({ linkedin: 'https://linkedin.com/in/amitgurung', github: 'https://github.com/amitgurung', twitter: '' }),
      sort_order: 3, visible: 1
    },
    {
      name: 'Sita Thapa',
      role: 'Project Manager & Client Relations',
      bio: 'Sita ensures every project runs smoothly, bridging the gap between client vision and technical execution with precision.',
      avatar_url: 'https://i.pravatar.cc/300?img=47',
      social_links: JSON.stringify({ linkedin: 'https://linkedin.com/in/sitathapa', github: '', twitter: '' }),
      sort_order: 4, visible: 1
    }
  ];

  teamMembers.forEach(member => {
    const exists = db.prepare('SELECT * FROM team_members WHERE name = ?').get(member.name);
    if (!exists) {
      db.prepare(`
        INSERT INTO team_members (name, role, bio, avatar_url, social_links, sort_order, visible)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        member.name, member.role, member.bio, member.avatar_url,
        member.social_links, member.sort_order, member.visible
      );
    }
  });
  console.log('✅ Team members seeded');

  console.log('🎉 Database seeding completed!');
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});

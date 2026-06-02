# 🎨 SITE ERA - Visual Design Guide

## 🌈 Color Palette

```
┌─────────────────────────────────────────────────┐
│  PRIMARY COLORS                                 │
├─────────────────────────────────────────────────┤
│  ⬛ Black      #080808  Background              │
│  ⬜ Cream      #F5F0E8  Text                    │
│  🟩 Accent     #C8FF00  Electric Lime (CTA)     │
│  🟧 Accent 2   #FF4D00  Burnt Orange (Hover)    │
│  ⬛ Dark       #111111  Cards                   │
│  ⬛ Mid        #1C1C1C  Inputs                  │
└─────────────────────────────────────────────────┘
```

## 📐 Layout Structure

### Homepage Sections (Top to Bottom)

```
┌─────────────────────────────────────────────────┐
│  NAVBAR (Sticky)                                │
│  [Logo]  Home About Services Portfolio Contact │
│                              [Start a Project]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  HERO SECTION (Full Screen)                    │
│  • Particle background                          │
│  • Floating gradient orbs                       │
│  • Large animated heading                       │
│  • Two CTA buttons                              │
│  • Scroll indicator                             │
│  • Bottom marquee strip                         │
│                                                 │
├─────────────────────────────────────────────────┤
│  STATS SECTION                                  │
│  [9+ Years] [150+ Projects] [50+ Clients] [100%]│
├─────────────────────────────────────────────────┤
│  ABOUT SECTION                                  │
│  [Image + Badges]  |  [Text + Bullet Points]   │
├─────────────────────────────────────────────────┤
│  SERVICES SECTION                               │
│  [Card] [Card] [Card]                           │
│  [Card] [Card] [Card]                           │
├─────────────────────────────────────────────────┤
│  PORTFOLIO SECTION                              │
│  [Filter: All Web Mobile Ecommerce Design]     │
│  [Project] [Project] [Project]                  │
│  [Project] [Project] [Project]                  │
├─────────────────────────────────────────────────┤
│  PROCESS SECTION                                │
│  01 → Discovery                                 │
│  02 → Design                                    │
│  03 → Development                               │
│  04 → Testing                                   │
│  05 → Launch                                    │
│  06 → Support                                   │
├─────────────────────────────────────────────────┤
│  TECH STACK SECTION                             │
│  → React Next.js Node.js Express MongoDB →      │
│  ← React Native Flutter Figma Tailwind ←        │
├─────────────────────────────────────────────────┤
│  TESTIMONIALS SECTION                           │
│  "Quote from client..."                         │
│  ⭐⭐⭐⭐⭐                                        │
│  [Avatar] Name - Title - Company                │
│  ● ● ○ (Carousel dots)                          │
├─────────────────────────────────────────────────┤
│  TEAM SECTION                                   │
│  [Member] [Member] [Member] [Member]            │
├─────────────────────────────────────────────────┤
│  CTA SECTION                                    │
│  Ready to Build Your Digital Empire?            │
│  [Start Your Project] [View Our Work]           │
├─────────────────────────────────────────────────┤
│  FOOTER                                         │
│  [Brand] [Quick Links] [Services] [Contact]    │
│  © 2024 Site Era. All rights reserved.          │
└─────────────────────────────────────────────────┘

[WhatsApp Button] (Fixed bottom-right)
```

## 🎭 Component Showcase

### Custom Cursor
```
     ○ ← Ring (40px)
    ●   ← Dot (12px)
```
- Follows mouse with spring animation
- Shows "VIEW" on links
- Shows "DRAG" on images

### Magnetic Button
```
┌──────────────────┐
│  Start Project → │  ← Pulls toward cursor
└──────────────────┘
```

### Glitch Text
```
We Build Empires
W̴e̴ ̴B̴u̴i̴l̴d̴ ̴E̴m̴p̴i̴r̴e̴s̴  ← Random glitch
We Build Empires
```

### Counter Animation
```
0 → 1 → 5 → 15 → 50 → 150+
(Smooth easing animation)
```

### Marquee Strip
```
→ WEB DEVELOPMENT · MOBILE APPS · UI/UX DESIGN · →
```

### Tilt Card
```
┌─────────────┐
│   [Image]   │  ← Tilts on mouse move
│   Name      │
│   Title     │
└─────────────┘
```

### Particle Background
```
  ●─────●
  │     │
  ●     ●─────●
        │
        ●
```
- 60 particles
- Lines connect within 150px
- Mouse repels particles

## 📱 Responsive Breakpoints

```
Mobile    Tablet    Desktop   Wide
< 768px   768-1024  1024-1440 > 1440px
│         │         │         │
▼         ▼         ▼         ▼
1 col     2 cols    3 cols    Max 1400px
```

## 🎨 Typography Scale

```
Hero Heading:    96-120px  (Clash Display Bold)
Section Heading: 48-60px   (Clash Display Bold)
Card Heading:    24-32px   (Clash Display Semibold)
Body Large:      18-20px   (Satoshi Regular)
Body:            16px      (Satoshi Regular)
Small:           14px      (Satoshi Regular)
Mono:            14px      (JetBrains Mono)
```

## ✨ Animation Types

### Fade Up
```
Hidden:  opacity: 0, y: 60
Visible: opacity: 1, y: 0
Duration: 0.7s
```

### Scale In
```
Hidden:  opacity: 0, scale: 0.85
Visible: opacity: 1, scale: 1
Duration: 0.5s
```

### Stagger
```
Item 1: delay 0s
Item 2: delay 0.15s
Item 3: delay 0.30s
Item 4: delay 0.45s
```

### Float
```
0%:   translateY(0px)
50%:  translateY(-20px)
100%: translateY(0px)
Duration: 6s infinite
```

## 🎯 Interactive States

### Button States
```
Default:  bg-accent text-black
Hover:    bg-accent-2 scale(1.05)
Active:   scale(0.95)
Disabled: opacity-50
```

### Card States
```
Default:  border-border
Hover:    border-accent translateY(-8px)
Active:   scale(0.98)
```

### Input States
```
Default:  border-border
Focus:    border-accent outline-none
Error:    border-red-500
Success:  border-green-500
```

## 🌟 Special Effects

### Glass Morphism
```
background: rgba(28, 28, 28, 0.5)
backdrop-filter: blur(20px)
border: 1px solid rgba(255,255,255,0.08)
```

### Gradient Orbs
```
Lime:   w-96 h-96 bg-accent blur-[120px] opacity-20
Orange: w-96 h-96 bg-accent-2 blur-[120px] opacity-20
Purple: w-96 h-96 bg-purple-500 blur-[120px] opacity-10
```

### Glow Effect
```
box-shadow: 0 0 20px rgba(200, 255, 0, 0.3)
```

## 📐 Spacing System

```
xs:  0.25rem  (4px)
sm:  0.5rem   (8px)
md:  1rem     (16px)
lg:  1.5rem   (24px)
xl:  2rem     (32px)
2xl: 3rem     (48px)
3xl: 4rem     (64px)
4xl: 6rem     (96px)
```

## 🎨 Component Patterns

### Section Container
```jsx
<section className="py-24 bg-black">
  <div className="container mx-auto px-6">
    {/* Content */}
  </div>
</section>
```

### Card Pattern
```jsx
<div className="glass p-8 rounded-lg hover:border-accent transition-all">
  {/* Card content */}
</div>
```

### Button Pattern
```jsx
<button className="bg-accent text-black px-8 py-4 rounded-full font-display font-semibold hover:bg-accent-2 transition-colors">
  Click Me
</button>
```

## 🎭 Page Templates

### Standard Page
```
┌─────────────────────────────────────┐
│  NAVBAR                             │
├─────────────────────────────────────┤
│  HERO SECTION                       │
│  • Page title                       │
│  • Breadcrumb                       │
├─────────────────────────────────────┤
│  CONTENT SECTION                    │
│  • Main content                     │
├─────────────────────────────────────┤
│  CTA SECTION                        │
├─────────────────────────────────────┤
│  FOOTER                             │
└─────────────────────────────────────┘
```

### Admin Page
```
┌─────────────────────────────────────┐
│  ADMIN HEADER                       │
│  [Dashboard] [Logout]               │
├─────────────────────────────────────┤
│  SIDEBAR    │  MAIN CONTENT         │
│  • Projects │  ┌──────────────────┐ │
│  • Messages │  │  Content Area    │ │
│  • Blog     │  │                  │ │
│  • Settings │  └──────────────────┘ │
└─────────────────────────────────────┘
```

## 🎨 Design Principles

### 1. Dark & Premium
- Black background (#080808)
- Cream text (#F5F0E8)
- Lime accents (#C8FF00)
- Minimal, clean design

### 2. Smooth Animations
- Spring physics
- Easing functions
- Scroll-triggered
- Staggered reveals

### 3. Interactive
- Custom cursor
- Magnetic buttons
- Hover effects
- Tilt cards

### 4. Professional
- Clean typography
- Consistent spacing
- Grid-based layout
- Attention to detail

## 🎯 Visual Hierarchy

```
1. Hero Heading (Largest, Lime gradient)
2. Section Headings (Large, Cream)
3. Card Headings (Medium, Cream)
4. Body Text (Regular, Cream)
5. Muted Text (Small, Gray)
6. Labels (Tiny, Mono, Lime)
```

## 🌟 Signature Elements

1. **Custom Cursor** - Unique interaction
2. **Particle Background** - Dynamic depth
3. **Glitch Effects** - Tech aesthetic
4. **Magnetic Buttons** - Playful interaction
5. **Glass Cards** - Modern design
6. **Gradient Orbs** - Ambient lighting
7. **Marquee Strips** - Continuous motion
8. **Counter Animations** - Engaging stats

---

**This visual guide helps you understand the design system and maintain consistency! 🎨**

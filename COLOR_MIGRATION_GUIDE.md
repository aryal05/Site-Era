# 🎨 Color Migration Guide

## Old → New Color Mapping

### Backgrounds
```
OLD: bg-black (#080808)     → NEW: bg-luxury (#000000)
OLD: bg-dark (#111111)      → NEW: bg-luxury-50 (#0D0D0D)
OLD: bg-mid (#1C1C1C)       → NEW: bg-luxury-100 (#1A1A1A)
```

### Text Colors
```
OLD: text-cream (#F5F0E8)   → NEW: text-white
OLD: text-text-muted        → NEW: text-platinum-400
OLD: text-accent            → NEW: text-royal-500
OLD: text-accent-2          → NEW: text-gold-500
```

### Borders
```
OLD: border-border          → NEW: border-royal-500/20
OLD: border-accent          → NEW: border-royal-500
```

### Buttons
```
OLD: bg-accent              → NEW: bg-gradient-royal (or btn-luxury class)
OLD: bg-accent-2            → NEW: bg-gradient-gold (or btn-gold class)
OLD: hover:bg-accent-2      → NEW: hover:shadow-luxury
```

### Glass Effects
```
OLD: glass                  → NEW: glass-luxury
```

### Gradients
```
OLD: text-gradient          → NEW: gradient-luxury
```

### Glows
```
OLD: glow-accent            → NEW: glow-royal
OLD: glow-accent2           → NEW: glow-gold
```

## Component-Specific Updates

### Navbar
- Background: glass-luxury
- Text: text-white
- Active: text-royal-500
- Button: btn-luxury

### Hero
- Background: bg-luxury with mesh-luxury
- Heading: text-white with gradient-luxury
- Orbs: bg-royal-500, bg-gold-500, bg-emerald-500

### Cards
- Background: card-luxury or glass-luxury
- Border: border-royal-500/20
- Hover: border-royal-500/50

### Buttons
- Primary: btn-luxury (royal gradient)
- Secondary: btn-gold (gold gradient)
- Ghost: border-royal-500/30

This ensures EVERYTHING is visible and premium!

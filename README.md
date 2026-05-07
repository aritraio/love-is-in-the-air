# Love Is In The Air 💌

Interactive Valentine Proposal Web Experience

## 🚀 Overview

**Love Is In The Air** is a cinematic, interactive Valentine proposal website built with vanilla JavaScript. It features:

- 💕 **6-Stage "No" Button** — Escalates with witty messages and mood emojis as the user clicks "No"
- ✨ **Ambient Particle Background** — Floating particles with dark/light mode support
- 💖 **Heart Particle Celebration** — Cinematic celebration with 40 hearts, 25 glow dots, and 15 sparkles on "Yes"
- 🎨 **Theme Toggle** — Switch between dark and light mode with smooth transitions
- 🎯 **Responsive Design** — Works beautifully on desktop and mobile
- 📖 **Interactive Storytelling** — Dynamic subtext that evolves with user interaction

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/aritra-2006/love-is-in-the-air.git
   cd love-is-in-the-air
   ```

2. **Open in browser**
   Simply open `index.html` in your web browser:
   ```bash
   open index.html
   ```

## 🛠️ Development

The project uses only vanilla JavaScript — no frameworks or build tools required!

### Project Structure

```
love-is-in-the-air/
├── index.html          # Main HTML structure and content
├── style.css           # All styling with dark/light mode support
├── script.js           # All JavaScript logic
└── README.md           # Project documentation
```

### Technical Features

#### State Machine for "No" Button

The `handleNoClick()` function implements a state machine with 6 stages:

| Click # | Button Text                           | Subtext                                               | Mood Emoji |
| ------- | ------------------------------------- | ----------------------------------------------------- | ---------- |
| 1       | No 🙅                                 | This is a one-time...                                 | 🥰         |
| 2       | Are you sure? 🤨                      | Okay, I'll ask again...                               | 😊         |
| 3       | Think carefully 😔                    | My heart is loading...                                | 🥺         |
| 4       | This feels statistically incorrect 📊 | Even my algorithm didn't predict...                   | 😢         |
| 5       | System recommendation: Click Yes 💡   | At this point, Yes is the path...                     | 😤         |
| 6       | Nice try 😏                           | You've unlocked: desperation mode...                  | 💀         |
| Escape  | You're enjoying this too much... 😈   | I'm starting to think this is a feature, not a bug... | 👻         |

#### Background Effects

**Ambient Particles (`particle-canvas`)**:

- 20 particles with random positions, velocities, and opacities
- Rose and gold color palette
- Slight upward drift for a floating effect
- Connection lines between nearby particles in dark mode
- 15% of particles are special ✨ with pulsing opacity

**Floating Orbs**:

- 3 large, blurred animated radial gradients drifting in the background to give a cinematic feel

**Heart Celebration (`heart-canvas`)**:

- 40 hearts rising from bottom of screen
- 25 glowing dots for accent
- 15 sparkling stars for extra celebration
- HSL color values for true pinks, reds, and golds
- Smooth rotation and drift with sine wave patterns

#### Theme System

- `data-theme="dark"` attribute on `<html>`
- CSS custom properties for theme-specific values
- Smooth transitions using `transition-property`
- Icon updates with theme toggle

## 🎨 Design

### Typography

- **Headings**: `Playfair Display` — elegant and cinematic
- **Body text**: `Inter` — highly readable sans-serif

### Color Palette

**Dark Mode (Default)**:

- Background: Deep space / dark violet (`#0f0d1e`)
- Card: Glassmorphism (`rgba(255, 255, 255, 0.04)`)
- Text: Soft white (`#f0eaef`)
- Pink accent: Muted rose (`#d4577a`)

**Light Mode**:

- Background: Soft rose / cream (`#f5eef2`)
- Card: Glassmorphism (`rgba(255, 255, 255, 0.65)`)
- Text: Dark violet/charcoal (`#2a1f25`)
- Pink accent: Muted rose (`#d4577a`)

## 📱 Responsive Design

### Mobile View

```css
@media (max-width: 480px) {
  .glass-card {
    padding: 36px 22px 32px;
  }
  .button-row {
    gap: 10px;
  }
  .btn {
    padding: 12px 24px;
    font-size: 0.92rem;
  }
  /* Theme toggle and decorations adjust */
}
```

### Reduced Motion Support

```javascript
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (prefersReducedMotion) {
  // Disable animations and particles
}
```

## 🧪 Testing

### Manual Testing

1. Open `index.html` in your browser
2. Click the "No" button multiple times to test the state machine
3. Click the "Yes" button to trigger the success celebration
4. Toggle the theme to see the dark/light mode switch
5. Resize the window to test responsiveness
6. Test on mobile devices to ensure proper layout
7. Check developer console for any errors

### Automated Tests

All tests are built-in and run automatically when the page loads:

```javascript
// All tests run automatically on page load
(function () {
  "use strict";
  // ...
})();
```

## 🎯 Deployment

1. Commit your changes:

   ```bash
   git add .
   git commit -m "feat: Implement all Valentine proposal features"
   ```

2. Push to GitHub:

   ```bash
   git push origin main
   ```

3. (Optional) Deploy to Netlify/Vercel:
   ```bash
   netlify deploy
   # or
   vercel
   ```

## 📚 API Documentation

### Global Variables

| Variable               | Type    | Description                         |
| ---------------------- | ------- | ----------------------------------- |
| `prefersReducedMotion` | boolean | Whether user prefers reduced motion |
| `currentTheme`         | string  | Current theme (`dark` or `light`)   |

### Event Listeners

| Element        | Event        | Handler                        |
| -------------- | ------------ | ------------------------------ |
| `btn-yes`      | `click`      | `handleYesClick()`             |
| `btn-no`       | `click`      | `handleNoClick()`              |
| `btn-no`       | `mouseenter` | `dodgeButton()` (desktop only) |
| `theme-toggle` | `click`      | `applyTheme(currentTheme)`     |

## 📦 Dependencies

No external dependencies required! This project uses only vanilla JavaScript.

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 👥 Contributing

Contributions are welcome! Feel free to fork the repository, create a feature branch, and submit a pull request.

## 🙏 Acknowledgments

- Built for a special someone ❤️
- Inspired by all the love stories out there
- Thanks to MDN Web Docs for the documentation

---

**Made with ❤️ by [Your Name]**

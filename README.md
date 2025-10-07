# Dashboard Demo

A React dashboard demonstrating a responsive grid layout with various widgets including recipes, weather, clock, stats, photo gallery, and image grids.

## Features

✅ **Responsive Grid System** - Automatically adapts to any screen size  
✅ **Card-Based Design** - Modern, clean aesthetic  
✅ **Interactive Widgets** - Clock updates in real-time  
✅ **Hover Effects** - Smooth transitions and interactions  
✅ **Easy to Extend** - Add new widgets by dropping in a new `.widget` div  
✅ **No Overlapping** - CSS Grid handles all positioning  

## Widgets Included

1. **Recipe List Widget** - Shows a list of meals with emojis and dates
2. **Featured Image Widget** - Large hero image display
3. **Weather Widget** - Current weather and 5-day forecast
4. **Clock Widget** - Real-time clock with week number
5. **Stats Widget** - Progress tracking with visual bar
6. **Photo Gallery Widget** - Grid of photos with hover effects
7. **Image Grid Widget** - 2x2 grid of images

## Getting Started

### Running the Application

The project has been created with Vite. The dev server should already be running, or you can start it with:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

## Project Structure

```
dashboard-demo/
├── src/
│   ├── App.jsx          # Main app component
│   ├── Dashboard.jsx    # Dashboard layout and all widget components
│   ├── Dashboard.css    # All styling for the dashboard
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point
├── package.json
└── vite.config.js
```

## Customization

### Adding a New Widget

Simply add a new widget div to the dashboard grid in `Dashboard.jsx`:

```jsx
<div className="widget widget-custom">
  <div className="widget-header">
    <h2>New Widget Title</h2>
  </div>
  <div className="widget-content">
    {/* Your content here */}
  </div>
</div>
```

### Adjusting Widget Sizes

In `Dashboard.css`, control widget span with grid properties:

```css
.widget-custom {
  grid-column: span 2; /* Takes 2 columns */
  grid-row: span 1;    /* Takes 1 row */
}
```

### Changing Colors

Update CSS variables in `Dashboard.css`:

```css
:root {
  --primary-color: #2563eb;
  --background: #f8fafc;
  --card-background: #ffffff;
  /* ... more variables */
}
```

## Technologies Used

- **React** - UI library
- **Vite** - Build tool and dev server
- **CSS Grid** - Layout system
- **CSS Custom Properties** - Theming

## Design Principles

- **Mobile-First** - Responsive design that works on all devices
- **Accessible** - Semantic HTML structure
- **Maintainable** - Clear component hierarchy and CSS organization
- **Performant** - No complex positioning or heavy dependencies

---

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


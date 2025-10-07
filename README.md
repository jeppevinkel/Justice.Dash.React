# Justice.Dash - Dashboard Demo

A React-based dashboard application with responsive grid layout, real-time updates, API integration, and interactive widgets for surveillance monitoring, menu planning, weather tracking, and photo galleries.

## Features

✅ **Responsive Grid System** - Automatically adapts to any screen size  
✅ **Card-Based Design** - Modern, clean aesthetic with Datadog branding  
✅ **Real-Time Updates** - Clock updates every second, auto-refresh for data  
✅ **API Integration** - Fetches data from backend APIs for menus and images  
✅ **Interactive Modals** - Full-screen image viewer and recipe detail modals  
✅ **Time-Based Logic** - Smart features that adapt based on time of day  
✅ **Auto-Refresh** - Domicile images refresh every 5 minutes, menu data every hour  
✅ **Markdown Support** - Recipe content rendered with GitHub Flavored Markdown  
✅ **Hover Effects** - Smooth transitions and interactions  
✅ **Easy to Extend** - Modular component architecture  

## Widgets Included

1. **Surveillance Team Widget** - Displays on-duty team with active/inactive status (7:30-16:30)
2. **Recipe List Widget** - Shows upcoming meals from API with click-to-view details
3. **Featured Image Widget** - Large display of today's/tomorrow's menu item (switches after 13:00)
4. **Weather Graph Widget** - Visual weather data display for Odense
5. **Photo Gallery Widget** - Latest 3 domicile images with click-to-enlarge
6. **Image Grid Widget** - 2x2+ grid of additional domicile images

### Inactive/Commented Widgets

- **Weather Chart Widget** - Alternative weather display (currently commented out)
- **Stats Widget** - Progress tracking with visual bar (currently commented out)

## Getting Started

### Running the Application

The project has been created with Vite. The dev server should already be running, or you can start it with:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### API Proxy Configuration

The local development server is configured to proxy API requests to a backend server. This allows you to develop the frontend without CORS issues.

**Default Behavior:**
- All requests to `/api/*` are proxied to `http://localhost:3000` by default

**Custom Backend URL:**

You can configure a different backend URL using the `VITE_API_PROXY_TARGET` environment variable:

```bash
# Windows PowerShell
$env:VITE_API_PROXY_TARGET="https://api.example.com"; npm run dev

# Linux/Mac
VITE_API_PROXY_TARGET=https://api.example.com npm run dev
```

Or create a `.env` file in the project root:

```env
VITE_API_PROXY_TARGET=https://api.example.com
```

**How it works:**
- Your app makes a request to `/api/users`
- The dev server proxies it to `{VITE_API_PROXY_TARGET}/api/users`
- The `changeOrigin` option handles CORS issues automatically

**Advanced Configuration:**

If you need to modify the proxy behavior (e.g., remove `/api` prefix from proxied requests), you can edit `vite.config.js` and uncomment the `rewrite` option:

```javascript
rewrite: (path) => path.replace(/^\/api/, ''),
```

This would proxy `/api/users` to `{target}/users` instead of `{target}/api/users`.

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── modals/
│   │   │   ├── FullscreenModal.jsx    # Full-screen image viewer with navigation
│   │   │   └── RecipeModal.jsx        # Recipe detail modal with markdown rendering
│   │   └── widgets/
│   │       ├── Clock.jsx              # Real-time clock component
│   │       ├── ImageGrid.jsx          # Grid layout for domicile images
│   │       ├── PhotoGallery.jsx       # Gallery view for latest images
│   │       ├── RecipeList.jsx         # Menu list display
│   │       ├── StatsDisplay.jsx       # Progress bar widget (inactive)
│   │       ├── SurveillanceTeam.jsx   # On-duty team display
│   │       ├── WeatherChart.jsx       # Weather chart view (inactive)
│   │       └── WeatherGraph.jsx       # Weather graph visualization
│   ├── data/
│   │   └── recipesData.js             # Sample recipe data structure
│   ├── App.jsx                        # Main app component
│   ├── Dashboard.jsx                  # Dashboard layout and state management
│   ├── Dashboard.css                  # All styling for the dashboard
│   ├── index.css                      # Global styles
│   └── main.jsx                       # Entry point
├── public/                            # Static assets (logos, images)
├── package.json
├── vite.config.js                     # Vite configuration with API proxy
└── Dockerfile                         # Docker configuration
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

## API Endpoints

The dashboard integrates with the following backend API endpoints:

### `/api/menu`
- **Purpose**: Fetches menu/meal plan data
- **Refresh Rate**: Every 1 hour
- **Response Format**: Array of menu items with date, food name, description, recipe (markdown), and image
- **Features**: 
  - Automatically filters to show meals from today (or tomorrow after 13:00) onwards
  - Recipe content supports GitHub Flavored Markdown

### `/api/domicile`
- **Purpose**: Fetches domicile/property images
- **Refresh Rate**: Every 5 minutes
- **Response Format**: Array of images with path and imageUpdateDate
- **Features**: 
  - Automatically sorted by latest first
  - Latest 3 displayed in Photo Gallery
  - Next 10 displayed in Image Grid

## Technologies Used

- **React 19** - UI library
- **Vite 7** - Build tool and dev server with API proxy support
- **react-markdown** - Markdown rendering for recipe content
- **remark-gfm** - GitHub Flavored Markdown support (tables, task lists, etc.)
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


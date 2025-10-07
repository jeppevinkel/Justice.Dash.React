import React from 'react';
import './Dashboard.css';
import SurveillanceTeam from './components/widgets/SurveillanceTeam';
import RecipeList from './components/widgets/RecipeList';
import WeatherChart from './components/widgets/WeatherChart';
import Clock from './components/widgets/Clock';
import PhotoGallery from './components/widgets/PhotoGallery';
import ImageGrid from './components/widgets/ImageGrid';
import FullscreenModal from './components/modals/FullscreenModal';
import RecipeModal from './components/modals/RecipeModal';

const Dashboard = () => {
  const [fullscreenImage, setFullscreenImage] = React.useState(null);
  const [selectedRecipe, setSelectedRecipe] = React.useState(null);

  const openFullscreen = (imageSrc) => {
    setFullscreenImage(imageSrc);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  return (
    <div className="dashboard">
      {/* Datadog Background Wallpaper */}
      <div className="datadog-background"></div>
      
      <header className="dashboard-header">
        <div className="header-left">
          <img 
            src="/dd_icon_white.png" 
            alt="Datadog Logo" 
            className="datadog-logo"
          />
          <h1>Dashboard</h1>
        </div>
        <div className="header-actions">
          <time>{new Date().toLocaleDateString('da-DK')}</time>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Surveillance/On-Duty Widget */}
        <div className="widget widget-surveillance">
          <div className="widget-header">
            <div className="widget-header-left">
              <img src="/dd_icon_white.png" alt="" className="widget-logo" />
              <h2>📋 Overvågning Uge 41</h2>
            </div>
            <span className="status-badge status-active">Aktiv</span>
          </div>
          <div className="widget-content">
            <SurveillanceTeam />
          </div>
        </div>

        {/* Recipe List Widget */}
        <div className="widget widget-recipes">
          <div className="widget-header">
            <div className="widget-header-left">
              <img src="/dd_icon_rgb.png" alt="" className="widget-logo" />
              <h2>Madplan</h2>
            </div>
            <button className="widget-action">⋯</button>
          </div>
          <div className="widget-content">
            <RecipeList onRecipeClick={setSelectedRecipe} />
          </div>
        </div>

        {/* Featured Image Widget */}
        <div className="widget widget-featured">
          <div className="widget-header">
            <div className="widget-header-left">
              <img src="/dd_icon_rgb.png" alt="" className="widget-logo" />
              <h2>Madbillede (Outer Space)</h2>
            </div>
          </div>
          <div className="widget-content widget-image">
            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop" alt="Featured dish" />
          </div>
        </div>

        {/* Weather Widget */}
        <div className="widget widget-weather">
          <div className="widget-header">
            <div className="widget-header-left">
              <img src="/dd_icon_rgb.png" alt="" className="widget-logo" />
              <h2>Vejret - Odense</h2>
            </div>
          </div>
          <div className="widget-content">
            <WeatherChart />
          </div>
        </div>

        {/* Clock Widget */}
        <div className="widget widget-clock">
          <Clock />
          <div className="widget-subtitle">Uge nummer: 41</div>
        </div>

        {/* Stats Widget */}
        {/* <div className="widget widget-stats">
          <div className="widget-header">
            <div className="widget-header-left">
              <img src="/dd_icon_rgb.png" alt="" className="widget-logo" />
              <h2>Rapporteret sikkerhed til Githika</h2>
            </div>
          </div>
          <div className="widget-content">
            <StatsDisplay />
          </div>
        </div> */}

        {/* Photo Gallery Widget */}
        <div className="widget widget-gallery">
          <div className="widget-header">
            <div className="widget-header-left">
              <img src="/dd_icon_rgb.png" alt="" className="widget-logo" />
              <h2>Nyt Domicil</h2>
            </div>
          </div>
          <div className="widget-content">
            <PhotoGallery onImageClick={openFullscreen} />
          </div>
        </div>

        {/* Image Grid Widget */}
        <div className="widget widget-grid-images">
          <div className="widget-content">
            <ImageGrid onImageClick={openFullscreen} />
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {fullscreenImage && (
        <FullscreenModal imageSrc={fullscreenImage} onClose={closeFullscreen} />
      )}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
    </div>
  );
};

export default Dashboard;

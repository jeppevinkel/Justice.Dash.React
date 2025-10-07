import React from 'react';
import './Dashboard.css';
import SurveillanceTeam from './components/widgets/SurveillanceTeam';
import RecipeList from './components/widgets/RecipeList';
import WeatherChart from './components/widgets/WeatherChart';
import WeatherGraph from './components/widgets/WeatherGraph';
import PhotoGallery from './components/widgets/PhotoGallery';
import ImageGrid from './components/widgets/ImageGrid';
import FullscreenModal from './components/modals/FullscreenModal';
import RecipeModal from './components/modals/RecipeModal';
import StatsDisplay from './components/widgets/StatsDisplay.jsx';

const Dashboard = () => {
  const [fullscreenImageIndex, setFullscreenImageIndex] = React.useState(null);
  const [selectedRecipe, setSelectedRecipe] = React.useState(null);
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [domicileImages, setDomicileImages] = React.useState([]);
  const [menuData, setMenuData] = React.useState([]);
  const [featuredMenuItem, setFeaturedMenuItem] = React.useState(null);
  const [filteredMenuData, setFilteredMenuData] = React.useState([]);
  const [currentWeek, setCurrentWeek] = React.useState(null);
  const [surveillanceStatus, setSurveillanceStatus] = React.useState({ text: 'Inaktiv', className: 'status-inactive' });

  // Function to get the current week number
  const getCurrentWeek = (date) => {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    // Set to nearest Thursday: current date + 4 - current day number
    tempDate.setDate(tempDate.getDate() + 4 - (tempDate.getDay() || 7));
    const yearStart = new Date(tempDate.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((tempDate - yearStart) / 86400000) + 1) / 7);
    return weekNo;
  };

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      setCurrentWeek(getCurrentWeek(now));
    };
    
    // Set initial values
    updateTime();
    
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    // Fetch domicile images from API
    const fetchDomicileImages = () => {
      fetch('/api/domicile')
        .then(response => response.json())
        .then(data => {
          // Sort images by imageUpdateDate (descending - latest first)
          const sortedImages = [...data].sort((a, b) => b.imageUpdateDate - a.imageUpdateDate);
          setDomicileImages(sortedImages);
        })
        .catch(error => {
          console.error('Error fetching domicile images:', error);
        });
    };
    
    // Initial fetch
    fetchDomicileImages();
    
    // Refresh every 5 minutes (300000ms)
    const interval = setInterval(fetchDomicileImages, 300000);
    
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    // Fetch menu data from API
    const fetchMenuData = () => {
      fetch('/api/menu')
        .then(response => response.json())
        .then(data => {
          // Transform API data to match the format expected by RecipeList and RecipeModal
          const transformedMenu = data.map(item => {
            // Parse the recipe markdown to extract ingredients and instructions
            // For now, we'll store the full recipe as a single instruction
            const recipeLines = item.recipe ? item.recipe.split('\n') : [];
            
            return {
              id: item.id,
              title: item.foodDisplayName || item.correctedFoodName || item.foodName,
              day: item.day,
              date: item.date.split('-').slice(1).reverse().join('/'), // Convert "2025-10-07" to "07/10"
              icon: '🍽️', // Default icon, could be mapped based on foodContents
              image: item.image?.path || '',
              description: item.description || '',
              recipe: item.recipe || '',
              ingredients: [], // We'll store the raw recipe for now
              instructions: [],
              finalNote: '',
              // Store additional API data for reference
              apiData: item
            };
          });
          
          setMenuData(transformedMenu);
        })
        .catch(error => {
          console.error('Error fetching menu data:', error);
        });
    };
    
    // Initial fetch
    fetchMenuData();
    
    // Refresh every 1 hour (3600000ms)
    const interval = setInterval(fetchMenuData, 3600000);
    
    return () => clearInterval(interval);
  }, []);

  // Update surveillance status based on current time
  React.useEffect(() => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    // 7:30 = 7*60 + 30 = 450 minutes
    // 16:30 = 16*60 + 30 = 990 minutes
    const startTime = 7 * 60 + 30; // 7:30
    const endTime = 16 * 60 + 30;   // 16:30
    
    const isActive = totalMinutes >= startTime && totalMinutes <= endTime;
    
    setSurveillanceStatus({
      text: isActive ? 'Aktiv' : 'Inaktiv',
      className: isActive ? 'status-active' : 'status-inactive'
    });
  }, [currentTime]);

  // Update featured menu item and filtered recipes based on current time (switch to tomorrow after 13:00)
  React.useEffect(() => {
    if (menuData.length === 0) return;
    
    const currentHour = currentTime.getHours();
    
    // If it's after 13:00 (1:00 PM), use tomorrow's date
    const targetDate = new Date(currentTime);
    if (currentHour >= 13) {
      targetDate.setDate(targetDate.getDate() + 1);
    }
    
    const targetDateString = targetDate.toISOString().split('T')[0];
    const targetMenuItem = menuData.find(item => item.apiData.date === targetDateString);
    setFeaturedMenuItem(targetMenuItem || menuData[0]);
    
    // Filter recipes to show only from target date onwards
    const filtered = menuData.filter(item => item.apiData.date >= targetDateString);
    setFilteredMenuData(filtered);
  }, [currentTime, menuData]);

  const openFullscreen = (imageIndex) => {
    setFullscreenImageIndex(imageIndex);
  };

  const closeFullscreen = () => {
    setFullscreenImageIndex(null);
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
          <div className="header-clock">
            {currentTime.toLocaleTimeString('da-DK', { 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit' 
            })}
          </div>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Surveillance/On-Duty Widget */}
        <div className="widget widget-surveillance">
          <div className="widget-header">
            <div className="widget-header-left">
              <img src="/dd_icon_white.png" alt="" className="widget-logo" />
              <h2>Overvågning Uge {currentWeek}</h2>
            </div>
            <span className={`status-badge ${surveillanceStatus.className}`}>{surveillanceStatus.text}</span>
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
          </div>
          <div className="widget-content">
            <RecipeList onRecipeClick={setSelectedRecipe} recipes={filteredMenuData} />
          </div>
        </div>

        {/* Featured Image Widget */}
        <div className="widget widget-featured">
          <div className="widget-header">
            <div className="widget-header-left">
              <img src="/dd_icon_rgb.png" alt="" className="widget-logo" />
              <h2>Madbillede ({featuredMenuItem?.apiData?.foodModifier?.title || 'Outer Space'})</h2>
            </div>
          </div>
          <div className="widget-content widget-image">
            {featuredMenuItem?.image ? (
              <img src={featuredMenuItem.image} alt={featuredMenuItem.title} />
            ) : (
              <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop" alt="Featured dish" />
            )}
          </div>
        </div>

        {/* Weather Widget */}
        {/* <div className="widget widget-weather">
          <div className="widget-header">
            <div className="widget-header-left">
              <img src="/dd_icon_rgb.png" alt="" className="widget-logo" />
              <h2>Vejret - Odense</h2>
            </div>
          </div>
          <div className="widget-content">
            <WeatherChart />
          </div>
        </div> */}

        {/* Weather Graph Widget */}
        <div className="widget widget-weather">
          <div className="widget-header">
            <div className="widget-header-left">
              <img src="/dd_icon_rgb.png" alt="" className="widget-logo" />
              <h2>Vejret Graf - Odense</h2>
            </div>
          </div>
          <div className="widget-content">
            <WeatherGraph />
          </div>
        </div>

        {/* Image Grid Widget */}
        <div className="widget widget-grid-images">
          <div className="widget-content">
            <ImageGrid images={domicileImages.slice(3, 13)} onImageClick={openFullscreen} startIndex={3} />
          </div>
        </div>

        {/* Stats Widget */}
        {/* <div className="widget widget-stats">
          <div className="widget-header">
            <div className="widget-header-left">
              <img src="/dd_icon_rgb.png" alt="" className="widget-logo" />
              <h2>Migreret til GitHub</h2>
            </div>
          </div>
          <div className="widget-content">
            <StatsDisplay label="Repositories:" value="68" progress={22} />
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
            <PhotoGallery images={domicileImages.slice(0, 3)} onImageClick={openFullscreen} />
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {fullscreenImageIndex !== null && (
        <FullscreenModal 
          images={domicileImages} 
          currentIndex={fullscreenImageIndex} 
          onClose={closeFullscreen} 
        />
      )}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
    </div>
  );
};

export default Dashboard;

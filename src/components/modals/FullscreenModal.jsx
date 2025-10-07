import React from 'react';

const FullscreenModal = ({ images, currentIndex, onClose }) => {
  const [index, setIndex] = React.useState(currentIndex);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [index, onClose]);

  const goToPrevious = () => {
    setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const currentImage = images[index];

  // Format the imageUpdateDate timestamp into a readable date
  const formatImageDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('da-DK', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fullscreen-modal" onClick={onClose}>
      <button className="fullscreen-close" onClick={onClose} aria-label="Close">
        ✕
      </button>
      
      {/* Image Date Title */}
      {currentImage?.imageUpdateDate && (
        <div className="fullscreen-title" onClick={(e) => e.stopPropagation()}>
          {formatImageDate(currentImage.imageUpdateDate)}
        </div>
      )}
      
      {/* Left Navigation Button */}
      <button 
        className="fullscreen-nav fullscreen-nav-left" 
        onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
        aria-label="Previous image"
      >
        ‹
      </button>
      
      {/* Right Navigation Button */}
      <button 
        className="fullscreen-nav fullscreen-nav-right" 
        onClick={(e) => { e.stopPropagation(); goToNext(); }}
        aria-label="Next image"
      >
        ›
      </button>
      
      <img 
        src={currentImage?.path} 
        alt={`Fullscreen image ${currentImage?.id}`}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default FullscreenModal;

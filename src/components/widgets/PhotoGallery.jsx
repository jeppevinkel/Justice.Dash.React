import React from 'react';

const PhotoGallery = ({ images = [], onImageClick }) => {
  return (
    <div className="photo-gallery-container">
      <div className="photo-grid">
        {images.map((image, index) => (
          <img 
            key={image.id}
            src={image.path} 
            alt={`Domicile image ${image.id}`} 
            onClick={() => onImageClick(index)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
      
      <button 
        className="restore-gallery-button"
        onClick={() => window.location.reload()}
      >
        Show Walking Skeleton
      </button>
    </div>
  );
};

export default PhotoGallery;

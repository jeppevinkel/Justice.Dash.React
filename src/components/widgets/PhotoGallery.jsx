import React from 'react';

const PhotoGallery = ({ onImageClick }) => {
  const images = [
    { src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop", alt: "Gallery 1" },
    { src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop", alt: "Gallery 2" },
    { src: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&h=600&fit=crop", alt: "Gallery 3" }
  ];

  return (
    <div className="photo-grid">
      {images.map((image, index) => (
        <img 
          key={index}
          src={image.src} 
          alt={image.alt} 
          onClick={() => onImageClick(image.src)}
          style={{ cursor: 'pointer' }}
        />
      ))}
    </div>
  );
};

export default PhotoGallery;

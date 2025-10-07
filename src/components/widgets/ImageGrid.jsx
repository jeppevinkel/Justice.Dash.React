import React from 'react';

const ImageGrid = ({ onImageClick }) => {
  const images = [
    { src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=800&fit=crop", alt: "Grid 1" },
    { src: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=800&fit=crop", alt: "Grid 2" },
    { src: "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800&h=800&fit=crop", alt: "Grid 3" },
    { src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=800&fit=crop", alt: "Grid 4" }
  ];

  return (
    <div className="image-grid">
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

export default ImageGrid;

import React from 'react';

const ImageGrid = ({ images = [], onImageClick, startIndex = 0 }) => {
  return (
    <div className="image-grid">
      {images.map((image, index) => (
        <img 
          key={image.id}
          src={image.path} 
          alt={`Domicile image ${image.id}`} 
          onClick={() => onImageClick(startIndex + index)}
          style={{ cursor: 'pointer' }}
        />
      ))}
    </div>
  );
};

export default ImageGrid;

import React from 'react';

const WalkingSkeleton = ({ onSwitchToPhotoGallery }) => {
  return (
    <div className="walking-skeleton-container">
      <img 
        src="https://github.com/user-attachments/assets/f1c672ce-45e4-41e6-a79e-1dd9f775349c" 
        alt="Walking Skeleton" 
        className="walking-skeleton-gif"
      />
      {onSwitchToPhotoGallery && (
        <button 
          className="restore-gallery-button"
          onClick={onSwitchToPhotoGallery}
        >
          Restore Image Gallery
        </button>
      )}
    </div>
  );
};

export default WalkingSkeleton;
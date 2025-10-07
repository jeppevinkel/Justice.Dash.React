import React from 'react';

const FullscreenModal = ({ imageSrc, onClose }) => {
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div className="fullscreen-modal" onClick={onClose}>
      <button className="fullscreen-close" onClick={onClose} aria-label="Close">
        ✕
      </button>
      <img 
        src={imageSrc} 
        alt="Fullscreen" 
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default FullscreenModal;

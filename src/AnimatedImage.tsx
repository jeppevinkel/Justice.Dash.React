import React, { useState, useEffect } from 'react';

function AnimatedImage({ path, alt, style }: { path: string, alt: string, style?: React.CSSProperties }) {
    const [showAnimated, setShowAnimated] = useState(false);
    
    // Function to toggle animated state on a random interval
    const scheduleNextToggle = () => {
        // Random interval between 2-4 hours
        const randomHours = 2 + Math.random() * 2;
        const milliseconds = randomHours * 60 * 60 * 1000;
        
        return setTimeout(() => {
            // Show animated for a short period (10 seconds)
            setShowAnimated(true);
            
            // Set timeout to switch back to static
            setTimeout(() => {
                setShowAnimated(false);
                scheduleNextToggle();
            }, 10000); // 10 seconds
        }, milliseconds);
    };

    useEffect(() => {
        // Initial setup of animation schedule
        const timerId = scheduleNextToggle();
        
        // Clean up on unmount
        return () => {
            clearTimeout(timerId);
        };
    }, []);

    // Convert image path to webp version when showing animated
    const imagePath = showAnimated 
        ? path.replace(/\.(jpg|jpeg|png)$/, '.webp') 
        : path;

    return (
        <img 
            src={imagePath} 
            alt={alt} 
            width="100%" 
            style={style || { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
        />
    );
}

export default AnimatedImage;
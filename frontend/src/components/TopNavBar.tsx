import React from 'react';

interface TopNavBarProps {
  onLogoClick: () => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ onLogoClick }) => {
  return (
    <nav style={{ 
      backgroundColor: '#001f3f', 
      color: '#ffffff', 
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
      height: '64px',
      position: 'relative',  // Add this
    }}>
      <div 
        style={{ 
          position: 'absolute',  // Add this
          left: '24px',  // Add this to fix the position from the left
          top: '50%',  // Center vertically
          transform: 'translateY(-50%)',  // Adjust for perfect vertical centering
          cursor: 'pointer',
        }} 
        onClick={onLogoClick}
      >
        <span style={{ fontSize: '38px', fontWeight: '900', fontFamily: 'serif' }}>LanceDB</span>
      </div>
    </nav>
  );
};

export default TopNavBar;
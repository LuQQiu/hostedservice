import React from 'react';

interface TopNavBarProps {
  onLogoClick: () => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ onLogoClick }) => {
  return (
    <nav style={{ backgroundColor: '#001f3f', color: '#ffffff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', height: '64px' }}>
      <div 
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', height: '100%', cursor: 'pointer' }} 
        onClick={onLogoClick}
      >
        <span style={{ fontSize: '38px', fontWeight: '900', fontFamily: 'serif' }}>LanceDB</span>
      </div>
    </nav>
  );
};

export default TopNavBar;

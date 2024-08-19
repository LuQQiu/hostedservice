import React, { useState } from 'react';
import TopNavBar from './TopNavBar';
import DefaultPage from './DefaultPage';
import DatabasePage from './DatabasePage';

interface MainPageProps {
  username: string;
}

const MainPage: React.FC<MainPageProps> = ({ username }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleLogoClick = () => {
    setActiveMenu(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopNavBar onLogoClick={handleLogoClick} />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <div
          style={{
            width: '20%', // Changed from fixed 200px to 20%
            minWidth: '200px', // Ensures a minimum width
            maxWidth: '300px', // Limits the maximum width
            backgroundColor: 'white',
            padding: '0',
            flexShrink: 0,
          }}
        >
          <button
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '8px 16px', // Added horizontal padding
              borderRadius: '0',
              backgroundColor: activeMenu === 'databases' ? '#f3f4f6' : 'transparent',
              color: 'black',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              marginTop: '24px',
            }}
            onClick={() => setActiveMenu('databases')}
          >
            Databases
          </button>
        </div>
        <div
          style={{
            flexGrow: 1,
            backgroundColor: '#f3f4f6',
            overflowX: 'auto',
            padding: '24px',
          }}
        >
          {activeMenu === 'databases' ? (
            <DatabasePage />
          ) : (
            <DefaultPage username={username} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;

import React, { useState } from 'react';
import TopNavBar from './TopNavBar';

interface Database {
  id: number;
  databasePath: string;
  status: string;
}

interface MainPageProps {
  username: string;
}

const MainPage: React.FC<MainPageProps> = ({ username }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [databases, setDatabases] = useState<Database[]>([]);
  const [newDatabasePath, setNewDatabasePath] = useState('');

  const handleCreateDatabase = () => {
    if (newDatabasePath.trim()) {
      const newDatabase: Database = {
        id: Date.now(),
        databasePath: newDatabasePath.trim(),
        status: 'Ready',
      };
      setDatabases(prevDatabases => [...prevDatabases, newDatabase]);
      setNewDatabasePath('');
    }
  };

  const handleDeleteDatabase = (id: number) => {
    setDatabases(prevDatabases => prevDatabases.filter(db => db.id !== id));
  };

  const handleLogoClick = () => {
    setActiveMenu(null); // Set activeMenu to null to return to the welcome page
  };

  const renderDatabaseContent = () => (
    <div style={{ padding: '24px', width: '90%', maxWidth: '90%' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Databases</h2>
      <div style={{ display: 'flex', marginBottom: '32px', width: '90%' }}>
        <input
          type="text"
          value={newDatabasePath}
          onChange={(e) => setNewDatabasePath(e.target.value)}
          placeholder="Enter database path"
          style={{ flexGrow: 1, padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px 0 0 4px' }}
        />
        <button 
          onClick={handleCreateDatabase}
          style={{ 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            padding: '8px 16px', 
            borderRadius: '0 4px 4px 0',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Create
        </button>
      </div>
      {databases.length > 0 ? (
        <div style={{ overflowX: 'auto', width: '90%' }}>
          <table style={{ width: '90%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{ textAlign: 'left', padding: '12px', width: '50%', minWidth: '300px' }}>Database Path</th>
                <th style={{ textAlign: 'left', padding: '12px', width: '25%', minWidth: '150px' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px', width: '25%', minWidth: '100px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {databases.map(db => (
                <tr key={db.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px', minWidth: '300px' }}>{db.databasePath}</td>
                  <td style={{ padding: '12px', minWidth: '150px' }}>{db.status}</td>
                  <td style={{ padding: '12px', minWidth: '100px' }}>
                    <button
                      onClick={() => handleDeleteDatabase(db.id)}
                      style={{ 
                        backgroundColor: '#ef4444', 
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No databases created yet.</p>
      )}
    </div>
  );

  const renderDefaultContent = () => (
    <div style={{ padding: '24px', width: '90%' }}>
      <h2 style={{ fontSize: '30px', fontWeight: 'bold' }}>Welcome, Lu!</h2>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopNavBar onLogoClick={handleLogoClick} />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <div
          style={{
            width: '200px',
            backgroundColor: 'white', // Sidebar is always white
            padding: '0', // Remove padding to avoid any space around the button
            flexShrink: 0,
          }}
        >
          <button
            style={{
              width: '100%', // Button takes up the full width of the sidebar
              textAlign: 'left',
              padding: '8px',
              borderRadius: '0', // Remove border-radius to avoid rounding at the edges
              backgroundColor: activeMenu === 'databases' ? '#f3f4f6' : 'transparent', // Button background becomes grey when active
              color: 'black',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px', // Matches the font size of "Welcome, Lu!"
              marginTop: '24px', // Adds some space below the top bar
            }}
            onClick={() => setActiveMenu('databases')}
          >
            Databases
          </button>
        </div>
        <div
          style={{
            flexGrow: 1,
            backgroundColor: '#f3f4f6', // Right content area is always grey
            overflowX: 'auto',
            padding: '24px', // Adds padding for consistency
          }}
        >
          {activeMenu === 'databases' ? renderDatabaseContent() : renderDefaultContent()}
        </div>
      </div>
    </div>
  );
};

export default MainPage;

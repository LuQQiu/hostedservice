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
    setActiveMenu(null);
  };

  const renderDatabaseContent = () => (
    <div style={{ padding: '24px', width: '90%' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Databases</h2>
      <div style={{ marginBottom: '32px', width: '90%' }}>
        <div style={{ display: 'flex', width: '90%' }}>
          <input
            type="text"
            value={newDatabasePath}
            onChange={(e) => setNewDatabasePath(e.target.value)}
            placeholder="Enter database path"
            style={{ 
              flexGrow: 1,
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px 0 0 4px',
              fontSize: '14px'
            }}
          />
          <button 
            onClick={handleCreateDatabase}
            style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '0 4px 4px 0',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            Create
          </button>
        </div>
      </div>
      {databases.length > 0 ? (
        <div style={{ width: '90%' }}>
          <table style={{ width: '90%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{ textAlign: 'left', padding: '12px', width: '50%' }}>Database Path</th>
                <th style={{ textAlign: 'left', padding: '12px', width: '25%' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px', width: '25%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {databases.map(db => (
                <tr key={db.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>{db.databasePath}</td>
                  <td style={{ padding: '12px' }}>{db.status}</td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => handleDeleteDatabase(db.id)}
                      style={{ 
                        backgroundColor: '#ef4444', 
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px'
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
          {activeMenu === 'databases' ? renderDatabaseContent() : renderDefaultContent()}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
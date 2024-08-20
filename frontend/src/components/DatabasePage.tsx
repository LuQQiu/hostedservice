import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

interface Database {
  path: string;
  status: string;
}

interface DatabasePageProps {
  token: string;
}

const DatabasePage: React.FC<DatabasePageProps> = ({ token }) => {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [newDatabasePath, setNewDatabasePath] = useState('');

  useEffect(() => {
    fetchDatabases();
    const interval = setInterval(fetchDatabases, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDatabases = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/list_databases`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDatabases(response.data.databases);
    } catch (error) {
      console.error('Error fetching databases:', error);
    }
  };

  const handleCreateDatabase = async () => {
    if (newDatabasePath.trim()) {
      try {
        await axios.post(`${API_BASE_URL}/create_database`, null, {
          params: {
            database_path: newDatabasePath.trim()
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setNewDatabasePath('');
        fetchDatabases(); // Refresh the list immediately to show the new "In Progress" database
      } catch (error) {
        console.error('Error creating database:', error);
      }
    }
  };

  const handleDeleteDatabase = async (databasePath: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete_database`, {
        params: {
          database_path: databasePath
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchDatabases(); // Refresh the list after deleting
    } catch (error) {
      console.error('Error deleting database:', error);
    }
  };

  return (
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
                <tr key={db.path} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>{db.path}</td>
                  <td style={{ padding: '12px' }}>
                    {db.status === 'In Progress' ? (
                      <span style={{ color: 'orange' }}>In Progress</span>
                    ) : (
                      <span style={{ color: 'green' }}>Created</span>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {db.status !== 'In Progress' && (
                      <button
                        onClick={() => handleDeleteDatabase(db.path)}
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
                    )}
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
};

export default DatabasePage;
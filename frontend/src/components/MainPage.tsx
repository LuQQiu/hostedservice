import React, { useState } from 'react';

interface MainPageProps {
  username: string;
}

interface Database {
  id: number;
  name: string;
}

const MainPage: React.FC<MainPageProps> = ({ username }) => {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [newDatabaseName, setNewDatabaseName] = useState('');

  const handleCreateDatabase = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDatabaseName.trim()) {
      const newDatabase: Database = {
        id: Date.now(),
        name: newDatabaseName.trim()
      };
      setDatabases([...databases, newDatabase]);
      setNewDatabaseName('');
    }
  };

  const handleDeleteDatabase = (id: number) => {
    setDatabases(databases.filter(db => db.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Welcome, {username}!</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create New Database</h2>
        <form onSubmit={handleCreateDatabase} className="flex gap-4">
          <input
            type="text"
            value={newDatabaseName}
            onChange={(e) => setNewDatabaseName(e.target.value)}
            placeholder="Enter database name"
            className="flex-grow px-3 py-2 border rounded-lg"
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            Create
          </button>
        </form>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Databases</h2>
        <ul className="space-y-4">
          {databases.map(db => (
            <li key={db.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
              <span>{db.name}</span>
              <button
                onClick={() => handleDeleteDatabase(db.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MainPage;
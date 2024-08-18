import React, { useState } from 'react';

interface MainPageProps {
  username: string;
}

interface Database {
  id: number;
  name: string;
}

const MainPage: React.FC<MainPageProps> = ({ username }) => {
  const [databases, setDatabases] = useState<Database[]>([
    { id: 1, name: '/tmp/database 1' },
    { id: 2, name: '/tmp/database 2' }
  ]);
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
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
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
          <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200">
            Create
          </button>
        </form>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Databases</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left font-semibold pb-2">Database Name</th>
              <th className="w-24"></th>
            </tr>
          </thead>
          <tbody>
            {databases.map(db => (
              <tr key={db.id} className="border-t">
                <td className="py-3">{db.name}</td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => handleDeleteDatabase(db.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainPage;
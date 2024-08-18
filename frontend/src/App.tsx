import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  const handleLogin = (user: string) => {
    setIsLoggedIn(true);
    setUsername(user);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {!isLoggedIn ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <MainPage username={username} />
        )}
      </div>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [token, setToken] = useState<string>('');

  const handleLogin = (user: string, accessToken: string) => {
    setIsLoggedIn(true);
    setUsername(user);
    setToken(accessToken);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow bg-gray-100">
        {!isLoggedIn ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <MainPage username={username} token={token} />
        )}
      </div>
    </div>
  );
};

export default App;